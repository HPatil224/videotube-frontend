import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// withCredentials: true is essential - without it, the browser will not
// send or store the accessToken/refreshToken cookies set by the backend,
// since this frontend (localhost:5173) and the backend (localhost:8000)
// are on different ports, which counts as cross-origin.
export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});

// Tracks whether a refresh request is already in flight, so that if
// multiple requests fail with 401 at the same time, we only call
// /users/refresh-token once instead of spamming it.
let isRefreshing = false;
let pendingRequests = [];

const onRefreshed = () => {
    pendingRequests.forEach((callback) => callback());
    pendingRequests = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isAuthError = error.response?.status === 401;
        const isRefreshCall = originalRequest?.url?.includes("/users/refresh-token");
        const isLoginCall = originalRequest?.url?.includes("/users/login");

        // don't try to refresh if the failing call IS the refresh/login call itself
        if (isAuthError && !isRefreshCall && !isLoginCall && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // wait for the in-flight refresh to finish, then retry this request
                return new Promise((resolve, reject) => {
                    pendingRequests.push(() => {
                        axiosInstance(originalRequest).then(resolve).catch(reject);
                    });
                });
            }

            isRefreshing = true;

            try {
                await axiosInstance.post("/users/refresh-token");
                isRefreshing = false;
                onRefreshed();
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                pendingRequests = [];
                // refresh failed too - the session is truly over
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
export default axiosInstance;