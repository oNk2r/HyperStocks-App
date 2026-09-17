"use client";

import { useEffect, useState } from "react";
import { getAlertsBySymbol } from "@/lib/actions/alert.actions";
import WatchlistAlertItem from "./WatchlistAlertItem";

interface AlertItem {
    _id: string;
    condition: "above" | "below";
    targetPrice: number;
    status: "active" | "triggered";
}

export default function WatchlistAlertList({
    symbol,
}: {
    symbol: string;
}) {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);

    useEffect(() => {
        let mounted = true;
        getAlertsBySymbol(symbol).then((data) => {
            if (mounted) {
                setAlerts((data || []) as unknown as AlertItem[]);
            }
        });
        return () => {
            mounted = false;
        };
    }, [symbol]);

    if (alerts.length === 0)
        return (
            <div className="text-sm text-gray-500">
                No alerts
            </div>
        );

    return (
        <div className="space-y-2">
            {alerts.map((a) => (
                <WatchlistAlertItem key={a._id} alert={a} />
            ))}
        </div>
    );
}
