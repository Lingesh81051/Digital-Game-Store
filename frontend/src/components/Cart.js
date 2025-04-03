// frontend/src/components/Cart.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper: get auth config for protected API calls
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Function to fetch cart items for the logged-in user
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const config = getAuthConfig();
      const response = await axios.get('/api/user/cart', config);
      // Assuming each cart item has a "product" field and a "quantity" property.
      setCartItems(response.data.filter(item => item.product));
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Fetch cart items on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  // After rendering, if a hash exists in the URL, scroll to that element smoothly.
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location, cartItems]);

  // Handler for removing a product from the cart
  const handleRemoveFromCart = async (productId) => {
    try {
      await axios.delete(`/api/user/cart/${productId}`, getAuthConfig());
      fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // Handler for moving an item to wishlist from the cart page
  const handleMoveToWishlist = async (productId) => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const config = getAuthConfig();
      if (wishlist.includes(productId)) {
        alert("This game is already in your wishlist");
      } else {
        await axios.post('/api/user/wishlist', { productId }, config);
        alert("Game moved to wishlist");
        window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { added: productId } }));
      }
      // In both cases, remove the item from the cart
      await axios.delete(`/api/user/cart/${productId}`, config);
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { removed: productId } }));
      fetchCart();
    } catch (error) {
      console.error("Error moving item to wishlist:", error);
    }
  };

  // Calculate the total price of the cart
  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Your Cart</h1>
        {cartItems.length === 0 ? (
          <p className="empty-msg">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-tile-list">
              {cartItems.map(item => {
                if (!item.product) return null;
                return (
                  <div key={item._id} id={`product-${item.product._id}`} className="cart-tile">
                    <div className="tile-image">
                      <img
                        src={
                          item.product.image.startsWith('/')
                            ? `http://localhost:5000${item.product.image}`
                            : item.product.image
                        }
                        alt={item.product.name}
                        onError={(e) => {
                          if (
                            e.target.src !== 'http://localhost:5000/images/placeholder.png'
                          ) {
                            e.target.onerror = null;
                            e.target.src = 'http://localhost:5000/images/placeholder.png';
                          }
                        }}
                      />
                    </div>
                    <div className="tile-details">
                      <h4>
                        <Link to={`/product/${item.product._id}`} className="title-link">
                          {item.product.name}
                        </Link>
                      </h4>
                      <p className="tile-price">
                        ${item.product.price} x {item.quantity}
                      </p>
                      <div className="tile-actions">
                        <span
                          className="remove-tile-text"
                          onClick={() => handleRemoveFromCart(item.product._id)}
                        >
                          <i className="fas fa-trash-alt"></i> Remove
                        </span>
                        <span
                          className="move-to-wishlist-text"
                          onClick={() => handleMoveToWishlist(item.product._id)}
                        >
                          <i className="fas fa-heart"></i> Move to Wishlist
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cart-summary">
              <h2>Total: ${calculateTotal()}</h2>
              <Link to="/checkout" className="checkout-btn">
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;