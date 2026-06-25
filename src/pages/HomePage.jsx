import { useEffect, useState } from "react";
import { FiVideo } from "react-icons/fi";

import { getAllVideos } from "../api/videoApi.js";
import VideoCard from "../components/VideoCard.jsx";
import VideoCardSkeleton from "../components/VideoCardSkeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";

const HomePage = () => {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getAllVideos({ page: 1, limit: 16 });
                // aggregatePaginate returns { docs, totalDocs, ... }
                setVideos(response.data.data.docs || []);
            } catch (err) {
                setError(
                    err?.response?.data?.message || "Could not load videos right now"
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideos();
    }, []);

    return (
        <div className="p-4 sm:p-6">
            {error && (
                <p className="text-brand text-sm mb-4 text-center">{error}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                          <VideoCardSkeleton key={i} />
                      ))
                    : videos.map((video) => (
                          <VideoCard key={video._id} video={video} />
                      ))}
            </div>

            {!isLoading && !error && videos.length === 0 && (
                <EmptyState
                    icon={<FiVideo size={40} />}
                    title="No videos yet"
                    description="Be the first to upload something to VideoTube."
                />
            )}
        </div>
    );
};

export default HomePage;
