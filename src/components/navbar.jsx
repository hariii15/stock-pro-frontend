import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Don't show navbar on login page
  if (location.pathname === '/login') return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={user ? "/home" : "/login"} className="nav-logo">
          StockPista
        </Link>
        
        {user && (
          <div className="nav-links">
            <Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}>
              <i className="fas fa-home"></i> Home
            </Link>
            <Link 
              to="/watchlist" 
              className={`nav-link ${location.pathname === '/watchlist' ? 'active' : ''}`}
            >
              <i className="fas fa-star"></i> Watchlist
            </Link>
            <Link 
              to="/profile" 
              className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
            >
              <i className="fas fa-user"></i> Profile
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
