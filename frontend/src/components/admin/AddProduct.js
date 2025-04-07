// frontend/src/components/admin/AddProduct.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';

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

function AddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    countInStock: 0,
    image: '',
    categories: [], // now an array
    trailer: '',
    developer: '',
    releaseDate: '',
    platform: '',
    ratings: 0,
    minRequirements: {
      os: '',
      processor: '',
      ram: '',
      hardDrive: '',
      videoCard: '',
      soundCard: '',
      directX: '',
      peripherals: ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleMinReqChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      minRequirements: { ...prev.minRequirements, [name]: value }
    }));
  };

  const toggleCategory = (category) => {
    setProduct(prev => {
      const alreadySelected = prev.categories.includes(category);
      if (alreadySelected) {
        return {
          ...prev,
          categories: prev.categories.filter(cat => cat !== category)
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, category]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Retrieve admin token from localStorage
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      // Optionally, if your backend expects a string, you can join the array:
      // const productData = { ...product, categories: product.categories.join(', ') };
      // For now, we send the array as is.
      const res = await axios.post('/api/admin/products', product, config);
      alert('Product added successfully');
      navigate('/admin/products');
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      alert(`Error adding product: ${errMsg}`);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="add-product">
      <div className="back-action" onClick={handleBack}>
        <i className="fa fa-arrow-left" aria-hidden="true"></i> Back
      </div>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit} className="add-form">
        <label>
          Name:
          <input type="text" name="name" value={product.name} onChange={handleInputChange} required />
        </label>
        <label>
          Description:
          <textarea name="description" value={product.description} onChange={handleInputChange} required />
        </label>
        <label>
          Price:
          <input type="number" name="price" value={product.price} onChange={handleInputChange} required />
        </label>
        <label>
          Count In Stock:
          <input type="number" name="countInStock" value={product.countInStock} onChange={handleInputChange} required />
        </label>
        <label>
          Image URL:
          <input type="text" name="image" value={product.image} onChange={handleInputChange} required />
        </label>
        <div className="categories-section">
          <p>Select Categories:</p>
          <div className="categories-list">
            {availableCategories.map((cat, index) => (
              <span
                key={index}
                className={`category-tag ${product.categories.includes(cat) ? 'selected' : ''}`}
                onClick={() => toggleCategory(cat)}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
        <label>
          Trailer URL:
          <input type="text" name="trailer" value={product.trailer} onChange={handleInputChange} />
        </label>
        <label>
          Developer:
          <input type="text" name="developer" value={product.developer} onChange={handleInputChange} required />
        </label>
        <label>
          Release Date:
          <input type="date" name="releaseDate" value={product.releaseDate} onChange={handleInputChange} required />
        </label>
        <label>
          Platform:
          <input type="text" name="platform" value={product.platform} onChange={handleInputChange} required />
        </label>
        <label>
          Ratings:
          <input type="number" step="0.1" name="ratings" value={product.ratings} onChange={handleInputChange} required />
        </label>
        <fieldset>
          <legend>Minimum Requirements</legend>
          <label>
            OS:
            <input type="text" name="os" value={product.minRequirements.os} onChange={handleMinReqChange} required />
          </label>
          <label>
            Processor:
            <input type="text" name="processor" value={product.minRequirements.processor} onChange={handleMinReqChange} required />
          </label>
          <label>
            RAM:
            <input type="text" name="ram" value={product.minRequirements.ram} onChange={handleMinReqChange} required />
          </label>
          <label>
            Hard Drive:
            <input type="text" name="hardDrive" value={product.minRequirements.hardDrive} onChange={handleMinReqChange} required />
          </label>
          <label>
            Video Card:
            <input type="text" name="videoCard" value={product.minRequirements.videoCard} onChange={handleMinReqChange} required />
          </label>
          <label>
            Sound Card:
            <input type="text" name="soundCard" value={product.minRequirements.soundCard} onChange={handleMinReqChange} required />
          </label>
          <label>
            DirectX:
            <input type="text" name="directX" value={product.minRequirements.directX} onChange={handleMinReqChange} required />
          </label>
          <label>
            Peripherals:
            <input type="text" name="peripherals" value={product.minRequirements.peripherals} onChange={handleMinReqChange} required />
          </label>
        </fieldset>
        <div className="form-actions">
        <button type="submit" className="add-btn">Add</button>
        <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
