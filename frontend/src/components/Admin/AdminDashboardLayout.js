// // src/components/Admin/AdminDashboardLayout.js
// import React, { useEffect, useState } from 'react';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import './AdminDashboard.css';

// // You might need to import your logo if it's in the src folder
// // import unihubLogo from '../../assets/unihub-logo.png'; // Example if in src/assets

// const AdminDashboardLayout = () => {
//     const navigate = useNavigate();
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // --- TEMPORARY BYPASS FOR DEVELOPMENT ONLY ---
//         // REMOVE THIS BLOCK AND UNCOMMENT JWT DECODE LOGIC FOR PRODUCTION
//         console.warn("ADMIN AUTH BYPASSED: Access granted for development. REMOVE FOR PRODUCTION!");
//         setIsAdmin(true);
//         setLoading(false);
//         // --- END TEMPORARY BYPASS ---

//         /*
//         // --- ORIGINAL AUTHENTICATION LOGIC (UNCOMMENT FOR PRODUCTION) ---
//         // IMPORTANT: Ensure you import jwtDecode at the top if uncommenting this
//         // import { jwtDecode } from 'jwt-decode';
//         const token = sessionStorage.getItem('token'); // Use sessionStorage as discussed
//         if (!token) {
//             navigate('/login');
//             return;
//         }

//         try {
//             const decodedToken = jwtDecode(token);
//             // Assuming your JWT payload has a 'user_type' claim (from your Flask backend)
//             if (decodedToken.user_type === 'admin' || decodedToken.user_type === 'super_admin') {
//                 setIsAdmin(true);
//             } else {
//                 navigate('/');
//             }
//         } catch (error) {
//             console.error("Invalid token or token decoding failed:", error);
//             sessionStorage.removeItem('token'); // Use sessionStorage
//             navigate('/login');
//         } finally {
//             setLoading(false);
//         }
//         // --- END ORIGINAL AUTHENTICATION LOGIC ---
//         */
//     }, [navigate]);

//     if (loading) {
//         return (
//             <div className="container mt-5 text-center">
//                 <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p className="admin-loading-text">Loading Admin Dashboard...</p>
//             </div>
//         );
//     }

//     if (!isAdmin) {
//         return (
//             <div className="container mt-5 text-center alert admin-access-denied">
//                 <h4>Access Denied</h4>
//                 <p>You do not have administrative privileges to view this page.</p>
//                 <Link to="/" className="btn btn-primary">Go to Home</Link>
//             </div>
//         );
//     }

//     return (
//         <div className="d-flex admin-dashboard-layout">
//             <div className="admin-sidebar">
//                 {/* --- NEW: Image Logo for the Heading --- */}
//                 <img
//                     src="/unihublogo.png" // <--- IMPORTANT: Update this path to your actual logo
//                     alt="Unihub Solutions Logo"
//                     className="admin-logo"
//                 />
//                 {/* --- END NEW --- */}

//                 <ul className="nav flex-column">
//                     <li className="nav-item mb-2">
//                         <Link to="products" className="nav-link">
//                             <i className="bi bi-box me-2"></i> Products
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="users" className="nav-link">
//                             <i className="bi bi-people me-2"></i> Users
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="categories" className="nav-link">
//                             <i className="bi bi-tags me-2"></i> Categories
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="orders" className="nav-link">
//                             <i className="bi bi-receipt me-2"></i> Orders
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="sales" className="nav-link">
//                             <i className="bi bi-currency-dollar me-2"></i> Sales
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="discounts" className="nav-link">
//                             <i className="bi bi-percent me-2"></i> Discounts
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="contact-messages" className="nav-link">
//                             <i className="bi bi-chat-dots me-2"></i> Contact Messages
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="news" className="nav-link">
//                             <i className="bi bi-newspaper me-2"></i> News
//                         </Link>
//                     </li>
//                     <li className="nav-item mt-auto">
//                         <Link to="/" className="nav-link" onClick={() => {
//                             sessionStorage.removeItem('token');
//                             alert("Logged out from Admin Dashboard (Auth Bypass Active).");
//                         }}>
//                             <i className="bi bi-box-arrow-right me-2"></i> Logout
//                         </Link>
//                     </li>
//                 </ul>
//             </div>

//             <div className="admin-content-area">
//                 <Outlet />
//             </div>
//         </div>
//     );
// };

// export default AdminDashboardLayout;





// // src/components/Admin/AdminDashboardLayout.js
// import React, { useEffect, useState } from 'react';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode'; // Ensure this is installed: npm install jwt-decode

// import './AdminDashboard.css'; // <--- Ensure your custom CSS is imported

// // You might need to import your logo if it's in the src folder
// // import unihubLogo from '../../assets/unihub-logo.png'; // Example if in src/assets

// // Default profile picture (place this in public/images/ or adjust path)
// const DEFAULT_PROFILE_PIC = '/images/profile-placeholder.jpg';

// const AdminDashboardLayout = ({ userName, userRole }) => { // <--- ACCEPT PROPS HERE
//     const navigate = useNavigate();
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // --- TEMPORARY BYPASS FOR DEVELOPMENT ONLY (REMOVE FOR PRODUCTION!) ---
//         console.warn("ADMIN AUTH BYPASSED: Access granted for development. REMOVE FOR PRODUCTION!");
//         setIsAdmin(true);
//         setLoading(false);
//         // --- END TEMPORARY BYPASS ---

//         /* // --- ORIGINAL AUTHENTICATION LOGIC (UNCOMMENT FOR PRODUCTION) ---
//         const token = sessionStorage.getItem('token'); // <--- Using sessionStorage
//         if (!token) {
//             navigate('/login');
//             return;
//         }

//         try {
//             const decodedToken = jwtDecode(token);
//             // Check if the user has 'admin' OR 'super_admin' role (using 'user_type' for consistency with App.js)
//             if (decodedToken.user_type === 'admin' || decodedToken.user_type === 'super_admin') {
//                 setIsAdmin(true);
//             } else {
//                 navigate('/');
//             }
//         } catch (error) {
//             console.error("Invalid token or token decoding failed:", error);
//             sessionStorage.removeItem('token'); // Clear invalid token from sessionStorage
//             navigate('/login');
//         } finally {
//             setLoading(false);
//         }
//         // --- END ORIGINAL AUTHENTICATION LOGIC --- */
//     }, [navigate]);

//     if (loading) {
//         return (
//             <div className="container mt-5 text-center">
//                 <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p className="admin-loading-text">Loading Admin Dashboard...</p>
//             </div>
//         );
//     }

//     if (!isAdmin) {
//         return (
//             <div className="container mt-5 text-center alert admin-access-denied">
//                 <h4>Access Denied</h4>
//                 <p>You do not have administrative privileges to view this page.</p>
//                 <Link to="/" className="btn btn-primary">Go to Home</Link>
//             </div>
//         );
//     }

//     // Function to format role (e.g., "super_admin" to "Super Admin")
//     const formatRole = (role) => {
//         if (!role) return '';
//         return role.split('_')
//                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//                    .join(' ');
//     };

//     return (
//         <div className="d-flex admin-dashboard-layout"> {/* <--- Using custom class */}
//             <div className="admin-sidebar"> {/* <--- Using custom class */}
//                 {/* --- Image Logo for the Heading --- */}
//                 <img
//                     src="/images/unihub-logo.png" // <--- IMPORTANT: Update this path to your actual logo (e.g., public/images/unihub-logo.png)
//                     alt="Unihub Solutions Logo"
//                     className="admin-logo"
//                 />

//                 {/* --- User Profile Section --- */}
//                 <div className="admin-profile-section">
//                     <img
//                         src={DEFAULT_PROFILE_PIC} // Use a placeholder or dynamic path
//                         alt="User Profile"
//                         className="profile-pic"
//                     />
//                     <div className="user-info">
//                         <div className="user-name">{userName || 'Admin User'}</div> {/* Use prop */}
//                         <div className="user-role">
//                             {formatRole(userRole) || 'Role'} {/* Use prop and format */}
//                             <i className="bi bi-caret-down-fill ms-1"></i>
//                         </div>
//                     </div>
//                 </div>
//                 {/* --- END User Profile Section --- */}

//                 <ul className="nav flex-column">
//                     <li className="nav-item mb-2">
//                         <Link to="products" className="nav-link"> {/* <--- Removed text-white here, handled by CSS */}
//                             <i className="bi bi-box me-2"></i> Products
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="users" className="nav-link"> {/* <--- Removed text-white here */}
//                             <i className="bi bi-people me-2"></i> Users
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="categories" className="nav-link"> {/* <--- Removed text-white here */}
//                             <i className="bi bi-tags me-2"></i> Categories
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="orders" className="nav-link"> {/* <--- Removed text-white here */}
//                             <i className="bi bi-receipt me-2"></i> Orders
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="sales" className="nav-link"> {/* <--- Removed text-white here */}
//                             <i className="bi bi-currency-dollar me-2"></i> Sales
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="discounts" className="nav-link"> {/* <--- Removed text-white here */}
//                             <i className="bi bi-percent me-2"></i> Discounts
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="contact-messages" className="nav-link"> {/* <--- Removed text-white here */}
//                             <i className="bi bi-chat-dots me-2"></i> Contact Messages
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="news" className="nav-link"> {/* <--- Removed text-white here */}
//                             <i className="bi bi-newspaper me-2"></i> News
//                         </Link>
//                     </li>
//                     <li className="nav-item mt-auto">
//                         <Link to="/" className="nav-link" onClick={() => { {/* <--- Removed text-white here */}
//                             sessionStorage.removeItem('token'); // <--- Using sessionStorage
//                             alert("Logged out from Admin Dashboard.");
//                         }}>
//                             <i className="bi bi-box-arrow-right me-2"></i> Logout
//                         </Link>
//                     </li>
//                 </ul>
//             </div>

//             <div className="admin-content-area"> {/* <--- Using custom class */}
//                 <Outlet />
//             </div>
//         </div>
//     );
// };

// export default AdminDashboardLayout;


// // src/components/Admin/AdminDashboardLayout.js
// import React, { useEffect, useState } from 'react';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode'; // Ensure this is installed: npm install jwt-decode

// import './AdminDashboard.css'; // Make sure your custom CSS is imported

// // Default profile picture (place this in public/images/ or adjust path)
// // This is used if the user doesn't have a specific profile picture.
// const DEFAULT_PROFILE_PIC = '/images/profile-placeholder.jpg'; 
// // You might need to import your logo if it's in the src folder, e.g.:
// // import unihubLogo from '../../assets/unihub-logo.png'; 

// const AdminDashboardLayout = ({ userName, userRole }) => { // Accepts userName and userRole props from App.js
//     const navigate = useNavigate();
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // --- TEMPORARY BYPASS FOR DEVELOPMENT ONLY (REMOVE FOR PRODUCTION!) ---
//         // This block grants access for development purposes without requiring a valid JWT.
//         // It MUST be removed or commented out when deploying to production.
//         console.warn("ADMIN AUTH BYPASSED: Access granted for development. REMOVE FOR PRODUCTION!");
//         setIsAdmin(true);
//         setLoading(false);
//         // --- END TEMPORARY BYPASS ---

//         /* // --- ORIGINAL AUTHENTICATION LOGIC (UNCOMMENT FOR PRODUCTION) ---
//         // This is the secure way to handle admin authentication using JWT from sessionStorage.
//         const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage
//         if (!token) {
//             navigate('/login'); // If no token, redirect to login
//             return;
//         }

//         try {
//             const decodedToken = jwtDecode(token); // Decode the JWT token
//             // Check if the user's role (user_type) is 'admin' or 'super_admin'
//             if (decodedToken.user_type === 'admin' || decodedToken.user_type === 'super_admin') {
//                 setIsAdmin(true); // User is authorized
//             } else {
//                 navigate('/'); // If not authorized, redirect to home page
//             }
//         } catch (error) {
//             console.error("Invalid token or token decoding failed:", error);
//             sessionStorage.removeItem('token'); // Clear invalid token from sessionStorage
//             navigate('/login'); // Redirect to login on token error
//         } finally {
//             setLoading(false); // Authentication check is complete
//         }
//         // --- END ORIGINAL AUTHENTICATION LOGIC --- 
//         */
//     }, [navigate]); // navigate is a dependency of useEffect

//     // Display a loading spinner while checking authentication
//     if (loading) {
//         return (
//             <div className="container mt-5 text-center">
//                 <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p className="admin-loading-text">Loading Admin Dashboard...</p>
//             </div>
//         );
//     }

//     // Display access denied message if not an admin
//     if (!isAdmin) {
//         return (
//             <div className="container mt-5 text-center alert admin-access-denied">
//                 <h4>Access Denied</h4>
//                 <p>You do not have administrative privileges to view this page.</p>
//                 <Link to="/" className="btn btn-primary">Go to Home</Link>
//             </div>
//         );
//     }

//     // Helper function to format role strings (e.g., "super_admin" to "Super Admin")
//     const formatRole = (role) => {
//         if (!role) return '';
//         return role.split('_')
//                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//                    .join(' ');
//     };

//     return (
//         <div className="d-flex admin-dashboard-layout"> {/* Uses custom CSS class for main layout */}
//             <div className="admin-sidebar"> {/* Uses custom CSS class for sidebar */}
//                 {/* --- Image Logo for the Heading --- */}
//                 {/* Update the src path to your actual logo location in the public folder */}
//                 <img
//                     src="/images/unihub-logo.png" 
//                     alt="Unihub Solutions Logo"
//                     className="admin-logo"
//                 />

//                 {/* --- User Profile Section (as per provided image) --- */}
//                 <div className="admin-profile-section">
//                     <img
//                         src={DEFAULT_PROFILE_PIC} // Displays a default profile picture
//                         alt="User Profile"
//                         className="profile-pic"
//                     />
//                     <div className="user-info">
//                         <div className="user-name">{userName || 'Admin User'}</div> {/* Displays user's name */}
//                         <div className="user-role">
//                             {formatRole(userRole) || 'Role'} {/* Displays user's role, e.g., "Super Admin" */}
//                             {/* <i className="bi bi-caret-down-fill ms-1"></i> Visual dropdown icon */}
//                         </div>
//                     </div>
//                 </div>
//                 {/* --- END User Profile Section --- */}

//                 {/* --- Navigation Links --- */}
//                 <ul className="nav flex-column">
//                     <li className="nav-item mb-2">
//                         <Link to="products" className="nav-link"> {/* Uses custom CSS class for links */}
//                             <i className="bi bi-box me-2"></i> Products
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="users" className="nav-link">
//                             <i className="bi bi-people me-2"></i> Users
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="categories" className="nav-link">
//                             <i className="bi bi-tags me-2"></i> Categories
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="orders" className="nav-link">
//                             <i className="bi bi-receipt me-2"></i> Orders
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="sales" className="nav-link">
//                             <i className="bi bi-currency-dollar me-2"></i> Sales
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="discounts" className="nav-link">
//                             <i className="bi bi-percent me-2"></i> Discounts
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="contact-messages" className="nav-link">
//                             <i className="bi bi-chat-dots me-2"></i> Contact Messages
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="news" className="nav-link">
//                             <i className="bi bi-newspaper me-2"></i> News
//                         </Link>
//                     </li>
//                     {/* NEW: Profile Settings Link for update profile pic and change password functionality */}
//                     <li className="nav-item mb-2">
//                         <Link to="profile" className="nav-link">
//                             <i className="bi bi-person-circle me-2"></i> Profile Settings
//                         </Link>
//                     </li>
//                     {/* Logout Link */}
//                     <li className="nav-item mt-auto"> {/* mt-auto pushes this item to the bottom */}
//                         <Link to="/" className="nav-link" onClick={() => {
//                             sessionStorage.removeItem('token'); // Remove token on logout
//                             alert("Logged out from Admin Dashboard."); // Simple alert for confirmation
//                         }}>
//                             <i className="bi bi-box-arrow-right me-2"></i> Logout
//                         </Link>
//                     </li>
//                 </ul>
//             </div>

//             {/* --- Main Content Area --- */}
//             <div className="admin-content-area"> {/* Uses custom CSS class for content area */}
//                 <Outlet /> {/* Renders the nested route components here */}
//             </div>
//         </div>
//     );
// };

// export default AdminDashboardLayout;





// import React, { useEffect, useState, useCallback } from 'react';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios';
// import { toast } from 'react-toastify'; // Import toast for notifications

// import './AdminDashboard.css'; // Make sure your custom CSS is imported

// const DEFAULT_PROFILE_PIC = '/images/profile-placeholder.jpg'; // Path to your default profile picture

// const AdminDashboardLayout = () => {
//     const navigate = useNavigate();
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [userName, setUserName] = useState('');
//     const [userRole, setUserRole] = useState('');
//     const [userProfilePic, setUserProfilePic] = useState(DEFAULT_PROFILE_PIC); // Initialize with default

//     const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';
//     const AUTH_API_URL = `${API_BASE_URL}/api/v1/auth`;

//     // Function to fetch user profile data, including picture
//     const fetchUserProfile = useCallback(async () => {
//         try {
//             const token = sessionStorage.getItem('token'); // Use sessionStorage for consistency with App.js
//             if (!token) {
//                 navigate('/login');
//                 return;
//             }

//             const decodedToken = jwtDecode(token);
//             // Ensure decodedToken has user_type, not 'role' or 'is_admin' based on your App.js ProtectedRoute
//             if (decodedToken.user_type === 'admin' || decodedToken.user_type === 'super_admin') {
//                 setIsAdmin(true);

//                 // Fetch full user profile from backend
//                 const response = await axios.get(`${AUTH_API_URL}/profile`, {
//                     headers: { 'Authorization': `Bearer ${token}` }
//                 });
//                 const userData = response.data;

//                 setUserName(`${userData.first_name} ${userData.last_name}`);
//                 setUserRole(userData.role_name); // Assuming role_name is returned by /profile endpoint

//                 // --- Logic to determine correct profile picture URL ---
//                 let profilePicToDisplay = DEFAULT_PROFILE_PIC; // Frontend default fallback
//                 if (userData.profile_picture_url) {
//                     // Check if it's already a full URL or needs API_BASE_URL prefix
//                     if (userData.profile_picture_url.startsWith('http://') || userData.profile_picture_url.startsWith('https://')) {
//                         profilePicToDisplay = userData.profile_picture_url;
//                     } else if (userData.profile_picture_url.startsWith('/uploads/')) {
//                         profilePicToDisplay = API_BASE_URL + userData.profile_picture_url;
//                     } else {
//                         // Assume it's a relative path that frontend can handle, e.g., in public/images/
//                         // Or if it's a backend relative path not starting with /uploads/
//                         profilePicToDisplay = userData.profile_picture_url;
//                     }
//                 }
//                 setUserProfilePic(profilePicToDisplay);

//             } else {
//                 navigate('/');
//             }
//         } catch (error) {
//             console.error("Authentication or profile fetch failed:", error.response?.data || error.message);
//             toast.error(error.response?.data?.message || 'Failed to fetch user profile. Logging out.');
//             sessionStorage.removeItem('token'); // Clear invalid token
//             navigate('/login');
//         } finally {
//             setLoading(false);
//         }
//     }, [navigate, AUTH_API_URL, API_BASE_URL]); // Dependencies for useCallback

//     // This function will be passed to AdminProfileSettingsPage to update the profile pic in this layout
//     const handleProfilePicUpdate = useCallback((newRelativePicUrl) => {
//         // This function receives the *relative* URL from AdminProfileSettingsPage
//         // We need to construct the full URL to update the state correctly
//         const newFullPicUrl = API_BASE_URL + newRelativePicUrl;
//         setUserProfilePic(newFullPicUrl);
//         toast.success("Profile picture updated in sidebar!");
//     }, [API_BASE_URL]);

//     useEffect(() => {
//         fetchUserProfile();
//     }, [fetchUserProfile]); // Re-run if fetchUserProfile changes (due to useCallback)

//     if (loading) {
//         return (
//             <div className="container mt-5 text-center">
//                 <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p className="admin-loading-text">Loading Admin Dashboard...</p>
//             </div>
//         );
//     }

//     if (!isAdmin) {
//         return (
//             <div className="container mt-5 text-center alert admin-access-denied">
//                 <h4>Access Denied</h4>
//                 <p>You do not have administrative privileges to view this page.</p>
//                 <Link to="/" className="btn btn-primary">Go to Home</Link>
//             </div>
//         );
//     }

//     return (
//         <div className="d-flex admin-dashboard-layout">
//             <div className="admin-sidebar">
//                 {/* --- Image Logo for the Heading --- */}
//                 <img
//                     src="/images/unihub-logo.png"
//                     alt="Unihub Solutions Logo"
//                     className="admin-logo"
//                 />

//                 {/* --- User Profile Section --- */}
//                 <div className="admin-profile-section">
//                     <img
//                         src={userProfilePic} // Displays the dynamically loaded profile picture
//                         alt="User Profile"
//                         className="profile-pic"
//                     />
//                     <div className="user-info">
//                         <div className="user-name">{userName || 'User Name'}</div>
//                         <div className="user-role">{userRole || 'Role'}</div>
//                     </div>
//                 </div>
//                 {/* --- END User Profile Section --- */}

//                 {/* --- Navigation Links --- */}
//                 <ul className="nav flex-column">
//                     <li className="nav-item mb-2">
//                         <Link to="products" className="nav-link">
//                             <i className="bi bi-box me-2"></i> Products
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="users" className="nav-link">
//                             <i className="bi bi-people me-2"></i> Users
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="categories" className="nav-link">
//                             <i className="bi bi-tags me-2"></i> Categories
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="orders" className="nav-link">
//                             <i className="bi bi-receipt me-2"></i> Orders
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="sales" className="nav-link">
//                             <i className="bi bi-currency-dollar me-2"></i> Sales
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="discounts" className="nav-link">
//                             <i className="bi bi-percent me-2"></i> Discounts
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="contact-messages" className="nav-link">
//                             <i className="bi bi-chat-dots me-2"></i> Contact Messages
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="news" className="nav-link">
//                             <i className="bi bi-newspaper me-2"></i> News
//                         </Link>
//                     </li>
//                     {/* Profile Settings Link */}
//                     <li className="nav-item mb-2">
//                         <Link to="profile-settings" className="nav-link"> {/* <--- THIS IS THE KEY PART */}
//                             <i className="bi bi-person-circle me-2"></i> Profile Settings
//                         </Link>
//                     </li>
//                     {/* Logout Link */}
//                     <li className="nav-item mt-auto">
//                         <Link to="/" className="nav-link" onClick={() => {
//                             sessionStorage.removeItem('token');
//                             toast.info("Logged out from Admin Dashboard.");
//                         }}>
//                             <i className="bi bi-box-arrow-right me-2"></i> Logout
//                         </Link>
//                     </li>
//                 </ul>
//             </div>

//             {/* --- Main Content Area --- */}
//             <div className="admin-content-area">
//                 {/* THIS IS WHERE THE CONTEXT IS PASSED */}
//                 <Outlet context={{ onProfileUpdate: handleProfilePicUpdate, userName, userRole, userProfilePic }} />
//             </div>
//         </div>
//     );
// };

// export default AdminDashboardLayout;



// import React, { useEffect, useState, useCallback } from 'react';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios';
// import { toast } from 'react-toastify'; // Import toast for notifications

// import './AdminDashboard.css'; // Make sure your custom CSS is imported

// const DEFAULT_PROFILE_PIC = '/images/profile-placeholder.jpg'; // Path to your default profile picture

// const AdminDashboardLayout = () => {
//     const navigate = useNavigate();
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [userName, setUserName] = useState('');
//     const [userRole, setUserRole] = useState('');
//     const [userProfilePic, setUserProfilePic] = useState(DEFAULT_PROFILE_PIC); // Initialize with default

//     const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';
//     const AUTH_API_URL = `${API_BASE_URL}/api/v1/auth`;

//     // Function to fetch user profile data, including picture
//     const fetchUserProfile = useCallback(async () => {
//         try {
//             const token = sessionStorage.getItem('token'); // Use sessionStorage for consistency with App.js
//             if (!token) {
//                 navigate('/login');
//                 return;
//             }

//             const decodedToken = jwtDecode(token);
//             // Ensure decodedToken has user_type, not 'role' or 'is_admin' based on your App.js ProtectedRoute
//             if (decodedToken.user_type === 'admin' || decodedToken.user_type === 'super_admin') {
//                 setIsAdmin(true);

//                 // Fetch full user profile from backend
//                 const response = await axios.get(`${AUTH_API_URL}/profile`, {
//                     headers: { 'Authorization': `Bearer ${token}` }
//                 });
//                 const userData = response.data;

//                 setUserName(`${userData.first_name} ${userData.last_name}`);
//                 setUserRole(userData.user_type); // <--- THIS IS THE CORRECTED LINE

//                 // --- Logic to determine correct profile picture URL ---
//                 let profilePicToDisplay = DEFAULT_PROFILE_PIC; // Frontend default fallback
//                 if (userData.profile_picture_url) {
//                     // Check if it's already a full URL or needs API_BASE_URL prefix
//                     if (userData.profile_picture_url.startsWith('http://') || userData.profile_picture_url.startsWith('https://')) {
//                         profilePicToDisplay = userData.profile_picture_url;
//                     } else if (userData.profile_picture_url.startsWith('/uploads/')) {
//                         profilePicToDisplay = API_BASE_URL + userData.profile_picture_url;
//                     } else {
//                         // Assume it's a relative path that frontend can handle, e.g., in public/images/
//                         // Or if it's a backend relative path not starting with /uploads/
//                         profilePicToDisplay = userData.profile_picture_url;
//                     }
//                 }
//                 setUserProfilePic(profilePicToDisplay);

//             } else {
//                 navigate('/');
//             }
//         } catch (error) {
//             console.error("Authentication or profile fetch failed:", error.response?.data || error.message);
//             toast.error(error.response?.data?.message || 'Failed to fetch user profile. Logging out.');
//             sessionStorage.removeItem('token'); // Clear invalid token
//             navigate('/login');
//         } finally {
//             setLoading(false);
//         }
//     }, [navigate, AUTH_API_URL, API_BASE_URL]); // Dependencies for useCallback

//     // This function will be passed to AdminProfileSettingsPage to update the profile pic in this layout
//     const handleProfilePicUpdate = useCallback((newRelativePicUrl) => {
//         // This function receives the *relative* URL from AdminProfileSettingsPage
//         // We need to construct the full URL to update the state correctly
//         const newFullPicUrl = API_BASE_URL + newRelativePicUrl;
//         setUserProfilePic(newFullPicUrl);
//         toast.success("Profile picture updated in sidebar!");
//     }, [API_BASE_URL]);

//     useEffect(() => {
//         fetchUserProfile();
//     }, [fetchUserProfile]); // Re-run if fetchUserProfile changes (due to useCallback)

//     if (loading) {
//         return (
//             <div className="container mt-5 text-center">
//                 <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p className="admin-loading-text">Loading Admin Dashboard...</p>
//             </div>
//         );
//     }

//     if (!isAdmin) {
//         return (
//             <div className="container mt-5 text-center alert admin-access-denied">
//                 <h4>Access Denied</h4>
//                 <p>You do not have administrative privileges to view this page.</p>
//                 <Link to="/" className="btn btn-primary">Go to Home</Link>
//             </div>
//         );
//     }

//     return (
//         <div className="d-flex admin-dashboard-layout">
//             <div className="admin-sidebar">
//                 {/* --- Image Logo for the Heading --- */}
//                 <img
//                     src="/unihublogo.png"
//                     alt="Unihub Solutions Logo"
//                     className="admin-logo"
//                 />

//                 {/* --- User Profile Section --- */}
//                 <div className="admin-profile-section">
//                     <img
//                         src={userProfilePic} // Displays the dynamically loaded profile picture
//                         alt="User Profile"
//                         className="profile-pic"
//                     />
//                     <div className="user-info">
//                         <div className="user-name">{userName || 'User Name'}</div>
//                         <div className="user-role">{userRole || 'Role'}</div>
//                     </div>
//                 </div>
//                 {/* --- END User Profile Section --- */}

//                 {/* --- Navigation Links --- */}
//                 <ul className="nav flex-column">
//                     <li className="nav-item mb-2">
//                         <Link to="products" className="nav-link">
//                             <i className="bi bi-box me-2"></i> Products
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="users" className="nav-link">
//                             <i className="bi bi-people me-2"></i> Users
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="categories" className="nav-link">
//                             <i className="bi bi-tags me-2"></i> Categories
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="orders" className="nav-link">
//                             <i className="bi bi-receipt me-2"></i> Orders
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="sales" className="nav-link">
//                             <i className="bi bi-currency-dollar me-2"></i> Sales
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="discounts" className="nav-link">
//                             <i className="bi bi-percent me-2"></i> Discounts
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="contact-messages" className="nav-link">
//                             <i className="bi bi-chat-dots me-2"></i> Contact Messages
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="news" className="nav-link">
//                             <i className="bi bi-newspaper me-2"></i> News
//                         </Link>
//                     </li>
//                     {/* Profile Settings Link */}
//                     <li className="nav-item mb-2">
//                         <Link to="profile-settings" className="nav-link">
//                             <i className="bi bi-person-circle me-2"></i> Profile Settings
//                         </Link>
//                     </li>
//                     {/* Logout Link */}
//                     <li className="nav-item mt-auto">
//                         <Link to="/" className="nav-link" onClick={() => {
//                             sessionStorage.removeItem('token');
//                             toast.info("Logged out from Admin Dashboard.");
//                         }}>
//                             <i className="bi bi-box-arrow-right me-2"></i> Logout
//                         </Link>
//                     </li>
//                 </ul>
//             </div>

//             {/* --- Main Content Area --- */}
//             <div className="admin-content-area">
//                 {/* THIS IS WHERE THE CONTEXT IS PASSED */}
//                 <Outlet context={{ onProfileUpdate: handleProfilePicUpdate, userName, userRole, userProfilePic }} />
//             </div>
//         </div>
//     );
// };

// export default AdminDashboardLayout;



// import React, { useEffect, useState, useCallback } from 'react';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios';
// import { toast } from 'react-toastify'; // Import toast for notifications

// import './AdminDashboard.css'; // Make sure your custom CSS is imported

// const DEFAULT_PROFILE_PIC = '/images/profile-placeholder.jpg'; // Path to your default profile picture

// const AdminDashboardLayout = () => {
//     const navigate = useNavigate();
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [userName, setUserName] = useState('');
//     const [userRole, setUserRole] = useState('');
//     const [userProfilePic, setUserProfilePic] = useState(DEFAULT_PROFILE_PIC); // Initialize with default

//     const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';
//     const AUTH_API_URL = `${API_BASE_URL}/api/v1/auth`;

//     // Function to fetch user profile data, including picture
//     const fetchUserProfile = useCallback(async () => {
//         try {
//             const token = sessionStorage.getItem('token'); // Use sessionStorage for consistency with App.js
//             if (!token) {
//                 navigate('/login');
//                 return;
//             }

//             const decodedToken = jwtDecode(token);
//             // Ensure decodedToken has user_type, not 'role' or 'is_admin' based on your App.js ProtectedRoute
//             if (decodedToken.user_type === 'admin' || decodedToken.user_type === 'super_admin') {
//                 setIsAdmin(true);

//                 // Fetch full user profile from backend
//                 const response = await axios.get(`${AUTH_API_URL}/profile`, {
//                     headers: { 'Authorization': `Bearer ${token}` }
//                 });
//                 const userData = response.data;

//                 setUserName(`${userData.first_name} ${userData.last_name}`);
//                 setUserRole(userData.user_type); // <--- THIS IS THE CORRECTED LINE

//                 // --- Logic to determine correct profile picture URL ---
//                 let profilePicToDisplay = DEFAULT_PROFILE_PIC; // Frontend default fallback
//                 if (userData.profile_picture_url) {
//                     // Check if it's already a full URL or needs API_BASE_URL prefix
//                     if (userData.profile_picture_url.startsWith('http://') || userData.profile_picture_url.startsWith('https://')) {
//                         profilePicToDisplay = userData.profile_picture_url;
//                     } else if (userData.profile_picture_url.startsWith('/uploads/')) {
//                         profilePicToDisplay = API_BASE_URL + userData.profile_picture_url;
//                     } else {
//                         // Assume it's a relative path that frontend can handle, e.g., in public/images/
//                         // Or if it's a backend relative path not starting with /uploads/
//                         profilePicToDisplay = userData.profile_picture_url;
//                     }
//                 }
//                 setUserProfilePic(profilePicToDisplay);

//             } else {
//                 navigate('/');
//             }
//         } catch (error) {
//             console.error("Authentication or profile fetch failed:", error.response?.data || error.message);
//             toast.error(error.response?.data?.message || 'Failed to fetch user profile. Logging out.');
//             sessionStorage.removeItem('token'); // Clear invalid token
//             navigate('/login');
//         } finally {
//             setLoading(false);
//         }
//     }, [navigate, AUTH_API_URL, API_BASE_URL]); // Dependencies for useCallback

//     // This function will be passed to AdminProfileSettingsPage to update the profile pic in this layout
//     const handleProfilePicUpdate = useCallback((newRelativePicUrl) => {
//         // This function receives the *relative* URL from AdminProfileSettingsPage
//         // We need to construct the full URL to update the state correctly
//         const newFullPicUrl = API_BASE_URL + newRelativePicUrl;
//         setUserProfilePic(newFullPicUrl);
//         toast.success("Profile picture updated in sidebar!");
//     }, [API_BASE_URL]);

//     useEffect(() => {
//         fetchUserProfile();
//     }, [fetchUserProfile]); // Re-run if fetchUserProfile changes (due to useCallback)

//     if (loading) {
//         return (
//             <div className="container mt-5 text-center">
//                 <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p className="admin-loading-text">Loading Admin Dashboard...</p>
//             </div>
//         );
//     }

//     if (!isAdmin) {
//         return (
//             <div className="container mt-5 text-center alert admin-access-denied">
//                 <h4>Access Denied</h4>
//                 <p>You do not have administrative privileges to view this page.</p>
//                 <Link to="/" className="btn btn-primary">Go to Home</Link>
//             </div>
//         );
//     }

//     return (
//         <div className="d-flex admin-dashboard-layout">
           
//             <div className="admin-sidebar">
//                 {/* --- Image Logo with background and divider --- */}
//                 <div className="logo-container">
//                     <img
//                         src="/unihublogo.png"
//                         alt="Unihub Solutions Logo"
//                         className="admin-logo"
//                     />
//                 </div>
//                 {/* --- END Logo Section --- */}

//                 {/* --- User Profile Section --- */}
//                 <div className="admin-profile-section">
//                     <img
//                         src={userProfilePic} // Displays the dynamically loaded profile picture
//                         alt="User Profile"
//                         className="profile-pic"
//                     />
//                     <div className="user-info">
//                         <div className="user-name">{userName || 'User Name'}</div>
//                         <div className="user-role">{userRole || 'Role'}</div>
//                     </div>
//                 </div>
//                 {/* --- END User Profile Section --- */}

//                 {/* --- Navigation Links --- */}
//                 <ul className="nav flex-column">
//                     <li className="nav-item mb-2">
//                         <Link to="products" className="nav-link">
//                             <i className="bi bi-box me-2"></i> Products
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="users" className="nav-link">
//                             <i className="bi bi-people me-2"></i> Users
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="categories" className="nav-link">
//                             <i className="bi bi-tags me-2"></i> Categories
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="orders" className="nav-link">
//                             <i className="bi bi-receipt me-2"></i> Orders
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="sales" className="nav-link">
//                             <i className="bi bi-currency-dollar me-2"></i> Sales
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="discounts" className="nav-link">
//                             <i className="bi bi-percent me-2"></i> Discounts
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="contact-messages" className="nav-link">
//                             <i className="bi bi-chat-dots me-2"></i> Contact Messages
//                         </Link>
//                     </li>
//                     <li className="nav-item mb-2">
//                         <Link to="news" className="nav-link">
//                             <i className="bi bi-newspaper me-2"></i> News
//                         </Link>
//                     </li>
//                     {/* Profile Settings Link */}
//                     <li className="nav-item mb-2">
//                         <Link to="profile-settings" className="nav-link">
//                             <i className="bi bi-person-circle me-2"></i> Profile Settings
//                         </Link>
//                     </li>
//                     {/* Logout Link */}
//                     <li className="nav-item mt-auto">
//                         <Link to="/" className="nav-link" onClick={() => {
//                             sessionStorage.removeItem('token');
//                             toast.info("Logged out from Admin Dashboard.");
//                         }}>
//                             <i className="bi bi-box-arrow-right me-2"></i> Logout
//                         </Link>
//                     </li>
//                 </ul>
//             </div>

//             {/* --- Main Content Area --- */}
//             <div className="admin-content-area">
//                 {/* THIS IS WHERE THE CONTEXT IS PASSED */}
//                 <Outlet context={{ onProfileUpdate: handleProfilePicUpdate, userName, userRole, userProfilePic }} />
//             </div>
//         </div>
//     );
// };

// export default AdminDashboardLayout;


// import React, { useEffect, useState, useCallback } from 'react';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// import './AdminDashboard.css';

// const DEFAULT_PROFILE_PIC = '/images/profile-placeholder.jpg';

// const AdminDashboardLayout = () => {
//     const navigate = useNavigate();
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [userName, setUserName] = useState('');
//     const [userRole, setUserRole] = useState('');
//     const [userProfilePic, setUserProfilePic] = useState(DEFAULT_PROFILE_PIC);
//     const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//     const [currentTime, setCurrentTime] = useState(new Date());

//     const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';
//     const AUTH_API_URL = `${API_BASE_URL}/api/v1/auth`;

//     // Update time every minute
//     useEffect(() => {
//         const timer = setInterval(() => {
//             setCurrentTime(new Date());
//         }, 60000);
//         return () => clearInterval(timer);
//     }, []);

//     const fetchUserProfile = useCallback(async () => {
//         try {
//             const token = sessionStorage.getItem('token');
//             if (!token) {
//                 navigate('/login');
//                 return;
//             }

//             const decodedToken = jwtDecode(token);
//             if (decodedToken.user_type === 'admin' || decodedToken.user_type === 'super_admin') {
//                 setIsAdmin(true);

//                 const response = await axios.get(`${AUTH_API_URL}/profile`, {
//                     headers: { 'Authorization': `Bearer ${token}` }
//                 });
//                 const userData = response.data;

//                 setUserName(`${userData.first_name} ${userData.last_name}`);
//                 setUserRole(userData.user_type);

//                 let profilePicToDisplay = DEFAULT_PROFILE_PIC;
//                 if (userData.profile_picture_url) {
//                     if (userData.profile_picture_url.startsWith('http://') || userData.profile_picture_url.startsWith('https://')) {
//                         profilePicToDisplay = userData.profile_picture_url;
//                     } else if (userData.profile_picture_url.startsWith('/uploads/')) {
//                         profilePicToDisplay = API_BASE_URL + userData.profile_picture_url;
//                     } else {
//                         profilePicToDisplay = userData.profile_picture_url;
//                     }
//                 }
//                 setUserProfilePic(profilePicToDisplay);

//             } else {
//                 navigate('/');
//             }
//         } catch (error) {
//             console.error("Authentication or profile fetch failed:", error.response?.data || error.message);
//             toast.error(error.response?.data?.message || 'Failed to fetch user profile. Logging out.');
//             sessionStorage.removeItem('token');
//             navigate('/login');
//         } finally {
//             setLoading(false);
//         }
//     }, [navigate, AUTH_API_URL, API_BASE_URL]);

//     const handleProfilePicUpdate = useCallback((newRelativePicUrl) => {
//         const newFullPicUrl = API_BASE_URL + newRelativePicUrl;
//         setUserProfilePic(newFullPicUrl);
//         toast.success("Profile picture updated successfully!");
//     }, [API_BASE_URL]);

//     const handleLogout = () => {
//         sessionStorage.removeItem('token');
//         toast.info("Successfully logged out.");
//         navigate('/');
//     };

//     useEffect(() => {
//         fetchUserProfile();
//     }, [fetchUserProfile]);

//     const navigationItems = [
//         { to: "products", icon: "bi-box", label: "Products", badge: null },
//         { to: "users", icon: "bi-people", label: "Users", badge: null },
//         { to: "categories", icon: "bi-tags", label: "Categories", badge: null },
//         { to: "orders", icon: "bi-receipt", label: "Orders", badge: "12" },
//         { to: "sales", icon: "bi-graph-up", label: "Sales Analytics", badge: null },
//         { to: "discounts", icon: "bi-percent", label: "Discounts", badge: null },
//         { to: "contact-messages", icon: "bi-chat-dots", label: "Messages", badge: "3" },
//         { to: "news", icon: "bi-newspaper", label: "News & Updates", badge: null },
//     ];

//     if (loading) {
//         return (
//             <div className="loading-container">
//                 <div className="loading-spinner">
//                     <div className="spinner"></div>
//                     <div className="loading-logo">
//                         <img src="/unihublogo.png" alt="UniHub Solutions" />
//                     </div>
//                 </div>
//                 <h3 className="loading-text">Initializing Admin Dashboard</h3>
//                 <p className="loading-subtext">Please wait while we prepare your workspace...</p>
//             </div>
//         );
//     }

//     if (!isAdmin) {
//         return (
//             <div className="access-denied-container">
//                 <div className="access-denied-content">
//                     <div className="access-denied-icon">
//                         <i className="bi bi-shield-exclamation"></i>
//                     </div>
//                     <h2>Access Restricted</h2>
//                     <p>Administrative privileges required to access this dashboard.</p>
//                     <Link to="/" className="btn-primary">
//                         <i className="bi bi-house"></i>
//                         Return to Home
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className={`admin-dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
//             {/* Enhanced Sidebar */}
//             <div className="admin-sidebar">
//                 {/* Header Section */}
//                 <div className="sidebar-header">
//                     <div className="logo-section">
//                         <img src="/unihublogo.png" alt="UniHub Solutions" className="admin-logo" />
//                         <div className="brand-text">
//                             <h4>UniHub Admin</h4>
//                             <span>Control Panel</span>
//                         </div>
//                     </div>
//                     <button 
//                         className="sidebar-toggle"
//                         onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//                     >
//                         <i className={`bi ${sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
//                     </button>
//                 </div>

//                 {/* User Profile Section */}
//                 <div className="admin-profile-section">
//                     <div className="profile-container">
//                         <div className="profile-pic-wrapper">
//                             <img src={userProfilePic} alt="User Profile" className="profile-pic" />
//                             <div className="online-indicator"></div>
//                         </div>
//                         <div className="user-info">
//                             <div className="user-name">{userName || 'Administrator'}</div>
//                             <div className="user-role">
//                                 <i className="bi bi-shield-check"></i>
//                                 {userRole === 'super_admin' ? 'Super Admin' : 'Administrator'}
//                             </div>
//                             <div className="user-status">
//                                 <i className="bi bi-clock"></i>
//                                 {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Navigation Menu */}
//                 <nav className="sidebar-nav">
//                     <div className="nav-section">
//                         <div className="nav-section-title">Management</div>
//                         <ul className="nav-list">
//                             {navigationItems.map((item) => (
//                                 <li key={item.to} className="nav-item">
//                                     <Link to={item.to} className="nav-link">
//                                         <span className="nav-icon">
//                                             <i className={`bi ${item.icon}`}></i>
//                                         </span>
//                                         <span className="nav-text">{item.label}</span>
//                                         {item.badge && (
//                                             <span className="nav-badge">{item.badge}</span>
//                                         )}
//                                         <span className="nav-arrow">
//                                             <i className="bi bi-chevron-right"></i>
//                                         </span>
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     <div className="nav-section">
//                         <div className="nav-section-title">Account</div>
//                         <ul className="nav-list">
//                             <li className="nav-item">
//                                 <Link to="profile-settings" className="nav-link">
//                                     <span className="nav-icon">
//                                         <i className="bi bi-person-gear"></i>
//                                     </span>
//                                     <span className="nav-text">Profile Settings</span>
//                                     <span className="nav-arrow">
//                                         <i className="bi bi-chevron-right"></i>
//                                     </span>
//                                 </Link>
//                             </li>
//                             <li className="nav-item">
//                                 <button onClick={handleLogout} className="nav-link logout-btn">
//                                     <span className="nav-icon">
//                                         <i className="bi bi-box-arrow-right"></i>
//                                     </span>
//                                     <span className="nav-text">Sign Out</span>
//                                     <span className="nav-arrow">
//                                         <i className="bi bi-chevron-right"></i>
//                                     </span>
//                                 </button>
//                             </li>
//                         </ul>
//                     </div>
//                 </nav>

//                 {/* Footer */}
//                 <div className="sidebar-footer">
//                     <div className="footer-content">
//                         <p>&copy; 2025 UniHub Solutions</p>
//                         <p>Version 2.1.0</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Content Area */}
//             <div className="admin-content-area">
//                 <Outlet context={{ 
//                     onProfileUpdate: handleProfilePicUpdate, 
//                     userName, 
//                     userRole, 
//                     userProfilePic,
//                     sidebarCollapsed,
//                     setSidebarCollapsed
//                 }} />
//             </div>
//         </div>
//     );
// };

// export default AdminDashboardLayout;





// import React, { useEffect, useState, useCallback } from 'react';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// import './styles/AdminDashboard.css';

// const DEFAULT_PROFILE_PIC = '/images/profile-placeholder.jpg';

// const AdminDashboardLayout = () => {
//     const navigate = useNavigate();
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [userName, setUserName] = useState('');
//     const [userRole, setUserRole] = useState('');
//     const [userProfilePic, setUserProfilePic] = useState(DEFAULT_PROFILE_PIC);
//     const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//     const [currentTime, setCurrentTime] = useState(new Date());

//     const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';
//     const AUTH_API_URL = `${API_BASE_URL}/api/v1/auth`;

//     // Update time every minute
//     useEffect(() => {
//         const timer = setInterval(() => {
//             setCurrentTime(new Date());
//         }, 60000);
//         return () => clearInterval(timer);
//     }, []);

//     const fetchUserProfile = useCallback(async () => {
//         try {
//             const token = sessionStorage.getItem('token');
//             if (!token) {
//                 navigate('/login');
//                 return;
//             }

//             const decodedToken = jwtDecode(token);
//             if (decodedToken.user_type === 'admin' || decodedToken.user_type === 'super_admin') {
//                 setIsAdmin(true);

//                 const response = await axios.get(`${AUTH_API_URL}/profile`, {
//                     headers: { 'Authorization': `Bearer ${token}` }
//                 });
//                 const userData = response.data;

//                 setUserName(`${userData.first_name} ${userData.last_name}`);
//                 setUserRole(userData.user_type);

//                 let profilePicToDisplay = DEFAULT_PROFILE_PIC;
//                 if (userData.profile_picture_url) {
//                     if (userData.profile_picture_url.startsWith('http://') || userData.profile_picture_url.startsWith('https://')) {
//                         profilePicToDisplay = userData.profile_picture_url;
//                     } else if (userData.profile_picture_url.startsWith('/uploads/')) {
//                         profilePicToDisplay = API_BASE_URL + userData.profile_picture_url;
//                     } else {
//                         profilePicToDisplay = userData.profile_picture_url;
//                     }
//                 }
//                 setUserProfilePic(profilePicToDisplay);

//             } else {
//                 navigate('/');
//             }
//         } catch (error) {
//             console.error("Authentication or profile fetch failed:", error.response?.data || error.message);
//             toast.error(error.response?.data?.message || 'Failed to fetch user profile. Logging out.');
//             sessionStorage.removeItem('token');
//             navigate('/login');
//         } finally {
//             setLoading(false);
//         }
//     }, [navigate, AUTH_API_URL, API_BASE_URL]);

//     const handleProfilePicUpdate = useCallback((newRelativePicUrl) => {
//         const newFullPicUrl = API_BASE_URL + newRelativePicUrl;
//         setUserProfilePic(newFullPicUrl);
//         toast.success("Profile picture updated successfully!");
//     }, [API_BASE_URL]);

//     const handleLogout = () => {
//         sessionStorage.removeItem('token');
//         toast.info("Successfully logged out.");
//         navigate('/');
//     };

//     useEffect(() => {
//         fetchUserProfile();
//     }, [fetchUserProfile]);

//     const navigationItems = [
//         { to: "products", icon: "bi-box", label: "Products", badge: null },
//         { to: "users", icon: "bi-people", label: "Users", badge: null },
//         { to: "categories", icon: "bi-tags", label: "Categories", badge: null },
//         { to: "orders", icon: "bi-receipt", label: "Orders", badge: "12" },
//         { to: "sales", icon: "bi-currency-dollar", label: "Sales", badge: null },
//         { to: "sales-analytics", icon: "bi-graph-up", label: "Sales Analytics", badge: null },
//         { to: "discounts", icon: "bi-percent", label: "Discounts", badge: null },
//         { to: "contact-messages", icon: "bi-chat-dots", label: "Messages", badge: "3" },
//         { to: "news", icon: "bi-newspaper", label: "News & Updates", badge: null },
//     ];

//     if (loading) {
//         return (
//             <div className="loading-container">
//                 <div className="loading-spinner">
//                     <div className="spinner"></div>
//                     <div className="loading-logo">
//                         <img src="/unihublogo.png" alt="UniHub Solutions" />
//                     </div>
//                 </div>
//                 <h3 className="loading-text">Initializing Admin Dashboard</h3>
//                 <p className="loading-subtext">Please wait while we prepare your workspace...</p>
//             </div>
//         );
//     }

//     if (!isAdmin) {
//         return (
//             <div className="access-denied-container">
//                 <div className="access-denied-content">
//                     <div className="access-denied-icon">
//                         <i className="bi bi-shield-exclamation"></i>
//                     </div>
//                     <h2>Access Restricted</h2>
//                     <p>Administrative privileges required to access this dashboard.</p>
//                     <Link to="/" className="btn-primary">
//                         <i className="bi bi-house"></i>
//                         Return to Home
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className={`admin-dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
//             {/* Enhanced Sidebar */}
//             <div className="admin-sidebar">
//                 {/* Header Section */}
//                 <div className="sidebar-header">
//                     <div className="logo-section">
//                         <img src="/unihublogo.png" alt="UniHub Solutions" className="admin-logo" />
//                         <div className="brand-text">
//                             <h4>UniHub Admin</h4>
//                             <span>Control Panel</span>
//                         </div>
//                     </div>
//                     <button 
//                         className="sidebar-toggle"
//                         onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//                     >
//                         <i className={`bi ${sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
//                     </button>
//                 </div>

//                 {/* User Profile Section */}
//                 <div className="admin-profile-section">
//                     <div className="profile-container">
//                         <div className="profile-pic-wrapper">
//                             <img src={userProfilePic} alt="User Profile" className="profile-pic" />
//                             <div className="online-indicator"></div>
//                         </div>
//                         <div className="user-info">
//                             <div className="user-name">{userName || 'Administrator'}</div>
//                             <div className="user-role">
//                                 <i className="bi bi-shield-check"></i>
//                                 {userRole === 'super_admin' ? 'Super Admin' : 'Administrator'}
//                             </div>
//                             <div className="user-status">
//                                 <i className="bi bi-clock"></i>
//                                 {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Navigation Menu */}
//                 <nav className="sidebar-nav">
//                     <div className="nav-section">
//                         <div className="nav-section-title">Management</div>
//                         <ul className="nav-list">
//                             {navigationItems.map((item) => (
//                                 <li key={item.to} className="nav-item">
//                                     <Link to={item.to} className="nav-link">
//                                         <span className="nav-icon">
//                                             <i className={`bi ${item.icon}`}></i>
//                                         </span>
//                                         <span className="nav-text">{item.label}</span>
//                                         {item.badge && (
//                                             <span className="nav-badge">{item.badge}</span>
//                                         )}
//                                         <span className="nav-arrow">
//                                             <i className="bi bi-chevron-right"></i>
//                                         </span>
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     <div className="nav-section">
//                         <div className="nav-section-title">Account</div>
//                         <ul className="nav-list">
//                             <li className="nav-item">
//                                 <Link to="profile-settings" className="nav-link">
//                                     <span className="nav-icon">
//                                         <i className="bi bi-person-gear"></i>
//                                     </span>
//                                     <span className="nav-text">Profile Settings</span>
//                                     <span className="nav-arrow">
//                                         <i className="bi bi-chevron-right"></i>
//                                     </span>
//                                 </Link>
//                             </li>
//                             <li className="nav-item">
//                                 <button onClick={handleLogout} className="nav-link logout-btn">
//                                     <span className="nav-icon">
//                                         <i className="bi bi-box-arrow-right"></i>
//                                     </span>
//                                     <span className="nav-text">Sign Out</span>
//                                     <span className="nav-arrow">
//                                         <i className="bi bi-chevron-right"></i>
//                                     </span>
//                                 </button>
//                             </li>
//                         </ul>
//                     </div>
//                 </nav>

//                 {/* Footer */}
//                 <div className="sidebar-footer">
//                     <div className="footer-content">
//                         <p>&copy; 2025 UniHub Solutions</p>
//                         <p>Version 2.1.0</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Content Area */}
//             <div className="admin-content-area">
//                 <Outlet context={{ 
//                     onProfileUpdate: handleProfilePicUpdate, 
//                     userName, 
//                     userRole, 
//                     userProfilePic,
//                     sidebarCollapsed,
//                     setSidebarCollapsed
//                 }} />
//             </div>
//         </div>
//     );
// };

// export default AdminDashboardLayout;






// // src/layouts/AdminDashboardLayout.jsx
// import React, { useEffect, useState, useCallback } from 'react';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// import API_BASE_URL from '../../config';
// import './styles/AdminDashboard.css';

// const DEFAULT_PROFILE_PIC = '/images/profile-placeholder.jpg';

// const AdminDashboardLayout = () => {
//   const navigate = useNavigate();
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [userName, setUserName] = useState('');
//   const [userRole, setUserRole] = useState('');
//   const [userProfilePic, setUserProfilePic] = useState(DEFAULT_PROFILE_PIC);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   const AUTH_API_URL = `${API_BASE_URL}/auth`; // ✅ updated

//   // Update time every minute
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 60000);
//     return () => clearInterval(timer);
//   }, []);

//   const fetchUserProfile = useCallback(async () => {
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       const decodedToken = jwtDecode(token);
//       if (decodedToken.user_type === 'admin' || decodedToken.user_type === 'super_admin') {
//         setIsAdmin(true);

//         const response = await axios.get(`${AUTH_API_URL}/profile`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const userData = response.data;

//         setUserName(`${userData.first_name} ${userData.last_name}`);
//         setUserRole(userData.user_type);

//         let profilePicToDisplay = DEFAULT_PROFILE_PIC;
//         if (userData.profile_picture_url) {
//           if (
//             userData.profile_picture_url.startsWith('http://') ||
//             userData.profile_picture_url.startsWith('https://')
//           ) {
//             profilePicToDisplay = userData.profile_picture_url;
//           } else if (userData.profile_picture_url.startsWith('/uploads/')) {
//             profilePicToDisplay = API_BASE_URL + userData.profile_picture_url;
//           } else {
//             profilePicToDisplay = userData.profile_picture_url;
//           }
//         }
//         setUserProfilePic(profilePicToDisplay);
//       } else {
//         navigate('/');
//       }
//     } catch (error) {
//       console.error('Authentication or profile fetch failed:', error.response?.data || error.message);
//       toast.error(error.response?.data?.message || 'Failed to fetch user profile. Logging out.');
//       sessionStorage.removeItem('token');
//       navigate('/login');
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate]);

//   const handleProfilePicUpdate = useCallback(
//     (newRelativePicUrl) => {
//       const newFullPicUrl = API_BASE_URL + newRelativePicUrl;
//       setUserProfilePic(newFullPicUrl);
//       toast.success('Profile picture updated successfully!');
//     },
//     []
//   );

//   const handleLogout = () => {
//     sessionStorage.removeItem('token');
//     toast.info('Successfully logged out.');
//     navigate('/');
//   };

//   useEffect(() => {
//     fetchUserProfile();
//   }, [fetchUserProfile]);

//   const navigationItems = [
//     { to: 'products', icon: 'bi-box', label: 'Products', badge: null },
//     { to: 'users', icon: 'bi-people', label: 'Users', badge: null },
//     { to: 'categories', icon: 'bi-tags', label: 'Categories', badge: null },
//     { to: 'orders', icon: 'bi-receipt', label: 'Orders', badge: '12' },
//     { to: 'sales', icon: 'bi-currency-dollar', label: 'Sales', badge: null },
//     { to: 'sales-analytics', icon: 'bi-graph-up', label: 'Sales Analytics', badge: null },
//     { to: 'discounts', icon: 'bi-percent', label: 'Discounts', badge: null },
//     { to: 'contact-messages', icon: 'bi-chat-dots', label: 'Messages', badge: '3' },
//     { to: 'news', icon: 'bi-newspaper', label: 'News & Updates', badge: null },
//   ];

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner">
//           <div className="spinner"></div>
//           <div className="loading-logo">
//             <img src="/unihublogo.png" alt="UniHub Solutions" />
//           </div>
//         </div>
//         <h3 className="loading-text">Initializing Admin Dashboard</h3>
//         <p className="loading-subtext">Please wait while we prepare your workspace...</p>
//       </div>
//     );
//   }

//   if (!isAdmin) {
//     return (
//       <div className="access-denied-container">
//         <div className="access-denied-content">
//           <div className="access-denied-icon">
//             <i className="bi bi-shield-exclamation"></i>
//           </div>
//           <h2>Access Restricted</h2>
//           <p>Administrative privileges required to access this dashboard.</p>
//           <Link to="/" className="btn-primary">
//             <i className="bi bi-house"></i>
//             Return to Home
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`admin-dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
//       {/* Sidebar */}
//       <div className="admin-sidebar">
//         {/* Header Section */}
//         <div className="sidebar-header">
//           <div className="logo-section">
//             <img src="/unihublogo.png" alt="UniHub Solutions" className="admin-logo" />
//             <div className="brand-text">
//               <h4>UniHub Admin</h4>
//               <span>Control Panel</span>
//             </div>
//           </div>
//           <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
//             <i className={`bi ${sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
//           </button>
//         </div>

//         {/* User Profile */}
//         <div className="admin-profile-section">
//           <div className="profile-container">
//             <div className="profile-pic-wrapper">
//               <img src={userProfilePic} alt="User Profile" className="profile-pic" />
//               <div className="online-indicator"></div>
//             </div>
//             <div className="user-info">
//               <div className="user-name">{userName || 'Administrator'}</div>
//               <div className="user-role">
//                 <i className="bi bi-shield-check"></i>
//                 {userRole === 'super_admin' ? 'Super Admin' : 'Administrator'}
//               </div>
//               <div className="user-status">
//                 <i className="bi bi-clock"></i>
//                 {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="sidebar-nav">
//           <div className="nav-section">
//             <div className="nav-section-title">Management</div>
//             <ul className="nav-list">
//               {navigationItems.map((item) => (
//                 <li key={item.to} className="nav-item">
//                   <Link to={item.to} className="nav-link">
//                     <span className="nav-icon">
//                       <i className={`bi ${item.icon}`}></i>
//                     </span>
//                     <span className="nav-text">{item.label}</span>
//                     {item.badge && <span className="nav-badge">{item.badge}</span>}
//                     <span className="nav-arrow">
//                       <i className="bi bi-chevron-right"></i>
//                     </span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="nav-section">
//             <div className="nav-section-title">Account</div>
//             <ul className="nav-list">
//               <li className="nav-item">
//                 <Link to="profile-settings" className="nav-link">
//                   <span className="nav-icon">
//                     <i className="bi bi-person-gear"></i>
//                   </span>
//                   <span className="nav-text">Profile Settings</span>
//                   <span className="nav-arrow">
//                     <i className="bi bi-chevron-right"></i>
//                   </span>
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <button onClick={handleLogout} className="nav-link logout-btn">
//                   <span className="nav-icon">
//                     <i className="bi bi-box-arrow-right"></i>
//                   </span>
//                   <span className="nav-text">Sign Out</span>
//                   <span className="nav-arrow">
//                     <i className="bi bi-chevron-right"></i>
//                   </span>
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </nav>

//         {/* Footer */}
//         <div className="sidebar-footer">
//           <div className="footer-content">
//             <p>&copy; 2025 UniHub Solutions</p>
//             <p>Version 2.1.0</p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="admin-content-area">
//         <Outlet
//           context={{
//             onProfileUpdate: handleProfilePicUpdate,
//             userName,
//             userRole,
//             userProfilePic,
//             sidebarCollapsed,
//             setSidebarCollapsed,
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default AdminDashboardLayout;



// src/layouts/AdminDashboardLayout.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { toast } from 'react-toastify';

import API_BASE_URL from '../../config';
import './styles/AdminDashboard.css';

const DEFAULT_PROFILE_PIC = '/images/profile-placeholder.jpg';

const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userProfilePic, setUserProfilePic] = useState(DEFAULT_PROFILE_PIC);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const AUTH_API_URL = `${API_BASE_URL}/api/v1/auth`; // ✅ Fixed to match login endpoint

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token');
      console.log('AdminDashboardLayout - Token from storage:', !!token);
      
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      // Validate and decode token before making API call
      let decodedToken;
      try {
        decodedToken = jwtDecode(token);
        console.log('Decoded token:', decodedToken);
      } catch (decodeErr) {
        console.error('Invalid token format:', decodeErr);
        sessionStorage.removeItem('token');
        toast.error('Invalid authentication token. Please login again.');
        navigate('/login');
        return;
      }

      // Check if token is expired
      if (decodedToken.exp * 1000 < Date.now()) {
        console.log('Token expired');
        sessionStorage.removeItem('token');
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      // Check user type
      if (decodedToken.user_type === 'admin' || decodedToken.user_type === 'super_admin') {
        console.log('User is admin, fetching profile');
        setIsAdmin(true);

        try {
          const response = await axios.get(`${AUTH_API_URL}/profile`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
          
          console.log('Profile API response:', response.data);
          const userData = response.data;

          setUserName(`${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Administrator');
          setUserRole(userData.user_type || decodedToken.user_type);

          // Handle profile picture
          let profilePicToDisplay = DEFAULT_PROFILE_PIC;
          if (userData.profile_picture_url) {
            if (
              userData.profile_picture_url.startsWith('http://') ||
              userData.profile_picture_url.startsWith('https://')
            ) {
              profilePicToDisplay = userData.profile_picture_url;
            } else if (userData.profile_picture_url.startsWith('/uploads/')) {
              profilePicToDisplay = API_BASE_URL + userData.profile_picture_url;
            } else {
              profilePicToDisplay = userData.profile_picture_url;
            }
          }
          setUserProfilePic(profilePicToDisplay);
          console.log('Admin profile loaded successfully');

        } catch (profileError) {
          console.error('Profile API error:', profileError);
          
          // Handle different error scenarios
          if (profileError.response?.status === 401) {
            console.log('Profile API returned 401 - token invalid');
            sessionStorage.removeItem('token');
            toast.error('Authentication failed. Please login again.');
            navigate('/login');
            return;
          } else if (profileError.response?.status === 403) {
            console.log('Profile API returned 403 - access forbidden');
            toast.error('Access denied. Admin privileges required.');
            navigate('/');
            return;
          } else {
            console.error('Profile API error details:', profileError.response?.data);
            // Don't redirect on profile fetch error, use token data instead
            setUserName('Administrator');
            setUserRole(decodedToken.user_type);
            toast.warn('Could not load profile details, but authentication successful.');
          }
        }
      } else {
        console.log('User is not admin, user_type:', decodedToken.user_type);
        toast.info('Admin access required.');
        navigate('/');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      sessionStorage.removeItem('token');
      toast.error('Authentication failed. Please login again.');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate, AUTH_API_URL]);

  const handleProfilePicUpdate = useCallback(
    (newRelativePicUrl) => {
      const newFullPicUrl = API_BASE_URL + newRelativePicUrl;
      setUserProfilePic(newFullPicUrl);
      toast.success('Profile picture updated successfully!');
    },
    []
  );

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    toast.info('Successfully logged out.');
    navigate('/');
  };

  useEffect(() => {
    console.log('AdminDashboardLayout mounted, starting authentication check');
    fetchUserProfile();
  }, [fetchUserProfile]);

  const navigationItems = [
    { to: 'products', icon: 'bi-box', label: 'Products', badge: null },
    { to: 'users', icon: 'bi-people', label: 'Users', badge: null },
    { to: 'categories', icon: 'bi-tags', label: 'Categories', badge: null },
    { to: 'orders', icon: 'bi-receipt', label: 'Orders', badge: '12' },
    { to: 'sales', icon: 'bi-currency-dollar', label: 'Sales', badge: null },
    { to: 'sales-analytics', icon: 'bi-graph-up', label: 'Sales Analytics', badge: null },
    { to: 'discounts', icon: 'bi-percent', label: 'Discounts', badge: null },
    { to: 'contact-messages', icon: 'bi-chat-dots', label: 'Messages', badge: '3' },
    { to: 'news', icon: 'bi-newspaper', label: 'News & Updates', badge: null },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <div className="loading-logo">
            <img src="/unihublogo.png" alt="UniHub Solutions" />
          </div>
        </div>
        <h3 className="loading-text">Initializing Admin Dashboard</h3>
        <p className="loading-subtext">Please wait while we prepare your workspace...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="access-denied-container">
        <div className="access-denied-content">
          <div className="access-denied-icon">
            <i className="bi bi-shield-exclamation"></i>
          </div>
          <h2>Access Restricted</h2>
          <p>Administrative privileges required to access this dashboard.</p>
          <Link to="/" className="btn-primary">
            <i className="bi bi-house"></i>
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <div className="admin-sidebar">
        {/* Header Section */}
        <div className="sidebar-header">
          <div className="logo-section">
            <img src="/unihublogo.png" alt="UniHub Solutions" className="admin-logo" />
            <div className="brand-text">
              <h4>UniHub Admin</h4>
              <span>Control Panel</span>
            </div>
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <i className={`bi ${sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
          </button>
        </div>

        {/* User Profile */}
        <div className="admin-profile-section">
          <div className="profile-container">
            <div className="profile-pic-wrapper">
              <img src={userProfilePic} alt="User Profile" className="profile-pic" />
              <div className="online-indicator"></div>
            </div>
            <div className="user-info">
              <div className="user-name">{userName || 'Administrator'}</div>
              <div className="user-role">
                <i className="bi bi-shield-check"></i>
                {userRole === 'super_admin' ? 'Super Admin' : 'Administrator'}
              </div>
              <div className="user-status">
                <i className="bi bi-clock"></i>
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Management</div>
            <ul className="nav-list">
              {navigationItems.map((item) => (
                <li key={item.to} className="nav-item">
                  <Link to={item.to} className="nav-link">
                    <span className="nav-icon">
                      <i className={`bi ${item.icon}`}></i>
                    </span>
                    <span className="nav-text">{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                    <span className="nav-arrow">
                      <i className="bi bi-chevron-right"></i>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Account</div>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="profile-settings" className="nav-link">
                  <span className="nav-icon">
                    <i className="bi bi-person-gear"></i>
                  </span>
                  <span className="nav-text">Profile Settings</span>
                  <span className="nav-arrow">
                    <i className="bi bi-chevron-right"></i>
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-btn">
                  <span className="nav-icon">
                    <i className="bi bi-box-arrow-right"></i>
                  </span>
                  <span className="nav-text">Sign Out</span>
                  <span className="nav-arrow">
                    <i className="bi bi-chevron-right"></i>
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="footer-content">
            <p>&copy; 2025 UniHub Solutions</p>
            <p>Version 2.1.0</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content-area">
        <Outlet
          context={{
            onProfileUpdate: handleProfilePicUpdate,
            userName,
            userRole,
            userProfilePic,
            sidebarCollapsed,
            setSidebarCollapsed,
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
