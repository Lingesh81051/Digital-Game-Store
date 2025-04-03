// frontend/src/components/Checkout.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    address: '',
    address2: '',
    country: '',
    state: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveInfo: false,
    shippingSame: false,
    paymentMethod: 'Credit card' // Default payment method
  });
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Helper: get auth config for protected API calls
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch cart items from the backend
  useEffect(() => {
    async function fetchCart() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const config = getAuthConfig();
        const response = await axios.get('/api/user/cart', config);
        // Ensure that only items with a valid product object are stored
        setCartItems(response.data.filter(item => item.product));
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }
    fetchCart();
  }, []);

  // Calculate total considering quantity (default quantity = 1)
  const totalWithoutPromo = cartItems.reduce(
    (acc, item) => acc + item.product.price * (item.quantity || 1),
    0
  );
  const total = totalWithoutPromo - promoDiscount;

  const handleBillingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillingInfo((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    // Demo logic: if promoCode is "EXAMPLECODE", discount $5.
    if (promoCode.trim() === 'EXAMPLECODE') {
      setPromoDiscount(5);
    } else {
      setPromoDiscount(0);
    }
  };

  // Validate required fields (all fields except address2 and email are required)
  const validateForm = () => {
    const requiredFields = [
      'firstName',
      'lastName',
      'username',
      'address',
      'country',
      'state',
      'zip',
      'cardName',
      'cardNumber',
      'expiryDate',
      'cvv'
    ];
    for (const field of requiredFields) {
      if (!billingInfo[field] || billingInfo[field].trim() === '') {
        return false;
      }
    }
    return true;
  };

  // After successful order creation, clear cart items and add each game to the user's library.
  const clearCartAndAddToLibrary = async () => {
    const config = getAuthConfig();
    try {
      // Clear cart: iterate over cartItems and send DELETE for each.
      await Promise.all(cartItems.map(item => 
        axios.delete(`/api/user/cart/${item.product._id}`, config)
      ));
      // Add each purchased game to the user's library
      await Promise.all(cartItems.map(item =>
        axios.post('/api/user/library', { productId: item.product._id }, config)
      ));
    } catch (error) {
      console.error("Error updating library and clearing cart:", error);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    // Construct order data object with all required details
    const orderData = {
      orderItems: cartItems.map((item) => ({
        product: item.product._id, // assuming each cart item has a product object with _id
        quantity: item.quantity || 1
      })),
      totalPrice: total,
      billingAddress: {
        firstName: billingInfo.firstName,
        lastName: billingInfo.lastName,
        username: billingInfo.username,
        email: billingInfo.email,
        address: billingInfo.address,
        address2: billingInfo.address2,
        country: billingInfo.country,
        state: billingInfo.state,
        zip: billingInfo.zip,
        shippingSame: billingInfo.shippingSame
      },
      paymentInfo: {
        paymentMethod: billingInfo.paymentMethod,
        cardName: billingInfo.cardName,
        cardNumber: billingInfo.cardNumber,
        expiryDate: billingInfo.expiryDate,
        cvv: billingInfo.cvv
      }
    };

    console.log('Checkout process initiated', orderData);
    try {
      // Send the order data to the backend to be saved in the orders collection
      await axios.post('/api/orders', orderData, getAuthConfig());
      // After order is saved, clear the cart and add purchased games to the library
      await clearCartAndAddToLibrary();
      alert('Checkout complete! Thank you for your purchase.');
      // Navigate to the library page where the user can install their games
      navigate('/library');
    } catch (error) {
      console.error("Error saving order:", error.response ? error.response.data : error);
      setErrorMessage('An error occurred while processing your order. Please try again.');
    }
  };

  return (
    <div className="checkout-container">
      {/* Back Icon/Button */}
      <div
        className="back-button"
        onClick={() => navigate('/cart')}
        style={{ cursor: 'pointer', marginBottom: '1rem', color: 'blue' }}
      >
        <span className="back-icon" aria-label="back" style={{ marginRight: '0.5rem' }}>&#8592;</span> 
        Back to Cart
      </div>
      <div className="py-5 text-center">
        <h1>Checkout Form</h1>
      </div>
      <div className="row">
        {/* Order Summary Section */}
        <div className="col-md-4 order-2 cart-section">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="your-cart-title">Your Cart</span>
            <span className="badge rounded-pill bg-secondary">{cartItems.length}</span>
          </h4>
          <ul className="list-group mb-3">
            {cartItems.map((item, index) => (
              <li key={index} className="list-group-item cart-item">
                <div className="cart-item-info">
                  <h6 className="my-0">{item.product.name}</h6>
                  {item.quantity && item.quantity > 1 && (
                    <small className="text-muted">Quantity: {item.quantity}</small>
                  )}
                </div>
                <span className="text-muted">
                  ${(item.product.price * (item.quantity || 1)).toFixed(2)}
                </span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between bg-light">
              <div className="text-success">
                <h6 className="my-0">Promo code</h6>
                <small>{promoCode || 'None'}</small>
              </div>
              <span className="text-success">-${promoDiscount}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </li>
          </ul>
          <form className="promo-form" onSubmit={handleApplyPromo}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button type="submit" className="Redeem-btn-secondary">
                Redeem
              </button>
            </div>
          </form>
        </div>
        {/* Billing Address & Payment Section */}
        <div className="col-md-8 order-1">
          <h4 className="mb-3">Billing Address</h4>
          {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
          <form onSubmit={handleCheckout} className="needs-validation" noValidate>
            <div className="row g-3">
              <div className="col-sm-6">
                <label htmlFor="firstName" className="form-label">
                  First Name*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  value={billingInfo.firstName}
                  onChange={handleBillingChange}
                  required
                />
              </div>
              <div className="col-sm-6">
                <label htmlFor="lastName" className="form-label">
                  Last Name*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  value={billingInfo.lastName}
                  onChange={handleBillingChange}
                  required
                />
              </div>
              <div className="col-12">
                <label htmlFor="username" className="form-label">
                  Username*
                </label>
                <div className="input-group">
                  <span className="input-group-text">@</span>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    placeholder="Username"
                    value={billingInfo.username}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
              </div>
              <div className="col-12">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-muted">(Optional)</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={billingInfo.email}
                  onChange={handleBillingChange}
                />
              </div>
              <div className="col-12">
                <label htmlFor="address" className="form-label">
                  Address*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  placeholder="1234 Main St"
                  value={billingInfo.address}
                  onChange={handleBillingChange}
                  required
                />
              </div>
              <div className="col-12">
                <label htmlFor="address2" className="form-label">
                  Address 2 <span className="text-muted">(Optional)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address2"
                  name="address2"
                  placeholder="Apartment or suite"
                  value={billingInfo.address2}
                  onChange={handleBillingChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="country" className="form-label">
                  Country*
                </label>
                <select
                  className="form-select"
                  id="country"
                  name="country"
                  value={billingInfo.country}
                  onChange={handleBillingChange}
                  required
                >
                  <option value="">Choose...</option>
                  <option>India</option>
                  <option>Others</option>
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="state" className="form-label">
                  State*
                </label>
                <select
                  className="form-select"
                  id="state"
                  name="state"
                  value={billingInfo.state}
                  onChange={handleBillingChange}
                  required
                >
                  <option value="">Choose...</option>
                  <option>Andhra Pradesh</option>
                  <option>Arunachal Pradesh</option>
                  <option>Assam</option>
                  <option>Bihar</option>
                  <option>Karnataka</option>
                  <option>Kerala</option>
                  <option>Maharashtra</option>
                  <option>Rajasthan</option>
                  <option>Sikkim</option>
                  <option>Tamil Nadu</option>
                  <option>Telangana</option>
                  <option>West Bengal</option>
                  <option>Others</option>
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="zip" className="form-label">
                  Zip Code*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="zip"
                  name="zip"
                  value={billingInfo.zip}
                  onChange={handleBillingChange}
                  required
                />
              </div>
            </div>

            <hr className="my-4" />

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="shippingSame"
                name="shippingSame"
                checked={billingInfo.shippingSame}
                onChange={handleBillingChange}
              />
              <label className="form-check-label" htmlFor="shippingSame">
                Shipping address is the same as my billing address
              </label>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="saveInfo"
                name="saveInfo"
                checked={billingInfo.saveInfo}
                onChange={handleBillingChange}
              />
              <label className="form-check-label" htmlFor="saveInfo">
                Save this information for next time
              </label>
            </div>

            <hr className="my-4" />

            <h4 className="mb-3">Payment</h4>

            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                name="paymentMethod"
                id="credit"
                value="Credit card"
                checked={billingInfo.paymentMethod === 'Credit card'}
                onChange={handleBillingChange}
              />
              <label className="form-check-label" htmlFor="credit">
                Credit card (Default)
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                name="paymentMethod"
                id="debit"
                value="Debit card"
                checked={billingInfo.paymentMethod === 'Debit card'}
                onChange={handleBillingChange}
              />
              <label className="form-check-label" htmlFor="debit">
                Debit card
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                name="paymentMethod"
                id="paypal"
                value="Paypal"
                checked={billingInfo.paymentMethod === 'Paypal'}
                onChange={handleBillingChange}
              />
              <label className="form-check-label" htmlFor="paypal">
                Paypal
              </label>
            </div>

            <div className="row gy-3">
              <div className="col-md-6">
                <label htmlFor="cardName" className="form-label">
                  Name on card*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="cardName"
                  name="cardName"
                  placeholder=""
                  value={billingInfo.cardName}
                  onChange={handleBillingChange}
                  required
                />
                <small className="text-muted">Full name as displayed on card</small>
              </div>
              <div className="col-md-6">
                <label htmlFor="cardNumber" className="form-label">
                  Credit / Debit card number*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={billingInfo.cardNumber}
                  onChange={handleBillingChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="expiryDate" className="form-label">
                  Expiry Date*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="01/2099"
                  value={billingInfo.expiryDate}
                  onChange={handleBillingChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="cvv" className="form-label">
                  CVV*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  value={billingInfo.cvv}
                  onChange={handleBillingChange}
                  required
                />
              </div>
            </div>

            <hr className="my-4" />

            <div className="d-grid gap-2">
              <button className="btn btn-primary btn-lg" type="submit">
                Continue to Checkout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
