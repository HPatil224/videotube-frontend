import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Wrap any route that requires a logged-in user with this component.
// While we haven't checked auth status yet (authChecked === false),
// we render nothing rather than redirecting, to avoid a flash-redirect
// to /login on every page refresh before the current-user check finishes.
const ProtectedRoute = () => {
    const { isAuthenticated, authChecked } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!authChecked) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
