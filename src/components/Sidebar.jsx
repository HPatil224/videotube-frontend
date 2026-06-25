import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiHome, FiUsers, FiUser, FiThumbsUp, FiList, FiTwitter, FiBarChart2 } from "react-icons/fi";

export default function Sidebar() {
    const { isOpen } = useSelector((state) => state.ui);
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // ✅ Dynamically map the routes, ensuring 'Your channel' uses the logged-in user's username
    const navItems = [
        { name: "Home", path: "/", icon: <FiHome size={20} /> },
        { name: "Subscriptions", path: "/subscriptions", icon: <FiUsers size={20} /> },
        { 
            name: "Your channel", 
            path: isAuthenticated && user?.username ? `/channel/${user.username}` : "/login", 
            icon: <FiUser size={20} /> 
        },
        { name: "Liked videos", path: "/liked-videos", icon: <FiThumbsUp size={20} /> },
        { name: "Playlists", path: "/playlists", icon: <FiList size={20} /> },
        { name: "Tweets", path: "/tweets", icon: <FiTwitter size={20} /> },
        { name: "Dashboard", path: "/dashboard", icon: <FiBarChart2 size={20} /> },
    ];

    return (
        <aside className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-gray-900 border-r border-gray-800 transition-all duration-300 overflow-y-auto ${isOpen ? "w-64" : "w-0 md:w-20"} flex-shrink-0`}>
            <div className="flex flex-col py-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors
                            ${isActive ? "bg-gray-800 text-white font-semibold" : ""}
                            ${!isOpen && "md:justify-center px-0"}
                        `}
                        title={!isOpen ? item.name : ""}
                    >
                        <span className="min-w-[20px]">{item.icon}</span>
                        {/* Hide text if sidebar is closed (mobile) or collapsed (desktop) */}
                        <span className={`whitespace-nowrap ${!isOpen ? "md:hidden" : ""}`}>
                            {item.name}
                        </span>
                    </NavLink>
                ))}
            </div>
        </aside>
    );
}