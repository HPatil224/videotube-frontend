import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu, FiSearch, FiUpload } from "react-icons/fi";

import { logoutUser } from "../api/authApi.js";
import { clearUser } from "../features/auth/authSlice.js";
import { toggleSidebar } from "../features/ui/uiSlice.js";
import Button from "./Button.jsx";

const Navbar = () => {
    const { user, isAuthenticated, authChecked } = useSelector(
        (state) => state.auth
    );
    const [searchQuery, setSearchQuery] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
        } finally {
            // clear local state regardless of whether the API call succeeded,
            // so the UI never gets stuck showing a logged-in state by mistake
            dispatch(clearUser());
            navigate("/login");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        navigate(`/results?q=${encodeURIComponent(searchQuery.trim())}`);
    };

    return (
        <nav className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border bg-surface sticky top-0 z-20">
            <div className="flex items-center gap-3 shrink-0">
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="text-text-primary p-2 rounded-full hover:bg-surface-hover transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <FiMenu size={20} />
                </button>
                <Link to="/" className="text-brand font-bold text-lg shrink-0">
                    VideoTube
                </Link>
            </div>

            <form
                onSubmit={handleSearch}
                className="flex-1 max-w-xl hidden sm:flex items-stretch"
            >
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search videos"
                    className="flex-1 bg-base border border-border rounded-l-full px-4 py-1.5 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-brand"
                />
                <button
                    type="submit"
                    className="px-4 rounded-r-full border border-l-0 border-border bg-surface-hover hover:bg-border transition-colors text-text-primary"
                    aria-label="Search"
                >
                    <FiSearch size={18} />
                </button>
            </form>

            <div className="flex items-center gap-3 shrink-0">
                {!authChecked ? null : isAuthenticated ? (
                    <>
                        <Link
                            to="/upload"
                            className="hidden sm:flex items-center gap-2 text-text-primary px-3 py-1.5 rounded-full hover:bg-surface-hover transition-colors"
                        >
                            <FiUpload size={18} />
                            <span className="text-sm">Upload</span>
                        </Link>

                        <Link to={`/channel/${user?.username}`}>
                            {user?.avatar && (
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            )}
                        </Link>

                        <Button variant="secondary" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <Link to="/login">
                        <Button variant="primary">Sign in</Button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
