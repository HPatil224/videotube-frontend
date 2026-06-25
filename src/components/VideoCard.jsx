import { formatTimeAgo, formatViews, formatDuration } from "../utils/format";
import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
    return (
        <Link to={`/watch/${video._id}`} className="flex flex-col gap-2 group cursor-pointer">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                </span>
            </div>
            
            <div className="flex gap-3 mt-2">
                {/* ✅ Added optional chaining (?.) to prevent crashes if owner is unpopulated */}
                <img 
                    src={video.owner?.avatar || "https://via.placeholder.com/150"} 
                    alt={video.owner?.username || "User"} 
                    className="w-10 h-10 rounded-full object-cover bg-gray-800"
                />
                <div className="flex flex-col">
                    <h3 className="text-white font-semibold line-clamp-2 leading-tight">
                        {video.title}
                    </h3>
                    {/* ✅ Added optional chaining here too */}
                    <p className="text-gray-400 text-sm mt-1">{video.owner?.fullname || "VideoTube User"}</p>
                    <p className="text-gray-400 text-sm">
                        {formatViews(video.views)} views • {formatTimeAgo(video.createdAt)}
                    </p>
                </div>
            </div>
        </Link>
    );
}