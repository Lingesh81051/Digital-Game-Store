// frontend/src/components/admin/AdminLayout.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3 className='admin-panel'>Admin Panel</h3>
        <nav>
          <ul>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/products">Manage Products</Link></li>
            <li><Link to="/admin/orders">Manage Orders</Link></li>
            <li><Link to="/admin/users">Manage Users</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
