import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
const AdminAuthContext = createContext(null);
export const useAdminAuth = () => useContext(AdminAuthContext);
export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      if (!localStorage.getItem("adminToken")) {
        setLoading(false);
        return;
      }
      try {
        setAdmin((await api.get("/auth/me")).data.admin);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  const login = async (values) => {
    const { data } = await api.post("/auth/login", values);
    localStorage.setItem("adminToken", data.token);
    setAdmin(data.admin);
  };
  const logout = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
  };
  return (
    <AdminAuthContext.Provider
      value={{ admin, loading, login, logout, setAdmin }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
