// Formats a raw number of views into a short YouTube-style string,
// e.g. 950 -> "950 views", 1500 -> "1.5K views", 2000000 -> "2M views"
export const formatViews = (views = 0) => {
    if (views >= 1_000_000) {
        return `${(views / 1_000_000).toFixed(1).replace(/\.0$/, "")}M views`;
    }
    if (views >= 1_000) {
        return `${(views / 1_000).toFixed(1).replace(/\.0$/, "")}K views`;
    }
    return `${views} ${views === 1 ? "view" : "views"}`;
};

// Formats an ISO date string into a relative time string,
// e.g. "3 days ago", "2 hours ago", "just now"
export const formatTimeAgo = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    const units = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
    ];

    for (const unit of units) {
        const value = Math.floor(diffInSeconds / unit.seconds);
        if (value >= 1) {
            return `${value} ${unit.label}${value > 1 ? "s" : ""} ago`;
        }
    }

    return "just now";
};

// Formats video duration in seconds into "m:ss" or "h:mm:ss"
export const formatDuration = (seconds = 0) => {
    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${minutes}:${String(secs).padStart(2, "0")}`;
};
