import { NavLink } from "react-router-dom";
import {
  FiBox,
  FiGrid,
  FiList,
  FiLogOut,
  FiPackage,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";

export const navLinks = [
  ["/", FiGrid, "Dashboard"],
  ["/products", FiBox, "Products"],
  ["/categories", FiList, "Categories"],
  ["/orders", FiPackage, "Orders"],
  ["/customers", FiUsers, "Customers"],
  ["/inventory", FiBox, "Inventory"],
  ["/profile", FiUser, "Profile"],
  ["/settings", FiSettings, "Settings"],
];

export default function Sidebar({ open, onNavigate, onLogout }) {
  return (
    <aside className={open ? "open" : ""}>
      <div className="brand">
        Little Trends <small>ADMIN</small>
      </div>
      <nav>
        {navLinks.map(([to, Icon, label]) => (
          <NavLink
            end={to === "/"}
            key={to}
            to={to}
            onClick={onNavigate}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
        <button onClick={onLogout}>
          <FiLogOut />
          Logout
        </button>
      </nav>
    </aside>
  );
}
