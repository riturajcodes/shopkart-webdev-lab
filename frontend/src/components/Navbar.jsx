import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <nav>
      <div>
        <Link to="/home" className="brand-link">SHOPKART.</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <>
            <span>{user.fullName}</span>
            <button id="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" id="nav-login-link">Login</Link>
            <Link to="/register" id="nav-register-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
