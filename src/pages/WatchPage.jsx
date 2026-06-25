import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getVideoById } from "../api/videoApi";
import { toggleSubscription } from "../api/subscriptionApi";
import { toggleVideoLike } from "../api/likeApi";
import { formatTimeAgo, formatViews } from "../utils/format";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import Button from "../components/Button";
import CommentSection from "../components/CommentSection";
import { useSelector } from "react-redux";

export default function WatchPage() {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                setLoading(true);
                const response = await getVideoById(videoId);
                setVideo(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load video");
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [videoId]);

    const handleSubscribe = async () => {
        if (!isAuthenticated) return alert("Please log in to subscribe");
        if (user._id === video.owner._id) return alert("You cannot subscribe to your own channel");
        try {
            await toggleSubscription(video.owner._id);
            alert("Subscription toggled successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    const handleLike = async () => {
        if (!isAuthenticated) return alert("Please log in to like");
        try {
            await toggleVideoLike(video._id);
            alert("Like toggled successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-4"><VideoCardSkeleton /></div>;
    if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;
    if (!video) return null;

    return (
        <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
                {/* Video Player */}
                <video
                    src={video.videoFile}
                    poster={video.thumbnail}
                    controls
                    autoPlay
                    className="w-full aspect-video bg-black rounded-xl object-contain"
                ></video>

                {/* Video Info */}
                <div className="mt-4">
                    <h1 className="text-xl md:text-2xl font-bold text-white">{video.title}</h1>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mt-3 gap-4">
                        <div className="flex items-center gap-4">
                            <Link to={`/channel/${video.owner.username}`}>
                                <img
                                    src={video.owner.avatar}
                                    alt={video.owner.username}
                                    className="w-12 h-12 rounded-full object-cover bg-gray-800"
                                />
                            </Link>
                            <div>
                                <Link to={`/channel/${video.owner.username}`} className="font-semibold text-white hover:text-gray-300">
                                    {video.owner.fullname}
                                </Link>
                                <p className="text-sm text-gray-400">@{video.owner.username}</p>
                            </div>
                            {user?._id !== video.owner._id && (
                                <Button onClick={handleSubscribe} className="ml-2 rounded-full px-4 py-2 bg-white text-black font-semibold hover:bg-gray-200">
                                    Subscribe
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button onClick={handleLike} className="rounded-full bg-gray-800 text-white hover:bg-gray-700 flex items-center gap-2">
                                <span>👍</span> Like
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Description Box */}
                <div className="mt-4 bg-gray-800/50 rounded-xl p-4 text-sm text-gray-200">
                    <p className="font-semibold text-white mb-2">
                        {formatViews(video.views)} views • {formatTimeAgo(video.createdAt)}
                    </p>
                    <p className="whitespace-pre-wrap">{video.description}</p>
                </div>

                {/* ✅ Comment Section integrated here */}
                <CommentSection videoId={video._id} />
            </div>

            {/* Sidebar Placeholder for later */}
            <div className="w-full lg:w-[350px] hidden lg:block">
                <p className="text-gray-400 text-sm font-semibold mb-4">Up Next</p>
                <div className="h-64 border border-gray-800 border-dashed rounded-xl flex items-center justify-center p-4 text-center text-gray-500">
                    More videos will go here
                </div>
            </div>
        </div>
    );
}