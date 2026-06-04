import { useAuth } from "../context/auth/useAuth";
import { Navigate, Outlet, useLocation } from "react-router";

export default function ProtectedRoute() {
    const { isLoggedIn } = useAuth();
    const location = useLocation();
    
    if (!isLoggedIn) {

        return <Navigate to="/login" state={{ from: location.pathname, errorMessage: 'Login to access this content' }} />;
    }
    return <Outlet />;
}