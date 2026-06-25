import axiosInstance from "./axiosInstance";

export const toggleSubscription = async (channelId) => {
    const response = await axiosInstance.post(`/subscriptions/c/${channelId}`);
    return response.data;
};

// ✅ Added function to fetch a user's subscribed channels
export const getSubscribedChannels = async (subscriberId) => {
    const response = await axiosInstance.get(`/subscriptions/u/${subscriberId}`);
    return response.data;
};