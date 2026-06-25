import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistById } from "../api/playlistApi";
import VideoCard from "../components/VideoCard";
import { FiPlayCircle } from "react-icons/fi";

export default function PlaylistDetailPage() {
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            setLoading(true);
            try {
                const response = await getPlaylistById(playlistId);
                // Extract safely from ApiResponse
                const data = response.data?.data || response.data;
                setPlaylist(data);
            } catch (err) {
                console.error("Failed to load playlist", err);
                setError("Playlist not found");
            } finally {
                setLoading(false);
            }
        };

        if (playlistId) {
            fetchPlaylistDetails();
        }
    }, [playlistId]);

    if (loading) return <div className="p-8 text-center text-white">Loading playlist...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!playlist) return null;

    return (
        <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full relative">
            
            {/* Playlist Info Sidebar (Left side on desktop, top on mobile) */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4">
                <div className="w-full aspect-[4/3] bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center relative">
                    {playlist.videos?.length > 0 && playlist.videos[0]?.thumbnail ? (
                        <>
                            <img 
                                src={playlist.videos[0].thumbnail} 
                                alt="Playlist Thumbnail" 
                                className="w-full h-full object-cover opacity-80" 
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <FiPlayCircle size={48} className="text-white/80" />
                            </div>
                        </>
                    ) : (
                        <FiPlayCircle size={64} className="text-gray-600" />
                    )}
                </div>
                
                <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-800">
                    <h1 className="text-2xl font-bold text-white leading-tight">{playlist.name}</h1>
                    <p className="text-gray-400 mt-2 text-sm whitespace-pre-wrap">
                        {playlist.description || "No description provided."}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-500 font-medium">
                        <span>{playlist.owner?.fullname || "You"}</span>
                        <span>•</span>
                        <span>{playlist.videos?.length || 0} videos</span>
                    </div>
                </div>
            </div>

            {/* Videos List (Right side) */}
            <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-4 hidden md:block">Videos</h2>
                
                {playlist.videos?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {playlist.videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-800/50 border border-gray-800 rounded-xl p-10 text-center flex flex-col items-center justify-center h-64">
                        <FiPlayCircle size={48} className="text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No videos yet</h3>
                        <p className="text-gray-400 text-sm">
                            Videos you add to this playlist will appear here.
                        </p>
                    </div>
                )}
            </div>
            
        </div>
    );
}