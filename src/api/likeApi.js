import axiosInstance from "./axiosInstance";

export const toggleVideoLike = async (videoId) => {
    const response = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
    return response.data;
};

// ✅ Added the new fetch function
export const getLikedVideos = async () => {
    const response = await axiosInstance.get(`/likes/videos`);
    return response.data;
};