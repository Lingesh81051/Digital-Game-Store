// frontend/src/components/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const [keyword, setKeyword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false); // For vertical space
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);

  // Update user state on mount and when pathname changes.
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [pathname]);

  // When dropdown opens, check vertical space below the avatar.
  useEffect(() => {
    if (dropdownOpen && avatarRef.current && dropdownRef.current) {
      const avatarRect = avatarRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.offsetHeight;
      // If not enough space below, open upward.
      if (window.innerHeight - avatarRect.bottom < dropdownHeight) {
        setOpenUp(true);
      } else {
        setOpenUp(false);
      }
    }
  }, [dropdownOpen]);

  // Trigger search on every keystroke.
  const handleSearchChange = (e) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
    if (newKeyword.trim()) {
      navigate(`/?keyword=${newKeyword.trim()}`);
    } else {
      navigate('/');
    }
  };

  // Fallback submission (if user presses Enter)
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword.trim()}`);
    } else {
      navigate('/');
    }
  };

  const handleAvatarClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="main-header">
      {/* Left Section: Logo */}
      <div className="header-left">
        <div className="logo">
          <Link to="/" title="GameHub Home">
            <i className="bi bi-controller"></i> GameSapien
          </Link>
        </div>
      </div>

      {/* Center Section: Search bar (only on Home) */}
      {pathname === '/' && (
        <div className="header-center">
          <form onSubmit={submitHandler} className="search-form">
            <input
              type="text"
              placeholder="Search games..."
              value={keyword}
              onChange={handleSearchChange}
            />
            <button type="submit" title="Search">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
      )}

      {/* Right Section: Navigation and Avatar */}
      <div className="header-right">
        <div className="dropdown">
          <Link to="/" className="dropdown-trigger" title="Go to Home">
            <i className="bi bi-house"></i> Home
          </Link>
          <div className="dropdown-menu">
            <Link to="/news" title="Latest news">
              <i className="bi bi-newspaper"></i> News
            </Link>
            <Link to="/categories" title="Browse categories">
              <i className="bi bi-tags"></i> Categories
            </Link>
          </div>
        </div>
        <Link to="/library" title="Your Library">
          <i className="bi bi-book"></i> Library
        </Link>
        <Link to="/wishlist" title="Your Wishlist">
          <i className="bi bi-heart"></i> Wishlist
        </Link>
        <Link to="/cart" title="View Cart">
          <i className="bi bi-cart"></i> Cart
        </Link>
        <div className="avatar-dropdown" ref={avatarRef}>
          <img
            src="/images/avatar.png"
            alt="User Avatar"
            className="avatar-icon"
            onClick={handleAvatarClick}
          />
          {user && dropdownOpen && (
            <div
              ref={dropdownRef}
              className={`dropdown-menu avatar-menu ${openUp ? 'open-up' : ''}`}
            >
              <div className="user-info">
                <p><strong>Username:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
              <div className="dropdown-links">
                <Link to="/profile" className="dropdown-item">
                  <i className="bi bi-person"></i> Profile
                </Link>
                <Link to="/settings" className="dropdown-item">
                  <i className="bi bi-gear"></i> Settings
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout-btn">
                  <i className="bi bi-box-arrow-right"></i> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
