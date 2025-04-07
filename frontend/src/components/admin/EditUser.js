// frontend/src/components/admin/EditUser.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditUser.css';

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    dob: '',
    gender: '',
    favouritePlace: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '', // Added country field
      pincode: ''
    },
    isAdmin: false
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`/api/admin/users/${id}`, config);
        setUser({
          name: data.name,
          email: data.email,
          username: data.username || '',
          phone: data.phone || '',
          dob: data.dob ? data.dob.substring(0, 10) : '',
          gender: data.gender || '',
          favouritePlace: data.favouritePlace || '',
          address: {
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            country: data.address?.country || '', // Populate country if exists
            pincode: data.address?.pincode || ''
          },
          isAdmin: data.isAdmin || false
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
        setMessage("Error fetching user details.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split('.')[1];
      setUser(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else if (type === 'checkbox') {
      setUser(prev => ({ ...prev, [name]: checked }));
    } else {
      setUser(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const updateData = {
        username: user.username,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        favouritePlace: user.favouritePlace,
        address: user.address,
        isAdmin: user.isAdmin
      };
      await axios.put(`/api/admin/users/${id}`, updateData, config);
      setMessage("User updated successfully.");
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error);
      setMessage(error.response?.data?.message || "Failed to update user.");
    }
  };

  const handleBack = () => {
    navigate('/admin/users');
  };

  if (loading) return <p>Loading user details...</p>;

  return (
    <div className="edit-user">
      <div className="back-action" onClick={handleBack}>
        <i className="fa fa-arrow-left" aria-hidden="true"></i> Back
      </div>
      <h1>Edit User</h1>
      {message && <p className="message">{message}</p>}
      <form className="edit-form">
        <div className="form-group">
          <label>Name:</label>
          <span>{user.name}</span>
        </div>
        <div className="form-group">
          <label>Email:</label>
          <span>{user.email}</span>
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input 
            type="text" 
            name="username" 
            value={user.username} 
            onChange={handleInputChange} 
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input 
            type="text" 
            name="phone" 
            value={user.phone} 
            onChange={handleInputChange} 
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input 
            type="date" 
            name="dob" 
            value={user.dob} 
            onChange={handleInputChange} 
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select name="gender" value={user.gender} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Favourite Place:</label>
          <input 
            type="text" 
            name="favouritePlace" 
            value={user.favouritePlace} 
            onChange={handleInputChange} 
          />
        </div>
        <fieldset className="address-fieldset">
          <legend>Address</legend>
          <div className="form-group">
            <label>Street:</label>
            <input 
              type="text" 
              name="address.street" 
              value={user.address.street} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="form-group">
            <label>City:</label>
            <input 
              type="text" 
              name="address.city" 
              value={user.address.city} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="form-group">
            <label>State:</label>
            <input 
              type="text" 
              name="address.state" 
              value={user.address.state} 
              onChange={handleInputChange} 
            />
          </div>
          {/* New Country field below State */}
          <div className="form-group">
            <label>Country:</label>
            <input 
              type="text" 
              name="address.country" 
              value={user.address.country} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="form-group">
            <label>Pincode:</label>
            <input 
              type="text" 
              name="address.pincode" 
              value={user.address.pincode} 
              onChange={handleInputChange} 
            />
          </div>
        </fieldset>
        <div className="form-group">
          <label>Admin:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="isAdmin"
                value="true"
                checked={user.isAdmin === true}
                onChange={() => setUser(prev => ({ ...prev, isAdmin: true }))}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="isAdmin"
                value="false"
                checked={user.isAdmin === false}
                onChange={() => setUser(prev => ({ ...prev, isAdmin: false }))}
              />
              No
            </label>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="save-btn" onClick={handleSave}>Save Changes</button>
          <button type="button" className="cancel-btn" onClick={handleBack}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
