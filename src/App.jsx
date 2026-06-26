import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";

import { getCurrentUser } from "./api/authApi.js";
import { setUser, clearUser } from "./features/auth/authSlice.js";

import MainLayout from "./components/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import UploadPage from "./pages/UploadPage.jsx";

function App() {
    const dispatch = useDispatch();

    // On every app load (including a hard refresh), ask the backend
    // "who am I?" using the accessToken cookie. If it succeeds, we know
    // the user is logged in. If it fails (401), the axios interceptor
    // will try /refresh-token automatically before giving up.
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await getCurrentUser();
                dispatch(setUser(response.data.data));
            } catch (error) {
                dispatch(clearUser());
            }
        };

        checkAuth();
    }, [dispatch]);

    return (
        <Routes>
            {/* full-screen pages, no navbar/sidebar shell */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* everything else gets the navbar + sidebar shell */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/upload" element={<UploadPage />} />
                    {/* more protected pages (dashboard, etc.) will be added in later phases */}
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
