import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Frontend-only gate. The backend's SecurityConfig does NOT currently
// restrict event/venue/seat management endpoints to ADMIN — any
// authenticated user could call them directly. This route only controls
// what the UI shows; it is not a substitute for real backend
// authorization. See README.
export default function AdminRoute({ children }) {
  const { isAuthenticated, status, user } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--border-strong)] border-t-[var(--violet)] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = user?.role ?? user?.Role;
  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}
