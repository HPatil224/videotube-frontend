import { axiosInstance } from "./axiosInstance.js";

export const getUserChannelProfile = (username) => {
    return axiosInstance.get(`/users/c/${username}`);
};
