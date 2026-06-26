import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiList } from "react-icons/fi";

import { getPlaylistById } from "../api/playlistApi.js";
import VideoCard from "../components/VideoCard.jsx";
import VideoCardSkeleton from "../components/VideoCardSkeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";

const PlaylistDetailPage = () => {
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPlaylist = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getPlaylistById(playlistId);
                if (isMounted) setPlaylist(response.data.data);
            } catch (err) {
                if (isMounted) {
                    setError(
                        err?.response?.data?.message || "This playlist could not be loaded"
                    );
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchPlaylist();
        return () => {
            isMounted = false;
        };
    }, [playlistId]);

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <VideoCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error || !playlist) {
        return (
            <div className="p-6 text-center">
                <p className="text-brand">{error || "Playlist not found"}</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            <h1 className="text-text-primary text-xl font-semibold">
                {playlist.name}
            </h1>
            <p className="text-text-secondary text-sm mt-1 mb-4">
                {playlist.description}
            </p>

            {playlist.videos?.length === 0 ? (
                <EmptyState
                    icon={<FiList size={36} />}
                    title="No videos in this playlist yet"
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                    {playlist.videos?.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlaylistDetailPage;
