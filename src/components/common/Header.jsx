import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import './Header.css';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1>Forum Diskusi</h1>
        </Link>

        <nav className="header-nav">
          <Link to="/" className="nav-link">Threads</Link>
          <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
        </nav>

        <div className="header-auth">
          {isLoggedIn ? (
            <div className="user-menu">
              <span className="user-name">{user?.name}</span>
              <button type="button" onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
