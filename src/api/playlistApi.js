import axiosInstance from "./axiosInstance";

export const createPlaylist = async (name, description) => {
    const response = await axiosInstance.post("/playlist", { name, description });
    return response.data;
};

export const getUserPlaylists = async (userId) => {
    const response = await axiosInstance.get(`/playlist/user/${userId}`);
    return response.data;
};

export const getPlaylistById = async (playlistId) => {
    const response = await axiosInstance.get(`/playlist/${playlistId}`);
    return response.data;
};