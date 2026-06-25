import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllVideos } from "../api/videoApi";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";

export default function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("search_query");
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const response = await getAllVideos({ query });
                
                console.log("Search API Full Response:", response.data); // Helpful for debugging
                
                // ✅ Safely extract the array from the backend's nested ApiResponse structure
                const payload = response.data?.data;
                const videoArray = payload?.docs || (Array.isArray(payload) ? payload : []);
                
                setVideos(videoArray);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchResults();
        } else {
            setLoading(false);
        }
    }, [query]);

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6">
                Search results for: <span className="text-blue-400">"{query}"</span>
            </h2>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => <VideoCardSkeleton key={i} />)}
                </div>
            ) : videos && videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            ) : (
                // ✅ Simple inline empty state so it never fails to render
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-gray-400 text-lg">No videos found matching "{query}"</p>
                    <p className="text-gray-500 text-sm mt-2">Try searching for something else.</p>
                </div>
            )}
        </div>
    );
}