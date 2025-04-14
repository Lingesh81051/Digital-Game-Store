// frontend/src/components/admin/ManageProducts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManageProducts.css';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Helper: get auth config for protected API calls, if required.
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
      console.log('Products fetched:', data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  const handleEditClick = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Use the correct endpoint URL here. 
        // Change '/api/products/' to '/api/admin/products/' if that matches your backend.
        await axios.delete(`/api/products/${productId}`, getAuthConfig());
        console.log('Product deleted:', productId);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error.response ? error.response.data : error);
      }
    }
  };

  const handleAddProduct = () => {
    navigate('/admin/products/add');
  };

  return (
    <div className="manage-products">
      <div className="header-row">
        <h1>Manage Products</h1>
        <button className="add-product-btn" onClick={handleAddProduct}>
          Add
        </button>
      </div>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(product._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageProducts;
