// frontend/src/components/Signup.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [favouritePlace, setFavouritePlace] = useState(''); // Updated field
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }
    if (!favouritePlace.trim()) {
      setMessage("Please enter your favourite place.");
      return;
    }
    try {
      await axios.post('/api/auth/register', { name, email, password, favouritePlace });
      setMessage("Registration successful! Please log in with your credentials.");
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        {message && <p className="signup-message">{message}</p>}
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {/* Updated Security Question Field */}
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
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <p className="signup-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
