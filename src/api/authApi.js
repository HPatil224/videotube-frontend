import { axiosInstance } from "./axiosInstance.js";

export const registerUser = (formData) => {
    // formData must be a FormData instance, since register accepts
    // multipart/form-data (text fields + avatar + coverImage files)
    return axiosInstance.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const loginUser = ({ email, username, password }) => {
    return axiosInstance.post("/users/login", { email, username, password });
};

export const logoutUser = () => {
    return axiosInstance.post("/users/logout");
};

export const getCurrentUser = () => {
    return axiosInstance.get("/users/current-user");
};

export const changePassword = ({ oldPassword, newPassword }) => {
    return axiosInstance.post("/users/change-password", { oldPassword, newPassword });
};

export const updateAccountDetails = ({ fullname, email }) => {
    return axiosInstance.patch("/users/update-account", { fullname, email });
};

export const updateAvatar = (formData) => {
    return axiosInstance.patch("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const updateCoverImage = (formData) => {
    return axiosInstance.patch("/users/cover-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
