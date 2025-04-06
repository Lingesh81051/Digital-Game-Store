// frontend/src/components/admin/ManageOrder.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageOrder.css';

function ManageOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data } = await axios.get('/api/admin/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('Orders fetched:', data);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleStatusChange = (field, value) => {
    setSelectedOrder(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/admin/orders/${selectedOrder._id}`, selectedOrder, config);
      alert('Order updated successfully');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order');
    } finally {
      setUpdating(false);
    }
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  if (loading) return <p>Loading orders...</p>;

  if (selectedOrder) {
    const billing = selectedOrder.billingAddress || {};
    const payment = selectedOrder.paymentInfo || {};
    const items = selectedOrder.orderItems || [];
    return (
      <div className="order-details">
        <div className="back-action" onClick={handleBackToList}>
          <i className="fa fa-arrow-left" aria-hidden="true"></i> Back
        </div>
        <h1>Order Details</h1>
        <p><strong>Order ID:</strong> {selectedOrder._id || ''}</p>
        <p>
          <strong>Customer Name:</strong> {billing.firstName || ''} {billing.lastName || ''} ({billing.username || ''})
        </p>
        <p>
          <strong>Shipping Address:</strong> {billing.address || ''}, {billing.state || ''}, {billing.zip || ''}, {billing.country || ''}
        </p>
        <p>
          <strong>Payment Info:</strong> {payment.cardName || ''} - {payment.cardNumber || ''} - {payment.expiryDate || ''} - {payment.cvv || ''}
        </p>
        <p>
          <strong>Payment Status:</strong> {selectedOrder.isPaid ? 'Paid' : 'Not Paid'}
        </p>
        <p>
          <strong>Delivery Status:</strong> {selectedOrder.isDelivered ? 'Delivered' : 'Not Delivered'}
        </p>
        <div>
          <strong>Games Ordered:</strong>
          {items.length > 0 ? (
            <ul>
              {items.map((item, index) => (
                <li key={index}>
                  {item.name ? item.name : 'Unknown'} (Qty: {item.quantity})
                </li>
              ))}
            </ul>
          ) : (
            <p>No games ordered</p>
          )}
        </div>
        <div>
          <strong>Timeline:</strong>
          <ul>
            <li>Ordered: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : ''}</li>
            <li>Paid: {selectedOrder.paidAt ? new Date(selectedOrder.paidAt).toLocaleString() : ''}</li>
            <li>Delivered: {selectedOrder.deliveredAt ? new Date(selectedOrder.deliveredAt).toLocaleString() : ''}</li>
          </ul>
        </div>
        <div className="status-update">
          <label>
            <input
              type="checkbox"
              checked={selectedOrder.isPaid || false}
              onChange={(e) => handleStatusChange('isPaid', e.target.checked)}
            />{' '}
            Mark as Paid
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedOrder.isDelivered || false}
              onChange={(e) => handleStatusChange('isDelivered', e.target.checked)}
            />{' '}
            Mark as Delivered
          </label>
        </div>
        <div className="update-actions">
          <button onClick={handleUpdateStatus} disabled={updating}>
            Update Order Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-orders">
      <h1>Manage Orders</h1>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Address</th>
              <th>Payment Status</th>
              <th>Delivery Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const billing = order.billingAddress || {};
              return (
                <tr key={order._id}>
                  <td>{order._id || ''}</td>
                  <td>{`${billing.firstName || ''} ${billing.lastName || ''} (${billing.username || ''})`}</td>
                  <td>{`${billing.address || ''}, ${billing.state || ''}, ${billing.zip || ''}, ${billing.country || ''}`}</td>
                  <td>{order.isPaid ? 'Paid' : 'Not Paid'}</td>
                  <td>{order.isDelivered ? 'Delivered' : 'Not Delivered'}</td>
                  <td>
                    <button onClick={() => handleOrderClick(order)}>Details</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageOrder;
