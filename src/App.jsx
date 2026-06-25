import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./api/authApi";
import { setUser, clearUser } from "./features/auth/authSlice";
import PlaylistsPage from "./pages/PlaylistsPage";
import PlaylistDetailPage from "./pages/PlaylistDetailPage";

import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UploadPage from "./pages/UploadPage";
import WatchPage from "./pages/WatchPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ChannelPage from "./pages/ChannelPage";
import DashboardPage from "./pages/DashboardPage";
import LikedVideosPage from "./pages/LikedVideosPage";
import TweetsPage from "./pages/TweetsPage"; // ✅ Liked Videos Import
import SubscriptionsPage from "./pages/SubscriptionsPage";

export default function App() {
  const dispatch = useDispatch();

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
      {/* Auth routes outside layout (Full screen) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Main app routes inside the layout (Navbar + Sidebar) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/watch/:videoId" element={<WatchPage />} />
        <Route path="/results" element={<SearchResultsPage />} />
        <Route path="/channel/:username" element={<ChannelPage />} />
        
        {/* Protected routes that require being logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/liked-videos" element={<LikedVideosPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} /> 
          <Route path="/playlist/:playlistId" element={<PlaylistDetailPage />} />
          <Route path="/tweets" element={<TweetsPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}