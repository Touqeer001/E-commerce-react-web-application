import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAdminAuth();
  if (loading) return <div className="center">Loading…</div>;
  return admin ? children : <Navigate to="/login" replace />;
}
