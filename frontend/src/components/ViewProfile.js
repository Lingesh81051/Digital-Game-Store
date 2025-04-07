// frontend/src/components/ViewProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewProfile.css';

function ViewProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    username: '',
    phone: '',
    dob: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',  // Added country field
      pincode: ''
    },
    favouritePlace: '',
    accountCreated: '',
    lastLogin: '',
    role: ''
  });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch profile data on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('/api/user/profile', config);
        setProfile({
          fullName: data.name,
          email: data.email,
          username: data.username || '',
          phone: data.phone || '',
          dob: data.dob ? data.dob.substring(0, 10) : '',
          gender: data.gender || '',
          address: {
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            country: data.address?.country || '',  // Read country from backend data
            pincode: data.address?.pincode || ''
          },
          favouritePlace: data.favouritePlace || '',
          accountCreated: data.createdAt,
          lastLogin: data.lastLogin,
          role: data.isAdmin ? 'Admin' : 'User'
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Prepare update data (editable fields)
    const updateData = {
      username: profile.username,
      phone: profile.phone,
      dob: profile.dob,
      gender: profile.gender,
      address: profile.address,
      favouritePlace: profile.favouritePlace
    };

    console.log("Updating profile with data:", updateData);
    try {
      const res = await axios.put('/api/user/profile', updateData, config);
      console.log("Profile update response:", res.data);
      setMessage('Profile updated successfully.');
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      setMessage(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  const toggleEdit = () => {
    setEditing(!editing);
    setMessage('');
  };

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete('/api/user/profile', config);
        handleLogout();
      } catch (error) {
        console.error("Error deleting account:", error);
        setMessage("Failed to delete account.");
      }
    }
  };

  return (
    <div className="view-profile-container">
      <h1>View Profile</h1>
      {message && <p className="profile-message">{message}</p>}
      
      {/* Basic Profile Information */}
      <section className="profile-section">
        <h2>Basic Profile Information</h2>
        <div className="profile-field">
          <label>Full Name:</label>
          <span>{profile.fullName}</span>
        </div>
        <div className="profile-field">
          <label>Email Address:</label>
          <span>{profile.email}</span>
        </div>
        <div className="profile-field">
          <label>Username:</label>
          {editing ? (
            <input type="text" name="username" value={profile.username} onChange={handleInputChange} />
          ) : (
            <span>{profile.username}</span>
          )}
        </div>
        <div className="profile-field">
          <label>Phone Number:</label>
          {editing ? (
            <input type="text" name="phone" value={profile.phone} onChange={handleInputChange} />
          ) : (
            <span>{profile.phone}</span>
          )}
        </div>
      </section>

      {/* Personal Details */}
      <section className="profile-section">
        <h2>Personal Details</h2>
        <div className="profile-field">
          <label>Date of Birth:</label>
          {editing ? (
            <input type="date" name="dob" value={profile.dob} onChange={handleInputChange} />
          ) : (
            <span>{profile.dob}</span>
          )}
        </div>
        <div className="profile-field">
          <label>Gender:</label>
          {editing ? (
            <select name="gender" value={profile.gender} onChange={handleInputChange}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <span>{profile.gender}</span>
          )}
        </div>
        <fieldset className="address-fieldset">
          <legend>Address</legend>
          <div className="profile-field">
            <label>Street:</label>
            {editing ? (
              <input type="text" name="address.street" value={profile.address.street} onChange={handleInputChange} />
            ) : (
              <span>{profile.address.street}</span>
            )}
          </div>
          <div className="profile-field">
            <label>City:</label>
            {editing ? (
              <input type="text" name="address.city" value={profile.address.city} onChange={handleInputChange} />
            ) : (
              <span>{profile.address.city}</span>
            )}
          </div>
          <div className="profile-field">
            <label>State:</label>
            {editing ? (
              <input type="text" name="address.state" value={profile.address.state} onChange={handleInputChange} />
            ) : (
              <span>{profile.address.state}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Country:</label>
            {editing ? (
              <input type="text" name="address.country" value={profile.address.country} onChange={handleInputChange} />
            ) : (
              <span>{profile.address.country}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Pincode:</label>
            {editing ? (
              <input type="text" name="address.pincode" value={profile.address.pincode} onChange={handleInputChange} />
            ) : (
              <span>{profile.address.pincode}</span>
            )}
          </div>
        </fieldset>
      </section>

      {/* Security Settings */}
      <section className="profile-section">
        <h2>Security Settings</h2>
        <div className="profile-field">
          <label>Password:</label>
          <span>********</span>
          <button className="action-btn" onClick={handleResetPassword}>Change Password</button>
        </div>
        <div className="profile-field">
          <label>Security Question:</label>
          <span>What is your favourite place?</span>
        </div>
        <div className="profile-field">
          <label>Security Answer:</label>
          {editing ? (
            <input type="text" name="favouritePlace" value={profile.favouritePlace} onChange={handleInputChange} />
          ) : (
            <span>{profile.favouritePlace}</span>
          )}
        </div>
      </section>

      {/* Account Info (View-only) */}
      <section className="profile-section view-only">
        <h2>Account Info</h2>
        <div className="profile-field">
          <label>Account Created On:</label>
          <span>{profile.accountCreated ? new Date(profile.accountCreated).toLocaleString() : '-'}</span>
        </div>
        <div className="profile-field">
          <label>Last Login:</label>
          <span>{profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : '-'}</span>
        </div>
        <div className="profile-field">
          <label>User Role:</label>
          <span>{profile.role}</span>
        </div>
      </section>

      {/* Actions */}
      <section className="profile-actions">
        {editing ? (
          <button className="action-btn" onClick={handleSave}>Save Changes</button>
        ) : (
          <button className="action-btn" onClick={toggleEdit}>Edit Profile</button>
        )}
        <button className="action-btn" onClick={handleResetPassword}>Reset Password</button>
        <button className="action-btn" onClick={handleLogout}>Logout</button>
        <button className="action-btn delete" onClick={handleDeleteAccount}>Delete Account</button>
      </section>
    </div>
  );
}

export default ViewProfile;
