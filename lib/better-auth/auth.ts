import { betterAuth } from "better-auth";
import { mongodbAdapter} from "better-auth/adapters/mongodb";
import { connectToDatabase} from "@/database/mongoose";
import { nextCookies} from "better-auth/next-js";
import type { Db } from "mongodb";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if (authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) throw new Error("MongoDB connection not found");

    authInstance = betterAuth({
        database: mongodbAdapter(db as unknown as Db),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    });

    return authInstance;
};

// Lazy Proxy prevents build-time static generation from failing when DB is not yet connected
export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
    get(_target, prop: string | symbol) {
        if (prop === "then") {
            return undefined;
        }
        if (authInstance) {
            return (authInstance as unknown as Record<string | symbol, unknown>)[prop];
        }

        return new Proxy({}, {
            get(_subTarget, subProp: string | symbol) {
                return async (...args: unknown[]) => {
                    const instance = await getAuth();
                    const targetProp = (instance as unknown as Record<string | symbol, unknown>)[prop];
                    if (typeof targetProp === "function") {
                        return (targetProp as (...a: unknown[]) => unknown)(...args);
                    }
                    if (targetProp && typeof (targetProp as Record<string | symbol, unknown>)[subProp] === "function") {
                        return ((targetProp as Record<string | symbol, unknown>)[subProp] as (...a: unknown[]) => unknown)(...args);
                    }
                    return (targetProp as Record<string | symbol, unknown>)?.[subProp];
                };
            },
        });

    },
});

