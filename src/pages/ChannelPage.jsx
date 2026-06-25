import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserChannelProfile } from "../api/userApi";
import { getAllVideos } from "../api/videoApi";
import { toggleSubscription } from "../api/subscriptionApi";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";

export default function ChannelPage() {
    const { username } = useParams();
    const { isAuthenticated, user: currentUser } = useSelector((state) => state.auth);
    
    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // ✅ Added error states to catch broken images
    const [coverError, setCoverError] = useState(false);
    const [avatarError, setAvatarError] = useState(false);

    useEffect(() => {
        const fetchChannelData = async () => {
            setLoading(true);
            setError("");
            // Reset image errors when switching profiles
            setCoverError(false);
            setAvatarError(false);
            
            try {
                const profileResponse = await getUserChannelProfile(username);
                const channelData = profileResponse.data?.data || profileResponse.data;
                setProfile(channelData);

                const videosResponse = await getAllVideos({ userId: channelData._id });
                const payload = videosResponse.data?.data || videosResponse.data;
                const videoArray = payload?.docs || (Array.isArray(payload) ? payload : []);
                setVideos(videoArray);

            } catch (err) {
                console.error(err);
                setError("Channel not found or failed to load.");
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchChannelData();
        }
    }, [username]);

    const handleSubscribe = async () => {
        if (!isAuthenticated) return alert("Please log in to subscribe");
        if (currentUser?._id === profile._id) return alert("You cannot subscribe to your own channel");
        
        try {
            await toggleSubscription(profile._id);
            setProfile((prev) => ({
                ...prev,
                isSubscribed: !prev.isSubscribed,
                subscribersCount: prev.isSubscribed ? prev.subscribersCount - 1 : prev.subscribersCount + 1
            }));
        } catch (err) {
            console.error("Failed to toggle subscription", err);
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Loading channel...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!profile) return null;

    return (
        <div className="w-full pb-8">
            {/* Cover Image Banner */}
            <div className="w-full h-32 sm:h-48 md:h-64 bg-gray-800 relative">
                {/* ✅ Added onError handler so it falls back to the gradient if the link is broken */}
                {profile.coverImage && !coverError ? (
                    <img 
                        src={profile.coverImage} 
                        alt="Cover" 
                        className="w-full h-full object-cover" 
                        onError={() => setCoverError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-900 to-gray-900"></div>
                )}
            </div>

            {/* Channel Header Info */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 md:mt-6 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                {/* ✅ Added onError handler for the Avatar as well */}
                <img 
                    src={!avatarError && profile.avatar ? profile.avatar : "https://via.placeholder.com/150"} 
                    alt={profile.username} 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-900 -mt-12 md:-mt-16 bg-gray-800 relative z-10"
                    onError={() => setAvatarError(true)}
                />
                
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{profile.fullname}</h1>
                    <p className="text-gray-400 mt-1">
                        @{profile.username} • {profile.subscribersCount} subscribers • {profile.channelsSubscribedToCount} subscribed
                    </p>
                </div>

                <div className="mt-2 md:mt-0">
                    {currentUser?.username !== profile.username && (
                        <Button 
                            onClick={handleSubscribe} 
                            className={`rounded-full px-6 py-2 font-semibold ${
                                profile.isSubscribed 
                                ? "bg-gray-800 text-white hover:bg-gray-700" 
                                : "bg-white text-black hover:bg-gray-200"
                            }`}
                        >
                            {profile.isSubscribed ? "Subscribed" : "Subscribe"}
                        </Button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 border-b border-gray-800">
                <div className="flex gap-8 text-sm font-medium">
                    <button className="pb-3 text-white border-b-2 border-white">Videos</button>
                    <button className="pb-3 text-gray-400 hover:text-white transition-colors">Playlists</button>
                    <button className="pb-3 text-gray-400 hover:text-white transition-colors">Tweets</button>
                </div>
            </div>

            {/* Video Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
                {videos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                ) : (
                    <EmptyState message="This channel hasn't uploaded any videos yet." />
                )}
            </div>
        </div>
    );
}