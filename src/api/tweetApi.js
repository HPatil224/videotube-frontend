import axiosInstance from "./axiosInstance";

export const createTweet = async (content) => {
    const response = await axiosInstance.post("/tweets", { content });
    return response.data;
};

export const getUserTweets = async (userId) => {
    const response = await axiosInstance.get(`/tweets/user/${userId}`);
    return response.data;
};

export const deleteTweet = async (tweetId) => {
    const response = await axiosInstance.delete(`/tweets/${tweetId}`);
    return response.data;
};