import { useEffect, useState } from "react";
import { FiThumbsUp } from "react-icons/fi";

import { getLikedVideos } from "../api/likeApi.js";
import VideoCard from "../components/VideoCard.jsx";
import VideoCardSkeleton from "../components/VideoCardSkeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";

const LikedVideosPage = () => {
    const [likedVideos, setLikedVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchLikedVideos = async () => {
            setIsLoading(true);
            try {
                const response = await getLikedVideos();
                if (isMounted) setLikedVideos(response.data.data || []);
            } catch (err) {
                // leave list empty on failure
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchLikedVideos();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="p-4 sm:p-6">
            <h1 className="text-text-primary text-xl font-semibold mb-4">
                Liked videos
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                          <VideoCardSkeleton key={i} />
                      ))
                    : likedVideos.map(
                          (item) =>
                              item.video && (
                                  <VideoCard key={item.video._id} video={item.video} />
                              )
                      )}
            </div>

            {!isLoading && likedVideos.length === 0 && (
                <EmptyState
                    icon={<FiThumbsUp size={40} />}
                    title="No liked videos yet"
                    description="Videos you like will show up here."
                />
            )}
        </div>
    );
};

export default LikedVideosPage;
