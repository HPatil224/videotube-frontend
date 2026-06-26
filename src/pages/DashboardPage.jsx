import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiUsers, FiVideo, FiThumbsUp } from "react-icons/fi";

import { getChannelStats, getChannelVideos } from "../api/dashboardApi.js";
import { togglePublishStatus, deleteVideo } from "../api/videoApi.js";
import { formatViews, formatTimeAgo } from "../utils/format.js";
import Button from "../components/Button.jsx";

const StatCard = ({ icon, label, value }) => (
    <div className="bg-surface border border-border rounded-lg p-4 flex items-center gap-3">
        <div className="text-brand">{icon}</div>
        <div>
            <p className="text-text-secondary text-xs">{label}</p>
            <p className="text-text-primary text-lg font-semibold">{value}</p>
        </div>
    </div>
);

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchDashboard = async () => {
            setIsLoading(true);
            try {
                const [statsRes, videosRes] = await Promise.all([
                    getChannelStats(),
                    getChannelVideos(),
                ]);
                if (isMounted) {
                    setStats(statsRes.data.data);
                    setVideos(videosRes.data.data || []);
                }
            } catch (err) {
                // leave dashboard empty on failure
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchDashboard();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleTogglePublish = async (videoId) => {
        try {
            const response = await togglePublishStatus(videoId);
            setVideos((prev) =>
                prev.map((v) =>
                    v._id === videoId
                        ? { ...v, isPublished: response.data.data.isPublished }
                        : v
                )
            );
        } catch (err) {
            // leave publish state unchanged on failure
        }
    };

    const handleDelete = async (videoId) => {
        try {
            await deleteVideo(videoId);
            setVideos((prev) => prev.filter((v) => v._id !== videoId));
        } catch (err) {
            // leave video in list on failure
        }
    };

    if (isLoading) {
        return <p className="p-6 text-text-secondary text-sm">Loading dashboard...</p>;
    }

    return (
        <div className="p-4 sm:p-6">
            <h1 className="text-text-primary text-xl font-semibold mb-4">
                Channel dashboard
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <StatCard
                    icon={<FiUsers size={20} />}
                    label="Subscribers"
                    value={stats?.totalSubscribers ?? 0}
                />
                <StatCard
                    icon={<FiVideo size={20} />}
                    label="Videos"
                    value={stats?.totalVideos ?? 0}
                />
                <StatCard
                    icon={<FiEye size={20} />}
                    label="Total views"
                    value={stats?.totalViews ?? 0}
                />
                <StatCard
                    icon={<FiThumbsUp size={20} />}
                    label="Total likes"
                    value={stats?.totalLikes ?? 0}
                />
            </div>

            <h2 className="text-text-primary font-medium mb-3">Your videos</h2>

            {videos.length === 0 ? (
                <p className="text-text-secondary text-sm">
                    You haven't uploaded any videos yet.
                </p>
            ) : (
                <div className="flex flex-col divide-y divide-border">
                    {videos.map((video) => (
                        <div
                            key={video._id}
                            className="flex items-center gap-4 py-3"
                        >
                            <Link to={`/watch/${video._id}`} className="shrink-0">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-32 aspect-video object-cover rounded-md"
                                />
                            </Link>
                            <div className="flex-1 min-w-0">
                                <Link to={`/watch/${video._id}`}>
                                    <p className="text-text-primary text-sm font-medium line-clamp-1">
                                        {video.title}
                                    </p>
                                </Link>
                                <p className="text-text-secondary text-xs mt-1">
                                    {formatViews(video.views)} · {video.likesCount ?? 0} likes ·{" "}
                                    {formatTimeAgo(video.createdAt)}
                                </p>
                            </div>
                            <Button
                                variant="secondary"
                                onClick={() => handleTogglePublish(video._id)}
                            >
                                {video.isPublished ? "Unpublish" : "Publish"}
                            </Button>
                            <Button variant="ghost" onClick={() => handleDelete(video._id)}>
                                <span className="text-brand">Delete</span>
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
