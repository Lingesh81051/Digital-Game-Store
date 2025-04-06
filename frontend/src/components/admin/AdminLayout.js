// frontend/src/components/admin/AdminLayout.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3 className="admin-panel">Admin Panel</h3>
        <nav>
          <ul>
            <li className="sidebar-link">
              <Link to="/admin/dashboard">
                <i className="fas fa-home sidebar-icon"></i> Dashboard
              </Link>
            </li>
            <li className="sidebar-link">
              <Link to="/admin/products">
                <i className="fas fa-box sidebar-icon"></i> Manage Products
              </Link>
            </li>
            <li className="sidebar-link">
              <Link to="/admin/orders">
                <i className="fas fa-clipboard-list sidebar-icon"></i> Manage Orders
              </Link>
            </li>
            <li className="sidebar-link">
              <Link to="/admin/users">
                <i className="fas fa-user-cog sidebar-icon"></i> Manage Users
              </Link>
            </li>
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
