import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSubscribedChannels } from "../api/subscriptionApi";
import { getAllVideos } from "../api/videoApi";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import { FiUsers, FiVideoOff } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function SubscriptionsPage() {
    const { user } = useSelector((state) => state.auth);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptionFeed = async () => {
            if (!user?._id) return;
            setLoading(true);
            
            try {
                // 1. Get the list of channels the user is subscribed to
                const subResponse = await getSubscribedChannels(user._id);
                const subPayload = subResponse.data?.data || subResponse.data;
                const subscriptions = Array.isArray(subPayload) ? subPayload : [];

                if (subscriptions.length === 0) {
                    setVideos([]);
                    setLoading(false);
                    return;
                }

                // 2. Fetch the latest videos for EACH subscribed channel in parallel
                const videoPromises = subscriptions.map(async (sub) => {
                    try {
                        const channel = sub.channel;
                        if (!channel?._id) return [];

                        // Limit to 5 most recent videos per channel to keep the feed fresh
                        const vidResponse = await getAllVideos({ userId: channel._id, limit: 5 });
                        const vidPayload = vidResponse.data?.data || vidResponse.data;
                        const vids = vidPayload?.docs || (Array.isArray(vidPayload) ? vidPayload : []);

                        // Ensure the owner data is perfectly attached for the VideoCard
                        return vids.map(v => ({
                            ...v,
                            owner: v.owner || channel 
                        }));
                    } catch (err) {
                        console.error("Failed to fetch videos for a channel", err);
                        return [];
                    }
                });

                const nestedVideos = await Promise.all(videoPromises);

                // 3. Flatten the arrays and sort by newest first (unified feed)
                const unifiedFeed = nestedVideos
                    .flat()
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setVideos(unifiedFeed);
            } catch (error) {
                console.error("Failed to load subscription feed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptionFeed();
    }, [user]);

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                    <span className="bg-gray-800 p-3 rounded-full"><FiUsers /></span> 
                    Latest from Subscriptions
                </h1>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => <VideoCardSkeleton key={i} />)}
                </div>
            ) : videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-800/30 rounded-xl border border-gray-800 border-dashed">
                    <FiVideoOff size={48} className="text-gray-600 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Your feed is empty</h2>
                    <p className="text-gray-400 text-sm max-w-md">
                        You either haven't subscribed to any channels yet, or the channels you follow haven't uploaded any videos.
                    </p>
                    <Link to="/" className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
                        Discover Channels
                    </Link>
                </div>
            )}
        </div>
    );
}