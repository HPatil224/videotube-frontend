import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiList, FiPlus } from "react-icons/fi";

import { getUserPlaylists, createPlaylist } from "../api/playlistApi.js";
import Input from "../components/Input.jsx";
import Textarea from "../components/Textarea.jsx";
import Button from "../components/Button.jsx";
import EmptyState from "../components/EmptyState.jsx";

const PlaylistsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!user?._id) return;
        let isMounted = true;

        const fetchPlaylists = async () => {
            setIsLoading(true);
            try {
                const response = await getUserPlaylists(user._id);
                if (isMounted) setPlaylists(response.data.data || []);
            } catch (err) {
                // leave list empty on failure
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchPlaylists();
        return () => {
            isMounted = false;
        };
    }, [user?._id]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) return;

        setIsCreating(true);
        try {
            const response = await createPlaylist({
                name: name.trim(),
                description: description.trim(),
            });
            setPlaylists((prev) => [
                { ...response.data.data, videoCount: 0 },
                ...prev,
            ]);
            setName("");
            setDescription("");
            setShowForm(false);
        } catch (err) {
            // keep the form open with entered values on failure
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-text-primary text-xl font-semibold">
                    Your playlists
                </h1>
                <Button variant="secondary" onClick={() => setShowForm((prev) => !prev)}>
                    <span className="flex items-center gap-1.5">
                        <FiPlus size={16} /> New playlist
                    </span>
                </Button>
            </div>

            {showForm && (
                <form
                    onSubmit={handleCreate}
                    className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-3 mb-6 max-w-md"
                >
                    <Input
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="My favorite videos"
                    />
                    <Textarea
                        label="Description"
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What's this playlist about?"
                    />
                    <Button type="submit" isLoading={isCreating} className="self-start">
                        Create
                    </Button>
                </form>
            )}

            {isLoading ? (
                <p className="text-text-secondary text-sm">Loading...</p>
            ) : playlists.length === 0 ? (
                <EmptyState
                    icon={<FiList size={40} />}
                    title="No playlists yet"
                    description="Create a playlist to start organizing videos."
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {playlists.map((playlist) => (
                        <Link
                            key={playlist._id}
                            to={`/playlist/${playlist._id}`}
                            className="bg-surface border border-border rounded-lg p-4 hover:bg-surface-hover transition-colors"
                        >
                            <h3 className="text-text-primary font-medium">
                                {playlist.name}
                            </h3>
                            <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                                {playlist.description}
                            </p>
                            <p className="text-text-secondary text-xs mt-2">
                                {playlist.videoCount ?? 0} videos
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlaylistsPage;
