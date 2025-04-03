// frontend/src/components/Wishlist.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PageSearchBar from './PageSearchBar';
import './Wishlist.css';

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartIds, setCartIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  // Function to fetch wishlist data
  const fetchWishlist = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('/api/user/profile', config);
      // Assuming response.data.wishlist is an array of product objects
      setWishlistItems(response.data.wishlist || []);
      const ids = (response.data.wishlist || []).map(item => item._id);
      localStorage.setItem('wishlist', JSON.stringify(ids));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch cart product IDs for the logged-in user
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('/api/user/cart', config);
      // Assuming each cart item has a nested product field:
      const ids = response.data
        .filter(item => item.product)
        .map(item => item.product._id);
      setCartIds(ids);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Fetch wishlist and cart items on component mount
  useEffect(() => {
    fetchWishlist();
    fetchCart();
  }, [fetchWishlist]);

  // Listen for custom events to refresh data
  useEffect(() => {
    const handleWishlistUpdated = () => fetchWishlist();
    window.addEventListener('wishlistUpdated', handleWishlistUpdated);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdated);
    };
  }, [fetchWishlist]);

  useEffect(() => {
    const handleCartUpdated = () => fetchCart();
    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  // Handler for removing from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/user/wishlist/${productId}`, config);
      const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const updated = stored.filter(id => id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { removed: productId } }));
      fetchWishlist();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  // Handler for cart action:
  // If not in cart → add to cart.
  // If already in cart → navigate to Cart page and scroll to the game tile.
  const handleCartAction = async (productId) => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
    if (!cartIds.includes(productId)) {
      try {
        await axios.post('/api/user/cart', { productId }, config);
        alert("Game added to cart");
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { added: productId } }));
        fetchCart();
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      // Navigate to cart page with hash to scroll to product tile.
      navigate(`/cart#product-${productId}`);
    }
  };

  const filteredItems = wishlistItems.filter(item =>
    item.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="wishlist-page">
      <PageSearchBar placeholder="Search in Wishlist..." onSearch={handleSearch} />
      <div className="wishlist-container">
        <h1>Your Wishlist</h1>
        {loading ? (
          <p>Loading wishlist...</p>
        ) : filteredItems.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          <div className="wishlist-grid">
            {filteredItems.map(item => (
              <div key={item._id} className="wishlist-card">
                <img
                  src={item.image.startsWith('/') ? `http://localhost:5000${item.image}` : item.image}
                  alt={item.name}
                  onError={(e) => {
                    if (e.target.src !== 'http://localhost:5000/images/placeholder.png') {
                      e.target.onerror = null;
                      e.target.src = 'http://localhost:5000/images/placeholder.png';
                    }
                  }}
                />
                <h3>
                  <Link to={`/product/${item._id}`} className="title-link">
                    {item.name}
                  </Link>
                </h3>
                <p className="price">${item.price}</p>
                <div className="button-group">
                  <button onClick={() => handleRemoveFromWishlist(item._id)} className="remove-btn">
                    Remove from Wishlist
                  </button>
                  <button onClick={() => handleCartAction(item._id)} className="add-to-cart-btn">
                    {cartIds.includes(item._id) ? "View in Cart" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
