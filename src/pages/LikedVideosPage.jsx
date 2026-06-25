import { useEffect, useState } from "react";
import { getLikedVideos } from "../api/likeApi";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";

export default function LikedVideosPage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikedVideos = async () => {
            setLoading(true);
            try {
                const response = await getLikedVideos();
                
                // 1. Extract the data array from the ApiResponse
                const payload = response.data?.data || response.data;
                const likesArray = payload?.docs || (Array.isArray(payload) ? payload : []);
                
                // 2. The backend usually returns an array of "Like" objects. 
                // The actual video details are nested inside 'item.video'. 
                // We extract them and filter out any broken/null videos.
                const extractedVideos = likesArray
                    .map((item) => item.video || item) 
                    .filter((v) => v && v._id);
                
                setVideos(extractedVideos);
            } catch (error) {
                console.error("Failed to load liked videos", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedVideos();
    }, []);

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                    <span className="bg-gray-800 p-3 rounded-full">👍</span> Liked Videos
                </h1>
                <p className="text-gray-400 mt-2">{videos.length} videos</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => <VideoCardSkeleton key={i} />)}
                </div>
            ) : videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-800/50 rounded-xl border border-gray-800">
                    <span className="text-4xl mb-4">👻</span>
                    <p className="text-gray-300 text-lg font-semibold">No liked videos yet</p>
                    <p className="text-gray-500 text-sm mt-2">Go watch some videos and hit the like button!</p>
                </div>
            )}
        </div>
    );
}