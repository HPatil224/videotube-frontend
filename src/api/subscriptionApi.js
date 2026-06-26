import { axiosInstance } from "./axiosInstance.js";

export const toggleSubscription = (channelId) => {
    return axiosInstance.post(`/subscriptions/c/${channelId}`);
};

export const getChannelSubscribers = (channelId) => {
    return axiosInstance.get(`/subscriptions/c/${channelId}/subscribers`);
};

export const getSubscribedChannels = (subscriberId) => {
    return axiosInstance.get(`/subscriptions/u/${subscriberId}/channels`);
};
