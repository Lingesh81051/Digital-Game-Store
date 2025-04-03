// frontend/src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    productCount: 0,
    orderCount: 0,
    userCount: 0,
  });

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('/api/admin/dashboard', config);
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin dashboard:', error);
      }
    }
    fetchDashboard();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat-item">
          <h2>{stats.productCount}</h2>
          <p>Products</p>
        </div>
        <div className="stat-item">
          <h2>{stats.orderCount}</h2>
          <p>Orders</p>
        </div>
        <div className="stat-item">
          <h2>{stats.userCount}</h2>
          <p>Users</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
