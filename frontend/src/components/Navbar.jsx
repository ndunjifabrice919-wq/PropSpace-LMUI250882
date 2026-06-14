import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link to="/" className="navbar-brand" id="navbar-brand">
        <div className="navbar-brand-icon">🏡</div>
        PropSpace
      </Link>

      {/* Links */}
      <div className="navbar-links">
        <Link to="/" className={isActive('/')} id="nav-link-home">
          Explore
        </Link>

        {user ? (
          <>
            <Link to="/dashboard" className={isActive('/dashboard')} id="nav-link-dashboard">
              My Dashboard
            </Link>
            <button
              id="btn-logout"
              onClick={logout}
              className="btn btn-outline btn-sm"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm" id="nav-link-login">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm" id="nav-link-register">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
