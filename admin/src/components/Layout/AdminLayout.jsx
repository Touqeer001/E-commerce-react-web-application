import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Layout.css";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const signOut = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="shell">
      <Sidebar open={open} onNavigate={() => setOpen(false)} onLogout={signOut} />
      <main>
        <Header onToggleMenu={() => setOpen(!open)} />
        <section className="content">
          <Outlet />
        </section>
      </main>
      <div
        className={open ? "overlay open" : "overlay"}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
    </div>
  );
}
