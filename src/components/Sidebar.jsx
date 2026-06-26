import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    FiHome,
    FiUsers,
    FiThumbsUp,
    FiUser,
    FiList,
    FiMessageSquare,
    FiBarChart2,
} from "react-icons/fi";

const NavItem = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                    ? "bg-surface-hover text-text-primary font-medium"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            }`
        }
    >
        {icon}
        <span>{label}</span>
    </NavLink>
);

const Sidebar = () => {
    const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    if (!isSidebarOpen) return null;

    return (
        <aside className="w-56 shrink-0 border-r border-border bg-surface h-[calc(100vh-57px)] sticky top-[57px] overflow-y-auto py-3 px-2 flex flex-col gap-1">
            <NavItem to="/" icon={<FiHome size={20} />} label="Home" />

            {isAuthenticated && (
                <>
                    <NavItem
                        to="/subscriptions"
                        icon={<FiUsers size={20} />}
                        label="Subscriptions"
                    />

                    <div className="border-t border-border my-2" />

                    <NavItem
                        to={`/channel/${user?.username}`}
                        icon={<FiUser size={20} />}
                        label="Your channel"
                    />
                    <NavItem
                        to="/liked-videos"
                        icon={<FiThumbsUp size={20} />}
                        label="Liked videos"
                    />
                    <NavItem
                        to="/playlists"
                        icon={<FiList size={20} />}
                        label="Playlists"
                    />
                    <NavItem
                        to="/tweets"
                        icon={<FiMessageSquare size={20} />}
                        label="Tweets"
                    />
                    <NavItem
                        to="/dashboard"
                        icon={<FiBarChart2 size={20} />}
                        label="Dashboard"
                    />
                </>
            )}
        </aside>
    );
};

export default Sidebar;
