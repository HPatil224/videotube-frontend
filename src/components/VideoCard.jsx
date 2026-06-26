import { Link } from "react-router-dom";
import { formatViews, formatTimeAgo, formatDuration } from "../utils/format.js";

const VideoCard = ({ video }) => {
    const owner = video.owner;

    return (
        <Link to={`/watch/${video._id}`} className="flex flex-col gap-2 group">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {video.duration > 0 && (
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                        {formatDuration(video.duration)}
                    </span>
                )}
            </div>

            <div className="flex gap-3">
                {owner?.avatar && (
                    <img
                        src={owner.avatar}
                        alt={owner.username}
                        className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                    />
                )}
                <div className="flex flex-col min-w-0">
                    <h3 className="text-text-primary text-sm font-medium line-clamp-2">
                        {video.title}
                    </h3>
                    {owner?.username && (
                        <span className="text-text-secondary text-xs mt-1">
                            {owner.username}
                        </span>
                    )}
                    <span className="text-text-secondary text-xs">
                        {formatViews(video.views)} · {formatTimeAgo(video.createdAt)}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default VideoCard;
