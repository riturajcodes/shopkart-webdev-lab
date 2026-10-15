import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";
import { useCart } from "../context/CartContext";
import { CATEGORIES } from "../constants";
import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "./Icons";

const ANNOUNCEMENTS = [
  "New styles dropping every week",
  "Easy 7-day returns on every order",
  "Secure checkout, pay your way",
];

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [announcement, setAnnouncement] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const accountRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(
      () => setAnnouncement((i) => (i + 1) % ANNOUNCEMENTS.length),
      4000,
    );
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!accountOpen) return undefined;
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setAccountOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const term = query.trim();
    navigate(term ? `/products?search=${encodeURIComponent(term)}` : "/products");
    setQuery("");
  };

  const isHome = location.pathname === "/";
  const overlay =
    isHome && !scrolled && !menuOpen && !searchOpen && !accountOpen;
  const headerClass = [
    "site-header",
    isHome && "is-home",
    isHome && scrolled && "is-scrolled",
    overlay && "is-overlay",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass}>
      <div className="announcement-bar" role="status">
        <span key={announcement} className="announcement-text">
          {ANNOUNCEMENTS[announcement]}
        </span>
      </div>

      <nav className="main-nav" aria-label="Main">
        <div className="nav-left">
          <button
            type="button"
            className="icon-btn nav-menu-btn"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </button>
          <ul className="nav-categories">
            <li>
              <NavLink to="/products" end id="nav-products-link">
                New In
              </NavLink>
            </li>
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link to={`/products?category=${category}`}>{category}</Link>
              </li>
            ))}
          </ul>
        </div>

        <Link to="/" className="brand-link">
          SHOPKART
        </Link>

        <div className="nav-actions">
          <button
            type="button"
            className="icon-btn"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
          >
            <SearchIcon />
          </button>

          {user ? (
            <div className="account-menu" ref={accountRef}>
              <button
                type="button"
                className="icon-btn"
                aria-label="Account"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((open) => !open)}
              >
                <UserIcon />
              </button>
              {accountOpen && (
                <div className="account-dropdown">
                  <div className="account-greeting">
                    Hi, {user.fullName?.split(" ")[0] || "there"}
                  </div>
                  <Link to="/profile" id="nav-profile-link">
                    My Profile
                  </Link>
                  <Link to="/orders" id="nav-orders-link">
                    My Orders
                  </Link>
                  <Link to="/wishlist">Wishlist</Link>
                  <button type="button" id="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="icon-btn"
              id="nav-login-link"
              aria-label="Login"
            >
              <UserIcon />
            </Link>
          )}

          <Link
            to="/wishlist"
            className="icon-btn nav-wishlist-btn"
            id="nav-wishlist-link"
            aria-label="Wishlist"
          >
            <HeartIcon />
          </Link>

          <Link
            to="/cart"
            className="icon-btn cart-btn"
            id="nav-cart-link"
            aria-label={`Cart, ${cartItemCount} items`}
          >
            <BagIcon />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
        </div>
      </nav>

      {searchOpen && (
        <form className="header-search" onSubmit={handleSearch} role="search">
          <SearchIcon />
          <input
            ref={searchRef}
            type="search"
            placeholder="Search for products, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit" className="header-search-submit">
            Search
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          >
            <CloseIcon />
          </button>
        </form>
      )}

      <div
        className={`drawer-overlay${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />
      <aside className={`drawer${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <div className="drawer-head">
          <span className="brand-link">
            SHOPKART
          </span>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <CloseIcon />
          </button>
        </div>
        <ul className="drawer-links">
          <li>
            <Link to="/products">New In</Link>
          </li>
          {CATEGORIES.map((category) => (
            <li key={category}>
              <Link to={`/products?category=${category}`}>{category}</Link>
            </li>
          ))}
        </ul>
        <ul className="drawer-links drawer-links-secondary">
          {user ? (
            <>
              <li>
                <Link to="/profile">My Profile</Link>
              </li>
              <li>
                <Link to="/orders">My Orders</Link>
              </li>
              <li>
                <Link to="/wishlist">Wishlist</Link>
              </li>
              <li>
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register" id="nav-register-link">
                  Create Account
                </Link>
              </li>
            </>
          )}
        </ul>
      </aside>
    </header>
  );
};

export default Navbar;
