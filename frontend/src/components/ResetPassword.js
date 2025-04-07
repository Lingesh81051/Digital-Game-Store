// frontend/src/components/ResetPassword.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [favouritePlace, setFavouritePlace] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      await axios.post('/api/auth/reset-password', {
        email,
        newPassword,
        favouritePlace
      });
      setMessage("Password reset successful! You can now log in with your new password.");
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Reset password failed.");
      console.error("Reset password error:", error);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-box">
        <h2>Reset Password</h2>
        {message && <p className="reset-message">{message}</p>}
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input 
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input 
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>What is your favourite place?</label>
            <input 
              type="text"
              placeholder="Enter your favourite place"
              value={favouritePlace}
              onChange={(e) => setFavouritePlace(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-btn">Reset Password</button>
        </form>
        <p className="reset-switch">
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
