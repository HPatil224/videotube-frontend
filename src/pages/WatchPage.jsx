import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiThumbsUp } from "react-icons/fi";

import { getVideoById } from "../api/videoApi.js";
import { toggleVideoLike } from "../api/likeApi.js";
import { toggleSubscription } from "../api/subscriptionApi.js";
import { formatViews, formatTimeAgo } from "../utils/format.js";

import Button from "../components/Button.jsx";
import CommentSection from "../components/CommentSection.jsx";

const WatchPage = () => {
    const { videoId } = useParams();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [video, setVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // local-only optimistic state for like/subscribe, since the backend
    // doesn't tell us our own like/subscribe status on this endpoint
    const [isLiked, setIsLiked] = useState(false);
    const [likeBusy, setLikeBusy] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribeBusy, setSubscribeBusy] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchVideo = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getVideoById(videoId);
                if (!isMounted) return;
                setVideo(response.data.data);
            } catch (err) {
                if (!isMounted) return;
                setError(
                    err?.response?.data?.message || "This video could not be loaded"
                );
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchVideo();
        return () => {
            isMounted = false;
        };
    }, [videoId]);

    const handleToggleLike = async () => {
        if (!isAuthenticated || likeBusy) return;
        setLikeBusy(true);
        try {
            const response = await toggleVideoLike(videoId);
            setIsLiked(response.data.data.isLiked);
        } catch (err) {
            // leave like state unchanged on failure
        } finally {
            setLikeBusy(false);
        }
    };

    const handleToggleSubscribe = async () => {
        if (!isAuthenticated || subscribeBusy || !video?.owner?._id) return;
        setSubscribeBusy(true);
        try {
            const response = await toggleSubscription(video.owner._id);
            setIsSubscribed(response.data.data.subscribed);
        } catch (err) {
            // leave subscribe state unchanged on failure
        } finally {
            setSubscribeBusy(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 max-w-4xl mx-auto">
                <div className="w-full aspect-video bg-surface rounded-xl animate-pulse" />
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="p-6 text-center">
                <p className="text-brand">{error || "Video not found"}</p>
            </div>
        );
    }

    const isOwnVideo = user?._id === video.owner?._id;

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
                <video
                    key={video._id}
                    src={video.videoFile}
                    poster={video.thumbnail}
                    controls
                    className="w-full h-full"
                />
            </div>

            <h1 className="text-text-primary text-lg font-semibold mt-4">
                {video.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                <div className="flex items-center gap-3">
                    {video.owner?.avatar && (
                        <img
                            src={video.owner.avatar}
                            alt={video.owner.username}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    )}
                    <div>
                        <p className="text-text-primary text-sm font-medium">
                            {video.owner?.username}
                        </p>
                        <p className="text-text-secondary text-xs">
                            {video.owner?.fullname}
                        </p>
                    </div>

                    {!isOwnVideo && (
                        <Button
                            variant={isSubscribed ? "secondary" : "primary"}
                            isLoading={subscribeBusy}
                            onClick={handleToggleSubscribe}
                            className="ml-2"
                        >
                            {isSubscribed ? "Subscribed" : "Subscribe"}
                        </Button>
                    )}
                </div>

                <button
                    onClick={handleToggleLike}
                    disabled={likeBusy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                        isLiked
                            ? "bg-surface-hover border-brand text-brand"
                            : "border-border text-text-primary hover:bg-surface-hover"
                    }`}
                >
                    <FiThumbsUp size={18} />
                    <span className="text-sm">{isLiked ? "Liked" : "Like"}</span>
                </button>
            </div>

            <div className="bg-surface rounded-lg p-3 mt-4">
                <p className="text-text-secondary text-sm">
                    {formatViews(video.views)} · {formatTimeAgo(video.createdAt)}
                </p>
                <p className="text-text-primary text-sm mt-2 whitespace-pre-wrap">
                    {video.description}
                </p>
            </div>

            <CommentSection videoId={videoId} />
        </div>
    );
};

export default WatchPage;
