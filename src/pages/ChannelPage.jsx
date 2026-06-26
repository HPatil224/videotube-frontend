import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiVideo, FiMessageSquare } from "react-icons/fi";

import { getUserChannelProfile } from "../api/channelApi.js";
import { getAllVideos } from "../api/videoApi.js";
import { getUserTweets } from "../api/tweetApi.js";
import { toggleSubscription } from "../api/subscriptionApi.js";

import Button from "../components/Button.jsx";
import VideoCard from "../components/VideoCard.jsx";
import VideoCardSkeleton from "../components/VideoCardSkeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";

const TABS = ["Videos", "Tweets"];

const ChannelPage = () => {
    const { username } = useParams();
    const { user: currentUser } = useSelector((state) => state.auth);

    const [channel, setChannel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subscribeBusy, setSubscribeBusy] = useState(false);

    const [activeTab, setActiveTab] = useState("Videos");
    const [videos, setVideos] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [tabLoading, setTabLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchChannel = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getUserChannelProfile(username);
                if (!isMounted) return;
                setChannel(response.data.data);
            } catch (err) {
                if (!isMounted) return;
                setError(
                    err?.response?.data?.message || "This channel could not be loaded"
                );
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchChannel();
        return () => {
            isMounted = false;
        };
    }, [username]);

    useEffect(() => {
        if (!channel?._id) return;
        let isMounted = true;

        const fetchTabData = async () => {
            setTabLoading(true);
            try {
                if (activeTab === "Videos") {
                    const response = await getAllVideos({ userId: channel._id, limit: 24 });
                    if (isMounted) setVideos(response.data.data.docs || []);
                } else if (activeTab === "Tweets") {
                    const response = await getUserTweets(channel._id);
                    if (isMounted) setTweets(response.data.data || []);
                }
            } catch (err) {
                // leave the current tab's list empty on failure
            } finally {
                if (isMounted) setTabLoading(false);
            }
        };

        fetchTabData();
        return () => {
            isMounted = false;
        };
    }, [channel?._id, activeTab]);

    const handleToggleSubscribe = async () => {
        if (!channel?._id || subscribeBusy) return;
        setSubscribeBusy(true);
        try {
            const response = await toggleSubscription(channel._id);
            setChannel((prev) => ({
                ...prev,
                isSubscribed: response.data.data.subscribed,
                subscribersCount:
                    prev.subscribersCount + (response.data.data.subscribed ? 1 : -1),
            }));
        } catch (err) {
            // leave subscribe state unchanged on failure
        } finally {
            setSubscribeBusy(false);
        }
    };

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="w-full h-40 sm:h-56 bg-surface" />
                <div className="p-4 sm:p-6 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-surface" />
                    <div className="h-4 w-40 bg-surface rounded" />
                </div>
            </div>
        );
    }

    if (error || !channel) {
        return (
            <div className="p-6 text-center">
                <p className="text-brand">{error || "Channel not found"}</p>
            </div>
        );
    }

    const isOwnChannel = currentUser?.username === channel.username;

    return (
        <div>
            <div
                className="w-full h-40 sm:h-56 bg-surface bg-cover bg-center"
                style={{
                    backgroundImage: channel.coverImage
                        ? `url(${channel.coverImage})`
                        : undefined,
                }}
            />

            <div className="p-4 sm:p-6 flex flex-wrap items-center gap-4 border-b border-border">
                {channel.avatar && (
                    <img
                        src={channel.avatar}
                        alt={channel.username}
                        className="w-20 h-20 rounded-full object-cover -mt-12 border-4 border-base"
                    />
                )}
                <div className="flex-1 min-w-0">
                    <h1 className="text-text-primary text-xl font-semibold">
                        {channel.fullname}
                    </h1>
                    <p className="text-text-secondary text-sm">
                        @{channel.username} · {channel.subscribersCount}{" "}
                        {channel.subscribersCount === 1 ? "subscriber" : "subscribers"}
                    </p>
                </div>

                {!isOwnChannel && (
                    <Button
                        variant={channel.isSubscribed ? "secondary" : "primary"}
                        isLoading={subscribeBusy}
                        onClick={handleToggleSubscribe}
                    >
                        {channel.isSubscribed ? "Subscribed" : "Subscribe"}
                    </Button>
                )}
            </div>

            <div className="flex gap-2 px-4 sm:px-6 pt-3 border-b border-border">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab
                                ? "border-brand text-text-primary"
                                : "border-transparent text-text-secondary hover:text-text-primary"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="p-4 sm:p-6">
                {activeTab === "Videos" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                        {tabLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                  <VideoCardSkeleton key={i} />
                              ))
                            : videos.map((video) => (
                                  <VideoCard key={video._id} video={{ ...video, owner: channel }} />
                              ))}
                    </div>
                )}

                {activeTab === "Videos" && !tabLoading && videos.length === 0 && (
                    <EmptyState
                        icon={<FiVideo size={36} />}
                        title="No videos yet"
                        description={`${channel.username} hasn't uploaded anything yet.`}
                    />
                )}

                {activeTab === "Tweets" && (
                    <div className="flex flex-col gap-3 max-w-xl">
                        {!tabLoading &&
                            tweets.map((tweet) => (
                                <div
                                    key={tweet._id}
                                    className="bg-surface border border-border rounded-lg p-4"
                                >
                                    <p className="text-text-primary text-sm">
                                        {tweet.content}
                                    </p>
                                </div>
                            ))}
                        {!tabLoading && tweets.length === 0 && (
                            <EmptyState
                                icon={<FiMessageSquare size={36} />}
                                title="No tweets yet"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChannelPage;
