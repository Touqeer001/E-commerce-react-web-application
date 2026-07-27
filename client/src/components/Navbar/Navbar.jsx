import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaSearch,
  FaSignOutAlt,
  FaUserCircle,
  FaRegHeart,
} from "react-icons/fa";

import "./Navbar.css";
import MegaMenu from "./MegaMenu";
import SearchDrawer from "../SearchDrawer/SearchDrawer";

import megaMenu from "../../data/megaMenu";

import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import useWishlist from "../../hooks/useWishlist";

function Navbar() {
  const { cart } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const { wishlist } = useWishlist();

  const [activeMenu, setActiveMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const cartCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <div className="navbar-wrapper" onMouseLeave={() => setActiveMenu(null)}>
      <nav className="navbar">
        {/* LEFT */}
        <div className="nav-left">
          <div
            className="nav-item"
            onMouseEnter={() => setActiveMenu(megaMenu[0])}
          >
            <Link to="/products?category=Babies">BABY</Link>
          </div>

          <div
            className="nav-item"
            onMouseEnter={() => setActiveMenu(megaMenu[1])}
          >
            <Link to="/products?category=Boys">BABA</Link>
          </div>

          {/* <div className="dropdown">
            <button className="menu-btn">
              SHOP <FaChevronDown />
            </button>

            <div className="dropdown-menu">
              <Link to="/products">All Products</Link>
              <Link to="/category/t-shirts">T-Shirts</Link>
              <Link to="/category/shirts">Shirts</Link>
              <Link to="/category/jeans">Jeans</Link>
              <Link to="/category/dresses">Dresses</Link>
            </div>
          </div> */}
        </div>

        {/* CENTER */}

        <div className="nav-center">
          <Link to="/">
            <h1>LittleTrendz</h1>
            <span>Premium Kids Wear</span>
          </Link>
        </div>

        {/* RIGHT */}

        <div className="nav-right">
          <div className="search-box" onClick={() => setIsSearchOpen(true)}>
            <FaSearch />

            <input type="text" placeholder="Search..." readOnly />
          </div>

          {isAuthenticated ? (
            <div className="account-menu">
              <button className="account-trigger">
                <FaUserCircle />
              </button>

              <div className="account-dropdown">
                <Link to="/account">
                  <FaUserCircle />
                  My Profile
                </Link>

                <Link to="/account/orders">
                  <FaBoxOpen />
                  My Orders
                </Link>

                <button onClick={logout}>
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="icon-btn">
              <FaUserCircle />
            </Link>
          )}

          <Link to="/wishlist" className="icon-btn wishlist-icon" aria-label="Wishlist">
            <FaRegHeart />
            {wishlist.count > 0 && <span className="cart-count">{wishlist.count}</span>}
          </Link>

          <Link to="/cart" className="icon-btn cart-icon">
            <FaShoppingCart />

            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>
      </nav>

      {/* Mega Menu */}
      {activeMenu && <MegaMenu menu={activeMenu} />}

      {/* Search Drawer */}
      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

export default Navbar;
