
// import React, { useState } from 'react';

// const UserDashboard = () => {
//   const [activeSection, setActiveSection] = useState('overview');

//   // Mock data for demonstration
//   const userProfile = {
//     name: "Alitiru Fiona Aladina",
//     email: "phionaaladina@gmail.com",
//     phone: "+256 773874765",
//     address: "Plot 19 Bukoto Street Women In Technology Uganda\nKamwokya, Kampala Region"
//   };

//   const orders = [
//     { 
//       id: "12345", 
//       date: "2024-01-15", 
//       total: 75000, 
//       payment_method: "mobile money", 
//       status: "delivered" 
//     },
//     { 
//       id: "12346", 
//       date: "2024-01-10", 
//       total: 120000, 
//       payment_method: "card", 
//       status: "processing" 
//     }
//   ];

//   const formatCurrency = (amount) => `UGX ${amount.toLocaleString()}`;
//   const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-UG');

//   const navigationItems = [
//     { id: 'overview', icon: '👤', label: 'My Jumia Account', active: activeSection === 'overview' },
//     { id: 'orders', icon: '📦', label: 'Orders' },
//     { id: 'inbox', icon: '📧', label: 'Inbox' },
//     { id: 'reviews', icon: '⭐', label: 'Pending Reviews' },
//     { id: 'vouchers', icon: '🎫', label: 'Vouchers' },
//     { id: 'wishlist', icon: '❤️', label: 'Saved Items' },
//     { id: 'recently-viewed', icon: '👁️', label: 'Recently Viewed' },
//     { id: 'account-management', icon: '⚙️', label: 'Account Management' }
//   ];

//   return (
//     <div className="dashboard-container">
//       <style jsx>{`
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }

//         .dashboard-container {
//           min-height: 100vh;
//           background-color: #f1f3f4;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//         }

//         .dashboard-header {
//           background: white;
//           border-bottom: 1px solid #e0e0e0;
//           padding: 1rem 0;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.05);
//         }

//         .header-content {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 0 1rem;
//           display: flex;
//           align-items: center;
//           gap: 2rem;
//         }

//         .brand-logo {
//           font-size: 1.8rem;
//           font-weight: bold;
//           color: #f68b1e;
//           text-decoration: none;
//         }

//         .search-bar {
//           flex: 1;
//           max-width: 600px;
//           position: relative;
//         }

//         .search-input {
//           width: 100%;
//           padding: 0.75rem 1rem;
//           border: 2px solid #e0e0e0;
//           border-radius: 4px;
//           font-size: 0.95rem;
//           outline: none;
//         }

//         .search-input:focus {
//           border-color: #f68b1e;
//         }

//         .search-btn {
//           position: absolute;
//           right: 0;
//           top: 0;
//           height: 100%;
//           background: #f68b1e;
//           border: none;
//           padding: 0 1.5rem;
//           color: white;
//           font-weight: 600;
//           cursor: pointer;
//           border-radius: 0 4px 4px 0;
//         }

//         .user-greeting {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           color: #333;
//           font-size: 0.95rem;
//         }

//         .cart-icon {
//           background: none;
//           border: none;
//           font-size: 1.2rem;
//           cursor: pointer;
//           color: #333;
//         }

//         .dashboard-main {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 2rem 1rem;
//           display: grid;
//           grid-template-columns: 320px 1fr;
//           gap: 2rem;
//           align-items: start;
//         }

//         .sidebar {
//           background: white;
//           border-radius: 8px;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.08);
//           overflow: hidden;
//           position: sticky;
//           top: 2rem;
//         }

//         .nav-list {
//           list-style: none;
//           margin: 0;
//           padding: 0;
//         }

//         .nav-item {
//           border-bottom: 1px solid #f5f5f5;
//         }

//         .nav-item:last-child {
//           border-bottom: none;
//         }

//         .nav-link {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           padding: 1.25rem 1.5rem;
//           color: #666;
//           text-decoration: none;
//           transition: all 0.2s ease;
//           font-size: 0.95rem;
//           font-weight: 500;
//           border: none;
//           background: none;
//           width: 100%;
//           text-align: left;
//           cursor: pointer;
//         }

//         .nav-link:hover {
//           background-color: #f8f9fa;
//           color: #f68b1e;
//         }

//         .nav-link.active {
//           background-color: #fff5f0;
//           color: #f68b1e;
//           border-right: 4px solid #f68b1e;
//           font-weight: 600;
//         }

//         .nav-icon {
//           font-size: 1.1rem;
//           width: 24px;
//           text-align: center;
//         }

//         .main-content {
//           background: white;
//           border-radius: 8px;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.08);
//           overflow: hidden;
//         }

//         .content-header {
//           background: #f8f9fa;
//           padding: 2rem;
//           border-bottom: 1px solid #e0e0e0;
//         }

//         .content-title {
//           font-size: 1.75rem;
//           font-weight: 600;
//           color: #333;
//           margin: 0;
//         }

//         .content-body {
//           padding: 2rem;
//         }

//         .overview-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//           gap: 1.5rem;
//           margin-bottom: 2.5rem;
//         }

//         .info-card {
//           background: #fafafa;
//           border: 1px solid #e0e0e0;
//           border-radius: 8px;
//           overflow: hidden;
//         }

//         .card-header {
//           background: white;
//           padding: 1rem 1.5rem;
//           border-bottom: 1px solid #e0e0e0;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .card-title {
//           font-size: 0.85rem;
//           font-weight: 700;
//           color: #666;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           margin: 0;
//         }

//         .edit-button {
//           background: none;
//           border: none;
//           color: #f68b1e;
//           cursor: pointer;
//           font-size: 1.1rem;
//           padding: 0.25rem;
//           border-radius: 4px;
//           transition: background-color 0.2s ease;
//         }

//         .edit-button:hover {
//           background-color: #f0f0f0;
//         }

//         .card-body {
//           padding: 1.5rem;
//         }

//         .user-info {
//           line-height: 1.6;
//         }

//         .user-name {
//           font-size: 1.1rem;
//           font-weight: 600;
//           color: #333;
//           margin-bottom: 0.5rem;
//         }

//         .user-detail {
//           color: #666;
//           font-size: 0.95rem;
//           margin-bottom: 0.25rem;
//         }

//         .address-text {
//           color: #666;
//           font-size: 0.95rem;
//           line-height: 1.5;
//           margin: 0;
//           white-space: pre-line;
//         }

//         .credit-info {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//         }

//         .credit-icon {
//           background: #f68b1e;
//           color: white;
//           width: 40px;
//           height: 40px;
//           border-radius: 6px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: bold;
//           font-size: 1rem;
//         }

//         .credit-text {
//           margin: 0;
//           color: #333;
//           font-size: 0.95rem;
//         }

//         .newsletter-text {
//           color: #666;
//           font-size: 0.95rem;
//           line-height: 1.5;
//           margin-bottom: 1rem;
//         }

//         .newsletter-link {
//           color: #f68b1e;
//           text-decoration: none;
//           font-size: 0.95rem;
//           font-weight: 500;
//         }

//         .newsletter-link:hover {
//           text-decoration: underline;
//         }

//         .orders-section {
//           margin-top: 2rem;
//         }

//         .section-title {
//           font-size: 1.3rem;
//           font-weight: 600;
//           color: #333;
//           margin-bottom: 1.5rem;
//         }

//         .orders-table {
//           width: 100%;
//           border-collapse: collapse;
//           border: 1px solid #e0e0e0;
//           border-radius: 8px;
//           overflow: hidden;
//         }

//         .orders-table th {
//           background: #f8f9fa;
//           padding: 1rem 1.25rem;
//           text-align: left;
//           font-weight: 600;
//           color: #666;
//           font-size: 0.85rem;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           border-bottom: 1px solid #e0e0e0;
//         }

//         .orders-table td {
//           padding: 1rem 1.25rem;
//           border-bottom: 1px solid #f0f0f0;
//           font-size: 0.95rem;
//           color: #333;
//         }

//         .orders-table tr:last-child td {
//           border-bottom: none;
//         }

//         .orders-table tr:hover {
//           background-color: #f8f9fa;
//         }

//         .order-id {
//           font-weight: 600;
//           color: #333;
//         }

//         .status-badge {
//           padding: 0.375rem 0.75rem;
//           border-radius: 20px;
//           font-size: 0.8rem;
//           font-weight: 600;
//           text-transform: capitalize;
//           display: inline-block;
//         }

//         .status-pending { 
//           background: #fff3cd; 
//           color: #856404; 
//           border: 1px solid #ffeaa7;
//         }
//         .status-confirmed { 
//           background: #d4edda; 
//           color: #155724;
//           border: 1px solid #c3e6cb;
//         }
//         .status-processing { 
//           background: #cce7ff; 
//           color: #004085;
//           border: 1px solid #a6d5fa;
//         }
//         .status-shipped { 
//           background: #e7f3ff; 
//           color: #0056b3;
//           border: 1px solid #bee5eb;
//         }
//         .status-delivered { 
//           background: #d4edda; 
//           color: #155724;
//           border: 1px solid #c3e6cb;
//         }
//         .status-cancelled { 
//           background: #f8d7da; 
//           color: #721c24;
//           border: 1px solid #f5c6cb;
//         }

//         .view-button {
//           background: none;
//           border: 2px solid #f68b1e;
//           color: #f68b1e;
//           padding: 0.5rem 1rem;
//           border-radius: 4px;
//           cursor: pointer;
//           font-size: 0.85rem;
//           font-weight: 600;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           transition: all 0.2s ease;
//         }

//         .view-button:hover {
//           background: #f68b1e;
//           color: white;
//         }

//         .empty-state {
//           text-align: center;
//           padding: 3rem 2rem;
//           color: #666;
//         }

//         .empty-icon {
//           font-size: 4rem;
//           margin-bottom: 1rem;
//           opacity: 0.5;
//         }

//         .empty-text {
//           font-size: 1.1rem;
//           margin-bottom: 1rem;
//           color: #666;
//         }

//         .shop-link {
//           color: #f68b1e;
//           text-decoration: none;
//           font-weight: 600;
//         }

//         .shop-link:hover {
//           text-decoration: underline;
//         }

//         .loading-state {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           height: 60vh;
//           gap: 1.5rem;
//         }

//         .spinner {
//           width: 50px;
//           height: 50px;
//           border: 4px solid #f3f3f3;
//           border-top: 4px solid #f68b1e;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         .loading-text {
//           color: #666;
//           font-size: 1.1rem;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         .alert {
//           padding: 1rem 1.5rem;
//           border-radius: 6px;
//           margin-bottom: 1.5rem;
//           font-size: 0.95rem;
//           position: relative;
//         }

//         .alert-success {
//           background: #d4edda;
//           border: 1px solid #c3e6cb;
//           color: #155724;
//         }

//         .alert-error {
//           background: #f8d7da;
//           border: 1px solid #f5c6cb;
//           color: #721c24;
//         }

//         .alert-close {
//           position: absolute;
//           right: 1rem;
//           top: 50%;
//           transform: translateY(-50%);
//           background: none;
//           border: none;
//           font-size: 1.5rem;
//           cursor: pointer;
//           color: inherit;
//           opacity: 0.7;
//         }

//         .alert-close:hover {
//           opacity: 1;
//         }

//         /* Responsive Design */
//         @media (max-width: 992px) {
//           .dashboard-main {
//             grid-template-columns: 1fr;
//             gap: 1.5rem;
//             padding: 1.5rem 1rem;
//           }

//           .sidebar {
//             position: static;
//             order: 2;
//           }

//           .main-content {
//             order: 1;
//           }

//           .nav-list {
//             display: grid;
//             grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//             gap: 1px;
//             background: #e0e0e0;
//           }

//           .nav-item {
//             border-bottom: none;
//             background: white;
//           }
//         }

//         @media (max-width: 768px) {
//           .header-content {
//             flex-direction: column;
//             gap: 1rem;
//           }

//           .search-bar {
//             order: 2;
//             max-width: 100%;
//           }

//           .user-greeting {
//             order: 3;
//             align-self: flex-end;
//           }

//           .overview-grid {
//             grid-template-columns: 1fr;
//             gap: 1rem;
//           }

//           .content-body {
//             padding: 1rem;
//           }

//           .content-header {
//             padding: 1.5rem 1rem;
//           }

//           .orders-table {
//             font-size: 0.85rem;
//           }

//           .orders-table th,
//           .orders-table td {
//             padding: 0.75rem 0.5rem;
//           }

//           .nav-list {
//             grid-template-columns: 1fr;
//           }
//         }

//         @media (max-width: 576px) {
//           .dashboard-main {
//             padding: 1rem 0.5rem;
//           }

//           .orders-table {
//             display: block;
//             overflow-x: auto;
//             white-space: nowrap;
//           }

//           .view-button {
//             padding: 0.375rem 0.75rem;
//             font-size: 0.8rem;
//           }
//         }
//       `}</style>

//       {/* Header */}
//       <header className="dashboard-header">
//         <div className="header-content">
//           <a href="/" className="brand-logo">JUMIA</a>
          
//           <div className="search-bar">
//             <input 
//               type="text" 
//               className="search-input" 
//               placeholder="Search products, brands and categories"
//             />
//             <button className="search-btn">Search</button>
//           </div>

//           <div className="user-greeting">
//             <span>Hi, {userProfile.name.split(' ')[0]}</span>
//             <button className="cart-icon">🛒</button>
//           </div>
//         </div>
//       </header>

//       {/* Main Dashboard */}
//       <main className="dashboard-main">
//         {/* Sidebar Navigation */}
//         <nav className="sidebar">
//           <ul className="nav-list">
//             {navigationItems.map((item) => (
//               <li key={item.id} className="nav-item">
//                 <button
//                   className={`nav-link ${item.active ? 'active' : ''}`}
//                   onClick={() => setActiveSection(item.id)}
//                 >
//                   <span className="nav-icon">{item.icon}</span>
//                   <span>{item.label}</span>
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* Main Content */}
//         <div className="main-content">
//           <div className="content-header">
//             <h1 className="content-title">Account Overview</h1>
//           </div>

//           <div className="content-body">
//             {/* Account Overview Grid */}
//             <div className="overview-grid">
//               {/* Account Details */}
//               <div className="info-card">
//                 <div className="card-header">
//                   <h3 className="card-title">Account Details</h3>
//                   <button className="edit-button" title="Edit account details">
//                     ✏️
//                   </button>
//                 </div>
//                 <div className="card-body">
//                   <div className="user-info">
//                     <div className="user-name">{userProfile.name}</div>
//                     <div className="user-detail">{userProfile.email}</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Address Book */}
//               <div className="info-card">
//                 <div className="card-header">
//                   <h3 className="card-title">Address Book</h3>
//                   <button className="edit-button" title="Edit address">
//                     ✏️
//                   </button>
//                 </div>
//                 <div className="card-body">
//                   <p className="address-text">
//                     <strong>Your default shipping address:</strong>
//                     <br />
//                     {userProfile.name}
//                     <br />
//                     {userProfile.address}
//                     <br />
//                     {userProfile.phone}
//                   </p>
//                 </div>
//               </div>

//               {/* Store Credit */}
//               <div className="info-card">
//                 <div className="card-header">
//                   <h3 className="card-title">Jumia Store Credit</h3>
//                 </div>
//                 <div className="card-body">
//                   <div className="credit-info">
//                     <div className="credit-icon">₹</div>
//                     <p className="credit-text">
//                       <strong>Jumia store credit balance: UGX 0</strong>
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Newsletter Preferences */}
//               <div className="info-card">
//                 <div className="card-header">
//                   <h3 className="card-title">Newsletter Preferences</h3>
//                 </div>
//                 <div className="card-body">
//                   <p className="newsletter-text">
//                     Manage your email communications to stay updated with the latest news and offers.
//                   </p>
//                   <a href="#" className="newsletter-link">
//                     Edit Newsletter preferences
//                   </a>
//                 </div>
//               </div>
//             </div>

//             {/* Recent Orders Section */}
//             <div className="orders-section">
//               <h2 className="section-title">Recent Orders</h2>
              
//               {orders.length === 0 ? (
//                 <div className="empty-state">
//                   <div className="empty-icon">📦</div>
//                   <p className="empty-text">You haven't placed any orders yet.</p>
//                   <a href="/products" className="shop-link">Start Shopping</a>
//                 </div>
//               ) : (
//                 <table className="orders-table">
//                   <thead>
//                     <tr>
//                       <th>Order ID</th>
//                       <th>Date</th>
//                       <th>Total</th>
//                       <th>Payment Method</th>
//                       <th>Status</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.map((order) => (
//                       <tr key={order.id}>
//                         <td>
//                           <span className="order-id">#{order.id}</span>
//                         </td>
//                         <td>{formatDate(order.date)}</td>
//                         <td>
//                           <strong>{formatCurrency(order.total)}</strong>
//                         </td>
//                         <td style={{ textTransform: 'capitalize' }}>
//                           {order.payment_method}
//                         </td>
//                         <td>
//                           <span className={`status-badge status-${order.status}`}>
//                             {order.status}
//                           </span>
//                         </td>
//                         <td>
//                           <button 
//                             className="view-button"
//                             onClick={() => console.log(`View order ${order.id}`)}
//                           >
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default UserDashboard;

// // ===================================
// // USER DASHBOARD COMPONENT
// // Modern React component with clean architecture
// // ===================================

// import React, { useContext, useState, useEffect, useCallback, useMemo } from "react";
// import { CartContext } from "../context/CartContext";
// import { Link, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";
// import "../styles/UserDashboard.css";

// // ===================================
// // CONSTANTS & CONFIGURATION
// // ===================================

// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

// const ENDPOINTS = {
//   ORDERS: `${API_BASE_URL}/orders/`,
//   PROFILE_UPDATE: `${API_BASE_URL}/auth/profile/update`,
//   PASSWORD_CHANGE: `${API_BASE_URL}/auth/profile/change_password`,
//   PROFILE_PICTURE: `${API_BASE_URL}/auth/profile/picture`,
// };

// const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// const ORDER_STATUS_COLORS = {
//   pending: "warning",
//   confirmed: "success",
//   processing: "info",
//   shipped: "primary",
//   delivered: "success",
//   cancelled: "danger",
// };

// // ===================================
// // CUSTOM HOOKS
// // ===================================

// /**
//  * Custom hook for managing form state
//  */
// const useFormState = (initialState) => {
//   const [formData, setFormData] = useState(initialState);

//   const updateField = useCallback((field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   }, []);

//   const resetForm = useCallback(() => {
//     setFormData(initialState);
//   }, [initialState]);

//   const handleInputChange = useCallback((e) => {
//     const { name, value } = e.target;
//     updateField(name, value);
//   }, [updateField]);

//   return {
//     formData,
//     updateField,
//     resetForm,
//     handleInputChange,
//     setFormData,
//   };
// };

// /**
//  * Custom hook for API calls with loading and error states
//  */
// const useApiCall = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const clearMessages = useCallback(() => {
//     setError("");
//     setSuccess("");
//   }, []);

//   const makeApiCall = useCallback(async (apiCall, successMessage = "") => {
//     setLoading(true);
//     clearMessages();

//     try {
//       const result = await apiCall();
//       if (successMessage) {
//         setSuccess(successMessage);
//       }
//       return result;
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           "An unexpected error occurred";
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [clearMessages]);

//   return {
//     loading,
//     error,
//     success,
//     makeApiCall,
//     clearMessages,
//     setError,
//     setSuccess,
//   };
// };

// // ===================================
// // UTILITY FUNCTIONS
// // ===================================

// /**
//  * Format currency amount to UGX
//  */
// const formatCurrency = (amount) => {
//   const numericAmount = parseFloat(amount || 0);
//   return `UGX ${numericAmount.toLocaleString('en-UG', {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   })}`;
// };

// /**
//  * Format date to local format
//  */
// const formatDate = (dateString) => {
//   if (!dateString) return "-";
//   return new Date(dateString).toLocaleDateString('en-UG', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });
// };

// /**
//  * Get authentication headers
//  */
// const getAuthHeaders = () => {
//   const token = sessionStorage.getItem("token");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// /**
//  * Validate file upload
//  */
// const validateFile = (file) => {
//   if (!file) return "Please select a file.";
  
//   if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
//     return "Invalid file type. Upload JPG, PNG, or WebP.";
//   }
  
//   if (file.size > MAX_FILE_SIZE) {
//     return "File too large. Maximum size is 5MB.";
//   }
  
//   return null;
// };

// /**
//  * Parse user data from JWT token
//  */
// const parseUserFromToken = (token) => {
//   try {
//     const decoded = jwtDecode(token);
//     return {
//       id: decoded.sub || decoded.user_id,
//       name: decoded.name || 
//             `${decoded.first_name || ""} ${decoded.last_name || ""}`.trim() || 
//             "User",
//       email: decoded.email || "",
//       phone: decoded.contact || "",
//       profile_picture_url: decoded.profile_picture_url || "",
//       first_name: decoded.first_name || "",
//       last_name: decoded.last_name || "",
//     };
//   } catch (error) {
//     throw new Error("Invalid token format");
//   }
// };

// // ===================================
// // COMPONENT SECTIONS
// // ===================================

// /**
//  * Loading Spinner Component
//  */
// const LoadingSpinner = ({ message = "Loading dashboard..." }) => (
//   <div className="loading-container">
//     <div className="spinner-border text-primary" role="status">
//       <span className="visually-hidden">Loading...</span>
//     </div>
//     <p>{message}</p>
//   </div>
// );

// /**
//  * Alert Message Component
//  */
// const AlertMessage = ({ type, message, onDismiss }) => {
//   if (!message) return null;
  
//   return (
//     <div className={`alert alert-${type} alert-dismissible`} role="alert">
//       {message}
//       {onDismiss && (
//         <button
//           type="button"
//           className="btn-close"
//           onClick={onDismiss}
//           aria-label="Close"
//         />
//       )}
//     </div>
//   );
// };

// /**
//  * Profile Overview Card
//  */
// const ProfileOverview = ({ userProfile }) => (
//   <div className="card shadow-sm">
//     <div className="card-header bg-primary text-white">
//       <i className="bi bi-person-circle me-2"></i>
//       Profile Overview
//     </div>
//     <div className="card-body text-center profile-info">
//       <img
//         src={userProfile.profile_picture_url || "https://via.placeholder.com/100?text=Profile"}
//         alt={`${userProfile.name}'s profile`}
//         className="profile-image mb-3"
//         onError={(e) => {
//           e.target.src = "https://via.placeholder.com/100?text=Profile";
//         }}
//       />
//       <h6>{userProfile.name}</h6>
//       <p className="text-muted">
//         <i className="bi bi-envelope me-1"></i>
//         {userProfile.email}
//       </p>
//       {userProfile.phone && (
//         <p className="text-muted">
//           <i className="bi bi-telephone me-1"></i>
//           {userProfile.phone}
//         </p>
//       )}
//     </div>
//   </div>
// );

// /**
//  * Order History Table
//  */
// const OrderHistory = ({ orders, loading }) => (
//   <div className="card shadow-sm">
//     <div className="card-header bg-light">
//       <i className="bi bi-bag-check me-2"></i>
//       Order History
//     </div>
//     <div className="card-body">
//       {loading ? (
//         <LoadingSpinner message="Loading orders..." />
//       ) : orders.length === 0 ? (
//         <div className="empty-state">
//           <i className="bi bi-bag-x display-4 text-muted mb-3"></i>
//           <p className="text-muted">
//             No orders yet. <Link to="/products">Start shopping!</Link>
//           </p>
//         </div>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-hover align-middle">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Date</th>
//                 <th>Total</th>
//                 <th>Payment</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.id}>
//                   <td>
//                     <strong>#{order.id}</strong>
//                   </td>
//                   <td>{formatDate(order.created_at)}</td>
//                   <td>
//                     <strong>{formatCurrency(order.total)}</strong>
//                   </td>
//                   <td>
//                     <span className="text-capitalize">
//                       {order.payment_method || "N/A"}
//                     </span>
//                   </td>
//                   <td>
//                     <span className={`badge bg-${ORDER_STATUS_COLORS[order.status] || 'secondary'}`}>
//                       {order.status || "Unknown"}
//                     </span>
//                   </td>
//                   <td>
//                     <Link 
//                       to={`/orders/${order.id}`}
//                       className="btn btn-sm btn-outline-primary"
//                       title="View Order Details"
//                     >
//                       <i className="bi bi-eye"></i>
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   </div>
// );

// /**
//  * Profile Update Form
//  */
// const ProfileUpdateForm = ({ 
//   profileForm, 
//   onInputChange, 
//   onSubmit, 
//   loading 
// }) => (
//   <div className="card shadow-sm">
//     <div className="card-header bg-light">
//       <i className="bi bi-person-gear me-2"></i>
//       Update Profile
//     </div>
//     <div className="card-body">
//       <form onSubmit={onSubmit}>
//         <div className="row g-3">
//           <div className="col-md-6">
//             <label htmlFor="first_name" className="form-label">First Name</label>
//             <input
//               id="first_name"
//               className="form-control"
//               name="first_name"
//               value={profileForm.first_name}
//               onChange={onInputChange}
//               placeholder="Enter first name"
//               required
//             />
//           </div>
//           <div className="col-md-6">
//             <label htmlFor="last_name" className="form-label">Last Name</label>
//             <input
//               id="last_name"
//               className="form-control"
//               name="last_name"
//               value={profileForm.last_name}
//               onChange={onInputChange}
//               placeholder="Enter last name"
//               required
//             />
//           </div>
//           <div className="col-12">
//             <label htmlFor="email" className="form-label">Email</label>
//             <input
//               id="email"
//               className="form-control"
//               type="email"
//               name="email"
//               value={profileForm.email}
//               onChange={onInputChange}
//               placeholder="Enter email address"
//               required
//             />
//           </div>
//           <div className="col-12">
//             <label htmlFor="contact" className="form-label">Phone Number</label>
//             <input
//               id="contact"
//               className="form-control"
//               name="contact"
//               value={profileForm.contact}
//               onChange={onInputChange}
//               placeholder="Enter phone number"
//             />
//           </div>
//           <div className="col-12">
//             <button 
//               type="submit" 
//               className="btn btn-primary w-100"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" />
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-check-circle me-2"></i>
//                   Update Profile
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   </div>
// );

// /**
//  * Password Change Form
//  */
// const PasswordChangeForm = ({ 
//   passwordForm, 
//   onInputChange, 
//   onSubmit, 
//   loading 
// }) => (
//   <div className="card shadow-sm">
//     <div className="card-header bg-light">
//       <i className="bi bi-shield-lock me-2"></i>
//       Change Password
//     </div>
//     <div className="card-body">
//       <form onSubmit={onSubmit}>
//         <div className="mb-3">
//           <label htmlFor="current_password" className="form-label">Current Password</label>
//           <input
//             id="current_password"
//             className="form-control"
//             type="password"
//             name="current_password"
//             value={passwordForm.current_password}
//             onChange={onInputChange}
//             placeholder="Enter current password"
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="new_password" className="form-label">New Password</label>
//           <input
//             id="new_password"
//             className="form-control"
//             type="password"
//             name="new_password"
//             value={passwordForm.new_password}
//             onChange={onInputChange}
//             placeholder="Enter new password"
//             minLength="6"
//             required
//           />
//           <div className="form-text">
//             Password must be at least 6 characters long.
//           </div>
//         </div>
//         <button 
//           type="submit" 
//           className="btn btn-primary w-100"
//           disabled={loading}
//         >
//           {loading ? (
//             <>
//               <span className="spinner-border spinner-border-sm me-2" />
//               Changing...
//             </>
//           ) : (
//             <>
//               <i className="bi bi-shield-check me-2"></i>
//               Change Password
//             </>
//           )}
//         </button>
//       </form>
//     </div>
//   </div>
// );

// /**
//  * Profile Picture Upload Form
//  */
// const ProfilePictureForm = ({ 
//   onFileChange, 
//   onSubmit, 
//   loading, 
//   selectedFile 
// }) => (
//   <div className="card shadow-sm">
//     <div className="card-header bg-light">
//       <i className="bi bi-image me-2"></i>
//       Profile Picture
//     </div>
//     <div className="card-body">
//       <form onSubmit={onSubmit}>
//         <div className="mb-3">
//           <label htmlFor="profile_picture" className="form-label">
//             Choose Profile Picture
//           </label>
//           <input
//             id="profile_picture"
//             type="file"
//             className="form-control"
//             accept="image/*"
//             onChange={onFileChange}
//           />
//           <div className="form-text">
//             Supported formats: JPG, PNG, WebP. Maximum size: 5MB.
//           </div>
//         </div>
//         <button
//           type="submit"
//           className="btn btn-primary"
//           disabled={!selectedFile || loading}
//         >
//           {loading ? (
//             <>
//               <span className="spinner-border spinner-border-sm me-2" />
//               Uploading...
//             </>
//           ) : (
//             <>
//               <i className="bi bi-cloud-upload me-2"></i>
//               Upload Picture
//             </>
//           )}
//         </button>
//       </form>
//     </div>
//   </div>
// );

// // ===================================
// // MAIN COMPONENT
// // ===================================

// const UserDashboard = () => {
//   // Context and Navigation
//   const { isAuthenticated, isLoading: contextLoading } = useContext(CartContext);
//   const navigate = useNavigate();

//   // State Management
//   const [userProfile, setUserProfile] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [profilePicture, setProfilePicture] = useState(null);

//   // Custom Hooks
//   const {
//     formData: profileForm,
//     handleInputChange: handleProfileChange,
//     setFormData: setProfileForm,
//   } = useFormState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     contact: "",
//   });

//   const {
//     formData: passwordForm,
//     handleInputChange: handlePasswordChange,
//     resetForm: resetPasswordForm,
//   } = useFormState({
//     current_password: "",
//     new_password: "",
//   });

//   const {
//     loading: apiLoading,
//     error,
//     success,
//     makeApiCall,
//     clearMessages,
//     setError,
//   } = useApiCall();

//   // ===================================
//   // API FUNCTIONS
//   // ===================================

//   const fetchUserData = useCallback(async () => {
//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       const userData = parseUserFromToken(token);
//       setUserProfile(userData);
//       setProfileForm({
//         first_name: userData.first_name,
//         last_name: userData.last_name,
//         email: userData.email,
//         contact: userData.phone,
//       });
//     } catch (error) {
//       console.error("Token parsing error:", error);
//       sessionStorage.removeItem("token");
//       navigate("/login");
//     }
//   }, [navigate, setProfileForm]);

//   const fetchOrders = useCallback(async () => {
//     const response = await axios.get(ENDPOINTS.ORDERS, {
//       headers: getAuthHeaders(),
//     });
//     return response.data.orders || [];
//   }, []);

//   // ===================================
//   // EVENT HANDLERS
//   // ===================================

//   const handleUpdateProfile = useCallback(async (e) => {
//     e.preventDefault();
    
//     await makeApiCall(async () => {
//       await axios.put(ENDPOINTS.PROFILE_UPDATE, profileForm, {
//         headers: getAuthHeaders(),
//       });
      
//       // Update user profile in state
//       setUserProfile(prev => ({
//         ...prev,
//         name: `${profileForm.first_name} ${profileForm.last_name}`.trim(),
//         email: profileForm.email,
//         phone: profileForm.contact,
//         first_name: profileForm.first_name,
//         last_name: profileForm.last_name,
//       }));
//     }, "Profile updated successfully!");
//   }, [profileForm, makeApiCall]);

//   const handleChangePassword = useCallback(async (e) => {
//     e.preventDefault();
    
//     await makeApiCall(async () => {
//       await axios.post(ENDPOINTS.PASSWORD_CHANGE, passwordForm, {
//         headers: getAuthHeaders(),
//       });
//       resetPasswordForm();
//     }, "Password changed successfully!");
//   }, [passwordForm, makeApiCall, resetPasswordForm]);

//   const handleProfilePicChange = useCallback((e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const error = validateFile(file);
//     if (error) {
//       setError(error);
//       return;
//     }

//     setProfilePicture(file);
//     clearMessages();
//   }, [setError, clearMessages]);

//   const handleUploadProfilePicture = useCallback(async (e) => {
//     e.preventDefault();
    
//     if (!profilePicture) {
//       setError("Please select a file.");
//       return;
//     }

//     await makeApiCall(async () => {
//       const formData = new FormData();
//       formData.append("profile_picture", profilePicture);
      
//       const response = await axios.post(ENDPOINTS.PROFILE_PICTURE, formData, {
//         headers: {
//           ...getAuthHeaders(),
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Update profile picture in state
//       setUserProfile(prev => ({
//         ...prev,
//         profile_picture_url: response.data.profile_pic_url,
//       }));
      
//       setProfilePicture(null);
//       // Reset file input
//       const fileInput = document.getElementById("profile_picture");
//       if (fileInput) fileInput.value = "";
      
//       return response.data;
//     }, "Profile picture updated successfully!");
//   }, [profilePicture, makeApiCall, setError]);

//   // ===================================
//   // EFFECTS
//   // ===================================

//   // Authentication and data fetching
//   useEffect(() => {
//     if (!isAuthenticated && !contextLoading) {
//       navigate("/login");
//       return;
//     }

//     if (!isAuthenticated || contextLoading) return;

//     const initializeDashboard = async () => {
//       setInitialLoading(true);
      
//       try {
//         await fetchUserData();
//         const ordersData = await fetchOrders();
//         setOrders(ordersData);
//       } catch (error) {
//         console.error("Dashboard initialization error:", error);
//         if (error.response?.status === 401) {
//           sessionStorage.removeItem("token");
//           navigate("/login");
//         }
//       } finally {
//         setInitialLoading(false);
//       }
//     };

//     initializeDashboard();
//   }, [isAuthenticated, contextLoading, navigate, fetchUserData, fetchOrders]);

//   // Auto-clear messages after 5 seconds
//   useEffect(() => {
//     if (error || success) {
//       const timer = setTimeout(clearMessages, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, success, clearMessages]);

//   // ===================================
//   // RENDER CONDITIONS
//   // ===================================

//   if (initialLoading || contextLoading || !userProfile) {
//     return (
//       <div className="container text-center mt-5">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   // ===================================
//   // MAIN RENDER
//   // ===================================

//   return (
//     <div className="container user-dashboard">
//       {/* Breadcrumb Navigation */}
//       <nav aria-label="breadcrumb">
//         <ol className="breadcrumb">
//           <li className="breadcrumb-item">
//             <Link to="/">
//               <i className="bi bi-house-door me-1"></i>
//               Home
//             </Link>
//           </li>
//           <li className="breadcrumb-item active" aria-current="page">
//             My Dashboard
//           </li>
//         </ol>
//       </nav>

//       {/* Welcome Header */}
//       <h2 className="welcome-header mb-4">
//         <i className="bi bi-person-circle me-2"></i>
//         Welcome back, {userProfile.name}!
//       </h2>

//       {/* Alert Messages */}
//       <AlertMessage 
//         type="danger" 
//         message={error} 
//         onDismiss={clearMessages} 
//       />
//       <AlertMessage 
//         type="success" 
//         message={success} 
//         onDismiss={clearMessages} 
//       />

//       {/* Dashboard Grid */}
//       <div className="row g-4">
//         {/* Profile Overview - Left Column */}
//         <div className="col-lg-4">
//           <ProfileOverview userProfile={userProfile} />
//         </div>

//         {/* Order History - Right Column */}
//         <div className="col-lg-8">
//           <OrderHistory 
//             orders={orders} 
//             loading={apiLoading} 
//           />
//         </div>

//         {/* Profile Update Form */}
//         <div className="col-lg-6">
//           <ProfileUpdateForm
//             profileForm={profileForm}
//             onInputChange={handleProfileChange}
//             onSubmit={handleUpdateProfile}
//             loading={apiLoading}
//           />
//         </div>

//         {/* Password Change Form */}
//         <div className="col-lg-6">
//           <PasswordChangeForm
//             passwordForm={passwordForm}
//             onInputChange={handlePasswordChange}
//             onSubmit={handleChangePassword}
//             loading={apiLoading}
//           />
//         </div>

//         {/* Profile Picture Upload */}
//         <div className="col-lg-12">
//           <ProfilePictureForm
//             onFileChange={handleProfilePicChange}
//             onSubmit={handleUploadProfilePicture}
//             loading={apiLoading}
//             selectedFile={profilePicture}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

// import React, { useContext, useState, useEffect } from 'react';
// import { CartContext } from '../context/CartContext';
// import { Link, useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios';
// import '../styles/UserDashboard.css'; // Import the CSS file

// const UserDashboard = () => {
//   const { isAuthenticated, isLoading: contextLoading, cart } = useContext(CartContext);
//   const navigate = useNavigate();
//   const [userProfile, setUserProfile] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [profileForm, setProfileForm] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     contact: ''
//   });
//   const [passwordForm, setPasswordForm] = useState({
//     current_password: '',
//     new_password: ''
//   });
//   const [profilePicture, setProfilePicture] = useState(null);

//   useEffect(() => {
//     if (!isAuthenticated && !contextLoading) {
//       navigate('/login');
//       return;
//     }

//     const fetchData = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const token = sessionStorage.getItem('token');
//         if (!token) {
//           setError('No authentication token found. Please log in again.');
//           navigate('/login');
//           return;
//         }

//         const decoded = jwtDecode(token);
//         const profile = {
//           id: decoded.sub || decoded.user_id,
//           name: decoded.name || `${decoded.first_name || ''} ${decoded.last_name || ''}`.trim(),
//           email: decoded.email || '',
//           phone: decoded.contact || '',
//           profile_picture_url: decoded.profile_picture_url || ''
//         };
//         setUserProfile(profile);
//         setProfileForm({
//           first_name: decoded.first_name || '',
//           last_name: decoded.last_name || '',
//           email: decoded.email || '',
//           contact: decoded.contact || ''
//         });

//         const response = await axios.get('http://localhost:5000/api/v1/orders/', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setOrders(response.data.orders || []);
//       } catch (err) {
//         console.error('Error fetching profile/orders:', err);
//         setError('Failed to load dashboard data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isAuthenticated || contextLoading) fetchData();
//   }, [isAuthenticated, contextLoading, navigate]);

//   const handleProfileInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileForm(prev => ({ ...prev, [name]: value }));
//     setError('');
//   };

//   const handlePasswordInputChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordForm(prev => ({ ...prev, [name]: value }));
//     setError('');
//   };

//   const handleProfilePictureChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//       const maxSize = 5 * 1024 * 1024;
//       if (!allowedTypes.includes(file.type)) {
//         setError('Please upload a valid image file (JPEG, PNG, or WebP)');
//         return;
//       }
//       if (file.size > maxSize) {
//         setError('File size must be less than 5MB');
//         return;
//       }
//       setProfilePicture(file);
//       setError('');
//     }
//   };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(profileForm.email)) {
//       setError('Please enter a valid email address.');
//       return;
//     }
//     if (!profileForm.contact || !/^\+?[\d\s-]{9,}$/.test(profileForm.contact)) {
//       setError('Please enter a valid phone number (at least 9 digits).');
//       return;
//     }

//     try {
//       const token = sessionStorage.getItem('token');
//       await axios.put(
//         'http://localhost:5000/api/v1/auth/profile/update',
//         profileForm,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSuccess('Profile updated successfully!');
//       setUserProfile({
//         ...userProfile,
//         name: `${profileForm.first_name} ${profileForm.last_name}`.trim(),
//         email: profileForm.email,
//         phone: profileForm.contact
//       });
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update profile.');
//     }
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!passwordForm.current_password || !passwordForm.new_password) {
//       setError('Both current and new passwords are required.');
//       return;
//     }
//     if (passwordForm.new_password.length < 8) {
//       setError('New password must be at least 8 characters long.');
//       return;
//     }

//     try {
//       const token = sessionStorage.getItem('token');
//       await axios.post(
//         'http://localhost:5000/api/v1/auth/profile/change_password',
//         passwordForm,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSuccess('Password changed successfully!');
//       setPasswordForm({ current_password: '', new_password: '' });
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to change password.');
//     }
//   };

//   const handleUploadProfilePicture = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!profilePicture) {
//       setError('Please select a profile picture.');
//       return;
//     }

//     try {
//       const token = sessionStorage.getItem('token');
//       const formData = new FormData();
//       formData.append('profile_picture', profilePicture);
//       const response = await axios.post(
//         'http://localhost:5000/api/v1/auth/profile/picture',
//         formData,
//         { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
//       );
//       setSuccess('Profile picture uploaded successfully!');
//       setUserProfile({ ...userProfile, profile_picture_url: response.data.profile_pic_url });
//       setProfilePicture(null);
//       document.getElementById('profilePicture').value = '';
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to upload profile picture.');
//     }
//   };

//   const formatCurrency = (amount) => {
//     return `UGX ${parseFloat(amount || 0).toLocaleString()}`;
//   };

//   const calculateCartTotal = () => {
//     return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   if (loading || contextLoading || !userProfile) {
//     return (
//       <div className="container mt-5 text-center">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="mt-2">Loading your dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-4">
//       <nav aria-label="breadcrumb">
//         <ol className="breadcrumb">
//           <li className="breadcrumb-item">
//             <Link to="/">Home</Link>
//           </li>
//           <li className="breadcrumb-item active" aria-current="page">My Dashboard</li>
//         </ol>
//       </nav>

//       <h2 className="mb-4">
//         <i className="bi bi-person-circle me-2"></i>
//         Welcome, {userProfile.name || 'User'}
//       </h2>

//       {error && (
//         <div className="alert alert-danger alert-dismissible fade show" role="alert">
//           <i className="bi bi-exclamation-triangle me-2"></i>
//           {error}
//           <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
//         </div>
//       )}
//       {success && (
//         <div className="alert alert-success alert-dismissible fade show" role="alert">
//           <i className="bi bi-check-circle me-2"></i>
//           {success}
//           <button type="button" className="btn-close" onClick={() => setSuccess('')} aria-label="Close"></button>
//         </div>
//       )}

//       <div className="dashboard-grid">
//         {/* Profile Overview */}
//         <div className="card h-100 shadow-sm border-0">
//           <div className="card-header bg-primary text-white">
//             <h5 className="mb-0">Profile Overview</h5>
//           </div>
//           <div className="card-body text-center p-4">
//             <img
//               src={userProfile.profile_picture_url || 'https://via.placeholder.com/100?text=Profile'}
//               alt="Profile"
//               className="rounded-circle mb-3"
//               style={{ width: '100px', height: '100px', objectFit: 'cover' }}
//               onError={(e) => (e.target.src = 'https://via.placeholder.com/100?text=Profile')}
//             />
//             <h6 className="mb-1">{userProfile.name || 'N/A'}</h6>
//             <p className="text-muted mb-1">{userProfile.email || 'N/A'}</p>
//             <p className="text-muted mb-0">{userProfile.phone || 'N/A'}</p>
//           </div>
//         </div>

//         {/* Cart Summary */}
//         <div className="card h-100 shadow-sm border-0">
//           <div className="card-header bg-light">
//             <h5 className="mb-0">Your Cart</h5>
//           </div>
//           <div className="card-body p-4">
//             {cart.length === 0 ? (
//               <p className="text-muted text-center">Your cart is empty. <Link to="/products" className="text-primary">Start shopping!</Link></p>
//             ) : (
//               <>
//                 <ul className="list-group list-group-flush mb-3">
//                   {cart.map((item, index) => (
//                     <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
//                       <span>{item.name} (x{item.quantity})</span>
//                       <span>{formatCurrency(item.price * item.quantity)}</span>
//                     </li>
//                   ))}
//                 </ul>
//                 <p className="text-end fw-bold">Total: {formatCurrency(calculateCartTotal())}</p>
//                 <div className="text-center mt-3">
//                   <Link to="/cart" className="btn btn-primary">View Cart</Link>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Order History */}
//         <div className="card h-100 shadow-sm border-0">
//           <div className="card-header bg-light">
//             <h5 className="mb-0">Order History</h5>
//           </div>
//           <div className="card-body p-4">
//             {orders.length === 0 ? (
//               <p className="text-muted text-center">No orders yet. <Link to="/products" className="text-primary">Start shopping!</Link></p>
//             ) : (
//               <div className="table-responsive">
//                 <table className="table table-hover align-middle">
//                   <thead>
//                     <tr>
//                       <th>Order ID</th>
//                       <th>Date</th>
//                       <th>Total</th>
//                       <th>Payment Method</th>
//                       <th>Status</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.map(order => (
//                       <tr key={order.id}>
//                         <td>#{order.id}</td>
//                         <td>{new Date(order.created_at).toLocaleDateString()}</td>
//                         <td>{formatCurrency(order.total)}</td>
//                         <td>{order.payment_method.toUpperCase()}</td>
//                         <td>
//                           <span className={`badge bg-${order.status === 'pending' ? 'warning' : order.status === 'confirmed' ? 'success' : 'info'}`}>
//                             {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                           </span>
//                         </td>
//                         <td>
//                           <button
//                             className="btn btn-outline-primary btn-sm"
//                             onClick={() => alert(`Order Details: ${JSON.stringify(order.cart, null, 2)}`)}
//                           >
//                             View Details
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Update Profile */}
//         <div className="card h-100 shadow-sm border-0">
//           <div className="card-header bg-light">
//             <h5 className="mb-0">Update Profile</h5>
//           </div>
//           <div className="card-body p-4">
//             <form onSubmit={handleUpdateProfile}>
//               <div className="row g-3">
//                 <div className="col-md-6">
//                   <label htmlFor="first_name" className="form-label">First Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="first_name"
//                     name="first_name"
//                     value={profileForm.first_name}
//                     onChange={handleProfileInputChange}
//                     disabled={loading}
//                     required
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <label htmlFor="last_name" className="form-label">Last Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="last_name"
//                     name="last_name"
//                     value={profileForm.last_name}
//                     onChange={handleProfileInputChange}
//                     disabled={loading}
//                     required
//                   />
//                 </div>
//                 <div className="col-12">
//                   <label htmlFor="email" className="form-label">Email</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     id="email"
//                     name="email"
//                     value={profileForm.email}
//                     onChange={handleProfileInputChange}
//                     disabled={loading}
//                     required
//                   />
//                 </div>
//                 <div className="col-12">
//                   <label htmlFor="contact" className="form-label">Phone Number</label>
//                   <input
//                     type="tel"
//                     className="form-control"
//                     id="contact"
//                     name="contact"
//                     value={profileForm.contact}
//                     onChange={handleProfileInputChange}
//                     disabled={loading}
//                     required
//                   />
//                 </div>
//               </div>
//               <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
//                 Update Profile
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Change Password */}
//         <div className="card h-100 shadow-sm border-0">
//           <div className="card-header bg-light">
//             <h5 className="mb-0">Change Password</h5>
//           </div>
//           <div className="card-body p-4">
//             <form onSubmit={handleChangePassword}>
//               <div className="mb-3">
//                 <label htmlFor="current_password" className="form-label">Current Password</label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   id="current_password"
//                   name="current_password"
//                   value={passwordForm.current_password}
//                   onChange={handlePasswordInputChange}
//                   disabled={loading}
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="new_password" className="form-label">New Password</label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   id="new_password"
//                   name="new_password"
//                   value={passwordForm.new_password}
//                   onChange={handlePasswordInputChange}
//                   disabled={loading}
//                   required
//                 />
//               </div>
//               <button type="submit" className="btn btn-primary w-100" disabled={loading}>
//                 Change Password
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Upload Profile Picture */}
//         <div className="card h-100 shadow-sm border-0">
//           <div className="card-header bg-light">
//             <h5 className="mb-0">Update Profile Picture</h5>
//           </div>
//           <div className="card-body p-4">
//             <form onSubmit={handleUploadProfilePicture}>
//               <div className="mb-3">
//                 <label htmlFor="profilePicture" className="form-label">Select Profile Picture</label>
//                 <input
//                   type="file"
//                   className="form-control"
//                   id="profilePicture"
//                   name="profilePicture"
//                   accept="image/jpeg,image/png,image/webp"
//                   onChange={handleProfilePictureChange}
//                   disabled={loading}
//                 />
//                 <div className="form-text">
//                   Upload a clear image (JPEG, PNG, or WebP). Max file size: 5MB
//                 </div>
//                 {profilePicture && (
//                   <div className="mt-2">
//                     <small className="text-success">
//                       <i className="bi bi-check-circle me-1"></i>
//                       File selected: {profilePicture.name} ({Math.round(profilePicture.size / 1024)} KB)
//                     </small>
//                   </div>
//                 )}
//               </div>
//               <button type="submit" className="btn btn-primary w-100" disabled={loading || !profilePicture}>
//                 Upload Picture
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

// import React, { useContext, useState, useEffect } from 'react';
// import { CartContext } from '../context/CartContext';
// import { Link, useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios';

// const UserDashboard = () => {
//   const { isAuthenticated, isLoading } = useContext(CartContext);
//   const navigate = useNavigate();
//   const [userProfile, setUserProfile] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true); // Added loading state
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [profileForm, setProfileForm] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     contact: ''
//   });
//   const [passwordForm, setPasswordForm] = useState({
//     current_password: '',
//     new_password: ''
//   });
//   const [profilePicture, setProfilePicture] = useState(null);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//       return;
//     }

//     const fetchData = async () => {
//       setLoading(true); // Start loading
//       try {
//         const token = sessionStorage.getItem('token');
//         if (!token) {
//           setError('No authentication token found. Please log in again.');
//           navigate('/login');
//           return;
//         }

//         // Decode JWT
//         const decoded = jwtDecode(token);
//         const profile = {
//           id: decoded.sub || decoded.user_id,
//           name: decoded.name || `${decoded.first_name} ${decoded.last_name}`,
//           email: decoded.email || '',
//           phone: decoded.contact || '',
//           profile_picture_url: decoded.profile_picture_url || ''
//         };
//         setUserProfile(profile);
//         setProfileForm({
//           first_name: decoded.first_name || '',
//           last_name: decoded.last_name || '',
//           email: decoded.email || '',
//           contact: decoded.contact || ''
//         });

//         // Fetch orders
//         const response = await axios.get('http://localhost:5000/api/v1/orders/', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setOrders(response.data.orders || []);
//       } catch (err) {
//         console.error('Error fetching profile/orders:', err);
//         setError('Failed to load dashboard data. Please try again.');
//       } finally {
//         setLoading(false); // End loading
//       }
//     };

//     fetchData();
//   }, [isAuthenticated, navigate]);

//   const handleProfileInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handlePasswordInputChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleProfilePictureChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//       const maxSize = 5 * 1024 * 1024; // 5MB
//       if (!allowedTypes.includes(file.type)) {
//         setError('Please upload a valid image file (JPEG, PNG, or WebP)');
//         return;
//       }
//       if (file.size > maxSize) {
//         setError('File size must be less than 5MB');
//         return;
//       }
//       setProfilePicture(file);
//       setError('');
//     }
//   };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     try {
//       const token = sessionStorage.getItem('token');
//       await axios.put(
//         'http://localhost:5000/api/v1/auth/profile/update',
//         profileForm,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSuccess('Profile updated successfully!');
//       // Refresh JWT (re-login required for updated claims)
//       setUserProfile({
//         ...userProfile,
//         name: `${profileForm.first_name} ${profileForm.last_name}`,
//         email: profileForm.email,
//         phone: profileForm.contact
//       });
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update profile.');
//     }
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     try {
//       const token = sessionStorage.getItem('token');
//       await axios.post(
//         'http://localhost:5000/api/v1/auth/profile/change_password',
//         passwordForm,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSuccess('Password changed successfully!');
//       setPasswordForm({ current_password: '', new_password: '' });
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to change password.');
//     }
//   };

//   const handleUploadProfilePicture = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!profilePicture) {
//       setError('Please select a profile picture.');
//       return;
//     }

//     try {
//       const token = sessionStorage.getItem('token');
//       const formData = new FormData();
//       formData.append('profile_picture', profilePicture);
//       const response = await axios.post(
//         'http://localhost:5000/api/v1/auth/profile/picture',
//         formData,
//         { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
//       );
//       setSuccess('Profile picture uploaded successfully!');
//       setUserProfile({ ...userProfile, profile_picture_url: response.data.profile_pic_url });
//       setProfilePicture(null);
//       document.getElementById('profilePicture').value = '';
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to upload profile picture.');
//     }
//   };

//   const formatCurrency = (amount) => {
//     return `UGX ${parseFloat(amount).toLocaleString()}`;
//   };

//   if (loading || !userProfile) {
//     return (
//       <div className="container mt-5 text-center">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-4">
//       <nav aria-label="breadcrumb">
//         <ol className="breadcrumb">
//           <li className="breadcrumb-item">
//             <Link to="/">Home</Link>
//           </li>
//           <li className="breadcrumb-item active" aria-current="page">My Dashboard</li>
//         </ol>
//       </nav>

//       <h2 className="mb-4">
//         <i className="bi bi-person-circle me-2"></i>
//         Welcome, {userProfile.name}
//       </h2>

//       {error && (
//         <div className="alert alert-danger" role="alert">
//           <i className="bi bi-exclamation-triangle me-2"></i>
//           {error}
//         </div>
//       )}
//       {success && (
//         <div className="alert alert-success" role="alert">
//           <i className="bi bi-check-circle me-2"></i>
//           {success}
//         </div>
//       )}

//       <div className="row">
//         {/* Profile Overview */}
//         <div className="col-lg-4 mb-4">
//           <div className="card shadow-sm">
//             <div className="card-header bg-primary text-white">
//               <h5 className="mb-0">Profile Overview</h5>
//             </div>
//             <div className="card-body text-center">
//               <img
//                 src={userProfile.profile_picture_url || '/api/placeholder/100/100'}
//                 alt="Profile"
//                 className="rounded-circle mb-3"
//                 style={{ width: '100px', height: '100px', objectFit: 'cover' }}
//                 onError={(e) => (e.target.src = '/api/placeholder/100/100')}
//               />
//               <h6>{userProfile.name}</h6>
//               <p className="text-muted mb-1">{userProfile.email}</p>
//               <p className="text-muted mb-0">{userProfile.phone}</p>
//             </div>
//           </div>
//         </div>

//         {/* Order History */}
//         <div className="col-lg-8 mb-4">
//           <div className="card shadow-sm">
//             <div className="card-header bg-light">
//               <h5 className="mb-0">Order History</h5>
//             </div>
//             <div className="card-body">
//               {orders.length === 0 ? (
//                 <p className="text-muted text-center">No orders yet. <Link to="/products">Start shopping!</Link></p>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table table-hover">
//                     <thead>
//                       <tr>
//                         <th>Order ID</th>
//                         <th>Date</th>
//                         <th>Total</th>
//                         <th>Payment Method</th>
//                         <th>Status</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {orders.map(order => (
//                         <tr key={order.id}>
//                           <td>#{order.id}</td>
//                           <td>{new Date(order.created_at).toLocaleDateString()}</td>
//                           <td>{formatCurrency(order.total)}</td>
//                           <td>{order.payment_method.toUpperCase()}</td>
//                           <td>
//                             <span className={`badge bg-${order.status === 'pending' ? 'warning' : order.status === 'confirmed' ? 'success' : 'info'}`}>
//                               {order.status}
//                             </span>
//                           </td>
//                           <td>
//                             <button
//                               className="btn btn-outline-primary btn-sm"
//                               onClick={() => alert(JSON.stringify(order.cart, null, 2))} // Replace with modal or details page
//                             >
//                               View Details
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Update Profile */}
//         <div className="col-lg-6 mb-4">
//           <div className="card shadow-sm">
//             <div className="card-header bg-light">
//               <h5 className="mb-0">Update Profile</h5>
//             </div>
//             <div className="card-body">
//               <form onSubmit={handleUpdateProfile}>
//                 <div className="row">
//                   <div className="col-md-6 mb-3">
//                     <label htmlFor="first_name" className="form-label">First Name</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="first_name"
//                       name="first_name"
//                       value={profileForm.first_name}
//                       onChange={handleProfileInputChange}
//                       disabled={isLoading}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label htmlFor="last_name" className="form-label">Last Name</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="last_name"
//                       name="last_name"
//                       value={profileForm.last_name}
//                       onChange={handleProfileInputChange}
//                       disabled={isLoading}
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="email" className="form-label">Email</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     id="email"
//                     name="email"
//                     value={profileForm.email}
//                     onChange={handleProfileInputChange}
//                     disabled={isLoading}
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="contact" className="form-label">Phone Number</label>
//                   <input
//                     type="tel"
//                     className="form-control"
//                     id="contact"
//                     name="contact"
//                     value={profileForm.contact}
//                     onChange={handleProfileInputChange}
//                     disabled={isLoading}
//                     required
//                   />
//                 </div>
//                 <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
//                   Update Profile
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>

//         {/* Change Password */}
//         <div className="col-lg-6 mb-4">
//           <div className="card shadow-sm">
//             <div className="card-header bg-light">
//               <h5 className="mb-0">Change Password</h5>
//             </div>
//             <div className="card-body">
//               <form onSubmit={handleChangePassword}>
//                 <div className="mb-3">
//                   <label htmlFor="current_password" className="form-label">Current Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="current_password"
//                     name="current_password"
//                     value={passwordForm.current_password}
//                     onChange={handlePasswordInputChange}
//                     disabled={isLoading}
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="new_password" className="form-label">New Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="new_password"
//                     name="new_password"
//                     value={passwordForm.new_password}
//                     onChange={handlePasswordInputChange}
//                     disabled={isLoading}
//                     required
//                   />
//                 </div>
//                 <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
//                   Change Password
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>

//         {/* Upload Profile Picture */}
//         <div className="col-lg-6 mb-4">
//           <div className="card shadow-sm">
//             <div className="card-header bg-light">
//               <h5 className="mb-0">Update Profile Picture</h5>
//             </div>
//             <div className="card-body">
//               <form onSubmit={handleUploadProfilePicture}>
//                 <div className="mb-3">
//                   <label htmlFor="profilePicture" className="form-label">Select Profile Picture</label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     id="profilePicture"
//                     name="profilePicture"
//                     accept="image/jpeg,image/png,image/webp"
//                     onChange={handleProfilePictureChange}
//                     disabled={isLoading}
//                   />
//                   <div className="form-text">
//                     Upload a clear image (JPEG, PNG, or WebP). Max file size: 5MB
//                   </div>
//                   {profilePicture && (
//                     <div className="mt-2">
//                       <small className="text-success">
//                         <i className="bi bi-check-circle me-1"></i>
//                         File selected: {profilePicture.name} ({Math.round(profilePicture.size / 1024)} KB)
//                       </small>
//                     </div>
//                   )}
//                 </div>
//                 <button type="submit" className="btn btn-primary w-100" disabled={isLoading || !profilePicture}>
//                   Upload Picture
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

















// // ===================================
// // USER DASHBOARD COMPONENT
// // Modern React component with clean architecture
// // ===================================

// import React, { useContext, useState, useEffect, useCallback } from "react";
// import { CartContext } from "../context/CartContext";
// import { Link, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";
// import "../styles/UserDashboard.css";

// // ===================================
// // CONSTANTS & CONFIGURATION
// // ===================================

// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

// const ENDPOINTS = {
//   ORDERS: `${API_BASE_URL}/orders/`,
//   PROFILE_UPDATE: `${API_BASE_URL}/auth/profile/update`,
//   PASSWORD_CHANGE: `${API_BASE_URL}/auth/profile/change_password`,
//   PROFILE_PICTURE: `${API_BASE_URL}/auth/profile/picture`,
// };

// const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// const ORDER_STATUS_COLORS = {
//   pending: "warning",
//   confirmed: "success",
//   processing: "info",
//   shipped: "primary",
//   delivered: "success",
//   cancelled: "danger",
// };

// // ===================================
// // CUSTOM HOOKS
// // ===================================

// const useFormState = (initialState) => {
//   const [formData, setFormData] = useState(initialState);

//   const updateField = useCallback((field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   }, []);

//   const handleInputChange = useCallback((e) => {
//     const { name, value } = e.target;
//     updateField(name, value);
//   }, [updateField]);

//   const resetForm = useCallback(() => {
//     setFormData(initialState);
//   }, [initialState]);

//   return {
//     formData,
//     updateField,
//     handleInputChange,
//     resetForm,
//     setFormData,
//   };
// };

// const useApiCall = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const clearMessages = useCallback(() => {
//     setError("");
//     setSuccess("");
//   }, []);

//   const makeApiCall = useCallback(async (apiCall, successMessage = "") => {
//     setLoading(true);
//     clearMessages();

//     try {
//       const result = await apiCall();
//       if (successMessage) {
//         setSuccess(successMessage);
//       }
//       return result;
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           "An unexpected error occurred";
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [clearMessages]);

//   return {
//     loading,
//     error,
//     success,
//     makeApiCall,
//     clearMessages,
//     setError,
//     setSuccess,
//   };
// };

// // ===================================
// // UTILITY FUNCTIONS
// // ===================================

// const formatCurrency = (amount) => {
//   const numericAmount = parseFloat(amount || 0);
//   return `UGX ${numericAmount.toLocaleString('en-UG', {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   })}`;
// };

// const formatDate = (dateString) => {
//   if (!dateString) return "-";
//   return new Date(dateString).toLocaleDateString('en-UG', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });
// };

// const getAuthHeaders = () => {
//   const token = sessionStorage.getItem("token");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// const validateFile = (file) => {
//   if (!file) return "Please select a file.";
  
//   if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
//     return "Invalid file type. Upload JPG, PNG, or WebP.";
//   }
  
//   if (file.size > MAX_FILE_SIZE) {
//     return "File too large. Maximum size is 5MB.";
//   }
  
//   return null;
// };

// const parseUserFromToken = (token) => {
//   try {
//     const decoded = jwtDecode(token);
//     return {
//       id: decoded.sub || decoded.user_id,
//       name: decoded.name || 
//             `${decoded.first_name || ""} ${decoded.last_name || ""}`.trim() || 
//             "User",
//       email: decoded.email || "",
//       phone: decoded.contact || "",
//       profile_picture_url: decoded.profile_picture_url || "",
//       first_name: decoded.first_name || "",
//       last_name: decoded.last_name || "",
//     };
//   } catch (error) {
//     throw new Error("Invalid token format");
//   }
// };

// // ===================================
// // UI COMPONENTS
// // ===================================

// const LoadingSpinner = ({ message = "Loading dashboard..." }) => (
//   <div className="d-flex flex-column align-items-center justify-content-center py-5">
//     <div className="spinner-border text-primary mb-3" role="status">
//       <span className="visually-hidden">Loading...</span>
//     </div>
//     <p className="text-muted">{message}</p>
//   </div>
// );

// const AlertMessage = ({ type, message, onDismiss }) => {
//   if (!message) return null;
  
//   return (
//     <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
//       <i className={`bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
//       {message}
//       {onDismiss && (
//         <button
//           type="button"
//           className="btn-close"
//           onClick={onDismiss}
//           aria-label="Close"
//         />
//       )}
//     </div>
//   );
// };

// const ProfileOverview = ({ userProfile }) => (
//   <div className="card h-100 shadow-sm border-0">
//     <div className="card-header bg-primary text-white">
//       <h5 className="mb-0">
//         <i className="bi bi-person-circle me-2"></i>
//         Profile Overview
//       </h5>
//     </div>
//     <div className="card-body text-center p-4">
//       <div className="position-relative d-inline-block mb-3">
//         <img
//           src={userProfile.profile_picture_url || "https://via.placeholder.com/120x120?text=Profile"}
//           alt={`${userProfile.name}'s profile`}
//           className="rounded-circle border border-3 border-white shadow"
//           style={{ 
//             width: '120px', 
//             height: '120px', 
//             objectFit: 'cover',
//             boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//           }}
//           onError={(e) => {
//             e.target.src = "https://via.placeholder.com/120x120?text=Profile";
//           }}
//         />
//       </div>
//       <h5 className="mb-2 fw-bold">{userProfile.name}</h5>
//       <p className="text-muted mb-2">
//         <i className="bi bi-envelope me-2"></i>
//         {userProfile.email}
//       </p>
//       {userProfile.phone && (
//         <p className="text-muted mb-0">
//           <i className="bi bi-telephone me-2"></i>
//           {userProfile.phone}
//         </p>
//       )}
//     </div>
//   </div>
// );

// const CartSummary = ({ cart }) => {
//   const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

//   return (
//     <div className="card h-100 shadow-sm border-0">
//       <div className="card-header bg-light">
//         <h5 className="mb-0">
//           <i className="bi bi-cart3 me-2"></i>
//           Your Cart
//           {cart.length > 0 && (
//             <span className="badge bg-primary ms-2">{cart.length}</span>
//           )}
//         </h5>
//       </div>
//       <div className="card-body p-4">
//         {cart.length === 0 ? (
//           <div className="text-center py-4">
//             <i className="bi bi-cart-x display-4 text-muted mb-3"></i>
//             <p className="text-muted mb-3">Your cart is empty</p>
//             <Link to="/products" className="btn btn-primary btn-sm">
//               <i className="bi bi-shop me-1"></i>
//               Start Shopping
//             </Link>
//           </div>
//         ) : (
//           <>
//             <div className="mb-3">
//               {cart.slice(0, 3).map((item, index) => (
//                 <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
//                   <div>
//                     <small className="fw-semibold">{item.name}</small>
//                     <br />
//                     <small className="text-muted">Qty: {item.quantity}</small>
//                   </div>
//                   <span className="fw-bold text-primary">
//                     {formatCurrency(item.price * item.quantity)}
//                   </span>
//                 </div>
//               ))}
//               {cart.length > 3 && (
//                 <small className="text-muted">+{cart.length - 3} more items</small>
//               )}
//             </div>
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <span className="fw-bold">Total:</span>
//               <span className="fw-bold text-primary h5 mb-0">
//                 {formatCurrency(cartTotal)}
//               </span>
//             </div>
//             <Link to="/cart" className="btn btn-primary w-100">
//               <i className="bi bi-cart-check me-2"></i>
//               View Cart
//             </Link>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// const OrderHistory = ({ orders, loading }) => (
//   <div className="card shadow-sm border-0">
//     <div className="card-header bg-light">
//       <h5 className="mb-0">
//         <i className="bi bi-bag-check me-2"></i>
//         Order History
//         {orders.length > 0 && (
//           <span className="badge bg-secondary ms-2">{orders.length}</span>
//         )}
//       </h5>
//     </div>
//     <div className="card-body">
//       {loading ? (
//         <LoadingSpinner message="Loading orders..." />
//       ) : orders.length === 0 ? (
//         <div className="text-center py-5">
//           <i className="bi bi-bag-x display-4 text-muted mb-3"></i>
//           <p className="text-muted mb-3">No orders yet</p>
//           <Link to="/products" className="btn btn-outline-primary">
//             <i className="bi bi-shop me-1"></i>
//             Start Shopping
//           </Link>
//         </div>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>Order ID</th>
//                 <th>Date</th>
//                 <th>Total</th>
//                 <th>Payment</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.id}>
//                   <td>
//                     <strong className="text-primary">#{order.id}</strong>
//                   </td>
//                   <td>{formatDate(order.created_at)}</td>
//                   <td>
//                     <strong>{formatCurrency(order.total)}</strong>
//                   </td>
//                   <td>
//                     <span className="text-capitalize">
//                       {order.payment_method || "N/A"}
//                     </span>
//                   </td>
//                   <td>
//                     <span className={`badge bg-${ORDER_STATUS_COLORS[order.status] || 'secondary'}`}>
//                       {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Unknown"}
//                     </span>
//                   </td>
//                   <td>
//                     <Link 
//                       to={`/orders/${order.id}`}
//                       className="btn btn-sm btn-outline-primary"
//                       title="View Order Details"
//                     >
//                       <i className="bi bi-eye"></i>
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   </div>
// );

// const ProfileUpdateForm = ({ 
//   profileForm, 
//   onInputChange, 
//   onSubmit, 
//   loading 
// }) => (
//   <div className="card shadow-sm border-0">
//     <div className="card-header bg-light">
//       <h5 className="mb-0">
//         <i className="bi bi-person-gear me-2"></i>
//         Update Profile
//       </h5>
//     </div>
//     <div className="card-body">
//       <form onSubmit={onSubmit}>
//         <div className="row g-3">
//           <div className="col-md-6">
//             <label htmlFor="first_name" className="form-label fw-semibold">
//               First Name <span className="text-danger">*</span>
//             </label>
//             <input
//               id="first_name"
//               className="form-control"
//               name="first_name"
//               value={profileForm.first_name}
//               onChange={onInputChange}
//               placeholder="Enter first name"
//               required
//               disabled={loading}
//             />
//           </div>
//           <div className="col-md-6">
//             <label htmlFor="last_name" className="form-label fw-semibold">
//               Last Name <span className="text-danger">*</span>
//             </label>
//             <input
//               id="last_name"
//               className="form-control"
//               name="last_name"
//               value={profileForm.last_name}
//               onChange={onInputChange}
//               placeholder="Enter last name"
//               required
//               disabled={loading}
//             />
//           </div>
//           <div className="col-12">
//             <label htmlFor="email" className="form-label fw-semibold">
//               Email Address <span className="text-danger">*</span>
//             </label>
//             <input
//               id="email"
//               className="form-control"
//               type="email"
//               name="email"
//               value={profileForm.email}
//               onChange={onInputChange}
//               placeholder="Enter email address"
//               required
//               disabled={loading}
//             />
//           </div>
//           <div className="col-12">
//             <label htmlFor="contact" className="form-label fw-semibold">
//               Phone Number
//             </label>
//             <input
//               id="contact"
//               className="form-control"
//               name="contact"
//               value={profileForm.contact}
//               onChange={onInputChange}
//               placeholder="Enter phone number"
//               disabled={loading}
//             />
//           </div>
//           <div className="col-12">
//             <button 
//               type="submit" 
//               className="btn btn-primary w-100"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" />
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-check-circle me-2"></i>
//                   Update Profile
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   </div>
// );

// const PasswordChangeForm = ({ 
//   passwordForm, 
//   onInputChange, 
//   onSubmit, 
//   loading 
// }) => (
//   <div className="card shadow-sm border-0">
//     <div className="card-header bg-light">
//       <h5 className="mb-0">
//         <i className="bi bi-shield-lock me-2"></i>
//         Change Password
//       </h5>
//     </div>
//     <div className="card-body">
//       <form onSubmit={onSubmit}>
//         <div className="mb-3">
//           <label htmlFor="current_password" className="form-label fw-semibold">
//             Current Password <span className="text-danger">*</span>
//           </label>
//           <input
//             id="current_password"
//             className="form-control"
//             type="password"
//             name="current_password"
//             value={passwordForm.current_password}
//             onChange={onInputChange}
//             placeholder="Enter current password"
//             required
//             disabled={loading}
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="new_password" className="form-label fw-semibold">
//             New Password <span className="text-danger">*</span>
//           </label>
//           <input
//             id="new_password"
//             className="form-control"
//             type="password"
//             name="new_password"
//             value={passwordForm.new_password}
//             onChange={onInputChange}
//             placeholder="Enter new password"
//             minLength="6"
//             required
//             disabled={loading}
//           />
//           <div className="form-text">
//             <i className="bi bi-info-circle me-1"></i>
//             Password must be at least 6 characters long
//           </div>
//         </div>
//         <button 
//           type="submit" 
//           className="btn btn-primary w-100"
//           disabled={loading}
//         >
//           {loading ? (
//             <>
//               <span className="spinner-border spinner-border-sm me-2" />
//               Changing...
//             </>
//           ) : (
//             <>
//               <i className="bi bi-shield-check me-2"></i>
//               Change Password
//             </>
//           )}
//         </button>
//       </form>
//     </div>
//   </div>
// );

// const ProfilePictureForm = ({ 
//   onFileChange, 
//   onSubmit, 
//   loading, 
//   selectedFile 
// }) => (
//   <div className="card shadow-sm border-0">
//     <div className="card-header bg-light">
//       <h5 className="mb-0">
//         <i className="bi bi-image me-2"></i>
//         Profile Picture
//       </h5>
//     </div>
//     <div className="card-body">
//       <form onSubmit={onSubmit}>
//         <div className="mb-3">
//           <label htmlFor="profile_picture" className="form-label fw-semibold">
//             Choose Profile Picture
//           </label>
//           <input
//             id="profile_picture"
//             type="file"
//             className="form-control"
//             accept="image/*"
//             onChange={onFileChange}
//             disabled={loading}
//           />
//           <div className="form-text">
//             <i className="bi bi-info-circle me-1"></i>
//             Supported formats: JPG, PNG, WebP. Maximum size: 5MB
//           </div>
//           {selectedFile && (
//             <div className="mt-2">
//               <small className="text-success">
//                 <i className="bi bi-check-circle me-1"></i>
//                 File selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
//               </small>
//             </div>
//           )}
//         </div>
//         <button
//           type="submit"
//           className="btn btn-primary w-100"
//           disabled={!selectedFile || loading}
//         >
//           {loading ? (
//             <>
//               <span className="spinner-border spinner-border-sm me-2" />
//               Uploading...
//             </>
//           ) : (
//             <>
//               <i className="bi bi-cloud-upload me-2"></i>
//               Upload Picture
//             </>
//           )}
//         </button>
//       </form>
//     </div>
//   </div>
// );

// // ===================================
// // MAIN COMPONENT
// // ===================================

// const UserDashboard = () => {
//   // Context and Navigation
//   const { isAuthenticated, isLoading: contextLoading, cart = [] } = useContext(CartContext);
//   const navigate = useNavigate();

//   // State Management
//   const [userProfile, setUserProfile] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [profilePicture, setProfilePicture] = useState(null);

//   // Custom Hooks
//   const {
//     formData: profileForm,
//     handleInputChange: handleProfileChange,
//     setFormData: setProfileForm,
//   } = useFormState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     contact: "",
//   });

//   const {
//     formData: passwordForm,
//     handleInputChange: handlePasswordChange,
//     resetForm: resetPasswordForm,
//   } = useFormState({
//     current_password: "",
//     new_password: "",
//   });

//   const {
//     loading: apiLoading,
//     error,
//     success,
//     makeApiCall,
//     clearMessages,
//     setError,
//   } = useApiCall();

//   // ===================================
//   // API FUNCTIONS
//   // ===================================

//   const fetchUserData = useCallback(async () => {
//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       const userData = parseUserFromToken(token);
//       setUserProfile(userData);
//       setProfileForm({
//         first_name: userData.first_name,
//         last_name: userData.last_name,
//         email: userData.email,
//         contact: userData.phone,
//       });
//     } catch (error) {
//       console.error("Token parsing error:", error);
//       sessionStorage.removeItem("token");
//       navigate("/login");
//     }
//   }, [navigate, setProfileForm]);

//   const fetchOrders = useCallback(async () => {
//     const response = await axios.get(ENDPOINTS.ORDERS, {
//       headers: getAuthHeaders(),
//     });
//     return response.data.orders || [];
//   }, []);

//   // ===================================
//   // EVENT HANDLERS
//   // ===================================

//   const handleUpdateProfile = useCallback(async (e) => {
//     e.preventDefault();
    
//     await makeApiCall(async () => {
//       await axios.put(ENDPOINTS.PROFILE_UPDATE, profileForm, {
//         headers: getAuthHeaders(),
//       });
      
//       setUserProfile(prev => ({
//         ...prev,
//         name: `${profileForm.first_name} ${profileForm.last_name}`.trim(),
//         email: profileForm.email,
//         phone: profileForm.contact,
//         first_name: profileForm.first_name,
//         last_name: profileForm.last_name,
//       }));
//     }, "Profile updated successfully!");
//   }, [profileForm, makeApiCall]);

//   const handleChangePassword = useCallback(async (e) => {
//     e.preventDefault();
    
//     await makeApiCall(async () => {
//       await axios.post(ENDPOINTS.PASSWORD_CHANGE, passwordForm, {
//         headers: getAuthHeaders(),
//       });
//       resetPasswordForm();
//     }, "Password changed successfully!");
//   }, [passwordForm, makeApiCall, resetPasswordForm]);

//   const handleProfilePicChange = useCallback((e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const error = validateFile(file);
//     if (error) {
//       setError(error);
//       return;
//     }

//     setProfilePicture(file);
//     clearMessages();
//   }, [setError, clearMessages]);

//   const handleUploadProfilePicture = useCallback(async (e) => {
//     e.preventDefault();
    
//     if (!profilePicture) {
//       setError("Please select a file.");
//       return;
//     }

//     await makeApiCall(async () => {
//       const formData = new FormData();
//       formData.append("profile_picture", profilePicture);
      
//       const response = await axios.post(ENDPOINTS.PROFILE_PICTURE, formData, {
//         headers: {
//           ...getAuthHeaders(),
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setUserProfile(prev => ({
//         ...prev,
//         profile_picture_url: response.data.profile_pic_url,
//       }));
      
//       setProfilePicture(null);
//       const fileInput = document.getElementById("profile_picture");
//       if (fileInput) fileInput.value = "";
      
//       return response.data;
//     }, "Profile picture updated successfully!");
//   }, [profilePicture, makeApiCall, setError]);

//   // ===================================
//   // EFFECTS
//   // ===================================

//   useEffect(() => {
//     if (!isAuthenticated && !contextLoading) {
//       navigate("/login");
//       return;
//     }

//     if (!isAuthenticated || contextLoading) return;

//     const initializeDashboard = async () => {
//       setInitialLoading(true);
      
//       try {
//         await fetchUserData();
//         const ordersData = await fetchOrders();
//         setOrders(ordersData);
//       } catch (error) {
//         console.error("Dashboard initialization error:", error);
//         if (error.response?.status === 401) {
//           sessionStorage.removeItem("token");
//           navigate("/login");
//         }
//       } finally {
//         setInitialLoading(false);
//       }
//     };

//     initializeDashboard();
//   }, [isAuthenticated, contextLoading, navigate, fetchUserData, fetchOrders]);

//   useEffect(() => {
//     if (error || success) {
//       const timer = setTimeout(clearMessages, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, success, clearMessages]);

//   // ===================================
//   // RENDER CONDITIONS
//   // ===================================

//   if (initialLoading || contextLoading || !userProfile) {
//     return (
//       <div className="container mt-5">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   // ===================================
//   // MAIN RENDER
//   // ===================================

//   return (
//     <div className="container-fluid px-4 py-4">
//       {/* Breadcrumb Navigation */}
//       <nav aria-label="breadcrumb" className="mb-4">
//         <ol className="breadcrumb">
//           <li className="breadcrumb-item">
//             <Link to="/" className="text-decoration-none">
//               <i className="bi bi-house-door me-1"></i>
//               Home
//             </Link>
//           </li>
//           <li className="breadcrumb-item active" aria-current="page">
//             My Dashboard
//           </li>
//         </ol>
//       </nav>

//       {/* Welcome Header */}
//       <div className="row mb-4">
//         <div className="col">
//           <h2 className="h3 mb-2 fw-bold">
//             <i className="bi bi-person-circle me-2 text-primary"></i>
//             Welcome back, {userProfile.name}!
//           </h2>
//           <p className="text-muted mb-0">Manage your profile, orders, and account settings</p>
//         </div>
//       </div>

//       {/* Alert Messages */}
//       <AlertMessage 
//         type="danger" 
//         message={error} 
//         onDismiss={clearMessages} 
//       />
//       <AlertMessage 
//         type="success" 
//         message={success} 
//         onDismiss={clearMessages} 
//       />

//       {/* Dashboard Grid */}
//       <div className="row g-4">
//         {/* Top Row - Profile Overview and Cart Summary */}
//         <div className="col-xl-4 col-lg-6">
//           <ProfileOverview userProfile={userProfile} />
//         </div>
        
//         <div className="col-xl-4 col-lg-6">
//           <CartSummary cart={cart} />
//         </div>

//         {/* Order History - Full Width */}
//         <div className="col-12">
//           <OrderHistory 
//             orders={orders} 
//             loading={apiLoading} 
//           />
//         </div>

//         {/* Forms Row */}
//         <div className="col-xl-4 col-lg-6">
//           <ProfileUpdateForm
//             profileForm={profileForm}
//             onInputChange={handleProfileChange}
//             onSubmit={handleUpdateProfile}
//             loading={apiLoading}
//           />
//         </div>

//         <div className="col-xl-4 col-lg-6">
//           <PasswordChangeForm
//             passwordForm={passwordForm}
//             onInputChange={handlePasswordChange}
//             onSubmit={handleChangePassword}
//             loading={apiLoading}
//           />
//         </div>

//         <div className="col-xl-4 col-lg-6">
//           <ProfilePictureForm
//             onFileChange={handleProfilePicChange}
//             onSubmit={handleUploadProfilePicture}
//             loading={apiLoading}
//             selectedFile={profilePicture}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;









// import React, { useContext, useState, useEffect, useCallback } from "react";
// import { CartContext } from "../context/CartContext";
// import { Link, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";

// // ===================================
// // CONSTANTS & CONFIGURATION
// // ===================================

// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

// const ENDPOINTS = {
//   ORDERS: `${API_BASE_URL}/orders/`,
//   PROFILE_UPDATE: `${API_BASE_URL}/auth/profile/update`,
//   PASSWORD_CHANGE: `${API_BASE_URL}/auth/profile/change_password`,
//   PROFILE_PICTURE: `${API_BASE_URL}/auth/profile/picture`,
// };

// const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// const ORDER_STATUS_COLORS = {
//   pending: "warning",
//   confirmed: "success",
//   processing: "info",
//   shipped: "primary",
//   delivered: "success",
//   cancelled: "danger",
// };

// const TABS = {
//   OVERVIEW: 'overview',
//   ORDERS: 'orders',
//   PROFILE: 'profile',
//   SECURITY: 'security'
// };

// // ===================================
// // CUSTOM HOOKS
// // ===================================

// const useFormState = (initialState) => {
//   const [formData, setFormData] = useState(initialState);

//   const updateField = useCallback((field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   }, []);

//   const handleInputChange = useCallback((e) => {
//     const { name, value } = e.target;
//     updateField(name, value);
//   }, [updateField]);

//   const resetForm = useCallback(() => {
//     setFormData(initialState);
//   }, [initialState]);

//   return {
//     formData,
//     updateField,
//     handleInputChange,
//     resetForm,
//     setFormData,
//   };
// };

// const useApiCall = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const clearMessages = useCallback(() => {
//     setError("");
//     setSuccess("");
//   }, []);

//   const makeApiCall = useCallback(async (apiCall, successMessage = "") => {
//     setLoading(true);
//     clearMessages();

//     try {
//       const result = await apiCall();
//       if (successMessage) {
//         setSuccess(successMessage);
//       }
//       return result;
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           "An unexpected error occurred";
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [clearMessages]);

//   return {
//     loading,
//     error,
//     success,
//     makeApiCall,
//     clearMessages,
//     setError,
//     setSuccess,
//   };
// };

// // ===================================
// // UTILITY FUNCTIONS
// // ===================================

// const formatCurrency = (amount) => {
//   const numericAmount = parseFloat(amount || 0);
//   return `UGX ${numericAmount.toLocaleString('en-UG', {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   })}`;
// };

// const formatDate = (dateString) => {
//   if (!dateString) return "-";
//   return new Date(dateString).toLocaleDateString('en-UG', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });
// };

// const getAuthHeaders = () => {
//   const token = sessionStorage.getItem("token");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// const validateFile = (file) => {
//   if (!file) return "Please select a file.";
  
//   if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
//     return "Invalid file type. Upload JPG, PNG, or WebP.";
//   }
  
//   if (file.size > MAX_FILE_SIZE) {
//     return "File too large. Maximum size is 5MB.";
//   }
  
//   return null;
// };

// const parseUserFromToken = (token) => {
//   try {
//     const decoded = jwtDecode(token);
//     return {
//       id: decoded.sub || decoded.user_id,
//       name: decoded.name || 
//             `${decoded.first_name || ""} ${decoded.last_name || ""}`.trim() || 
//             "User",
//       email: decoded.email || "",
//       phone: decoded.contact || "",
//       profile_picture_url: decoded.profile_picture_url || "",
//       first_name: decoded.first_name || "",
//       last_name: decoded.last_name || "",
//     };
//   } catch (error) {
//     throw new Error("Invalid token format");
//   }
// };

// // ===================================
// // UI COMPONENTS
// // ===================================

// const LoadingSpinner = ({ message = "Loading dashboard..." }) => (
//   <div className="d-flex flex-column align-items-center justify-content-center py-5">
//     <div className="spinner-border text-primary mb-3" role="status">
//       <span className="visually-hidden">Loading...</span>
//     </div>
//     <p className="text-muted">{message}</p>
//   </div>
// );

// const AlertMessage = ({ type, message, onDismiss }) => {
//   if (!message) return null;
  
//   return (
//     <div className={`alert alert-${type} alert-dismissible fade show mb-4`} role="alert">
//       <i className={`bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
//       {message}
//       {onDismiss && (
//         <button
//           type="button"
//           className="btn-close"
//           onClick={onDismiss}
//           aria-label="Close"
//         />
//       )}
//     </div>
//   );
// };

// // Tab Navigation Component
// const TabNavigation = ({ activeTab, onTabChange }) => {
//   const tabs = [
//     { key: TABS.OVERVIEW, label: 'Overview', icon: 'bi-house' },
//     { key: TABS.ORDERS, label: 'Orders', icon: 'bi-bag-check' },
//     { key: TABS.PROFILE, label: 'Profile', icon: 'bi-person-gear' },
//     { key: TABS.SECURITY, label: 'Security', icon: 'bi-shield-lock' }
//   ];

//   return (
//     <div className="card mb-4">
//       <div className="card-body p-0">
//         <nav className="nav nav-pills nav-fill">
//           {tabs.map(tab => (
//             <button
//               key={tab.key}
//               className={`nav-link d-flex align-items-center justify-content-center py-3 px-4 border-0 ${
//                 activeTab === tab.key ? 'active bg-primary text-white' : 'text-dark bg-transparent'
//               }`}
//               onClick={() => onTabChange(tab.key)}
//               style={{
//                 borderRadius: '0',
//                 transition: 'all 0.2s ease',
//                 fontWeight: '500'
//               }}
//             >
//               <i className={`${tab.icon} me-2`}></i>
//               {tab.label}
//             </button>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
// };

// // Overview Tab Content
// const OverviewTab = ({ userProfile, cart, orders }) => {
//   const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
//   const recentOrders = orders.slice(0, 3);

//   return (
//     <div className="row g-4">
//       {/* Welcome Section */}
//       <div className="col-12">
//         <div className="card bg-gradient-primary text-white">
//           <div className="card-body p-4">
//             <div className="row align-items-center">
//               <div className="col-md-8">
//                 <h3 className="mb-2">Welcome back, {userProfile.name}!</h3>
//                 <p className="mb-0 opacity-75">
//                   Manage your profile, orders, and account settings from your dashboard
//                 </p>
//               </div>
//               <div className="col-md-4 text-md-end">
//                 <img
//                   src={userProfile.profile_picture_url || "https://via.placeholder.com/80x80?text=Profile"}
//                   alt="Profile"
//                   className="rounded-circle border border-3 border-white"
//                   style={{ width: '80px', height: '80px', objectFit: 'cover' }}
//                   onError={(e) => {
//                     e.target.src = "https://via.placeholder.com/80x80?text=Profile";
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="col-md-4">
//         <div className="card h-100 border-0 shadow-sm">
//           <div className="card-body text-center p-4">
//             <div className="text-primary mb-3">
//               <i className="bi bi-bag-check display-4"></i>
//             </div>
//             <h4 className="fw-bold text-dark">{orders.length}</h4>
//             <p className="text-muted mb-0">Total Orders</p>
//           </div>
//         </div>
//       </div>

//       <div className="col-md-4">
//         <div className="card h-100 border-0 shadow-sm">
//           <div className="card-body text-center p-4">
//             <div className="text-success mb-3">
//               <i className="bi bi-cart3 display-4"></i>
//             </div>
//             <h4 className="fw-bold text-dark">{cart.length}</h4>
//             <p className="text-muted mb-0">Items in Cart</p>
//           </div>
//         </div>
//       </div>

//       <div className="col-md-4">
//         <div className="card h-100 border-0 shadow-sm">
//           <div className="card-body text-center p-4">
//             <div className="text-warning mb-3">
//               <i className="bi bi-currency-dollar display-4"></i>
//             </div>
//             <h4 className="fw-bold text-dark">{formatCurrency(cartTotal)}</h4>
//             <p className="text-muted mb-0">Cart Total</p>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="col-md-6">
//         <div className="card h-100 border-0 shadow-sm">
//           <div className="card-header bg-white border-bottom">
//             <h5 className="mb-0 fw-semibold">
//               <i className="bi bi-lightning-charge me-2 text-primary"></i>
//               Quick Actions
//             </h5>
//           </div>
//           <div className="card-body">
//             <div className="d-grid gap-2">
//               <Link to="/products" className="btn btn-outline-primary">
//                 <i className="bi bi-shop me-2"></i>
//                 Browse Products
//               </Link>
//               <Link to="/cart" className="btn btn-outline-success">
//                 <i className="bi bi-cart-check me-2"></i>
//                 View Cart ({cart.length})
//               </Link>
//               <button 
//                 className="btn btn-outline-info"
//                 onClick={() => window.location.href = '/support'}
//               >
//                 <i className="bi bi-headset me-2"></i>
//                 Contact Support
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Orders Preview */}
//       <div className="col-md-6">
//         <div className="card h-100 border-0 shadow-sm">
//           <div className="card-header bg-white border-bottom">
//             <h5 className="mb-0 fw-semibold">
//               <i className="bi bi-clock-history me-2 text-primary"></i>
//               Recent Orders
//             </h5>
//           </div>
//           <div className="card-body">
//             {recentOrders.length === 0 ? (
//               <div className="text-center py-3">
//                 <i className="bi bi-bag-x display-6 text-muted mb-2"></i>
//                 <p className="text-muted mb-0">No orders yet</p>
//               </div>
//             ) : (
//               <div className="list-group list-group-flush">
//                 {recentOrders.map((order) => (
//                   <div key={order.id} className="list-group-item px-0 border-0 border-bottom">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <h6 className="mb-1 fw-semibold">Order #{order.id}</h6>
//                         <small className="text-muted">{formatDate(order.created_at)}</small>
//                       </div>
//                       <div className="text-end">
//                         <div className="fw-bold text-primary">{formatCurrency(order.total)}</div>
//                         <span className={`badge bg-${ORDER_STATUS_COLORS[order.status] || 'secondary'} mt-1`}>
//                           {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Orders Tab Content
// const OrdersTab = ({ orders, loading }) => (
//   <div className="card border-0 shadow-sm">
//     <div className="card-header bg-white border-bottom">
//       <div className="d-flex justify-content-between align-items-center">
//         <h5 className="mb-0 fw-semibold">
//           <i className="bi bi-bag-check me-2 text-primary"></i>
//           Order History
//         </h5>
//         {orders.length > 0 && (
//           <span className="badge bg-primary">{orders.length} orders</span>
//         )}
//       </div>
//     </div>
//     <div className="card-body">
//       {loading ? (
//         <LoadingSpinner message="Loading orders..." />
//       ) : orders.length === 0 ? (
//         <div className="text-center py-5">
//           <i className="bi bi-bag-x display-1 text-muted mb-4"></i>
//           <h4 className="text-muted mb-3">No orders found</h4>
//           <p className="text-muted mb-4">Start shopping to see your orders here</p>
//           <Link to="/products" className="btn btn-primary btn-lg">
//             <i className="bi bi-shop me-2"></i>
//             Browse Products
//           </Link>
//         </div>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th className="fw-semibold">Order ID</th>
//                 <th className="fw-semibold">Date</th>
//                 <th className="fw-semibold">Total Amount</th>
//                 <th className="fw-semibold">Payment Method</th>
//                 <th className="fw-semibold">Status</th>
//                 <th className="fw-semibold text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.id}>
//                   <td>
//                     <strong className="text-primary">#{order.id}</strong>
//                   </td>
//                   <td>{formatDate(order.created_at)}</td>
//                   <td>
//                     <strong>{formatCurrency(order.total)}</strong>
//                   </td>
//                   <td>
//                     <span className="text-capitalize">
//                       {order.payment_method || "N/A"}
//                     </span>
//                   </td>
//                   <td>
//                     <span className={`badge bg-${ORDER_STATUS_COLORS[order.status] || 'secondary'}`}>
//                       {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Unknown"}
//                     </span>
//                   </td>
//                   <td className="text-center">
//                     <Link 
//                       to={`/orders/${order.id}`}
//                       className="btn btn-sm btn-outline-primary"
//                       title="View Order Details"
//                     >
//                       <i className="bi bi-eye me-1"></i>
//                       View
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   </div>
// );

// // Profile Tab Content
// const ProfileTab = ({ 
//   userProfile, 
//   profileForm, 
//   onInputChange, 
//   onSubmit, 
//   loading,
//   onFileChange,
//   onPictureSubmit,
//   selectedFile
// }) => (
//   <div className="row g-4">
//     {/* Profile Picture Section */}
//     <div className="col-lg-4">
//       <div className="card border-0 shadow-sm h-100">
//         <div className="card-header bg-white border-bottom">
//           <h5 className="mb-0 fw-semibold">
//             <i className="bi bi-image me-2 text-primary"></i>
//             Profile Picture
//           </h5>
//         </div>
//         <div className="card-body text-center">
//           <div className="mb-4">
//             <img
//               src={userProfile.profile_picture_url || "https://via.placeholder.com/150x150?text=Profile"}
//               alt="Profile"
//               className="rounded-circle border border-3 border-light shadow-sm"
//               style={{ width: '150px', height: '150px', objectFit: 'cover' }}
//               onError={(e) => {
//                 e.target.src = "https://via.placeholder.com/150x150?text=Profile";
//               }}
//             />
//           </div>
//           <form onSubmit={onPictureSubmit}>
//             <div className="mb-3">
//               <input
//                 id="profile_picture"
//                 type="file"
//                 className="form-control"
//                 accept="image/*"
//                 onChange={onFileChange}
//                 disabled={loading}
//               />
//               <div className="form-text">
//                 <small>Supported: JPG, PNG, WebP. Max: 5MB</small>
//               </div>
//               {selectedFile && (
//                 <div className="mt-2">
//                   <small className="text-success">
//                     <i className="bi bi-check-circle me-1"></i>
//                     {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
//                   </small>
//                 </div>
//               )}
//             </div>
//             <button
//               type="submit"
//               className="btn btn-primary w-100"
//               disabled={!selectedFile || loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" />
//                   Uploading...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-cloud-upload me-2"></i>
//                   Update Picture
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>

//     {/* Profile Information */}
//     <div className="col-lg-8">
//       <div className="card border-0 shadow-sm h-100">
//         <div className="card-header bg-white border-bottom">
//           <h5 className="mb-0 fw-semibold">
//             <i className="bi bi-person-gear me-2 text-primary"></i>
//             Profile Information
//           </h5>
//         </div>
//         <div className="card-body">
//           <form onSubmit={onSubmit}>
//             <div className="row g-3">
//               <div className="col-md-6">
//                 <label htmlFor="first_name" className="form-label fw-semibold">
//                   First Name <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   id="first_name"
//                   className="form-control form-control-lg"
//                   name="first_name"
//                   value={profileForm.first_name}
//                   onChange={onInputChange}
//                   placeholder="Enter first name"
//                   required
//                   disabled={loading}
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label htmlFor="last_name" className="form-label fw-semibold">
//                   Last Name <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   id="last_name"
//                   className="form-control form-control-lg"
//                   name="last_name"
//                   value={profileForm.last_name}
//                   onChange={onInputChange}
//                   placeholder="Enter last name"
//                   required
//                   disabled={loading}
//                 />
//               </div>
//               <div className="col-12">
//                 <label htmlFor="email" className="form-label fw-semibold">
//                   Email Address <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   id="email"
//                   className="form-control form-control-lg"
//                   type="email"
//                   name="email"
//                   value={profileForm.email}
//                   onChange={onInputChange}
//                   placeholder="Enter email address"
//                   required
//                   disabled={loading}
//                 />
//               </div>
//               <div className="col-12">
//                 <label htmlFor="contact" className="form-label fw-semibold">
//                   Phone Number
//                 </label>
//                 <input
//                   id="contact"
//                   className="form-control form-control-lg"
//                   name="contact"
//                   value={profileForm.contact}
//                   onChange={onInputChange}
//                   placeholder="Enter phone number"
//                   disabled={loading}
//                 />
//               </div>
//               <div className="col-12 pt-3">
//                 <button 
//                   type="submit" 
//                   className="btn btn-primary btn-lg w-100"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2" />
//                       Updating Profile...
//                     </>
//                   ) : (
//                     <>
//                       <i className="bi bi-check-circle me-2"></i>
//                       Update Profile
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Security Tab Content
// const SecurityTab = ({ 
//   passwordForm, 
//   onInputChange, 
//   onSubmit, 
//   loading 
// }) => (
//   <div className="row justify-content-center">
//     <div className="col-lg-6">
//       <div className="card border-0 shadow-sm">
//         <div className="card-header bg-white border-bottom">
//           <h5 className="mb-0 fw-semibold">
//             <i className="bi bi-shield-lock me-2 text-primary"></i>
//             Change Password
//           </h5>
//         </div>
//         <div className="card-body">
//           <div className="alert alert-info border-0 mb-4">
//             <i className="bi bi-info-circle me-2"></i>
//             <strong>Security Tip:</strong> Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.
//           </div>
//           <form onSubmit={onSubmit}>
//             <div className="mb-4">
//               <label htmlFor="current_password" className="form-label fw-semibold">
//                 Current Password <span className="text-danger">*</span>
//               </label>
//               <input
//                 id="current_password"
//                 className="form-control form-control-lg"
//                 type="password"
//                 name="current_password"
//                 value={passwordForm.current_password}
//                 onChange={onInputChange}
//                 placeholder="Enter your current password"
//                 required
//                 disabled={loading}
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="new_password" className="form-label fw-semibold">
//                 New Password <span className="text-danger">*</span>
//               </label>
//               <input
//                 id="new_password"
//                 className="form-control form-control-lg"
//                 type="password"
//                 name="new_password"
//                 value={passwordForm.new_password}
//                 onChange={onInputChange}
//                 placeholder="Enter your new password"
//                 minLength="6"
//                 required
//                 disabled={loading}
//               />
//               <div className="form-text">
//                 <i className="bi bi-info-circle me-1"></i>
//                 Password must be at least 6 characters long
//               </div>
//             </div>
//             <button 
//               type="submit" 
//               className="btn btn-primary btn-lg w-100"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" />
//                   Changing Password...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-shield-check me-2"></i>
//                   Change Password
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // ===================================
// // MAIN COMPONENT
// // ===================================

// const UserDashboard = () => {
//   // Context and Navigation
//   const { isAuthenticated, isLoading: contextLoading, cart = [] } = useContext(CartContext);
//   const navigate = useNavigate();

//   // State Management
//   const [userProfile, setUserProfile] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);

//   // Custom Hooks
//   const {
//     formData: profileForm,
//     handleInputChange: handleProfileChange,
//     setFormData: setProfileForm,
//   } = useFormState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     contact: "",
//   });

//   const {
//     formData: passwordForm,
//     handleInputChange: handlePasswordChange,
//     resetForm: resetPasswordForm,
//   } = useFormState({
//     current_password: "",
//     new_password: "",
//   });

//   const {
//     loading: apiLoading,
//     error,
//     success,
//     makeApiCall,
//     clearMessages,
//     setError,
//   } = useApiCall();

//   // ===================================
//   // API FUNCTIONS
//   // ===================================

//   const fetchUserData = useCallback(async () => {
//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       const userData = parseUserFromToken(token);
//       setUserProfile(userData);
//       setProfileForm({
//         first_name: userData.first_name,
//         last_name: userData.last_name,
//         email: userData.email,
//         contact: userData.phone,
//       });
//     } catch (error) {
//       console.error("Token parsing error:", error);
//       sessionStorage.removeItem("token");
//       navigate("/login");
//     }
//   }, [navigate, setProfileForm]);

//   const fetchOrders = useCallback(async () => {
//     const response = await axios.get(ENDPOINTS.ORDERS, {
//       headers: getAuthHeaders(),
//     });
//     return response.data.orders || [];
//   }, []);

//   // ===================================
//   // EVENT HANDLERS
//   // ===================================

//   const handleUpdateProfile = useCallback(async (e) => {
//     e.preventDefault();
    
//     await makeApiCall(async () => {
//       await axios.put(ENDPOINTS.PROFILE_UPDATE, profileForm, {
//         headers: getAuthHeaders(),
//       });
      
//       setUserProfile(prev => ({
//         ...prev,
//         name: `${profileForm.first_name} ${profileForm.last_name}`.trim(),
//         email: profileForm.email,
//         phone: profileForm.contact,
//         first_name: profileForm.first_name,
//         last_name: profileForm.last_name,
//       }));
//     }, "Profile updated successfully!");
//   }, [profileForm, makeApiCall]);

//   const handleChangePassword = useCallback(async (e) => {
//     e.preventDefault();
    
//     await makeApiCall(async () => {
//       await axios.post(ENDPOINTS.PASSWORD_CHANGE, passwordForm, {
//         headers: getAuthHeaders(),
//       });
//       resetPasswordForm();
//     }, "Password changed successfully!");
//   }, [passwordForm, makeApiCall, resetPasswordForm]);

//   const handleProfilePicChange = useCallback((e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const error = validateFile(file);
//     if (error) {
//       setError(error);
//       return;
//     }

//     setProfilePicture(file);
//     clearMessages();
//   }, [setError, clearMessages]);

//   const handleUploadProfilePicture = useCallback(async (e) => {
//     e.preventDefault();
    
//     if (!profilePicture) {
//       setError("Please select a file.");
//       return;
//     }

//     await makeApiCall(async () => {
//       const formData = new FormData();
//       formData.append("profile_picture", profilePicture);
      
//       const response = await axios.post(ENDPOINTS.PROFILE_PICTURE, formData, {
//         headers: {
//           ...getAuthHeaders(),
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setUserProfile(prev => ({
//         ...prev,
//         profile_picture_url: response.data.profile_pic_url,
//       }));
      
//       setProfilePicture(null);
//       const fileInput = document.getElementById("profile_picture");
//       if (fileInput) fileInput.value = "";
      
//       return response.data;
//     }, "Profile picture updated successfully!");
//   }, [profilePicture, makeApiCall, setError]);

//   // ===================================
//   // EFFECTS
//   // ===================================

//   useEffect(() => {
//     if (!isAuthenticated && !contextLoading) {
//       navigate("/login");
//       return;
//     }

//     if (!isAuthenticated || contextLoading) return;

//     const initializeDashboard = async () => {
//       setInitialLoading(true);
      
//       try {
//         await fetchUserData();
//         const ordersData = await fetchOrders();
//         setOrders(ordersData);
//       } catch (error) {
//         console.error("Dashboard initialization error:", error);
//         if (error.response?.status === 401) {
//           sessionStorage.removeItem("token");
//           navigate("/login");
//         }
//       } finally {
//         setInitialLoading(false);
//       }
//     };

//     initializeDashboard();
//   }, [isAuthenticated, contextLoading, navigate, fetchUserData, fetchOrders]);

//   useEffect(() => {
//     if (error || success) {
//       const timer = setTimeout(clearMessages, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, success, clearMessages]);

//   // ===================================
//   // RENDER CONDITIONS
//   // ===================================

//   if (initialLoading || contextLoading || !userProfile) {
//     return (
//       <div className="container mt-5">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   // ===================================
//   // RENDER TAB CONTENT
//   // ===================================

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case TABS.OVERVIEW:
//         return (
//           <OverviewTab 
//             userProfile={userProfile} 
//             cart={cart} 
//             orders={orders} 
//           />
//         );
//       case TABS.ORDERS:
//         return (
//           <OrdersTab 
//             orders={orders} 
//             loading={apiLoading} 
//           />
//         );
//       case TABS.PROFILE:
//         return (
//           <ProfileTab
//             userProfile={userProfile}
//             profileForm={profileForm}
//             onInputChange={handleProfileChange}
//             onSubmit={handleUpdateProfile}
//             loading={apiLoading}
//             onFileChange={handleProfilePicChange}
//             onPictureSubmit={handleUploadProfilePicture}
//             selectedFile={profilePicture}
//           />
//         );
//       case TABS.SECURITY:
//         return (
//           <SecurityTab
//             passwordForm={passwordForm}
//             onInputChange={handlePasswordChange}
//             onSubmit={handleChangePassword}
//             loading={apiLoading}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   // ===================================
//   // MAIN RENDER
//   // ===================================

//   return (
//     <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
//       <div className="container-fluid px-4 py-4">
//         {/* Breadcrumb Navigation */}
//         <nav aria-label="breadcrumb" className="mb-4">
//           <ol className="breadcrumb bg-white px-3 py-2 rounded shadow-sm">
//             <li className="breadcrumb-item">
//               <Link to="/" className="text-decoration-none text-primary">
//                 <i className="bi bi-house-door me-1"></i>
//                 Home
//               </Link>
//             </li>
//             <li className="breadcrumb-item active fw-semibold" aria-current="page">
//               My Dashboard
//             </li>
//           </ol>
//         </nav>

//         {/* Page Header */}
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h1 className="h3 mb-1 fw-bold text-dark">
//               <i className="bi bi-speedometer2 me-2 text-primary"></i>
//               Dashboard
//             </h1>
//             <p className="text-muted mb-0">
//               Welcome back, <strong>{userProfile.name}</strong>
//             </p>
//           </div>
//           <div className="d-flex gap-2">
//             <Link to="/products" className="btn btn-outline-primary">
//               <i className="bi bi-shop me-1"></i>
//               Shop Now
//             </Link>
//             <Link to="/cart" className="btn btn-primary">
//               <i className="bi bi-cart3 me-1"></i>
//               Cart ({cart.length})
//             </Link>
//           </div>
//         </div>

//         {/* Alert Messages */}
//         <AlertMessage 
//           type="danger" 
//           message={error} 
//           onDismiss={clearMessages} 
//         />
//         <AlertMessage 
//           type="success" 
//           message={success} 
//           onDismiss={clearMessages} 
//         />

//         {/* Tab Navigation */}
//         <TabNavigation 
//           activeTab={activeTab} 
//           onTabChange={setActiveTab} 
//         />

//         {/* Tab Content */}
//         <div className="tab-content">
//           {renderTabContent()}
//         </div>
//       </div>

//       {/* Custom Styles */}
//       <style jsx>{`
//         .bg-gradient-primary {
//           background: linear-gradient(135deg, #0047ab 0%, #0056d3 100%);
//         }
        
//         .nav-pills .nav-link.active {
//           background-color: #0047ab !important;
//           box-shadow: 0 2px 4px rgba(0, 71, 171, 0.2);
//         }
        
//         .nav-pills .nav-link:not(.active):hover {
//           background-color: rgba(0, 71, 171, 0.1);
//           color: #0047ab !important;
//         }
        
//         .card {
//           border: none;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
//           transition: all 0.3s ease;
//         }
        
//         .card:hover {
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
//           transform: translateY(-2px);
//         }
        
//         .form-control-lg {
//           border-radius: 8px;
//           border: 2px solid #e9ecef;
//           transition: all 0.3s ease;
//         }
        
//         .form-control-lg:focus {
//           border-color: #0047ab;
//           box-shadow: 0 0 0 0.2rem rgba(0, 71, 171, 0.25);
//         }
        
//         .btn-lg {
//           border-radius: 8px;
//           padding: 12px 24px;
//           font-weight: 600;
//         }
        
//         .badge {
//           font-size: 0.75em;
//           padding: 0.5em 0.75em;
//         }
        
//         .table th {
//           font-weight: 600;
//           color: #495057;
//           border-top: none;
//           border-bottom: 2px solid #dee2e6;
//         }
        
//         .breadcrumb-item + .breadcrumb-item::before {
//           content: "›";
//           font-weight: bold;
//           color: #6c757d;
//         }
        
//         .display-1 {
//           font-size: 4rem;
//           opacity: 0.3;
//         }
        
//         .display-4 {
//           font-size: 2.5rem;
//         }
        
//         .display-6 {
//           font-size: 1.75rem;
//         }
        
//         @media (max-width: 768px) {
//           .nav-pills .nav-link {
//             font-size: 0.875rem;
//             padding: 10px 12px;
//           }
          
//           .nav-pills .nav-link i {
//             font-size: 1rem;
//           }
          
//           .card-body {
//             padding: 1rem;
//           }
          
//           .btn-lg {
//             padding: 10px 20px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default UserDashboard;


















// import React, { useContext, useState, useEffect, useCallback } from "react";
// import { CartContext } from "../context/CartContext";
// import { Link, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";

// // ===================================
// // CONSTANTS & CONFIGURATION
// // ===================================

// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

// const ENDPOINTS = {
//   ORDERS: `${API_BASE_URL}/orders/`,
//   PROFILE_UPDATE: `${API_BASE_URL}/auth/profile/update`,
//   PASSWORD_CHANGE: `${API_BASE_URL}/auth/profile/change_password`,
//   PROFILE_PICTURE: `${API_BASE_URL}/auth/profile/picture`,
// };

// const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// const ORDER_STATUS_COLORS = {
//   pending: "warning",
//   confirmed: "success",
//   processing: "info",
//   shipped: "primary",
//   delivered: "success",
//   cancelled: "danger",
// };

// const TABS = {
//   OVERVIEW: 'overview',
//   ORDERS: 'orders',
//   PROFILE: 'profile',
//   SECURITY: 'security'
// };

// // ===================================
// // CUSTOM HOOKS
// // ===================================

// const useFormState = (initialState) => {
//   const [formData, setFormData] = useState(initialState);

//   const updateField = useCallback((field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   }, []);

//   const handleInputChange = useCallback((e) => {
//     const { name, value } = e.target;
//     updateField(name, value);
//   }, [updateField]);

//   const resetForm = useCallback(() => {
//     setFormData(initialState);
//   }, [initialState]);

//   return {
//     formData,
//     updateField,
//     handleInputChange,
//     resetForm,
//     setFormData,
//   };
// };

// const useApiCall = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const clearMessages = useCallback(() => {
//     setError("");
//     setSuccess("");
//   }, []);

//   const makeApiCall = useCallback(async (apiCall, successMessage = "") => {
//     setLoading(true);
//     clearMessages();

//     try {
//       const result = await apiCall();
//       if (successMessage) {
//         setSuccess(successMessage);
//       }
//       return result;
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           "An unexpected error occurred";
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [clearMessages]);

//   return {
//     loading,
//     error,
//     success,
//     makeApiCall,
//     clearMessages,
//     setError,
//     setSuccess,
//   };
// };

// // ===================================
// // UTILITY FUNCTIONS
// // ===================================

// const formatCurrency = (amount) => {
//   const numericAmount = parseFloat(amount || 0);
//   return `UGX ${numericAmount.toLocaleString('en-UG', {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   })}`;
// };

// const formatDate = (dateString) => {
//   if (!dateString) return "-";
//   return new Date(dateString).toLocaleDateString('en-UG', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });
// };

// const getAuthHeaders = () => {
//   const token = sessionStorage.getItem("token");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// const validateFile = (file) => {
//   if (!file) return "Please select a file.";
  
//   if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
//     return "Invalid file type. Upload JPG, PNG, or WebP.";
//   }
  
//   if (file.size > MAX_FILE_SIZE) {
//     return "File too large. Maximum size is 5MB.";
//   }
  
//   return null;
// };

// const parseUserFromToken = (token) => {
//   try {
//     const decoded = jwtDecode(token);
//     return {
//       id: decoded.sub || decoded.user_id,
//       name: decoded.name || 
//             `${decoded.first_name || ""} ${decoded.last_name || ""}`.trim() || 
//             "User",
//       email: decoded.email || "",
//       phone: decoded.contact || "",
//       profile_picture_url: decoded.profile_picture_url || "",
//       first_name: decoded.first_name || "",
//       last_name: decoded.last_name || "",
//     };
//   } catch (error) {
//     throw new Error("Invalid token format");
//   }
// };

// // ===================================
// // UI COMPONENTS
// // ===================================

// const LoadingSpinner = ({ message = "Loading dashboard..." }) => (
//   <div className="d-flex flex-column align-items-center justify-content-center py-5">
//     <div className="spinner-border text-primary mb-3" role="status">
//       <span className="visually-hidden">Loading...</span>
//     </div>
//     <p className="text-muted">{message}</p>
//   </div>
// );

// const AlertMessage = ({ type, message, onDismiss }) => {
//   if (!message) return null;
  
//   return (
//     <div className={`alert alert-${type} alert-dismissible fade show mb-4`} role="alert">
//       <i className={`bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
//       {message}
//       {onDismiss && (
//         <button
//           type="button"
//           className="btn-close"
//           onClick={onDismiss}
//           aria-label="Close"
//         />
//       )}
//     </div>
//   );
// };

// // Tab Navigation Component
// const TabNavigation = ({ activeTab, onTabChange }) => {
//   const tabs = [
//     { key: TABS.OVERVIEW, label: 'Overview', icon: 'bi-house' },
//     { key: TABS.ORDERS, label: 'Orders', icon: 'bi-bag-check' },
//     { key: TABS.PROFILE, label: 'Profile', icon: 'bi-person-gear' },
//     { key: TABS.SECURITY, label: 'Security', icon: 'bi-shield-lock' }
//   ];

//   return (
//     <div className="card mb-4">
//       <div className="card-body p-0">
//         <nav className="nav nav-pills nav-fill">
//           {tabs.map(tab => (
//             <button
//               key={tab.key}
//               className={`nav-link d-flex align-items-center justify-content-center py-3 px-4 border-0 ${
//                 activeTab === tab.key ? 'active bg-primary text-white' : 'text-dark bg-transparent'
//               }`}
//               onClick={() => onTabChange(tab.key)}
//               style={{
//                 borderRadius: '0',
//                 transition: 'all 0.2s ease',
//                 fontWeight: '500'
//               }}
//             >
//               <i className={`${tab.icon} me-2`}></i>
//               {tab.label}
//             </button>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
// };

// // Overview Tab Content
// const OverviewTab = ({ userProfile, cart, orders }) => {
//   const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
//   const recentOrders = orders.slice(0, 3);

//   return (
//     <div className="row g-4">
//       {/* Welcome Section */}
//       <div className="col-12">
//         <div className="card bg-gradient-primary text-white">
//           <div className="card-body p-4">
//             <div className="row align-items-center">
//               <div className="col-md-8">
//                 <h3 className="mb-2">Welcome back, {userProfile.name}!</h3>
//                 <p className="mb-0 opacity-75">
//                   Manage your profile, orders, and account settings from your dashboard
//                 </p>
//               </div>
//               <div className="col-md-4 text-md-end">
//                 <img
//                   src={userProfile.profile_picture_url || "https://via.placeholder.com/80x80?text=Profile"}
//                   alt="Profile"
//                   className="rounded-circle border border-3 border-white"
//                   style={{ width: '80px', height: '80px', objectFit: 'cover' }}
//                   onError={(e) => {
//                     e.target.src = "https://via.placeholder.com/80x80?text=Profile";
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="col-md-4">
//         <div className="card h-100 border-0 shadow-sm">
//           <div className="card-body text-center p-4">
//             <div className="text-primary mb-3">
//               <i className="bi bi-bag-check display-4"></i>
//             </div>
//             <h4 className="fw-bold text-dark">{orders.length}</h4>
//             <p className="text-muted mb-0">Total Orders</p>
//           </div>
//         </div>
//       </div>

//       <div className="col-md-4">
//         <div className="card h-100 border-0 shadow-sm">
//           <div className="card-body text-center p-4">
//             <div className="text-success mb-3">
//               <i className="bi bi-cart3 display-4"></i>
//             </div>
//             <h4 className="fw-bold text-dark">{cart.length}</h4>
//             <p className="text-muted mb-0">Items in Cart</p>
//           </div>
//         </div>
//       </div>

//       <div className="col-md-4">
//         <div className="card h-100 border-0 shadow-sm">
//           <div className="card-body text-center p-4">
//             <div className="text-warning mb-3">
//               <i className="bi bi-currency-dollar display-4"></i>
//             </div>
//             <h4 className="fw-bold text-dark">{formatCurrency(cartTotal)}</h4>
//             <p className="text-muted mb-0">Cart Total</p>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="col-md-6">
//         <div className="card h-100 border-0 shadow-sm">
//           <div className="card-header bg-white border-bottom">
//             <h5 className="mb-0 fw-semibold">
//               <i className="bi bi-lightning-charge me-2 text-primary"></i>
//               Quick Actions
//             </h5>
//           </div>
//           <div className="card-body">
//             <div className="d-grid gap-2">
//               <Link to="/products" className="btn btn-outline-primary">
//                 <i className="bi bi-shop me-2"></i>
//                 Browse Products
//               </Link>
//               <Link to="/cart" className="btn btn-outline-success">
//                 <i className="bi bi-cart-check me-2"></i>
//                 View Cart ({cart.length})
//               </Link>
//               <button 
//                 className="btn btn-outline-info"
//                 onClick={() => window.location.href = '/support'}
//               >
//                 <i className="bi bi-headset me-2"></i>
//                 Contact Support
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Orders Preview */}
//       <div className="col-md-6">
//         <div className="card h-100 border-0 shadow-sm">
//           <div className="card-header bg-white border-bottom">
//             <h5 className="mb-0 fw-semibold">
//               <i className="bi bi-clock-history me-2 text-primary"></i>
//               Recent Orders
//             </h5>
//           </div>
//           <div className="card-body">
//             {recentOrders.length === 0 ? (
//               <div className="text-center py-3">
//                 <i className="bi bi-bag-x display-6 text-muted mb-2"></i>
//                 <p className="text-muted mb-0">No orders yet</p>
//               </div>
//             ) : (
//               <div className="list-group list-group-flush">
//                 {recentOrders.map((order) => (
//                   <div key={order.id} className="list-group-item px-0 border-0 border-bottom">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <h6 className="mb-1 fw-semibold">Order #{order.id}</h6>
//                         <small className="text-muted">{formatDate(order.created_at)}</small>
//                       </div>
//                       <div className="text-end">
//                         <div className="fw-bold text-primary">{formatCurrency(order.total)}</div>
//                         <span className={`badge bg-${ORDER_STATUS_COLORS[order.status] || 'secondary'} mt-1`}>
//                           {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Orders Tab Content
// const OrdersTab = ({ orders, loading }) => (
//   <div className="card border-0 shadow-sm">
//     <div className="card-header bg-white border-bottom">
//       <div className="d-flex justify-content-between align-items-center">
//         <h5 className="mb-0 fw-semibold">
//           <i className="bi bi-bag-check me-2 text-primary"></i>
//           Order History
//         </h5>
//         {orders.length > 0 && (
//           <span className="badge bg-primary">{orders.length} orders</span>
//         )}
//       </div>
//     </div>
//     <div className="card-body">
//       {loading ? (
//         <LoadingSpinner message="Loading orders..." />
//       ) : orders.length === 0 ? (
//         <div className="text-center py-5">
//           <i className="bi bi-bag-x display-1 text-muted mb-4"></i>
//           <h4 className="text-muted mb-3">No orders found</h4>
//           <p className="text-muted mb-4">Start shopping to see your orders here</p>
//           <Link to="/products" className="btn btn-primary btn-lg">
//             <i className="bi bi-shop me-2"></i>
//             Browse Products
//           </Link>
//         </div>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th className="fw-semibold">Order ID</th>
//                 <th className="fw-semibold">Date</th>
//                 <th className="fw-semibold">Total Amount</th>
//                 <th className="fw-semibold">Payment Method</th>
//                 <th className="fw-semibold">Status</th>
//                 <th className="fw-semibold text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.id}>
//                   <td>
//                     <strong className="text-primary">#{order.id}</strong>
//                   </td>
//                   <td>{formatDate(order.created_at)}</td>
//                   <td>
//                     <strong>{formatCurrency(order.total)}</strong>
//                   </td>
//                   <td>
//                     <span className="text-capitalize">
//                       {order.payment_method || "N/A"}
//                     </span>
//                   </td>
//                   <td>
//                     <span className={`badge bg-${ORDER_STATUS_COLORS[order.status] || 'secondary'}`}>
//                       {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Unknown"}
//                     </span>
//                   </td>
//                   <td className="text-center">
//                     <Link 
//                       to={`/orders/${order.id}`}
//                       className="btn btn-sm btn-outline-primary"
//                       title="View Order Details"
//                     >
//                       <i className="bi bi-eye me-1"></i>
//                       View
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   </div>
// );

// // Profile Tab Content
// const ProfileTab = ({ 
//   userProfile, 
//   profileForm, 
//   onInputChange, 
//   onSubmit, 
//   loading,
//   onFileChange,
//   onPictureSubmit,
//   selectedFile
// }) => (
//   <div className="row g-4">
//     {/* Profile Picture Section */}
//     <div className="col-lg-4">
//       <div className="card border-0 shadow-sm h-100">
//         <div className="card-header bg-white border-bottom">
//           <h5 className="mb-0 fw-semibold">
//             <i className="bi bi-image me-2 text-primary"></i>
//             Profile Picture
//           </h5>
//         </div>
//         <div className="card-body text-center">
//           <div className="mb-4">
//             <img
//               src={userProfile.profile_picture_url || "https://via.placeholder.com/150x150?text=Profile"}
//               alt="Profile"
//               className="rounded-circle border border-3 border-light shadow-sm"
//               style={{ width: '150px', height: '150px', objectFit: 'cover' }}
//               onError={(e) => {
//                 e.target.src = "https://via.placeholder.com/150x150?text=Profile";
//               }}
//             />
//           </div>
//           <form onSubmit={onPictureSubmit}>
//             <div className="mb-3">
//               <input
//                 id="profile_picture"
//                 type="file"
//                 className="form-control"
//                 accept="image/*"
//                 onChange={onFileChange}
//                 disabled={loading}
//               />
//               <div className="form-text">
//                 <small>Supported: JPG, PNG, WebP. Max: 5MB</small>
//               </div>
//               {selectedFile && (
//                 <div className="mt-2">
//                   <small className="text-success">
//                     <i className="bi bi-check-circle me-1"></i>
//                     {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
//                   </small>
//                 </div>
//               )}
//             </div>
//             <button
//               type="submit"
//               className="btn btn-primary w-100"
//               disabled={!selectedFile || loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" />
//                   Uploading...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-cloud-upload me-2"></i>
//                   Update Picture
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>

//     {/* Profile Information */}
//     <div className="col-lg-8">
//       <div className="card border-0 shadow-sm h-100">
//         <div className="card-header bg-white border-bottom">
//           <h5 className="mb-0 fw-semibold">
//             <i className="bi bi-person-gear me-2 text-primary"></i>
//             Profile Information
//           </h5>
//         </div>
//         <div className="card-body">
//           <form onSubmit={onSubmit}>
//             <div className="row g-3">
//               <div className="col-md-6">
//                 <label htmlFor="first_name" className="form-label fw-semibold">
//                   First Name <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   id="first_name"
//                   className="form-control form-control-lg"
//                   name="first_name"
//                   value={profileForm.first_name}
//                   onChange={onInputChange}
//                   placeholder="Enter first name"
//                   required
//                   disabled={loading}
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label htmlFor="last_name" className="form-label fw-semibold">
//                   Last Name <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   id="last_name"
//                   className="form-control form-control-lg"
//                   name="last_name"
//                   value={profileForm.last_name}
//                   onChange={onInputChange}
//                   placeholder="Enter last name"
//                   required
//                   disabled={loading}
//                 />
//               </div>
//               <div className="col-12">
//                 <label htmlFor="email" className="form-label fw-semibold">
//                   Email Address <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   id="email"
//                   className="form-control form-control-lg"
//                   type="email"
//                   name="email"
//                   value={profileForm.email}
//                   onChange={onInputChange}
//                   placeholder="Enter email address"
//                   required
//                   disabled={loading}
//                 />
//               </div>
//               <div className="col-12">
//                 <label htmlFor="contact" className="form-label fw-semibold">
//                   Phone Number
//                 </label>
//                 <input
//                   id="contact"
//                   className="form-control form-control-lg"
//                   name="contact"
//                   value={profileForm.contact}
//                   onChange={onInputChange}
//                   placeholder="Enter phone number"
//                   disabled={loading}
//                 />
//               </div>
//               <div className="col-12 pt-3">
//                 <button 
//                   type="submit" 
//                   className="btn btn-primary btn-lg w-100"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2" />
//                       Updating Profile...
//                     </>
//                   ) : (
//                     <>
//                       <i className="bi bi-check-circle me-2"></i>
//                       Update Profile
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Security Tab Content
// const SecurityTab = ({ 
//   passwordForm, 
//   onInputChange, 
//   onSubmit, 
//   loading 
// }) => (
//   <div className="row justify-content-center">
//     <div className="col-lg-6">
//       <div className="card border-0 shadow-sm">
//         <div className="card-header bg-white border-bottom">
//           <h5 className="mb-0 fw-semibold">
//             <i className="bi bi-shield-lock me-2 text-primary"></i>
//             Change Password
//           </h5>
//         </div>
//         <div className="card-body">
//           <div className="alert alert-info border-0 mb-4">
//             <i className="bi bi-info-circle me-2"></i>
//             <strong>Security Tip:</strong> Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.
//           </div>
//           <form onSubmit={onSubmit}>
//             <div className="mb-4">
//               <label htmlFor="current_password" className="form-label fw-semibold">
//                 Current Password <span className="text-danger">*</span>
//               </label>
//               <input
//                 id="current_password"
//                 className="form-control form-control-lg"
//                 type="password"
//                 name="current_password"
//                 value={passwordForm.current_password}
//                 onChange={onInputChange}
//                 placeholder="Enter your current password"
//                 required
//                 disabled={loading}
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="new_password" className="form-label fw-semibold">
//                 New Password <span className="text-danger">*</span>
//               </label>
//               <input
//                 id="new_password"
//                 className="form-control form-control-lg"
//                 type="password"
//                 name="new_password"
//                 value={passwordForm.new_password}
//                 onChange={onInputChange}
//                 placeholder="Enter your new password"
//                 minLength="6"
//                 required
//                 disabled={loading}
//               />
//               <div className="form-text">
//                 <i className="bi bi-info-circle me-1"></i>
//                 Password must be at least 6 characters long
//               </div>
//             </div>
//             <button 
//               type="submit" 
//               className="btn btn-primary btn-lg w-100"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" />
//                   Changing Password...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-shield-check me-2"></i>
//                   Change Password
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // ===================================
// // MAIN COMPONENT
// // ===================================

// const UserDashboard = () => {
//   // Context and Navigation
//   const { isAuthenticated, isLoading: contextLoading, cart = [] } = useContext(CartContext);
//   const navigate = useNavigate();

//   // State Management
//   const [userProfile, setUserProfile] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);

//   // Custom Hooks
//   const {
//     formData: profileForm,
//     handleInputChange: handleProfileChange,
//     setFormData: setProfileForm,
//   } = useFormState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     contact: "",
//   });

//   const {
//     formData: passwordForm,
//     handleInputChange: handlePasswordChange,
//     resetForm: resetPasswordForm,
//   } = useFormState({
//     current_password: "",
//     new_password: "",
//   });

//   const {
//     loading: apiLoading,
//     error,
//     success,
//     makeApiCall,
//     clearMessages,
//     setError,
//   } = useApiCall();

//   // ===================================
//   // API FUNCTIONS
//   // ===================================

//   const fetchUserData = useCallback(async () => {
//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       const userData = parseUserFromToken(token);
//       setUserProfile(userData);
//       setProfileForm({
//         first_name: userData.first_name,
//         last_name: userData.last_name,
//         email: userData.email,
//         contact: userData.phone,
//       });
//     } catch (error) {
//       console.error("Token parsing error:", error);
//       sessionStorage.removeItem("token");
//       navigate("/login");
//     }
//   }, [navigate, setProfileForm]);

//   const fetchOrders = useCallback(async () => {
//     const response = await axios.get(ENDPOINTS.ORDERS, {
//       headers: getAuthHeaders(),
//     });
//     return response.data.orders || [];
//   }, []);

//   // ===================================
//   // EVENT HANDLERS
//   // ===================================

//   const handleUpdateProfile = useCallback(async (e) => {
//     e.preventDefault();
    
//     await makeApiCall(async () => {
//       await axios.put(ENDPOINTS.PROFILE_UPDATE, profileForm, {
//         headers: getAuthHeaders(),
//       });
      
//       setUserProfile(prev => ({
//         ...prev,
//         name: `${profileForm.first_name} ${profileForm.last_name}`.trim(),
//         email: profileForm.email,
//         phone: profileForm.contact,
//         first_name: profileForm.first_name,
//         last_name: profileForm.last_name,
//       }));
//     }, "Profile updated successfully!");
//   }, [profileForm, makeApiCall]);

//   const handleChangePassword = useCallback(async (e) => {
//     e.preventDefault();
    
//     await makeApiCall(async () => {
//       await axios.post(ENDPOINTS.PASSWORD_CHANGE, passwordForm, {
//         headers: getAuthHeaders(),
//       });
//       resetPasswordForm();
//     }, "Password changed successfully!");
//   }, [passwordForm, makeApiCall, resetPasswordForm]);

//   const handleProfilePicChange = useCallback((e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const error = validateFile(file);
//     if (error) {
//       setError(error);
//       return;
//     }

//     setProfilePicture(file);
//     clearMessages();
//   }, [setError, clearMessages]);

//   const handleUploadProfilePicture = useCallback(async (e) => {
//     e.preventDefault();
    
//     if (!profilePicture) {
//       setError("Please select a file.");
//       return;
//     }

//     await makeApiCall(async () => {
//       const formData = new FormData();
//       formData.append("profile_picture", profilePicture);
      
//       const response = await axios.post(ENDPOINTS.PROFILE_PICTURE, formData, {
//         headers: {
//           ...getAuthHeaders(),
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setUserProfile(prev => ({
//         ...prev,
//         profile_picture_url: response.data.profile_pic_url,
//       }));
      
//       setProfilePicture(null);
//       const fileInput = document.getElementById("profile_picture");
//       if (fileInput) fileInput.value = "";
      
//       return response.data;
//     }, "Profile picture updated successfully!");
//   }, [profilePicture, makeApiCall, setError]);

//   // ===================================
//   // EFFECTS
//   // ===================================

//   useEffect(() => {
//     if (!isAuthenticated && !contextLoading) {
//       navigate("/login");
//       return;
//     }

//     if (!isAuthenticated || contextLoading) return;

//     const initializeDashboard = async () => {
//       setInitialLoading(true);
      
//       try {
//         await fetchUserData();
//         const ordersData = await fetchOrders();
//         setOrders(ordersData);
//       } catch (error) {
//         console.error("Dashboard initialization error:", error);
//         if (error.response?.status === 401) {
//           sessionStorage.removeItem("token");
//           navigate("/login");
//         }
//       } finally {
//         setInitialLoading(false);
//       }
//     };

//     initializeDashboard();
//   }, [isAuthenticated, contextLoading, navigate, fetchUserData, fetchOrders]);

//   useEffect(() => {
//     if (error || success) {
//       const timer = setTimeout(clearMessages, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, success, clearMessages]);

//   // ===================================
//   // RENDER CONDITIONS
//   // ===================================

//   if (initialLoading || contextLoading || !userProfile) {
//     return (
//       <div className="container mt-5">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   // ===================================
//   // RENDER TAB CONTENT
//   // ===================================

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case TABS.OVERVIEW:
//         return (
//           <OverviewTab 
//             userProfile={userProfile} 
//             cart={cart} 
//             orders={orders} 
//           />
//         );
//       case TABS.ORDERS:
//         return (
//           <OrdersTab 
//             orders={orders} 
//             loading={apiLoading} 
//           />
//         );
//       case TABS.PROFILE:
//         return (
//           <ProfileTab
//             userProfile={userProfile}
//             profileForm={profileForm}
//             onInputChange={handleProfileChange}
//             onSubmit={handleUpdateProfile}
//             loading={apiLoading}
//             onFileChange={handleProfilePicChange}
//             onPictureSubmit={handleUploadProfilePicture}
//             selectedFile={profilePicture}
//           />
//         );
//       case TABS.SECURITY:
//         return (
//           <SecurityTab
//             passwordForm={passwordForm}
//             onInputChange={handlePasswordChange}
//             onSubmit={handleChangePassword}
//             loading={apiLoading}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   // ===================================
//   // MAIN RENDER
//   // ===================================

//   return (
//     <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
//       <div className="container-fluid px-4 py-4">
//         {/* Breadcrumb Navigation */}
//         <nav aria-label="breadcrumb" className="mb-4">
//           <ol className="breadcrumb bg-white px-3 py-2 rounded shadow-sm">
//             <li className="breadcrumb-item">
//               <Link to="/" className="text-decoration-none text-primary">
//                 <i className="bi bi-house-door me-1"></i>
//                 Home
//               </Link>
//             </li>
//             <li className="breadcrumb-item active fw-semibold" aria-current="page">
//               My Dashboard
//             </li>
//           </ol>
//         </nav>

//         {/* Page Header */}
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h1 className="h3 mb-1 fw-bold text-dark">
//               <i className="bi bi-speedometer2 me-2 text-primary"></i>
//               Dashboard
//             </h1>
//             <p className="text-muted mb-0">
//               Welcome back, <strong>{userProfile.name}</strong>
//             </p>
//           </div>
//           <div className="d-flex gap-2">
//             <Link to="/products" className="btn btn-outline-primary">
//               <i className="bi bi-shop me-1"></i>
//               Shop Now
//             </Link>
//             <Link to="/cart" className="btn btn-primary">
//               <i className="bi bi-cart3 me-1"></i>
//               Cart ({cart.length})
//             </Link>
//           </div>
//         </div>

//         {/* Alert Messages */}
//         <AlertMessage 
//           type="danger" 
//           message={error} 
//           onDismiss={clearMessages} 
//         />
//         <AlertMessage 
//           type="success" 
//           message={success} 
//           onDismiss={clearMessages} 
//         />

//         {/* Tab Navigation */}
//         <TabNavigation 
//           activeTab={activeTab} 
//           onTabChange={setActiveTab} 
//         />

//         {/* Tab Content */}
//         <div className="tab-content">
//           {renderTabContent()}
//         </div>
//       </div>

//       {/* Custom Styles */}
//       <style jsx>{`
//         .bg-gradient-primary {
//           background: linear-gradient(135deg, #0047ab 0%, #0056d3 100%);
//         }
        
//         .nav-pills .nav-link.active {
//           background-color: #0047ab !important;
//           box-shadow: 0 2px 4px rgba(0, 71, 171, 0.2);
//         }
        
//         .nav-pills .nav-link:not(.active):hover {
//           background-color: rgba(0, 71, 171, 0.1);
//           color: #0047ab !important;
//         }
        
//         .card {
//           border: none;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
//           transition: all 0.3s ease;
//         }
        
//         .card:hover {
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
//           transform: translateY(-2px);
//         }
        
//         .form-control-lg {
//           border-radius: 8px;
//           border: 2px solid #e9ecef;
//           transition: all 0.3s ease;
//         }
        
//         .form-control-lg:focus {
//           border-color: #0047ab;
//           box-shadow: 0 0 0 0.2rem rgba(0, 71, 171, 0.25);
//         }
        
//         .btn-lg {
//           border-radius: 8px;
//           padding: 12px 24px;
//           font-weight: 600;
//         }
        
//         .badge {
//           font-size: 0.75em;
//           padding: 0.5em 0.75em;
//         }
        
//         .table th {
//           font-weight: 600;
//           color: #495057;
//           border-top: none;
//           border-bottom: 2px solid #dee2e6;
//         }
        
//         .breadcrumb-item + .breadcrumb-item::before {
//           content: "›";
//           font-weight: bold;
//           color: #6c757d;
//         }
        
//         .display-1 {
//           font-size: 4rem;
//           opacity: 0.3;
//         }
        
//         .display-4 {
//           font-size: 2.5rem;
//         }
        
//         .display-6 {
//           font-size: 1.75rem;
//         }
        
//         @media (max-width: 768px) {
//           .nav-pills .nav-link {
//             font-size: 0.875rem;
//             padding: 10px 12px;
//           }
          
//           .nav-pills .nav-link i {
//             font-size: 1rem;
//           }
          
//           .card-body {
//             padding: 1rem;
//           }
          
//           .btn-lg {
//             padding: 10px 20px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default UserDashboard;



import React, { useContext, useState, useEffect, useCallback } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API_BASE_URL from "../config";

// ===================================
// CONSTANTS & CONFIGURATION
// ===================================

// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const ENDPOINTS = {
  ORDERS: `${API_BASE_URL}/orders/`,
  PROFILE_UPDATE: `${API_BASE_URL}/auth/profile/update`,
  PASSWORD_CHANGE: `${API_BASE_URL}/auth/profile/change_password`,
  PROFILE_PICTURE: `${API_BASE_URL}/auth/profile/picture`,
};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ORDER_STATUS_COLORS = {
  pending: "warning",
  confirmed: "success", 
  processing: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "danger",
};

const TABS = {
  OVERVIEW: 'overview',
  ORDERS: 'orders',
  PROFILE: 'profile',
  SECURITY: 'security'
};

// ===================================
// CUSTOM HOOKS
// ===================================

const useFormState = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    updateField(name, value);
  }, [updateField]);

  const resetForm = useCallback(() => {
    setFormData(initialState);
  }, [initialState]);

  return {
    formData,
    updateField,
    handleInputChange,
    resetForm,
    setFormData,
  };
};

const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  const makeApiCall = useCallback(async (apiCall, successMessage = "") => {
    setLoading(true);
    clearMessages();

    try {
      const result = await apiCall();
      if (successMessage) {
        setSuccess(successMessage);
      }
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "An unexpected error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  return {
    loading,
    error,
    success,
    makeApiCall,
    clearMessages,
    setError,
    setSuccess,
  };
};

// ===================================
// UTILITY FUNCTIONS
// ===================================

const formatCurrency = (amount) => {
  const numericAmount = parseFloat(amount || 0);
  return `UGX ${numericAmount.toLocaleString('en-UG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const validateFile = (file) => {
  if (!file) return "Please select a file.";
  
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Invalid file type. Upload JPG, PNG, or WebP.";
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return "File too large. Maximum size is 5MB.";
  }
  
  return null;
};

const parseUserFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.sub || decoded.user_id,
      name: decoded.name || 
            `${decoded.first_name || ""} ${decoded.last_name || ""}`.trim() || 
            "User",
      email: decoded.email || "",
      phone: decoded.contact || "",
      profile_picture_url: decoded.profile_picture_url || "",
      first_name: decoded.first_name || "",
      last_name: decoded.last_name || "",
    };
  } catch (error) {
    throw new Error("Invalid token format");
  }
};

// ===================================
// UI COMPONENTS
// ===================================

const LoadingSpinner = ({ message = "Loading dashboard..." }) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5">
    <div className="spinner-border" style={{ color: 'var(--primary-color)' }} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p style={{ color: 'var(--grey-color)' }} className="mt-3">{message}</p>
  </div>
);

const AlertMessage = ({ type, message, onDismiss }) => {
  if (!message) return null;
  
  const getAlertColor = (type) => {
    switch(type) {
      case 'success': return 'var(--primary-color)';
      case 'danger': return '#dc3545';
      case 'warning': return 'var(--secondary-color)';
      default: return 'var(--primary-color)';
    }
  };
  
  return (
    <div 
      className="alert alert-dismissible fade show mb-4" 
      role="alert"
      style={{ 
        backgroundColor: `${getAlertColor(type)}15`,
        borderColor: getAlertColor(type),
        color: getAlertColor(type),
        border: `1px solid ${getAlertColor(type)}`
      }}
    >
      <i className={`bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
      {message}
      {onDismiss && (
        <button
          type="button"
          className="btn-close"
          onClick={onDismiss}
          aria-label="Close"
        />
      )}
    </div>
  );
};

// Tab Navigation Component
const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: TABS.OVERVIEW, label: 'Overview', icon: 'bi-house' },
    { key: TABS.ORDERS, label: 'Orders', icon: 'bi-bag-check' },
    { key: TABS.PROFILE, label: 'Profile', icon: 'bi-person-gear' },
    { key: TABS.SECURITY, label: 'Security', icon: 'bi-shield-lock' }
  ];

  return (
    <div className="card mb-4" style={{ border: 'none', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)' }}>
      <div className="card-body p-0">
        <nav className="nav nav-pills nav-fill">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`nav-link d-flex align-items-center justify-content-center py-3 px-4 border-0`}
              onClick={() => onTabChange(tab.key)}
              style={{
                borderRadius: '0',
                transition: 'all 0.2s ease',
                fontWeight: '500',
                backgroundColor: activeTab === tab.key ? 'var(--primary-color)' : 'transparent',
                color: activeTab === tab.key ? 'white' : 'var(--grey-color)',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.key) {
                  e.target.style.backgroundColor = 'var(--tertiary-color)';
                  e.target.style.color = 'var(--primary-color)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.key) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--grey-color)';
                }
              }}
            >
              <i className={`${tab.icon} me-2`}></i>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Overview Tab Content
const OverviewTab = ({ userProfile, cart, orders }) => {
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="row g-4">
      {/* Welcome Section */}
      <div className="col-12">
        <div 
          className="card text-white"
          style={{
            background: `linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)`,
            border: 'none'
          }}
        >
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h3 className="mb-2">Welcome back, {userProfile.name}!</h3>
                <p className="mb-0 opacity-75">
                  Manage your profile, orders, and account settings from your dashboard
                </p>
              </div>
              <div className="col-md-4 text-md-end">
                <img
                  src={userProfile.profile_picture_url || "https://via.placeholder.com/80x80?text=Profile"}
                  alt="Profile"
                  className="rounded-circle border border-3 border-white"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80x80?text=Profile";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="col-md-4">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body text-center p-4">
            <div className="mb-3" style={{ color: 'var(--primary-color)' }}>
              <i className="bi bi-bag-check display-4"></i>
            </div>
            <h4 className="fw-bold" style={{ color: 'var(--primary-color)' }}>{orders.length}</h4>
            <p className="mb-0" style={{ color: 'var(--grey-color)' }}>Total Orders</p>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body text-center p-4">
            <div className="mb-3" style={{ color: 'var(--secondary-color)' }}>
              <i className="bi bi-cart3 display-4"></i>
            </div>
            <h4 className="fw-bold" style={{ color: 'var(--primary-color)' }}>{cart.length}</h4>
            <p className="mb-0" style={{ color: 'var(--grey-color)' }}>Items in Cart</p>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body text-center p-4">
            <div className="mb-3" style={{ color: 'var(--secondary-color)' }}>
              <i className="bi bi-currency-dollar display-4"></i>
            </div>
            <h4 className="fw-bold" style={{ color: 'var(--primary-color)' }}>{formatCurrency(cartTotal)}</h4>
            <p className="mb-0" style={{ color: 'var(--grey-color)' }}>Cart Total</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="col-md-6">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-header" style={{ backgroundColor: 'var(--tertiary-color)', border: 'none' }}>
            <h5 className="mb-0 fw-semibold" style={{ color: 'var(--primary-color)' }}>
              <i className="bi bi-lightning-charge me-2"></i>
              Quick Actions
            </h5>
          </div>
          <div className="card-body">
            <div className="d-grid gap-2">
              <Link 
                to="/products" 
                className="btn"
                style={{
                  backgroundColor: 'transparent',
                  border: `2px solid var(--primary-color)`,
                  color: 'var(--primary-color)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--primary-color)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--primary-color)';
                }}
              >
                <i className="bi bi-shop me-2"></i>
                Browse Products
              </Link>
              <Link 
                to="/cart" 
                className="btn"
                style={{
                  backgroundColor: 'transparent',
                  border: `2px solid var(--secondary-color)`,
                  color: 'var(--secondary-color)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--secondary-color)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--secondary-color)';
                }}
              >
                <i className="bi bi-cart-check me-2"></i>
                View Cart ({cart.length})
              </Link>
              <button 
                className="btn"
                onClick={() => window.location.href = '/support'}
                style={{
                  backgroundColor: 'transparent',
                  border: `2px solid var(--grey-color)`,
                  color: 'var(--grey-color)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--grey-color)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--grey-color)';
                }}
              >
                <i className="bi bi-headset me-2"></i>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="col-md-6">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-header" style={{ backgroundColor: 'var(--tertiary-color)', border: 'none' }}>
            <h5 className="mb-0 fw-semibold" style={{ color: 'var(--primary-color)' }}>
              <i className="bi bi-clock-history me-2"></i>
              Recent Orders
            </h5>
          </div>
          <div className="card-body">
            {recentOrders.length === 0 ? (
              <div className="text-center py-3">
                <i className="bi bi-bag-x display-6 mb-2" style={{ color: 'var(--grey-color)', opacity: '0.3' }}></i>
                <p className="mb-0" style={{ color: 'var(--grey-color)' }}>No orders yet</p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {recentOrders.map((order) => (
                  <div key={order.id} className="list-group-item px-0 border-0 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 fw-semibold" style={{ color: 'var(--primary-color)' }}>Order #{order.id}</h6>
                        <small style={{ color: 'var(--grey-color)' }}>{formatDate(order.created_at)}</small>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold" style={{ color: 'var(--primary-color)' }}>{formatCurrency(order.total)}</div>
                        <span 
                          className="badge mt-1"
                          style={{
                            backgroundColor: order.status === 'delivered' || order.status === 'confirmed' 
                              ? 'var(--primary-color)' 
                              : order.status === 'pending' 
                                ? 'var(--secondary-color)'
                                : 'var(--grey-color)',
                            color: 'white'
                          }}
                        >
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Orders Tab Content
const OrdersTab = ({ orders, loading }) => (
  <div className="card border-0 shadow-sm">
    <div className="card-header" style={{ backgroundColor: 'var(--tertiary-color)', border: 'none' }}>
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-semibold" style={{ color: 'var(--primary-color)' }}>
          <i className="bi bi-bag-check me-2"></i>
          Order History
        </h5>
        {orders.length > 0 && (
          <span 
            className="badge" 
            style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
          >
            {orders.length} orders
          </span>
        )}
      </div>
    </div>
    <div className="card-body">
      {loading ? (
        <LoadingSpinner message="Loading orders..." />
      ) : orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-bag-x mb-4" style={{ fontSize: '4rem', color: 'var(--grey-color)', opacity: '0.3' }}></i>
          <h4 className="mb-3" style={{ color: 'var(--grey-color)' }}>No orders found</h4>
          <p className="mb-4" style={{ color: 'var(--grey-color)' }}>Start shopping to see your orders here</p>
          <Link 
            to="/products" 
            className="btn btn-lg"
            style={{ 
              backgroundColor: 'var(--primary-color)', 
              borderColor: 'var(--primary-color)',
              color: 'white'
            }}
          >
            <i className="bi bi-shop me-2"></i>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ backgroundColor: 'var(--tertiary-color)' }}>
              <tr>
                <th className="fw-semibold" style={{ color: 'var(--primary-color)' }}>Order ID</th>
                <th className="fw-semibold" style={{ color: 'var(--primary-color)' }}>Date</th>
                <th className="fw-semibold" style={{ color: 'var(--primary-color)' }}>Total Amount</th>
                <th className="fw-semibold" style={{ color: 'var(--primary-color)' }}>Payment Method</th>
                <th className="fw-semibold" style={{ color: 'var(--primary-color)' }}>Status</th>
                <th className="fw-semibold text-center" style={{ color: 'var(--primary-color)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong style={{ color: 'var(--primary-color)' }}>#{order.id}</strong>
                  </td>
                  <td style={{ color: 'var(--grey-color)' }}>{formatDate(order.created_at)}</td>
                  <td>
                    <strong style={{ color: 'var(--primary-color)' }}>{formatCurrency(order.total)}</strong>
                  </td>
                  <td>
                    <span className="text-capitalize" style={{ color: 'var(--grey-color)' }}>
                      {order.payment_method || "N/A"}
                    </span>
                  </td>
                  <td>
                    <span 
                      className="badge"
                      style={{
                        backgroundColor: order.status === 'delivered' || order.status === 'confirmed' 
                          ? 'var(--primary-color)' 
                          : order.status === 'pending' 
                            ? 'var(--secondary-color)'
                            : 'var(--grey-color)',
                        color: 'white'
                      }}
                    >
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Unknown"}
                    </span>
                  </td>
                  <td className="text-center">
                    <Link 
                      to={`/orders/${order.id}`}
                      className="btn btn-sm"
                      title="View Order Details"
                      style={{
                        backgroundColor: 'transparent',
                        border: `1px solid var(--primary-color)`,
                        color: 'var(--primary-color)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--primary-color)';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'var(--primary-color)';
                      }}
                    >
                      <i className="bi bi-eye me-1"></i>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

// Profile Tab Content
const ProfileTab = ({ 
  userProfile, 
  profileForm, 
  onInputChange, 
  onSubmit, 
  loading,
  onFileChange,
  onPictureSubmit,
  selectedFile
}) => (
  <div className="row g-4">
    {/* Profile Picture Section */}
    <div className="col-lg-4">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header" style={{ backgroundColor: 'var(--tertiary-color)', border: 'none' }}>
          <h5 className="mb-0 fw-semibold" style={{ color: 'var(--primary-color)' }}>
            <i className="bi bi-image me-2"></i>
            Profile Picture
          </h5>
        </div>
        <div className="card-body text-center">
          <div className="mb-4">
            <img
              src={userProfile.profile_picture_url || "https://via.placeholder.com/150x150?text=Profile"}
              alt="Profile"
              className="rounded-circle border border-3 shadow-sm"
              style={{ 
                width: '150px', 
                height: '150px', 
                objectFit: 'cover',
                borderColor: 'var(--tertiary-color) !important'
              }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150x150?text=Profile";
              }}
            />
          </div>
          <form onSubmit={onPictureSubmit}>
            <div className="mb-3">
              <input
                id="profile_picture"
                type="file"
                className="form-control"
                accept="image/*"
                onChange={onFileChange}
                disabled={loading}
                style={{
                  borderColor: 'var(--tertiary-color)',
                  borderWidth: '2px'
                }}
              />
              <div className="form-text" style={{ color: 'var(--grey-color)' }}>
                <small>Supported: JPG, PNG, WebP. Max: 5MB</small>
              </div>
              {selectedFile && (
                <div className="mt-2">
                  <small style={{ color: 'var(--primary-color)' }}>
                    <i className="bi bi-check-circle me-1"></i>
                    {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </small>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn w-100"
              disabled={!selectedFile || loading}
              style={{
                backgroundColor: selectedFile && !loading ? 'var(--primary-color)' : 'var(--grey-color)',
                borderColor: selectedFile && !loading ? 'var(--primary-color)' : 'var(--grey-color)',
                color: 'white'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <i className="bi bi-cloud-upload me-2"></i>
                  Update Picture
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>

    {/* Profile Information */}
    <div className="col-lg-8">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header" style={{ backgroundColor: 'var(--tertiary-color)', border: 'none' }}>
          <h5 className="mb-0 fw-semibold" style={{ color: 'var(--primary-color)' }}>
            <i className="bi bi-person-gear me-2"></i>
            Profile Information
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="first_name" className="form-label fw-semibold" style={{ color: 'var(--primary-color)' }}>
                  First Name <span style={{ color: 'var(--secondary-color)' }}>*</span>
                </label>
                <input
                  id="first_name"
                  className="form-control form-control-lg"
                  name="first_name"
                  value={profileForm.first_name}
                  onChange={onInputChange}
                  placeholder="Enter first name"
                  required
                  disabled={loading}
                  style={{
                    borderColor: 'var(--tertiary-color)',
                    borderWidth: '2px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--tertiary-color)'}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="last_name" className="form-label fw-semibold" style={{ color: 'var(--primary-color)' }}>
                  Last Name <span style={{ color: 'var(--secondary-color)' }}>*</span>
                </label>
                <input
                  id="last_name"
                  className="form-control form-control-lg"
                  name="last_name"
                  value={profileForm.last_name}
                  onChange={onInputChange}
                  placeholder="Enter last name"
                  required
                  disabled={loading}
                  style={{
                    borderColor: 'var(--tertiary-color)',
                    borderWidth: '2px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--tertiary-color)'}
                />
              </div>
              <div className="col-12">
                <label htmlFor="email" className="form-label fw-semibold" style={{ color: 'var(--primary-color)' }}>
                  Email Address <span style={{ color: 'var(--secondary-color)' }}>*</span>
                </label>
                <input
                  id="email"
                  className="form-control form-control-lg"
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={onInputChange}
                  placeholder="Enter email address"
                  required
                  disabled={loading}
                  style={{
                    borderColor: 'var(--tertiary-color)',
                    borderWidth: '2px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--tertiary-color)'}
                />
              </div>
              <div className="col-12">
                <label htmlFor="contact" className="form-label fw-semibold" style={{ color: 'var(--primary-color)' }}>
                  Phone Number
                </label>
                <input
                  id="contact"
                  className="form-control form-control-lg"
                  name="contact"
                  value={profileForm.contact}
                  onChange={onInputChange}
                  placeholder="Enter phone number"
                  disabled={loading}
                  style={{
                    borderColor: 'var(--tertiary-color)',
                    borderWidth: '2px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--tertiary-color)'}
                />
              </div>
              <div className="col-12 pt-3">
                <button 
                  type="submit" 
                  className="btn btn-lg w-100"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? 'var(--grey-color)' : 'var(--primary-color)',
                    borderColor: loading ? 'var(--grey-color)' : 'var(--primary-color)',
                    color: 'white'
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Updating Profile...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Update Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);

// Security Tab Content
const SecurityTab = ({ 
  passwordForm, 
  onInputChange, 
  onSubmit, 
  loading 
}) => (
  <div className="row justify-content-center">
    <div className="col-lg-6">
      <div className="card border-0 shadow-sm">
        <div className="card-header" style={{ backgroundColor: 'var(--tertiary-color)', border: 'none' }}>
          <h5 className="mb-0 fw-semibold" style={{ color: 'var(--primary-color)' }}>
            <i className="bi bi-shield-lock me-2"></i>
            Change Password
          </h5>
        </div>
        <div className="card-body">
          <div 
            className="alert border-0 mb-4"
            style={{
              backgroundColor: 'var(--primary-color)15',
              borderColor: 'var(--primary-color)',
              color: 'var(--primary-color)'
            }}
          >
            <i className="bi bi-info-circle me-2"></i>
            <strong>Security Tip:</strong> Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.
          </div>
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label htmlFor="current_password" className="form-label fw-semibold" style={{ color: 'var(--primary-color)' }}>
                Current Password <span style={{ color: 'var(--secondary-color)' }}>*</span>
              </label>
              <input
                id="current_password"
                className="form-control form-control-lg"
                type="password"
                name="current_password"
                value={passwordForm.current_password}
                onChange={onInputChange}
                placeholder="Enter your current password"
                required
                disabled={loading}
                style={{
                  borderColor: 'var(--tertiary-color)',
                  borderWidth: '2px'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--tertiary-color)'}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="new_password" className="form-label fw-semibold" style={{ color: 'var(--primary-color)' }}>
                New Password <span style={{ color: 'var(--secondary-color)' }}>*</span>
              </label>
              <input
                id="new_password"
                className="form-control form-control-lg"
                type="password"
                name="new_password"
                value={passwordForm.new_password}
                onChange={onInputChange}
                placeholder="Enter your new password"
                minLength="6"
                required
                disabled={loading}
                style={{
                  borderColor: 'var(--tertiary-color)',
                  borderWidth: '2px'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--tertiary-color)'}
              />
              <div className="form-text" style={{ color: 'var(--grey-color)' }}>
                <i className="bi bi-info-circle me-1"></i>
                Password must be at least 6 characters long
              </div>
            </div>
            <button 
              type="submit" 
              className="btn btn-lg w-100"
              disabled={loading}
              style={{
                backgroundColor: loading ? 'var(--grey-color)' : 'var(--primary-color)',
                borderColor: loading ? 'var(--grey-color)' : 'var(--primary-color)',
                color: 'white'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Changing Password...
                </>
              ) : (
                <>
                  <i className="bi bi-shield-check me-2"></i>
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);

// ===================================
// MAIN COMPONENT
// ===================================

const UserDashboard = () => {
  // Context and Navigation
  const { isAuthenticated, isLoading: contextLoading, cart = [] } = useContext(CartContext);
  const navigate = useNavigate();

  // State Management
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);

  // Custom Hooks
  const {
    formData: profileForm,
    handleInputChange: handleProfileChange,
    setFormData: setProfileForm,
  } = useFormState({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
  });

  const {
    formData: passwordForm,
    handleInputChange: handlePasswordChange,
    resetForm: resetPasswordForm,
  } = useFormState({
    current_password: "",
    new_password: "",
  });

  const {
    loading: apiLoading,
    error,
    success,
    makeApiCall,
    clearMessages,
    setError,
  } = useApiCall();

  // ===================================
  // API FUNCTIONS
  // ===================================

  const fetchUserData = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const userData = parseUserFromToken(token);
      setUserProfile(userData);
      setProfileForm({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        contact: userData.phone,
      });
    } catch (error) {
      console.error("Token parsing error:", error);
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate, setProfileForm]);

  const fetchOrders = useCallback(async () => {
    const response = await axios.get(ENDPOINTS.ORDERS, {
      headers: getAuthHeaders(),
    });
    return response.data.orders || [];
  }, []);

  // ===================================
  // EVENT HANDLERS
  // ===================================

  const handleUpdateProfile = useCallback(async (e) => {
    e.preventDefault();
    
    await makeApiCall(async () => {
      await axios.put(ENDPOINTS.PROFILE_UPDATE, profileForm, {
        headers: getAuthHeaders(),
      });
      
      setUserProfile(prev => ({
        ...prev,
        name: `${profileForm.first_name} ${profileForm.last_name}`.trim(),
        email: profileForm.email,
        phone: profileForm.contact,
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
      }));
    }, "Profile updated successfully!");
  }, [profileForm, makeApiCall]);

  const handleChangePassword = useCallback(async (e) => {
    e.preventDefault();
    
    await makeApiCall(async () => {
      await axios.post(ENDPOINTS.PASSWORD_CHANGE, passwordForm, {
        headers: getAuthHeaders(),
      });
      resetPasswordForm();
    }, "Password changed successfully!");
  }, [passwordForm, makeApiCall, resetPasswordForm]);

  const handleProfilePicChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setError(error);
      return;
    }

    setProfilePicture(file);
    clearMessages();
  }, [setError, clearMessages]);

  const handleUploadProfilePicture = useCallback(async (e) => {
    e.preventDefault();
    
    if (!profilePicture) {
      setError("Please select a file.");
      return;
    }

    await makeApiCall(async () => {
      const formData = new FormData();
      formData.append("profile_picture", profilePicture);
      
      const response = await axios.post(ENDPOINTS.PROFILE_PICTURE, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      setUserProfile(prev => ({
        ...prev,
        profile_picture_url: response.data.profile_pic_url,
      }));
      
      setProfilePicture(null);
      const fileInput = document.getElementById("profile_picture");
      if (fileInput) fileInput.value = "";
      
      return response.data;
    }, "Profile picture updated successfully!");
  }, [profilePicture, makeApiCall, setError]);

  // ===================================
  // EFFECTS
  // ===================================

  useEffect(() => {
    if (!isAuthenticated && !contextLoading) {
      navigate("/login");
      return;
    }

    if (!isAuthenticated || contextLoading) return;

    const initializeDashboard = async () => {
      setInitialLoading(true);
      
      try {
        await fetchUserData();
        const ordersData = await fetchOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error("Dashboard initialization error:", error);
        if (error.response?.status === 401) {
          sessionStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setInitialLoading(false);
      }
    };

    initializeDashboard();
  }, [isAuthenticated, contextLoading, navigate, fetchUserData, fetchOrders]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, clearMessages]);

  // ===================================
  // RENDER CONDITIONS
  // ===================================

  if (initialLoading || contextLoading || !userProfile) {
    return (
      <div className="container mt-5">
        <LoadingSpinner />
      </div>
    );
  }

  // ===================================
  // RENDER TAB CONTENT
  // ===================================

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.OVERVIEW:
        return (
          <OverviewTab 
            userProfile={userProfile} 
            cart={cart} 
            orders={orders} 
          />
        );
      case TABS.ORDERS:
        return (
          <OrdersTab 
            orders={orders} 
            loading={apiLoading} 
          />
        );
      case TABS.PROFILE:
        return (
          <ProfileTab
            userProfile={userProfile}
            profileForm={profileForm}
            onInputChange={handleProfileChange}
            onSubmit={handleUpdateProfile}
            loading={apiLoading}
            onFileChange={handleProfilePicChange}
            onPictureSubmit={handleUploadProfilePicture}
            selectedFile={profilePicture}
          />
        );
      case TABS.SECURITY:
        return (
          <SecurityTab
            passwordForm={passwordForm}
            onInputChange={handlePasswordChange}
            onSubmit={handleChangePassword}
            loading={apiLoading}
          />
        );
      default:
        return null;
    }
  };

  // ===================================
  // MAIN RENDER
  // ===================================

  return (
    <div className="min-vh-100" style={{ backgroundColor: 'var(--tertiary-color)' }}>
      <div className="container-fluid px-4 py-4">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb bg-white px-3 py-2 rounded shadow-sm" style={{ border: 'none' }}>
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none" style={{ color: 'var(--primary-color)' }}>
                <i className="bi bi-house-door me-1"></i>
                Home
              </Link>
            </li>
            <li className="breadcrumb-item active fw-semibold" aria-current="page" style={{ color: 'var(--grey-color)' }}>
              My Dashboard
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 mb-1 fw-bold" style={{ color: 'var(--primary-color)' }}>
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard
            </h1>
            <p className="mb-0" style={{ color: 'var(--grey-color)' }}>
              Welcome back, <strong style={{ color: 'var(--primary-color)' }}>{userProfile.name}</strong>
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link 
              to="/products" 
              className="btn"
              style={{
                backgroundColor: 'transparent',
                border: `2px solid var(--primary-color)`,
                color: 'var(--primary-color)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--primary-color)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--primary-color)';
              }}
            >
              <i className="bi bi-shop me-1"></i>
              Shop Now
            </Link>
            <Link 
              to="/cart" 
              className="btn"
              style={{ 
                backgroundColor: 'var(--primary-color)', 
                borderColor: 'var(--primary-color)',
                color: 'white'
              }}
            >
              <i className="bi bi-cart3 me-1"></i>
              Cart ({cart.length})
            </Link>
          </div>
        </div>

        {/* Alert Messages */}
        <AlertMessage 
          type="danger" 
          message={error} 
          onDismiss={clearMessages} 
        />
        <AlertMessage 
          type="success" 
          message={success} 
          onDismiss={clearMessages} 
        />

        {/* Tab Navigation */}
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .card {
          border: none;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }
        
        .card:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }
        
        .form-control-lg {
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .form-control-lg:focus {
          box-shadow: 0 0 0 0.2rem rgba(0, 71, 171, 0.25);
        }
        
        .btn-lg {
          border-radius: 8px;
          padding: 12px 24px;
          font-weight: 600;
        }
        
        .badge {
          font-size: 0.75em;
          padding: 0.5em 0.75em;
        }
        
        .table th {
          font-weight: 600;
          border-top: none;
          border-bottom: 2px solid #dee2e6;
        }
        
        .breadcrumb-item + .breadcrumb-item::before {
          content: "›";
          font-weight: bold;
          color: var(--grey-color);
        }
        
        .display-4 {
          font-size: 2.5rem;
        }
        
        .display-6 {
          font-size: 1.75rem;
        }
        
        @media (max-width: 768px) {
          .nav-pills .nav-link {
            font-size: 0.875rem;
            padding: 10px 12px;
          }
          
          .nav-pills .nav-link i {
            font-size: 1rem;
          }
          
          .card-body {
            padding: 1rem;
          }
          
          .btn-lg {
            padding: 10px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;