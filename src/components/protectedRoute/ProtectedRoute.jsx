import { useAuth } from "../../context/auth/useAuth";
import { Navigate, useLocation } from "react-router";

export default function ProtectedRoute({ children }) {
    
    const { isLoggedIn } = useAuth();
    
    if (!isLoggedIn) {

        return <Navigate to="/login" state={{ errorMessage: 'Login to access this content' }} />;
    }
    return children;
}