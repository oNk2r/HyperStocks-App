"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    createAlert,
    deleteAlert,
    getAlertsBySymbol,
} from "@/lib/actions/alert.actions";
import { toast } from "sonner";

export interface AlertItem {
    _id: string;
    userId?: string;
    symbol: string;
    targetPrice: number;
    condition: "above" | "below";
    status: "active" | "triggered";
    createdAt?: string | Date;
}

interface WatchlistAlertsProps {
    symbol?: string;
    symbols?: string[];
}

export default function WatchlistAlerts({ symbol, symbols = [] }: WatchlistAlertsProps) {
    const availableSymbols = useMemo(() => (symbol ? [symbol] : symbols), [symbol, symbols]);
    const [selectedSymbol, setSelectedSymbol] = useState<string>(
        symbol || (symbols.length > 0 ? symbols[0] : "")
    );

    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [price, setPrice] = useState("");
    const [condition, setCondition] = useState<"above" | "below">("above");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedSymbol && availableSymbols.length > 0) {
            setSelectedSymbol(availableSymbols[0]);
        }
    }, [availableSymbols, selectedSymbol]);

    const loadAlerts = useCallback(async (sym: string) => {
        if (!sym) {
            setAlerts([]);
            return;
        }
        try {
            const data = await getAlertsBySymbol(sym);
            setAlerts(data as unknown as AlertItem[]);
        } catch {
            setAlerts([]);
        }
    }, []);

    useEffect(() => {
        if (selectedSymbol) {
            void loadAlerts(selectedSymbol);
        } else {
            setAlerts([]);
        }
    }, [selectedSymbol, loadAlerts]);

    const add = async () => {
        if (!selectedSymbol) {
            toast.error("Please select a stock");
            return;
        }
        const numPrice = Number(price);
        if (!price || isNaN(numPrice) || numPrice <= 0) {
            toast.error("Please enter a valid target price");
            return;
        }

        try {
            setLoading(true);
            await createAlert(selectedSymbol, condition, numPrice);
            toast.success(`Alert created for ${selectedSymbol}`);
            setPrice("");
            await loadAlerts(selectedSymbol);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to create alert");
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: string) => {
        try {
            await deleteAlert(id);
            toast.success("Alert removed");
            if (selectedSymbol) {
                await loadAlerts(selectedSymbol);
            }
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to remove alert");
        }
    };

    if (availableSymbols.length === 0) {
        return (
            <div className="text-gray-400 py-6">
                No stocks in your watchlist to set alerts for. Add stocks to your watchlist first.
            </div>
        );
    }

    return (
        <div className="space-y-4 max-w-xl">
            {/* Symbol selector if multiple symbols available */}
            {availableSymbols.length > 1 && (
                <div className="flex items-center gap-3">
                    <label htmlFor="symbol-select" className="text-sm text-gray-400">
                        Select Stock:
                    </label>
                    <select
                        id="symbol-select"
                        value={selectedSymbol}
                        onChange={(e) => setSelectedSymbol(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2"
                    >
                        {availableSymbols.map((sym) => (
                            <option key={sym} value={sym}>
                                {sym}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Alert Creation Form */}
            <div className="flex flex-wrap gap-2 items-center">
                <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as "above" | "below")}
                    className="bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2"
                >
                    <option value="above">Above (≥)</option>
                    <option value="below">Below (≤)</option>
                </select>
                <input
                    type="number"
                    step="any"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Target price ($)"
                    className="bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2 flex-1 min-w-[120px]"
                />
                <button
                    onClick={add}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-gray-900 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                >
                    {loading ? "Adding..." : "Set Alert"}
                </button>
            </div>

            {/* Alerts List */}
            <div className="space-y-2 pt-2">
                <h4 className="text-sm font-medium text-gray-300">
                    Active Alerts for {selectedSymbol} ({alerts.length})
                </h4>
                {alerts.length === 0 ? (
                    <div className="text-sm text-gray-500 py-3">
                        No alerts set for {selectedSymbol}.
                    </div>
                ) : (
                    alerts.map((a) => (
                        <div
                            key={a._id}
                            className="flex justify-between items-center text-sm bg-gray-800/80 border border-gray-700/60 px-4 py-2.5 rounded-lg"
                        >
                            <div className="flex items-center gap-2">
                                <span className={a.condition === "above" ? "text-green-400" : "text-red-400"}>
                                    {a.condition === "above" ? "▲ Above" : "▼ Below"}
                                </span>
                                <span className="font-semibold text-gray-100">
                                    ${a.targetPrice}
                                </span>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded ${
                                        a.status === "active"
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-gray-600/30 text-gray-400"
                                    }`}
                                >
                                    {a.status}
                                </span>
                            </div>

                            <button
                                onClick={() => remove(a._id)}
                                className="text-gray-400 hover:text-red-400 transition-colors p-1"
                                title="Delete alert"
                            >
                                ✕
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

