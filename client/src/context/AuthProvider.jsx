import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import { API_BASE_URL, getCurrentUser, logoutUser } from "../Services/api";
import { getToken, setToken, clearToken } from "../Services/tokenService";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  const refreshUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      return;
    }

    try {
      const response = await getCurrentUser();
      setUser(response.data.user || null);
    } catch (error) {
      console.error(error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const redirect = params.get("redirect");

      if (token) {
        setToken(token);
        window.history.replaceState({}, "", window.location.pathname);

        if (redirect) {
          navigate(redirect, { replace: true });
        }
      }

      await refreshUser();
      setAuthLoading(false);
    };

    bootstrap();
  }, [navigate, refreshUser]);

  const loginWithGoogle = useCallback((redirectTo = "/") => {
    window.location.assign(
      `${API_BASE_URL}/auth/google?redirect=${encodeURIComponent(redirectTo)}`
    );
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearToken();
      setUser(null);
      navigate("/login");
    }
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      authLoading,
      loginWithGoogle,
      logout,
      refreshUser,
    }),
    [user, authLoading, loginWithGoogle, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
