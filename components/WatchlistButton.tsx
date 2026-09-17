"use client";

import { useEffect, useState } from "react";
import { toggleWatchlist } from "@/lib/actions/watchlist.actions";
import { toast } from "sonner";

const WatchlistButton = ({
    symbol,
    company,
    isInWatchlist,
    type = "icon",
    onWatchlistChange,
}: WatchlistButtonProps) => {
    const [isAdded, setIsAdded] = useState(isInWatchlist);

    useEffect(() => {
        setIsAdded(isInWatchlist);
    }, [isInWatchlist]);

    const handleClick = async () => {
        const nextState = !isAdded;
        setIsAdded(nextState);

        try {
            const result = await toggleWatchlist(symbol, company);
            setIsAdded(result.added);
            onWatchlistChange?.(symbol, result.added);
            toast.success(
                result.added
                    ? `${symbol.toUpperCase()} added to watchlist`
                    : `${symbol.toUpperCase()} removed from watchlist`
            );
        } catch (e) {
            setIsAdded(!nextState);
            toast.error(e instanceof Error ? e.message : "Failed to update watchlist");
        }
    };

    if (type === "icon") {
        return (
            <button
                onClick={handleClick}
                className={`watchlist-icon-btn ${
                    isAdded ? "watchlist-icon-added" : ""
                }`}
                title={isAdded ? "Remove from watchlist" : "Add to watchlist"}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isAdded ? "#FACC15" : "none"}
                    stroke="#FACC15"
                    strokeWidth="1.5"
                    className="watchlist-star"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
                    />
                </svg>
            </button>
        );
    }


    return null;
};

export default WatchlistButton;
