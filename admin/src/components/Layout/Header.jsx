import { useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { navLinks } from "./Sidebar";

export default function Header({ onToggleMenu }) {
  const { admin } = useAdminAuth();
  const location = useLocation();
  const title = navLinks.reduce(
    (t, [to, , label]) =>
      location.pathname === to ||
      (to !== "/" && location.pathname.startsWith(to))
        ? label
        : t,
    "Dashboard",
  );
  return (
    <header>
      <button
        className="menu"
        aria-label="Toggle navigation"
        onClick={onToggleMenu}
      >
        <FiMenu />
      </button>
      <span className="page-title"></span>
      <div>
        <b>{admin?.name}</b>
        <span>{admin?.role?.replace("_", " ")}</span>
      </div>
    </header>
  );
}
