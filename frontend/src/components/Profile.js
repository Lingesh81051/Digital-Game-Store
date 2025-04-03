// frontend/src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Retrieve user info from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {user ? (
          <>
            <h2>My Profile</h2>
            <div className="profile-info">
              <p><strong>Username:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="profile-actions">
              <Link to="/settings" className="profile-btn">Profile Settings</Link>
              <Link to="/change-password" className="profile-btn">Change Password</Link>
              <button onClick={handleLogout} className="profile-btn logout-btn">Log Out</button>
            </div>
          </>
        ) : (
          <>
            <h2>Welcome!</h2>
            <div className="profile-actions">
              <Link to="/login" className="profile-btn">Login</Link>
              <Link to="/forgot-password" className="profile-btn">Forgot Password?</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
