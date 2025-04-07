// frontend/src/components/admin/EditProduct.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProduct.css';

const availableCategories = [
  // Group 1
  "Discover New",
  "Featured Discounts",
  "Free Games",
  "Trending Games",
  "New Releases",
  "Top Sellers",
  "Most Played",
  "Most popular",
  // Group 2
  "Adventure",
  "Action",
  "Sports",
  "Simulation",
  "Platformer",
  "RPG",
  "First-person shooter",
  "Action-adventure",
  "Fighting",
  "Real-time strategy",
  "Racing",
  "Shooter",
  "Puzzle",
  "Casual",
  "Strategy game",
  "Stealth",
  "Party",
  "Tactical role-playing",
  "Survival",
  "Battle Royale",
  "Massively multiplayer online role-playing"
];

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        // Ensure categories is an array (if stored as comma separated, you can split here)
        if (typeof data.categories === 'string') {
          data.categories = data.categories.split(',').map(cat => cat.trim());
        }
        setProduct(data);
        console.log('Fetched product:', data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMinReqChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      minRequirements: {
        ...prev.minRequirements,
        [name]: value,
      },
    }));
  };

  const handleFileBrowse = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For demo purposes, generate a temporary URL.
      const imageUrl = URL.createObjectURL(file);
      setProduct((prev) => ({
        ...prev,
        image: imageUrl,
      }));
      console.log('Updated image URL:', imageUrl);
    }
  };

  const toggleCategory = (category) => {
    setProduct(prev => {
      const currentCategories = prev.categories || [];
      const alreadySelected = currentCategories.includes(category);
      if (alreadySelected) {
        return { ...prev, categories: currentCategories.filter(cat => cat !== category) };
      } else {
        return { ...prev, categories: [...currentCategories, category] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting product update:', product);

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const res = await axios.put(`/api/admin/products/${id}`, product, config);
      console.log('Product updated successfully:', res.data);
      alert('Changes made successfully');
      navigate('/admin/products');
      window.location.reload();
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      console.error('Error updating product:', errMsg);
      alert(`Error updating product: ${errMsg}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      console.log('Deleting product with id:', id);

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const res = await axios.delete(`/api/admin/products/${id}`, config);
        console.log('Product deleted successfully:', res.data);
        alert('Product deleted successfully');
        navigate('/admin/products');
        window.location.reload();
      } catch (error) {
        const errMsg = error.response?.data?.message || error.message;
        console.error('Error deleting product:', errMsg);
        alert(`Error deleting product: ${errMsg}`);
      }
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="edit-product">
      <div className="back-action" onClick={handleCancel}>
        <i className="fa fa-arrow-left" aria-hidden="true"></i> Back
      </div>
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit} className="edit-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={product.name || ''}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={product.description || ''}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={product.price || ''}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Count In Stock:
          <input
            type="number"
            name="countInStock"
            value={product.countInStock || ''}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Image URL:
          <div className="file-input-container">
            <input
              type="text"
              name="image"
              value={product.image || ''}
              onChange={handleInputChange}
              required
            />
            <button type="button" className="browse-btn" onClick={handleFileBrowse}>
              Browse
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </label>
        {/* Replace the categories input with tag selection */}
        <div className="categories-section">
          <p>Select Categories:</p>
          <div className="categories-list">
            {availableCategories.map((cat, index) => (
              <span
                key={index}
                className={`category-tag ${product.categories && product.categories.includes(cat) ? 'selected' : ''}`}
                onClick={() => toggleCategory(cat)}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
        <label>
          Trailer URL:
          <input
            type="text"
            name="trailer"
            value={product.trailer || ''}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Developer:
          <input
            type="text"
            name="developer"
            value={product.developer || ''}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Release Date:
          <input
            type="date"
            name="releaseDate"
            value={product.releaseDate ? product.releaseDate.substring(0, 10) : ''}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Platform:
          <input
            type="text"
            name="platform"
            value={product.platform || ''}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Ratings:
          <input
            type="number"
            step="0.1"
            name="ratings"
            value={product.ratings || ''}
            onChange={handleInputChange}
            required
          />
        </label>
        <fieldset>
          <legend>Minimum Requirements</legend>
          <label>
            OS:
            <input
              type="text"
              name="os"
              value={product.minRequirements?.os || ''}
              onChange={handleMinReqChange}
              required
            />
          </label>
          <label>
            Processor:
            <input
              type="text"
              name="processor"
              value={product.minRequirements?.processor || ''}
              onChange={handleMinReqChange}
              required
            />
          </label>
          <label>
            RAM:
            <input
              type="text"
              name="ram"
              value={product.minRequirements?.ram || ''}
              onChange={handleMinReqChange}
              required
            />
          </label>
          <label>
            Hard Drive:
            <input
              type="text"
              name="hardDrive"
              value={product.minRequirements?.hardDrive || ''}
              onChange={handleMinReqChange}
              required
            />
          </label>
          <label>
            Video Card:
            <input
              type="text"
              name="videoCard"
              value={product.minRequirements?.videoCard || ''}
              onChange={handleMinReqChange}
              required
            />
          </label>
          <label>
            Sound Card:
            <input
              type="text"
              name="soundCard"
              value={product.minRequirements?.soundCard || ''}
              onChange={handleMinReqChange}
              required
            />
          </label>
          <label>
            DirectX:
            <input
              type="text"
              name="directX"
              value={product.minRequirements?.directX || ''}
              onChange={handleMinReqChange}
              required
            />
          </label>
          <label>
            Peripherals:
            <input
              type="text"
              name="peripherals"
              value={product.minRequirements?.peripherals || ''}
              onChange={handleMinReqChange}
              required
            />
          </label>
        </fieldset>
        <div className="modal-actions">
        <button type="submit" className="save-btn">Save Changes</button>
        {/* <button type="button" className="delete-btn" onClick={handleDelete}>Delete Product</button> */}
        <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
