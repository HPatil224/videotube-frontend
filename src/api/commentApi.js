import { axiosInstance } from "./axiosInstance.js";

export const getVideoComments = (videoId, { page = 1, limit = 20 } = {}) => {
    return axiosInstance.get(`/comments/${videoId}`, { params: { page, limit } });
};

export const addComment = (videoId, content) => {
    return axiosInstance.post(`/comments/${videoId}`, { content });
};

export const updateComment = (commentId, content) => {
    return axiosInstance.patch(`/comments/c/${commentId}`, { content });
};

export const deleteComment = (commentId) => {
    return axiosInstance.delete(`/comments/c/${commentId}`);
};
