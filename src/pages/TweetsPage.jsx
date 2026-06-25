import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserTweets, createTweet, deleteTweet } from "../api/tweetApi";
import { formatTimeAgo } from "../utils/format";
import Button from "../components/Button";
import { FiTwitter, FiTrash2 } from "react-icons/fi";

export default function TweetsPage() {
    const { user } = useSelector((state) => state.auth);
    const [tweets, setTweets] = useState([]);
    const [newTweet, setNewTweet] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTweets = async () => {
        if (!user?._id) return;
        setLoading(true);
        try {
            const response = await getUserTweets(user._id);
            const payload = response.data?.data || response.data;
            // Ensure we extract the array safely
            setTweets(Array.isArray(payload) ? payload : payload?.docs || []);
        } catch (error) {
            console.error("Failed to load tweets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTweets();
    }, [user]);

    const handlePostTweet = async (e) => {
        e.preventDefault();
        if (!newTweet.trim()) return;

        setIsSubmitting(true);
        try {
            await createTweet(newTweet);
            setNewTweet("");
            fetchTweets(); // Refresh the feed
        } catch (error) {
            console.error("Failed to post tweet", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (tweetId) => {
        try {
            await deleteTweet(tweetId);
            setTweets(tweets.filter((t) => t._id !== tweetId));
        } catch (error) {
            console.error("Failed to delete tweet", error);
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                    <span className="bg-gray-800 p-3 rounded-full text-blue-400"><FiTwitter /></span> 
                    Your Tweets
                </h1>
            </div>

            {/* Create Tweet Box */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6 mb-8 shadow-sm">
                <form onSubmit={handlePostTweet} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <img 
                            src={user?.avatar || "https://ui-avatars.com/api/?name=User"} 
                            alt="avatar" 
                            className="w-12 h-12 rounded-full object-cover bg-gray-800 border border-gray-700 hidden sm:block" 
                        />
                        <textarea
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 h-24 resize-none transition-colors"
                            placeholder="What's on your mind?"
                            value={newTweet}
                            onChange={(e) => setNewTweet(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <Button 
                            type="submit" 
                            isLoading={isSubmitting} 
                            disabled={!newTweet.trim()}
                            className="px-6 py-2 rounded-full font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Post
                        </Button>
                    </div>
                </form>
            </div>

            {/* Tweets Feed */}
            {loading ? (
                <div className="flex flex-col gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-800 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : tweets.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {tweets.map((tweet) => (
                        <div key={tweet._id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6 flex gap-4 group">
                            <img 
                                src={tweet.owner?.avatar || user?.avatar} 
                                alt="avatar" 
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover bg-gray-800 border border-gray-700 flex-shrink-0" 
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-bold text-white truncate">
                                            {tweet.owner?.fullname || user?.fullname}
                                        </h3>
                                        <span className="text-gray-500 text-sm">
                                            @{tweet.owner?.username || user?.username}
                                        </span>
                                        <span className="text-gray-600 text-xs hidden sm:inline">•</span>
                                        <span className="text-gray-500 text-xs">
                                            {formatTimeAgo(tweet.createdAt)}
                                        </span>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleDelete(tweet._id)}
                                        className="text-gray-500 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete tweet"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                                <p className="text-gray-200 mt-2 whitespace-pre-wrap break-words text-sm md:text-base">
                                    {tweet.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-800/30 rounded-xl border border-gray-800 border-dashed">
                    <FiTwitter size={48} className="text-gray-600 mb-4" />
                    <p className="text-gray-300 text-lg font-semibold">No tweets yet</p>
                    <p className="text-gray-500 text-sm mt-2">Share your thoughts with your subscribers!</p>
                </div>
            )}
        </div>
    );
}