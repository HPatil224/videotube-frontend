import { axiosInstance } from "./axiosInstance.js";

export const createPlaylist = ({ name, description }) => {
    return axiosInstance.post("/playlist", { name, description });
};

export const getUserPlaylists = (userId) => {
    return axiosInstance.get(`/playlist/user/${userId}`);
};

export const getPlaylistById = (playlistId) => {
    return axiosInstance.get(`/playlist/${playlistId}`);
};

export const addVideoToPlaylist = (videoId, playlistId) => {
    return axiosInstance.patch(`/playlist/add/${videoId}/${playlistId}`);
};

export const removeVideoFromPlaylist = (videoId, playlistId) => {
    return axiosInstance.patch(`/playlist/remove/${videoId}/${playlistId}`);
};

export const deletePlaylist = (playlistId) => {
    return axiosInstance.delete(`/playlist/${playlistId}`);
};

export const updatePlaylist = (playlistId, { name, description }) => {
    return axiosInstance.patch(`/playlist/${playlistId}`, { name, description });
};
