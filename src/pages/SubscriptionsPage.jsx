import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiUsers } from "react-icons/fi";

import { getSubscribedChannels } from "../api/subscriptionApi.js";
import EmptyState from "../components/EmptyState.jsx";

const SubscriptionsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [channels, setChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?._id) return;
        let isMounted = true;

        const fetchSubscriptions = async () => {
            setIsLoading(true);
            try {
                const response = await getSubscribedChannels(user._id);
                if (isMounted) setChannels(response.data.data || []);
            } catch (err) {
                // leave list empty on failure
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchSubscriptions();
        return () => {
            isMounted = false;
        };
    }, [user?._id]);

    return (
        <div className="p-4 sm:p-6">
            <h1 className="text-text-primary text-xl font-semibold mb-4">
                Subscriptions
            </h1>

            {isLoading ? (
                <p className="text-text-secondary text-sm">Loading...</p>
            ) : channels.length === 0 ? (
                <EmptyState
                    icon={<FiUsers size={40} />}
                    title="No subscriptions yet"
                    description="Channels you subscribe to will show up here."
                />
            ) : (
                <div className="flex flex-col gap-3 max-w-md">
                    {channels.map(
                        (item) =>
                            item.channel && (
                                <Link
                                    key={item.channel._id}
                                    to={`/channel/${item.channel.username}`}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-hover transition-colors"
                                >
                                    {item.channel.avatar && (
                                        <img
                                            src={item.channel.avatar}
                                            alt={item.channel.username}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="text-text-primary text-sm font-medium">
                                            {item.channel.fullname}
                                        </p>
                                        <p className="text-text-secondary text-xs">
                                            @{item.channel.username}
                                        </p>
                                    </div>
                                </Link>
                            )
                    )}
                </div>
            )}
        </div>
    );
};

export default SubscriptionsPage;
