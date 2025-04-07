import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManageUser.css';

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError('');
      // Adjust endpoint as needed.
      const { data } = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error fetching users. Please check your API and token.');
    } finally {
      setLoading(false);
    }
  }

  const handleDetails = (userId) => {
    // For now, just log the ID; implement details view as needed.
    console.log("Details for user:", userId);
    // e.g., navigate(`/admin/users/details/${userId}`);
  };

  const handleEdit = (userId) => {
    // Navigate to the EditUser page with the given user ID.
    navigate(`/admin/users/edit/${userId}`);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="manage-users">
      <h1>Manage Users</h1>
      {users.length === 0 ? (
        <p>No users available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name || `${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                <td>
                  <button className="details-btn" onClick={() => handleDetails(user._id)}>Details</button>
                  <button className="edit-btn" onClick={() => handleEdit(user._id)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageUser;
