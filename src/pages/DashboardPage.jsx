import { useEffect, useState } from "react";
import { getChannelStats, getChannelVideos } from "../api/dashboardApi";
import { formatViews } from "../utils/format";
import VideoCard from "../components/VideoCard";

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const statsResponse = await getChannelStats();
                const videosResponse = await getChannelVideos();
                
                setStats(statsResponse.data?.data || statsResponse.data);
                
                // Extract videos array safely
                const videoPayload = videosResponse.data?.data || videosResponse.data;
                const videoArray = videoPayload?.docs || (Array.isArray(videoPayload) ? videoPayload : []);
                setVideos(videoArray);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-8 text-center text-white">Loading dashboard...</div>;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Channel Dashboard</h1>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl text-center">
                        <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Views</h3>
                        <p className="text-3xl font-bold text-white">{formatViews(stats.totalViews || 0)}</p>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl text-center">
                        <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Subscribers</h3>
                        <p className="text-3xl font-bold text-white">{formatViews(stats.totalSubscribers || 0)}</p>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl text-center">
                        <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Likes</h3>
                        <p className="text-3xl font-bold text-white">{formatViews(stats.totalLikes || 0)}</p>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl text-center">
                        <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Videos</h3>
                        <p className="text-3xl font-bold text-white">{stats.totalVideos || 0}</p>
                    </div>
                </div>
            )}

            {/* Uploaded Videos Grid */}
            <h2 className="text-xl font-bold text-white mb-6">Your Videos</h2>
            {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            ) : (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-10 text-center">
                    <p className="text-gray-400 mb-4">You haven't uploaded any videos yet.</p>
                </div>
            )}
        </div>
    );
}