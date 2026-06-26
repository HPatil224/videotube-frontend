import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiMessageSquare, FiMoreVertical } from "react-icons/fi";

import {
    getUserTweets,
    createTweet,
    updateTweet,
    deleteTweet,
} from "../api/tweetApi.js";
import { formatTimeAgo } from "../utils/format.js";

import Button from "../components/Button.jsx";
import Textarea from "../components/Textarea.jsx";
import EmptyState from "../components/EmptyState.jsx";

const TweetItem = ({ tweet, onUpdated, onDeleted }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(tweet.content);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!content.trim()) return;
        setIsSaving(true);
        try {
            const response = await updateTweet(tweet._id, content.trim());
            onUpdated(response.data.data);
            setIsEditing(false);
        } catch (err) {
            // keep editing open on failure
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTweet(tweet._id);
            onDeleted(tweet._id);
        } catch (err) {
            // leave tweet in place on failure
        }
    };

    return (
        <div className="bg-surface border border-border rounded-lg p-4 relative">
            {isEditing ? (
                <div className="flex flex-col gap-2">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={3}
                    />
                    <div className="flex gap-2">
                        <Button variant="primary" isLoading={isSaving} onClick={handleSave}>
                            Save
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsEditing(false);
                                setContent(tweet.content);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <p className="text-text-primary text-sm pr-6">{tweet.content}</p>
                    <p className="text-text-secondary text-xs mt-2">
                        {formatTimeAgo(tweet.createdAt)}
                    </p>

                    <div className="absolute top-3 right-3">
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="p-1 rounded-full hover:bg-surface-hover text-text-secondary"
                            aria-label="Tweet options"
                        >
                            <FiMoreVertical size={16} />
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 top-7 bg-base border border-border rounded-md shadow-lg z-10 w-28 overflow-hidden">
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setMenuOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        handleDelete();
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-brand hover:bg-surface-hover"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

const TweetsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [tweets, setTweets] = useState([]);
    const [newTweet, setNewTweet] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        if (!user?._id) return;
        let isMounted = true;

        const fetchTweets = async () => {
            setIsLoading(true);
            try {
                const response = await getUserTweets(user._id);
                if (isMounted) setTweets(response.data.data || []);
            } catch (err) {
                // leave tweets empty on failure
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchTweets();
        return () => {
            isMounted = false;
        };
    }, [user?._id]);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newTweet.trim()) return;

        setIsPosting(true);
        try {
            const response = await createTweet(newTweet.trim());
            setTweets((prev) => [response.data.data, ...prev]);
            setNewTweet("");
        } catch (err) {
            // leave the typed tweet in the textarea on failure
        } finally {
            setIsPosting(false);
        }
    };

    const handleUpdated = (updatedTweet) => {
        setTweets((prev) =>
            prev.map((t) => (t._id === updatedTweet._id ? updatedTweet : t))
        );
    };

    const handleDeleted = (tweetId) => {
        setTweets((prev) => prev.filter((t) => t._id !== tweetId));
    };

    return (
        <div className="p-4 sm:p-6 max-w-xl mx-auto">
            <h1 className="text-text-primary text-xl font-semibold mb-4">
                Your tweets
            </h1>

            <form onSubmit={handlePost} className="flex flex-col gap-2 mb-6">
                <Textarea
                    value={newTweet}
                    onChange={(e) => setNewTweet(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={3}
                />
                <Button
                    type="submit"
                    isLoading={isPosting}
                    disabled={!newTweet.trim()}
                    className="self-end"
                >
                    Tweet
                </Button>
            </form>

            {isLoading ? (
                <p className="text-text-secondary text-sm">Loading tweets...</p>
            ) : tweets.length === 0 ? (
                <EmptyState
                    icon={<FiMessageSquare size={36} />}
                    title="No tweets yet"
                    description="Share your first thought with the world."
                />
            ) : (
                <div className="flex flex-col gap-3">
                    {tweets.map((tweet) => (
                        <TweetItem
                            key={tweet._id}
                            tweet={tweet}
                            onUpdated={handleUpdated}
                            onDeleted={handleDeleted}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TweetsPage;
