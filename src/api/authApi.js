import axiosInstance from "./axiosInstance";

export const registerUser = async (formData) => {
    const response = await axiosInstance.post("/users/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await axiosInstance.post("/users/login", credentials);
    return response.data;
};

export const logoutUser = async () => {
    const response = await axiosInstance.post("/users/logout");
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await axiosInstance.get("/users/current-user");
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await axiosInstance.post("/users/forgot-password", { email });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await axiosInstance.post(`/users/reset-password/${token}`, { newPassword });
    return response.data;
};