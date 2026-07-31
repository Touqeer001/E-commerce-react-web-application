import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiBox,
  FiGrid,
  FiList,
  FiPackage,
  FiUsers,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { useAdminAuth } from "../context/AdminAuthContext";
import "./styles/Layout.css";
const links = [
  ["/", FiGrid, "Dashboard"],
  ["/products", FiBox, "Products"],
  ["/categories", FiList, "Categories"],
  ["/orders", FiPackage, "Orders"],
  ["/customers", FiUsers, "Customers"],
  ["/inventory", FiBox, "Inventory"],
  ["/profile", FiUser, "Profile"],
  ["/settings", FiSettings, "Settings"],
];
export default function Layout() {
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const signOut = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="shell">
      <aside className={open ? "open" : ""}>
        <div className="brand">
          Little Trends <small>ADMIN</small>
        </div>
        <nav>
          {links.map(([to, Icon, label]) => (
            <NavLink
              end={to === "/"}
              key={to}
              to={to}
              onClick={() => setOpen(false)}
            >
              <Icon />
              {label}
            </NavLink>
          ))}
          <button onClick={signOut}>
            <FiLogOut />
            Logout
          </button>
        </nav>
      </aside>
      <main>
        <header>
          <button className="menu" onClick={() => setOpen(!open)}>
            <FiMenu />
          </button>
          <div>
            <b>{admin?.name}</b>
            <span>{admin?.role?.replace("_", " ")}</span>
          </div>
        </header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
