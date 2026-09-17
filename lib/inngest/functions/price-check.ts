import { inngest } from "@/lib/inngest/client";
import { AlertModel } from "@/database/models/alert.model";
import { getStockQuote } from "@/lib/actions/finnhub.actions";
import { sendAlertEmail } from "@/lib/nodemailer";
import { connectToDatabase } from "@/database/mongoose";

export const checkPriceAlerts = inngest.createFunction(
    { id: "price-alert-check" },
    { cron: "*/2 * * * *" },
    async () => {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;

        const alerts = await AlertModel.find({ status: "active" });

        for (const alert of alerts) {
            try {
                const quote = await getStockQuote(alert.symbol);
                const currentPrice = quote.c;

                const hit =
                    alert.condition === "above"
                        ? currentPrice >= alert.targetPrice
                        : currentPrice <= alert.targetPrice;

                if (!hit) continue;

                // Resolve valid email recipient
                let recipientEmail = alert.userEmail;
                if (!recipientEmail && db) {
                    const user = await db.collection("user").findOne({
                        $or: [{ id: alert.userId }, { _id: alert.userId }]
                    });
                    recipientEmail = user?.email;
                }

                if (recipientEmail) {
                    await sendAlertEmail({
                        email: recipientEmail,
                        symbol: alert.symbol,
                        price: currentPrice,
                        target: alert.targetPrice,
                        condition: alert.condition,
                    });
                } else {
                    console.warn(`Could not find recipient email for alert ${alert._id} (userId: ${alert.userId})`);
                }

                // Delete or deactivate triggered alert
                await AlertModel.deleteOne({ _id: alert._id });
            } catch (err) {
                console.error(`Error processing alert ${alert._id} for ${alert.symbol}:`, err);
            }
        }
    }
);

