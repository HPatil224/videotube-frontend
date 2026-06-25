import { axiosInstance } from "./axiosInstance.js";

export const getAllVideos = ({ page = 1, limit = 12, query, sortBy, sortType, userId } = {}) => {
    const params = { page, limit };
    if (query) params.query = query;
    if (sortBy) params.sortBy = sortBy;
    if (sortType) params.sortType = sortType;
    if (userId) params.userId = userId;

    return axiosInstance.get("/videos", { params });
};

export const getVideoById = (videoId) => {
    return axiosInstance.get(`/videos/${videoId}`);
};

export const publishVideo = (formData) => {
    return axiosInstance.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const updateVideo = (videoId, formData) => {
    return axiosInstance.patch(`/videos/${videoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const deleteVideo = (videoId) => {
    return axiosInstance.delete(`/videos/${videoId}`);
};

export const togglePublishStatus = (videoId) => {
    return axiosInstance.patch(`/videos/toggle/publish/${videoId}`);
};
