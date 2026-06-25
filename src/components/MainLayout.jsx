import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

const MainLayout = () => {
    const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);

    return (
        <div className="min-h-screen bg-base">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main
                    className={`flex-1 min-w-0 ${
                        isSidebarOpen ? "" : "w-full"
                    }`}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
