import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserPlaylists, createPlaylist } from "../api/playlistApi";
import { FiPlayCircle, FiList, FiX } from "react-icons/fi";
import Button from "../components/Button";
import Input from "../components/Input";

export default function PlaylistsPage() {
    const { user } = useSelector((state) => state.auth);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchPlaylists = async () => {
        if (!user?._id) return;
        setLoading(true);
        try {
            const response = await getUserPlaylists(user._id);
            const payload = response.data?.data || response.data;
            setPlaylists(Array.isArray(payload) ? payload : []);
        } catch (error) {
            console.error("Failed to load playlists", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, [user]);

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        setIsSubmitting(true);
        try {
            await createPlaylist(name, description);
            // Close modal and reset form
            setIsModalOpen(false);
            setName("");
            setDescription("");
            // Refresh the playlists to show the new one
            fetchPlaylists();
        } catch (error) {
            console.error("Failed to create playlist", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto w-full relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                        <span className="bg-gray-800 p-3 rounded-full"><FiList /></span> Your Playlists
                    </h1>
                    <p className="text-gray-400 mt-2">{playlists.length} playlists created</p>
                </div>
                
                {/* ✅ Button now opens the modal */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    + New Playlist
                </button>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-full aspect-video bg-gray-800 animate-pulse rounded-xl"></div>
                    ))}
                </div>
            ) : playlists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {playlists.map((playlist) => (
                        <Link 
                            key={playlist._id} 
                            to={`/playlist/${playlist._id}`} 
                            className="group flex flex-col gap-2 cursor-pointer"
                        >
                            <div className="relative w-full aspect-[4/3] bg-gray-800 rounded-xl overflow-hidden border border-gray-700 flex items-center justify-center group-hover:border-gray-500 transition-colors">
                                <FiPlayCircle size={48} className="text-gray-600 group-hover:text-white transition-colors" />
                                <div className="absolute bottom-0 w-full bg-black/80 text-white text-xs p-2 flex justify-between">
                                    <span>Playlist</span>
                                </div>
                            </div>
                            <h3 className="text-white font-semibold line-clamp-1 mt-1 group-hover:text-blue-400 transition-colors">
                                {playlist.name}
                            </h3>
                            <p className="text-gray-400 text-sm line-clamp-2">
                                {playlist.description || "No description"}
                            </p>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-800/50 rounded-xl border border-gray-800">
                    <FiList size={48} className="text-gray-600 mb-4" />
                    <p className="text-gray-300 text-lg font-semibold">No playlists created yet</p>
                    <p className="text-gray-500 text-sm mt-2">Organize your favorite videos by creating a playlist.</p>
                </div>
            )}

            {/* ✅ Create Playlist Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Create New Playlist</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-4">
                            <Input
                                label="Playlist Name"
                                placeholder="E.g., Web Dev Tutorials"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-300">Description (Optional)</label>
                                <textarea
                                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 h-24 resize-none"
                                    placeholder="What is this playlist about?"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <Button type="submit" isLoading={isSubmitting}>
                                    Create
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}