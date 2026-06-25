import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../api/authApi";
import { clearUser } from "../features/auth/authSlice";
import { toggleSidebar } from "../features/ui/uiSlice";
import { FiMenu, FiSearch, FiVideo, FiLogOut } from "react-icons/fi";
import Button from "./Button";

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // ✅ Uses ui-avatars to generate a custom image with the user's initial
    const defaultAvatar = `https://ui-avatars.com/api/?name=${user?.username || "User"}&background=1F2937&color=fff`;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/results?search_query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            dispatch(clearUser());
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-gray-900 border-b border-gray-800 px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={() => dispatch(toggleSidebar())} className="text-white p-2 hover:bg-gray-800 rounded-full transition-colors">
                    <FiMenu size={24} />
                </button>
                <Link to="/" className="text-2xl font-bold text-white tracking-tighter">
                    Video<span className="text-red-500">Tube</span>
                </Link>
            </div>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8 items-center bg-gray-900 border border-gray-700 rounded-full overflow-hidden">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-transparent text-white px-4 py-2 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="px-5 py-2 bg-gray-800 border-l border-gray-700 hover:bg-gray-700 text-gray-300 transition-colors">
                    <FiSearch size={20} />
                </button>
            </form>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <>
                        <Link to="/upload" className="hidden sm:flex items-center gap-2 text-white hover:bg-gray-800 px-3 py-2 rounded-full transition-colors">
                            <FiVideo size={20} />
                        </Link>
                        
                        <Link to={`/channel/${user?.username}`}>
                            <img 
                                src={user?.avatar || defaultAvatar} 
                                alt="avatar" 
                                className="w-8 h-8 rounded-full object-cover bg-gray-800 border border-gray-700" 
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = defaultAvatar; // ✅ Fallback updated
                                }}
                            />
                        </Link>
                        
                        <button onClick={handleLogout} className="text-gray-300 hover:text-white p-2 hover:bg-gray-800 rounded-full transition-colors">
                            <FiLogOut size={20} />
                        </button>
                    </>
                ) : (
                    <Link to="/login">
                        <Button className="rounded-full bg-transparent border border-gray-600 text-blue-400 hover:bg-blue-500/10">
                            Sign in
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    );
}