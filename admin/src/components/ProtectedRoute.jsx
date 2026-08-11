import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import Loader from "../components/Common/Loader";
export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAdminAuth();
  if (loading) return <Loader message="Loading…" />;
  return admin ? children : <Navigate to="/login" replace />;
}
