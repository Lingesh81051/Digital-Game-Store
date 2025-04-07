// frontend/src/components/admin/UserDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UserDetails.css';

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`/api/admin/users/${id}`, config);
        setUser(data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Error fetching user details.");
      } finally {
        setLoading(false);
      }
    }
    fetchUserDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/users');
  };

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="user-details">
      <div className="back-action" onClick={handleBack}>
        <i className="fa fa-arrow-left" aria-hidden="true"></i> Back
      </div>
      <h1>User Details</h1>
      <div className="detail-field">
        <label>User ID:</label>
        <span>{user._id || '-'}</span>
      </div>
      <div className="detail-field">
        <label>Name:</label>
        <span>{user.name || '-'}</span>
      </div>
      <div className="detail-field">
        <label>Email:</label>
        <span>{user.email || '-'}</span>
      </div>
      <div className="detail-field">
        <label>Username:</label>
        <span>{user.username || '-'}</span>
      </div>
      <div className="detail-field">
        <label>Phone:</label>
        <span>{user.phone || '-'}</span>
      </div>
      <div className="detail-field">
        <label>Favourite Place:</label>
        <span>{user.favouritePlace || '-'}</span>
      </div>
      {user.address && (
        <fieldset className="address-fieldset">
          <legend>Address</legend>
          <div className="detail-field">
            <label>Street:</label>
            <span>{user.address.street || '-'}</span>
          </div>
          <div className="detail-field">
            <label>City:</label>
            <span>{user.address.city || '-'}</span>
          </div>
          <div className="detail-field">
            <label>State:</label>
            <span>{user.address.state || '-'}</span>
          </div>
          <div className="detail-field">
            <label>Country:</label>
            <span>{user.address.country || '-'}</span>
          </div>
          <div className="detail-field">
            <label>Pincode:</label>
            <span>{user.address.pincode || '-'}</span>
          </div>
        </fieldset>
      )}
      <div className="detail-field">
        <label>Admin:</label>
        <span>{user.isAdmin ? 'Yes' : 'No'}</span>
      </div>
    </div>
  );
}

export default UserDetails;
