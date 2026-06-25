import axiosInstance from "./axiosInstance";

export const getUserChannelProfile = async (username) => {
    // The standard backend endpoint for fetching a channel's public profile
    const response = await axiosInstance.get(`/users/c/${username}`);
    return response.data;
};