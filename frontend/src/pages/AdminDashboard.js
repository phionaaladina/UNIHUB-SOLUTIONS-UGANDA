// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import AdminSidebar from '../components/AdminSidebar';
// import '../styles/Admin.css'; 

// const AdminDashboardLayout = () => {
//   return (
//     <div className="container-fluid admin-dashboard">
//       <div className="row">
//         {/* Sidebar */}
//         <div className="col-md-3 col-lg-2 sidebar-wrapper">
//           <AdminSidebar />
//         </div>

//         {/* Main Content */}
//         <div className="col-md-9 col-lg-10 p-4 main-content-wrapper">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboardLayout;



// src/components/Admin/AdminDashboardLayout.js
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Remember to install this: npm install jwt-decode

const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      
      // --- MODIFIED LINE HERE ---
      // Check if the user has 'admin' OR 'superadmin' role, or if 'is_admin' flag is true
      if (decodedToken.role === 'admin' || decodedToken.role === 'superadmin' || decodedToken.is_admin) {
        setIsAdmin(true);
      } else {
        // Not an admin or superadmin, redirect to home or an unauthorized page
        navigate('/'); 
      }
    } catch (error) {
      console.error("Invalid token or token decoding failed:", error);
      localStorage.removeItem('token'); // Clear invalid token
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mt-5 text-center alert alert-danger">
        <h4>Access Denied</h4>
        <p>You do not have administrative privileges to view this page.</p>
        <Link to="/" className="btn btn-primary">Go to Home</Link>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <h4 className="mb-4">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="products" className="nav-link text-white">
              <i className="bi bi-box me-2"></i> Products
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="users" className="nav-link text-white">
              <i className="bi bi-people me-2"></i> Users
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="orders" className="nav-link text-white">
              <i className="bi bi-receipt me-2"></i> Orders
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="categories" className="nav-link text-white">
              <i className="bi bi-tags me-2"></i> Categories
            </Link>
          </li>
          <li className="nav-item mt-auto">
            <Link to="/" className="nav-link text-white" onClick={() => {
                localStorage.removeItem('token');
                alert("Logged out as Admin.");
            }}>
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboardLayout;