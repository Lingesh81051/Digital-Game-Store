// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Discover from './components/Discover';
import News from './components/News';
import NewsDetail from './components/NewsDetail';
import Library from './components/Library';
import Wishlist from './components/Wishlist';
import Categories from './components/Categories';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Login from './components/Login';
import Signup from './components/Signup';
import Checkout from './components/Checkout';
import ResetPassword from './components/ResetPassword';
import ViewProfile from './components/ViewProfile';
import AboutUs from './components/AboutUs'; // About Us component
import TermsOfService from './components/TermsOfService'; // Terms of Service component
import PrivacyPolicy from './components/PrivacyPolicy'; // Privacy Policy component
import ContactUs from './components/ContactUs'; // Contact Us component

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageProducts from './components/admin/ManageProducts';
import EditProduct from './components/admin/EditProduct';
import AddProduct from './components/admin/AddProduct';
import ManageOrder from './components/admin/ManageOrder';
import ManageUser from './components/admin/ManageUser';
import EditUser from './components/admin/EditUser';
import UserDetails from './components/admin/UserDetails';

import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/library" element={<Library />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<ViewProfile />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          {/* New Contact Us Route */}
          <Route path="/contact" element={<ContactUs />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="orders" element={<ManageOrder />} />
            <Route path="users" element={<ManageUser />} />
            <Route path="users/edit/:id" element={<EditUser />} />
            <Route path="users/details/:id" element={<UserDetails />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
