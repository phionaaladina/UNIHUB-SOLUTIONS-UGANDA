// // src/App.js
// import React, { useContext, useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';
// // Import useLocation
// import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'; // <--- UPDATED IMPORT

// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import WhatsAppChat from './components/chatComponent';

// import Home from './pages/Home';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Services from './pages/Services';
// import News from './pages/News';
// import Products from './pages/Products';
// import Cart from './components/Cart';
// import LoginForm from './components/LoginForm';

// import { CartProvider, CartContext } from './context/CartContext';

// // Import Admin Dashboard components
// import AdminDashboardLayout from './components/Admin/AdminDashboardLayout';
// import AdminProductsPage from './components/Admin/AdminProductsPage';
// import AdminUsersPage from './components/Admin/AdminUsersPage';
// import AdminOrdersPage from './components/Admin/AdminOrdersPage';
// import AdminCategoriesPage from './components/Admin/AdminCategoriesPage';
// import AdminSalesPage from './components/Admin/AdminSalesPage';
// import AdminContactMessagePage from './components/Admin/AdminContactMessagePage';
// import AdminNewsPage from './components/Admin/AdminNewsPage';
// import AdminDiscountsPage from './components/Admin/AdminDiscountsPage';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';

// // --- Unauthorized Page Component ---
// const UnauthorizedPage = () => (
//   <div className="container mt-5 text-center alert alert-danger">
//     <h4>Access Denied</h4>
//     <p>You do not have the necessary permissions to view this page.</p>
//     <p>Please ensure you are logged in with an authorized account.</p>
//     <a href="/" className="btn btn-primary">Go to Home</a>
//   </div>
// );

// // --- Protected Route Component ---
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const token = sessionStorage.getItem('token'); // Using sessionStorage for token

//   if (!token) {
//     // Not logged in, redirect to login
//     return <Navigate to="/login" replace />;
//   }

//   try {
//     const decodedToken = jwtDecode(token); // Using the correctly imported jwtDecode
//     const userRole = decodedToken.user_type; // Assuming 'user_type' is in your JWT payload

//     if (allowedRoles && !allowedRoles.includes(userRole)) {
//       // Logged in, but role not allowed, redirect to unauthorized
//       return <Navigate to="/unauthorized" replace />;
//     }

//     // User is logged in AND has the required role, render the children components
//     return children;
//   } catch (error) {
//     console.error("Invalid token:", error);
//     sessionStorage.removeItem('token'); // Clear invalid token from sessionStorage
//     // Token invalid or expired, force re-login
//     return <Navigate to="/login" replace />;
//   }
// };

// // Component to define your application's routes
// const AppRoutes = ({ isLoggedIn, userRole, handleLoginSuccess, handleLogout }) => {
//   const { cart, handleAddToCart } = useContext(CartContext);

//   return (
//     <Routes>
//       {/* --- Public Routes (accessible to anyone, no ProtectedRoute) --- */}
//       <Route path="/" element={<Home />} />
//       <Route path="/about" element={<About />} />
//       <Route path="/products" element={<Products onAddToCart={handleAddToCart} currentCart={cart} />} />
//       <Route path="/products/laptops" element={<Products initialCategory="Laptops" onAddToCart={handleAddToCart} currentCart={cart} />} />
//       <Route path="/products/desktops" element={<Products initialCategory="Desktops" onAddToCart={handleAddToCart} currentCart={cart} />} />
//       <Route path="/products/accessories" element={<Products initialCategory="Accessories" onAddToCart={handleAddToCart} currentCart={cart} />} />
//       <Route path="/products/software" element={<Products initialCategory="Software" onAddToCart={handleAddToCart} currentCart={cart} />} />
//       <Route path="/services" element={<Services />} />
//       <Route path="/services/web-software-development" element={<Services />} />
//       <Route path="/services/managed-it" element={<Services />} />
//       <Route path="/services/cybersecurity-cloud" element={<Services />} />
//       <Route path="/services/hardware-infrastructure" element={<Services />} />
//       <Route path="/services/specialized-it" element={<Services />} />
//       <Route path="/news" element={<News />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
//       <Route path="/unauthorized" element={<UnauthorizedPage />} />


//       {/* --- Authenticated Routes (Require login, but accessible by any logged-in role) --- */}
//       <Route
//         path="/cart"
//         element={
//           <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
//             <Cart />
//           </ProtectedRoute>
//         }
//       />

//       {/* --- Admin Dashboard Routes (Highly Protected, specific admin roles required) --- */}
//       <Route
//         path="/admin"
//         element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboardLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<AdminProductsPage />} />
//         <Route path="users" element={<AdminUsersPage />} />
//         <Route path="categories" element={<AdminCategoriesPage />} />
//         <Route path="products" element={<AdminProductsPage />} />
//         <Route path="orders" element={<AdminOrdersPage />} />
//         <Route path="sales" element={<AdminSalesPage />} />
//         <Route path="discounts" element={<AdminDiscountsPage />} />
//         <Route path="contact-messages" element={<AdminContactMessagePage />} />
//         <Route path="news" element={<AdminNewsPage />} />
//       </Route>

//       {/* --- Fallback for unknown routes --- */}
//       <Route path="*" element={<div>404 - Page Not Found</div>} />
//     </Routes>
//   );
// };

// // Main App component that manages global state and sets up Router
// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userRole, setUserRole] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation(); // <--- NEW: Get the current location

//   // Determine if the current route is an admin route
//   const isAdminRoute = location.pathname.startsWith('/admin'); // <--- NEW: Check if path starts with /admin

//   // Function to check and update authentication status based on sessionStorage token
//   const updateAuthStatus = () => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setIsLoggedIn(true);
//         setUserRole(decodedToken.user_type);
//       } catch (error) {
//         console.error("Failed to decode token on app load:", error);
//         sessionStorage.removeItem('token');
//         setIsLoggedIn(false);
//         setUserRole(null);
//       }
//     } else {
//       setIsLoggedIn(false);
//       setUserRole(null);
//     }
//   };

//   // Effect to run once on component mount to check initial auth status
//   useEffect(() => {
//     updateAuthStatus();
//   }, []);

//   // Handler for successful login, called by LoginForm
//   const handleLoginSuccess = (token) => {
//     sessionStorage.setItem('token', token);
//     const decodedToken = jwtDecode(token);
//     const newUserRole = decodedToken.user_type;

//     setIsLoggedIn(true);
//     setUserRole(newUserRole);

//     if (newUserRole === 'admin' || newUserRole === 'super_admin') {
//       navigate('/admin');
//     } else {
//       navigate('/');
//     }
//   };

//   // Handler for logout
//   const handleLogout = () => {
//     sessionStorage.removeItem('token');
//     setIsLoggedIn(false);
//     setUserRole(null);
//     navigate('/');
//   };

//   return (
//     <CartProvider>
//       {/* Conditionally render Navbar */}
//       {!isAdminRoute && (
//         <Navbar isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} />
//       )}

//       <AppRoutes
//         isLoggedIn={isLoggedIn}
//         userRole={userRole}
//         handleLoginSuccess={handleLoginSuccess}
//         handleLogout={handleLogout}
//       />

//       {/* Conditionally render WhatsAppChat */}
//       {!isAdminRoute && (
//         <WhatsAppChat />
//       )}

//       {/* Conditionally render Footer */}
//       {!isAdminRoute && (
//         <Footer />
//       )}
//     </CartProvider>
//   );
// };

// export default App;





// import React, { useContext, useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios'; // For potential future use, though currently not directly used in App.js for general data fetching

// // Main layout components
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import WhatsAppChat from './components/chatComponent';

// // Public Pages
// import Home from './pages/Home';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Services from './pages/Services';
// import News from './pages/News';
// import Products from './pages/Products';
// import Cart from './components/Cart';
// import LoginForm from './components/LoginForm';

// // Context Providers
// import { CartProvider, CartContext } from './context/CartContext';

// // Admin Dashboard Components
// import AdminDashboardLayout from './components/Admin/AdminDashboardLayout';
// import AdminProductsPage from './components/Admin/AdminProductsPage';
// import AdminUsersPage from './components/Admin/AdminUsersPage';
// import AdminOrdersPage from './components/Admin/AdminOrdersPage';
// import AdminCategoriesPage from './components/Admin/AdminCategoriesPage';
// import AdminSalesPage from './components/Admin/AdminSalesPage';
// import AdminContactMessagePage from './components/Admin/AdminContactMessagePage';
// import AdminNewsPage from './components/Admin/AdminNewsPage';
// import AdminDiscountsPage from './components/Admin/AdminDiscountsPage';
// import AdminProfileSettingsPage from './components/Admin/AdminProfileSettingsPage'; // For profile pic and password change

// // Styling and Notifications
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // --- Unauthorized Page Component ---
// const UnauthorizedPage = () => (
//   <div className="container mt-5 text-center alert alert-danger">
//     <h4>Access Denied</h4>
//     <p>You do not have the necessary permissions to view this page.</p>
//     <p>Please ensure you are logged in with an authorized account.</p>
//     <a href="/" className="btn btn-primary">Go to Home</a>
//   </div>
// );

// // --- Protected Route Component ---
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const token = sessionStorage.getItem('token'); // Using sessionStorage for token

//   if (!token) {
//     // Not logged in, redirect to login
//     return <Navigate to="/login" replace />;
//   }

//   try {
//     const decodedToken = jwtDecode(token);
//     const userRole = decodedToken.user_type; // Assuming 'user_type' is in your JWT payload

//     if (allowedRoles && !allowedRoles.includes(userRole)) {
//       // Logged in, but role not allowed, redirect to unauthorized
//       return <Navigate to="/unauthorized" replace />;
//     }

//     // User is logged in AND has the required role, render the children components
//     return children;
//   } catch (error) {
//     console.error("Invalid token:", error);
//     sessionStorage.removeItem('token'); // Clear invalid token from sessionStorage
//     // Token invalid or expired, force re-login
//     return <Navigate to="/login" replace />;
//   }
// };

// // Component to define your application's routes
// const AppRoutes = ({ isLoggedIn, userRole, userName, handleLoginSuccess, handleLogout }) => {
//   const { cart, handleAddToCart } = useContext(CartContext);

//   return (
//     <Routes>
//       {/* --- Public Routes (accessible to anyone, no ProtectedRoute) --- */}
//       <Route path="/" element={<Home />} />
//       <Route path="/about" element={<About />} />
//       <Route path="/products" element={<Products onAddToCart={handleAddToCart} currentCart={cart} />} />
//       <Route path="/products/laptops" element={<Products initialCategory="Laptops" onAddToCart={handleAddToCart} currentCart={cart} />} />
//       <Route path="/products/desktops" element={<Products initialCategory="Desktops" onAddToCart={handleAddToCart} currentCart={cart} />} />
//       <Route path="/products/accessories" element={<Products initialCategory="Accessories" onAddToCart={handleAddToCart} currentCart={cart} />} />
//       <Route path="/products/software" element={<Products initialCategory="Software" onAddToCart={handleAddToCart} currentCart={cart} />} />
//       <Route path="/services" element={<Services />} />
//       <Route path="/services/web-software-development" element={<Services />} />
//       <Route path="/services/managed-it" element={<Services />} />
//       <Route path="/services/cybersecurity-cloud" element={<Services />} />
//       <Route path="/services/hardware-infrastructure" element={<Services />} />
//       <Route path="/services/specialized-it" element={<Services />} />
//       <Route path="/news" element={<News />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
//       <Route path="/unauthorized" element={<UnauthorizedPage />} />


//       {/* --- Authenticated Routes (Require login, but accessible by any logged-in role) --- */}
//       <Route
//         path="/cart"
//         element={
//           <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
//             <Cart />
//           </ProtectedRoute>
//         }
//       />

//       {/* --- Admin Dashboard Routes (Highly Protected, specific admin roles required) --- */}
//       <Route
//         path="/admin"
//         element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             {/* Pass userName and userRole to AdminDashboardLayout */}
//             <AdminDashboardLayout userName={userName} userRole={userRole} />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<AdminProductsPage />} />
//         <Route path="users" element={<AdminUsersPage />} />
//         <Route path="categories" element={<AdminCategoriesPage />} />
//         <Route path="products" element={<AdminProductsPage />} />
//         <Route path="orders" element={<AdminOrdersPage />} />
//         <Route path="sales" element={<AdminSalesPage />} />
//         <Route path="discounts" element={<AdminDiscountsPage />} />
//         <Route path="contact-messages" element={<AdminContactMessagePage />} />
//         <Route path="news" element={<AdminNewsPage />} />
//         <Route path="profile" element={<AdminProfileSettingsPage userName={userName} userRole={userRole} />} />
//       </Route>

//       {/* --- Fallback for unknown routes --- */}
//       <Route path="*" element={<div>404 - Page Not Found</div>} />
//     </Routes>
//   );
// };

// // Main App component that manages global state and sets up Router
// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userRole, setUserRole] = useState(null);
//   const [userName, setUserName] = useState(null); // State for user's display name
//   const navigate = useNavigate();
//   const location = useLocation(); // Get the current location for conditional rendering

//   // Determine if the current route is an admin route
//   const isAdminRoute = location.pathname.startsWith('/admin');

//   // Function to check and update authentication status based on sessionStorage token
//   const updateAuthStatus = () => {
//     const token = sessionStorage.getItem('token'); // Using sessionStorage
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setIsLoggedIn(true);
//         setUserRole(decodedToken.user_type); // Assuming 'user_type' is in your JWT payload

//         // --- IMPORTANT: Concatenate first_name and last_name from JWT payload ---
//         const firstName = decodedToken.first_name || ''; // Get first_name, default to empty string
//         const lastName = decodedToken.last_name || '';   // Get last_name, default to empty string
//         setUserName(`${firstName} ${lastName}`.trim()); // Concatenate and trim whitespace

//       } catch (error) {
//         console.error("Failed to decode token on app load:", error);
//         sessionStorage.removeItem('token'); // Clear invalid token from sessionStorage
//         setIsLoggedIn(false);
//         setUserRole(null);
//         setUserName(null);
//       }
//     } else {
//       setIsLoggedIn(false);
//       setUserRole(null);
//       setUserName(null);
//     }
//   };

//   // Effect to run once on component mount to check initial auth status
//   useEffect(() => {
//     updateAuthStatus();
//   }, []); // Empty dependency array means it runs once after initial render

//   // Handler for successful login, called by LoginForm
//   const handleLoginSuccess = (token) => {
//     sessionStorage.setItem('token', token); // Store the token in sessionStorage
//     const decodedToken = jwtDecode(token); // Decode the token immediately for role check
//     const newUserRole = decodedToken.user_type;

//     // --- IMPORTANT: Concatenate first_name and last_name from JWT payload ---
//     const firstName = decodedToken.first_name || '';
//     const lastName = decodedToken.last_name || '';
//     const newUserName = `${firstName} ${lastName}`.trim();

//     setIsLoggedIn(true);
//     setUserRole(newUserRole);
//     setUserName(newUserName);

//     // Conditional redirect based on user role after successful login
//     if (newUserRole === 'admin' || newUserRole === 'super_admin') {
//       navigate('/admin'); // Redirect to admin dashboard
//     } else {
//       navigate('/'); // Redirect regular users to home or their default dashboard
//     }
//   };

//   // Handler for logout
//   const handleLogout = () => {
//     sessionStorage.removeItem('token'); // Remove token from sessionStorage
//     setIsLoggedIn(false);
//     setUserRole(null);
//     setUserName(null);
//     navigate('/'); // Redirect to home page after logout
//   };

//   return (
//     <CartProvider>
//       {/* Conditionally render Navbar: Only show if NOT an admin route */}
//       {!isAdminRoute && (
//         <Navbar isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} />
//       )}

//       {/* AppRoutes component contains all specific routes */}
//       <AppRoutes
//         isLoggedIn={isLoggedIn}
//         userRole={userRole}
//         userName={userName} // Pass userName to AppRoutes (and subsequently to AdminDashboardLayout)
//         handleLoginSuccess={handleLoginSuccess}
//         handleLogout={handleLogout}
//       />

//       {/* Conditionally render WhatsAppChat: Only show if NOT an admin route */}
//       {!isAdminRoute && (
//         <WhatsAppChat />
//       )}

//       {/* Conditionally render Footer: Only show if NOT an admin route */}
//       {!isAdminRoute && (
//         <Footer />
//       )}
//       <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
//     </CartProvider>
//   );
// };

// export default App;















// import React, { useContext, useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';

// // Main layout components
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import WhatsAppChat from './components/chatComponent';

// // Public Pages
// import Home from './pages/Home';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Services from './pages/Services';
// import News from './pages/News';
// import Products from './pages/Products';
// import Cart from './components/Cart';
// import LoginForm from './components/LoginForm';

// // Context Providers
// import { CartProvider, CartContext } from './context/CartContext';

// // Admin Dashboard Components (ensure correct paths)
// import AdminDashboardLayout from './components/Admin/AdminDashboardLayout';
// import AdminProductsPage from './components/Admin/AdminProductsPage';
// import AdminUsersPage from './components/Admin/AdminUsersPage';
// import AdminOrdersPage from './components/Admin/AdminOrdersPage';
// import AdminCategoriesPage from './components/Admin/AdminCategoriesPage';
// import AdminSalesPage from './components/Admin/AdminSalesPage';
// import AdminContactMessagePage from './components/Admin/AdminContactMessagePage';
// import AdminNewsPage from './components/Admin/AdminNewsPage';
// import AdminDiscountsPage from './components/Admin/AdminDiscountsPage';
// import AdminProfileSettingsPage from './components/Admin/AdminProfileSettingsPage'; // Ensure this path is correct!

// // Styling and Notifications
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // --- Unauthorized Page Component ---
// const UnauthorizedPage = () => (
//     <div className="container mt-5 text-center alert alert-danger">
//         <h4>Access Denied</h4>
//         <p>You do not have the necessary permissions to view this page.</p>
//         <p>Please ensure you are logged in with an authorized account.</p>
//         <a href="/" className="btn btn-primary">Go to Home</a>
//     </div>
// );

// // --- Protected Route Component ---
// const ProtectedRoute = ({ children, allowedRoles }) => {
//     const token = sessionStorage.getItem('token'); // Using sessionStorage for token

//     if (!token) {
//         return <Navigate to="/login" replace />;
//     }

//     try {
//         const decodedToken = jwtDecode(token);
//         const userRole = decodedToken.user_type;

//         if (allowedRoles && !allowedRoles.includes(userRole)) {
//             return <Navigate to="/unauthorized" replace />;
//         }

//         return children;
//     } catch (error) {
//         console.error("Invalid token:", error);
//         sessionStorage.removeItem('token');
//         return <Navigate to="/login" replace />;
//     }
// };

// // Component to define your application's routes
// const AppRoutes = ({ handleLoginSuccess, handleLogout, isLoggedIn, userRole }) => {
//     const { cart, handleAddToCart } = useContext(CartContext);

//     return (
//         <Routes>
//             {/* --- Public Routes --- */}
//             <Route path="/" element={<Home />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/products" element={<Products onAddToCart={handleAddToCart} currentCart={cart} />} />
//             <Route path="/products/laptops" element={<Products initialCategory="Laptops" onAddToCart={handleAddToCart} currentCart={cart} />} />
//             <Route path="/products/desktops" element={<Products initialCategory="Desktops" onAddToCart={handleAddToCart} currentCart={cart} />} />
//             <Route path="/products/accessories" element={<Products initialCategory="Accessories" onAddToCart={handleAddToCart} currentCart={cart} />} />
//             <Route path="/products/software" element={<Products initialCategory="Software" onAddToCart={handleAddToCart} currentCart={cart} />} />
//             <Route path="/services" element={<Services />} />
//             <Route path="/services/web-software-development" element={<Services />} />
//             <Route path="/services/managed-it" element={<Services />} />
//             <Route path="/services/cybersecurity-cloud" element={<Services />} />
//             <Route path="/services/hardware-infrastructure" element={<Services />} />
//             <Route path="/services/specialized-it" element={<Services />} />
//             <Route path="/news" element={<News />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
//             <Route path="/unauthorized" element={<UnauthorizedPage />} />

//             {/* --- Authenticated Routes --- */}
//             <Route
//                 path="/cart"
//                 element={
//                     <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
//                         <Cart />
//                     </ProtectedRoute>
//                 }
//             />

//             {/* --- Admin Dashboard Routes --- */}
//             <Route
//                 path="/admin"
//                 element={
//                     <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//                         {/* AdminDashboardLayout will now fetch and manage its own user data */}
//                         <AdminDashboardLayout />
//                     </ProtectedRoute>
//                 }
//             >
//                 {/* Nested routes within AdminDashboardLayout */}
//                 <Route index element={<AdminProductsPage />} />
//                 <Route path="users" element={<AdminUsersPage />} />
//                 <Route path="categories" element={<AdminCategoriesPage />} />
//                 <Route path="products" element={<AdminProductsPage />} />
//                 <Route path="orders" element={<AdminOrdersPage />} />
//                 <Route path="sales" element={<AdminSalesPage />} />
//                 <Route path="discounts" element={<AdminDiscountsPage />} />
//                 <Route path="contact-messages" element={<AdminContactMessagePage />} />
//                 <Route path="news" element={<AdminNewsPage />} />
//                 {/* AdminProfileSettingsPage will use useOutletContext */}
//                 <Route path="profile-settings" element={<AdminProfileSettingsPage />} />
//             </Route>

//             {/* --- Fallback for unknown routes --- */}
//             <Route path="*" element={<div>404 - Page Not Found</div>} />
//         </Routes>
//     );
// };

// // Main App component that manages global state and sets up Router
// const App = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [userRole, setUserRole] = useState(null);
//     const navigate = useNavigate();
//     const location = useLocation();

//     const isAdminRoute = location.pathname.startsWith('/admin');

//     const updateAuthStatus = () => {
//         const token = sessionStorage.getItem('token');
//         if (token) {
//             try {
//                 const decodedToken = jwtDecode(token);
//                 setIsLoggedIn(true);
//                 setUserRole(decodedToken.user_type);
//             } catch (error) {
//                 console.error("Failed to decode token on app load:", error);
//                 sessionStorage.removeItem('token');
//                 setIsLoggedIn(false);
//                 setUserRole(null);
//             }
//         } else {
//             setIsLoggedIn(false);
//             setUserRole(null);
//         }
//     };

//     useEffect(() => {
//         updateAuthStatus();
//     }, []);

//     const handleLoginSuccess = (token) => {
//         sessionStorage.setItem('token', token);
//         const decodedToken = jwtDecode(token);
//         const newUserRole = decodedToken.user_type;

//         setIsLoggedIn(true);
//         setUserRole(newUserRole);

//         if (newUserRole === 'admin' || newUserRole === 'super_admin') {
//             navigate('/admin');
//         } else {
//             navigate('/');
//         }
//     };

//     const handleLogout = () => {
//         sessionStorage.removeItem('token');
//         setIsLoggedIn(false);
//         setUserRole(null);
//         navigate('/');
//     };

//     return (
//         <CartProvider>
//             {!isAdminRoute && (
//                 <Navbar isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} />
//             )}

//             <AppRoutes
//                 isLoggedIn={isLoggedIn}
//                 userRole={userRole}
//                 handleLoginSuccess={handleLoginSuccess}
//                 handleLogout={handleLogout}
//             />

//             {!isAdminRoute && (
//                 <WhatsAppChat />
//             )}

//             {!isAdminRoute && (
//                 <Footer />
//             )}
//             <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
//         </CartProvider>
//     );
// };

// export default App;







// import React, { useContext, useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';

// // Main layout components
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import WhatsAppChat from './components/chatComponent';

// // Public Pages
// import Home from './pages/Home';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Services from './pages/Services';
// import News from './pages/News';
// import Products from './pages/Products';
// import Cart from './components/Cart';
// import LoginForm from './components/LoginForm';

// // Context Providers
// import { CartProvider, CartContext } from './context/CartContext';

// // Admin Dashboard Components (ensure correct paths)
// import AdminDashboardLayout from './components/Admin/AdminDashboardLayout';
// import AdminProductsPage from './components/Admin/AdminProductsPage';
// import AdminUsersPage from './components/Admin/AdminUsersPage';
// import AdminOrdersPage from './components/Admin/AdminOrdersPage';
// import AdminCategoriesPage from './components/Admin/AdminCategoriesPage';
// import AdminSalesPage from './components/Admin/AdminSalesPage';
// import AdminContactMessagePage from './components/Admin/AdminContactMessagePage';
// import AdminNewsPage from './components/Admin/AdminNewsPage';
// import AdminDiscountsPage from './components/Admin/AdminDiscountsPage';
// import AdminProfileSettingsPage from './components/Admin/AdminProfileSettingsPage'; // Ensure this path is correct!

// // Styling and Notifications
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // --- Unauthorized Page Component ---
// const UnauthorizedPage = () => (
//     <div className="container mt-5 text-center alert alert-danger">
//         <h4>Access Denied</h4>
//         <p>You do not have the necessary permissions to view this page.</p>
//         <p>Please ensure you are logged in with an authorized account.</p>
//         <a href="/" className="btn btn-primary">Go to Home</a>
//     </div>
// );

// // --- Protected Route Component ---
// const ProtectedRoute = ({ children, allowedRoles }) => {
//     const token = sessionStorage.getItem('token'); // Using sessionStorage for token

//     if (!token) {
//         return <Navigate to="/login" replace />;
//     }

//     try {
//         const decodedToken = jwtDecode(token);
//         const userRole = decodedToken.user_type;

//         if (allowedRoles && !allowedRoles.includes(userRole)) {
//             return <Navigate to="/unauthorized" replace />;
//         }

//         return children;
//     } catch (error) {
//         console.error("Invalid token:", error);
//         sessionStorage.removeItem('token');
//         return <Navigate to="/login" replace />;
//     }
// };

// // Component to define your application's routes
// const AppRoutes = ({ handleLoginSuccess, handleLogout, isLoggedIn, userRole }) => {
//     const { cart, handleAddToCart } = useContext(CartContext);

//     return (
//         <Routes>
//             {/* --- Public Routes --- */}
//             <Route path="/" element={<Home />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/products" element={<Products onAddToCart={handleAddToCart} currentCart={cart} />} />
//             <Route path="/products/laptops" element={<Products initialCategory="Laptops" onAddToCart={handleAddToCart} currentCart={cart} />} />
//             <Route path="/products/desktops" element={<Products initialCategory="Desktops" onAddToCart={handleAddToCart} currentCart={cart} />} />
//             <Route path="/products/accessories" element={<Products initialCategory="Accessories" onAddToCart={handleAddToCart} currentCart={cart} />} />
//             <Route path="/products/software" element={<Products initialCategory="Software" onAddToCart={handleAddToCart} currentCart={cart} />} />
//             <Route path="/services" element={<Services />} />
//             <Route path="/services/web-software-development" element={<Services />} />
//             <Route path="/services/managed-it" element={<Services />} />
//             <Route path="/services/cybersecurity-cloud" element={<Services />} />
//             <Route path="/services/hardware-infrastructure" element={<Services />} />
//             <Route path="/services/specialized-it" element={<Services />} />
//             <Route path="/news" element={<News />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
//             <Route path="/unauthorized" element={<UnauthorizedPage />} />

//             {/* --- Authenticated Routes --- */}
//             <Route
//                 path="/cart"
//                 element={
//                     <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
//                         <Cart />
//                     </ProtectedRoute>
//                 }
//             />

//             {/* --- Admin Dashboard Routes --- */}
//             <Route
//                 path="/admin"
//                 element={
//                     <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//                         {/* AdminDashboardLayout will now fetch and manage its own user data */}
//                         <AdminDashboardLayout />
//                     </ProtectedRoute>
//                 }
//             >
//                 {/* Nested routes within AdminDashboardLayout */}
//                 <Route index element={<AdminProductsPage />} />
//                 <Route path="users" element={<AdminUsersPage />} />
//                 <Route path="categories" element={<AdminCategoriesPage />} />
//                 <Route path="products" element={<AdminProductsPage />} />
//                 <Route path="orders" element={<AdminOrdersPage />} />
//                 <Route path="sales" element={<AdminSalesPage />} />
//                 <Route path="discounts" element={<AdminDiscountsPage />} />
//                 <Route path="contact-messages" element={<AdminContactMessagePage />} />
//                 <Route path="news" element={<AdminNewsPage />} />
//                 {/* AdminProfileSettingsPage will use useOutletContext */}
//                 <Route path="profile-settings" element={<AdminProfileSettingsPage />} />
//             </Route>

//             {/* --- Fallback for unknown routes --- */}
//             <Route path="*" element={<div>404 - Page Not Found</div>} />
//         </Routes>
//     );
// };

// // Main App component that manages global state and sets up Router
// const App = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [userRole, setUserRole] = useState(null);
//     const navigate = useNavigate();
//     const location = useLocation();

//     // Check if the current path is the login page or an admin page
//     const isSpecialRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

//     const updateAuthStatus = () => {
//         const token = sessionStorage.getItem('token');
//         if (token) {
//             try {
//                 const decodedToken = jwtDecode(token);
//                 setIsLoggedIn(true);
//                 setUserRole(decodedToken.user_type);
//             } catch (error) {
//                 console.error("Failed to decode token on app load:", error);
//                 sessionStorage.removeItem('token');
//                 setIsLoggedIn(false);
//                 setUserRole(null);
//             }
//         } else {
//             setIsLoggedIn(false);
//             setUserRole(null);
//         }
//     };

//     useEffect(() => {
//         updateAuthStatus();
//     }, []);

//     const handleLoginSuccess = (token) => {
//         sessionStorage.setItem('token', token);
//         const decodedToken = jwtDecode(token);
//         const newUserRole = decodedToken.user_type;

//         setIsLoggedIn(true);
//         setUserRole(newUserRole);

//         if (newUserRole === 'admin' || newUserRole === 'super_admin') {
//             navigate('/admin');
//         } else {
//             navigate('/');
//         }
//     };

//     const handleLogout = () => {
//         sessionStorage.removeItem('token');
//         setIsLoggedIn(false);
//         setUserRole(null);
//         navigate('/');
//     };

//     return (
//         <CartProvider>
//             {!isSpecialRoute && (
//                 <Navbar isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} />
//             )}

//             <AppRoutes
//                 isLoggedIn={isLoggedIn}
//                 userRole={userRole}
//                 handleLoginSuccess={handleLoginSuccess}
//                 handleLogout={handleLogout}
//             />

//             {!isSpecialRoute && (
//                 <WhatsAppChat />
//             )}

//             {!isSpecialRoute && (
//                 <Footer />
//             )}
//             <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
//         </CartProvider>
//     );
// };

// export default App;



// import React, { useContext, useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';

// // Main layout components
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import WhatsAppChat from './components/chatComponent';

// // Public Pages
// import Home from './pages/Home';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Services from './pages/Services';
// import News from './pages/News';
// import Products from './pages/Products';
// import Cart from './components/Cart';
// import LoginForm from './components/LoginForm';
// import SignUpForm from './components/SignUpForm'; // <-- ADDED IMPORT
// import UserDashboard from './components/UserDashboard';

// // Context Providers
// import { CartProvider, CartContext } from './context/CartContext';

// // Admin Dashboard Components (ensure correct paths)
// import AdminDashboardLayout from './components/Admin/AdminDashboardLayout';
// import AdminProductsPage from './components/Admin/AdminProductsPage';
// import AdminUsersPage from './components/Admin/AdminUsersPage';
// import AdminOrdersPage from './components/Admin/AdminOrdersPage';
// import AdminCategoriesPage from './components/Admin/AdminCategoriesPage';
// import AdminSalesPage from './components/Admin/AdminSalesPage';
// import AdminContactMessagePage from './components/Admin/AdminContactMessagePage';
// import AdminNewsPage from './components/Admin/AdminNewsPage';
// import AdminDiscountsPage from './components/Admin/AdminDiscountsPage';
// import AdminProfileSettingsPage from './components/Admin/AdminProfileSettingsPage'; // Ensure this path is correct!

// // Styling and Notifications
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // --- Unauthorized Page Component ---
// const UnauthorizedPage = () => (
//     <div className="container mt-5 text-center alert alert-danger">
//         <h4>Access Denied</h4>
//         <p>You do not have the necessary permissions to view this page.</p>
//         <p>Please ensure you are logged in with an authorized account.</p>
//         <a href="/" className="btn btn-primary">Go to Home</a>
//     </div>
// );

// // --- Protected Route Component ---
// const ProtectedRoute = ({ children, allowedRoles }) => {
//     const token = sessionStorage.getItem('token'); // Using sessionStorage for token

//     if (!token) {
//         return <Navigate to="/login" replace />;
//     }

//     try {
//         const decodedToken = jwtDecode(token);
//         const userRole = decodedToken.user_type;

//         if (allowedRoles && !allowedRoles.includes(userRole)) {
//             return <Navigate to="/unauthorized" replace />;
//         }

//         return children;
//     } catch (error) {
//         console.error("Invalid token:", error);
//         sessionStorage.removeItem('token');
//         return <Navigate to="/login" replace />;
//     }
// };

// // Component to define your application's routes
// const AppRoutes = ({ handleLoginSuccess, handleLogout, isLoggedIn, userRole }) => {
//     const { cart, handleAddToCart } = useContext(CartContext);

//     return (
//         <Routes>
//             {/* --- Public Routes --- */}
//             <Route path="/" element={<Home />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/products" element={<Products onAddToCart={handleAddToCart} currentCart={cart} />} />
//             <Route path="/products/laptops" element={<Products initialCategory="Laptops" onAddToCart={handleAddToCart} currentCart={cart} />} />
//             <Route path="/products/desktops" element={<Products initialCategory="Desktops" onAddToCart={handleAddToCart} currentCart={cart} />} />
//             <Route path="/products/accessories" element={<Products initialCategory="Accessories" onAddToCart={handleAddToCart} currentCart={cart} />} />
//             <Route path="/products/software" element={<Products initialCategory="Software" onAddToCart={handleAddToCart} currentCart={cart} />} />
//             <Route path="/services" element={<Services />} />
//             <Route path="/services/web-software-development" element={<Services />} />
//             <Route path="/services/managed-it" element={<Services />} />
//             <Route path="/services/cybersecurity-cloud" element={<Services />} />
//             <Route path="/services/hardware-infrastructure" element={<Services />} />
//             <Route path="/services/specialized-it" element={<Services />} />
//             <Route path="/news" element={<News />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
//             <Route path="/signup" element={<SignUpForm />} /> {/* <-- ADDED ROUTE */}
//             <Route path="/unauthorized" element={<UnauthorizedPage />} />

//             {/* --- Authenticated Routes --- */}
//             <Route
//                 path="/cart"
//                 element={
                 
//                         <Cart />
                  
//                 }
//             />
//             <Route path="/dashboard" element={<UserDashboard />} />
//             {/* --- Admin Dashboard Routes --- */}
//             <Route
//                 path="/admin"
//                 element={
//                     <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//                         {/* AdminDashboardLayout will now fetch and manage its own user data */}
//                         <AdminDashboardLayout />
//                     </ProtectedRoute>
//                 }
//             >
//                 {/* Nested routes within AdminDashboardLayout */}
//                 <Route index element={<AdminProductsPage />} />
//                 <Route path="users" element={<AdminUsersPage />} />
//                 <Route path="categories" element={<AdminCategoriesPage />} />
//                 <Route path="products" element={<AdminProductsPage />} />
//                 <Route path="orders" element={<AdminOrdersPage />} />
//                 <Route path="sales" element={<AdminSalesPage />} />
//                 <Route path="discounts" element={<AdminDiscountsPage />} />
//                 <Route path="contact-messages" element={<AdminContactMessagePage />} />
//                 <Route path="news" element={<AdminNewsPage />} />
//                 {/* AdminProfileSettingsPage will use useOutletContext */}
//                 <Route path="profile-settings" element={<AdminProfileSettingsPage />} />
//             </Route>

//             {/* --- Fallback for unknown routes --- */}
//             <Route path="*" element={<div>404 - Page Not Found</div>} />
//         </Routes>
//     );
// };

// // Main App component that manages global state and sets up Router
// const App = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [userRole, setUserRole] = useState(null);
//     const navigate = useNavigate();
//     const location = useLocation();

//     // Check if the current path is the login page or an admin page
//     const isSpecialRoute = location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/signup';

//     const updateAuthStatus = () => {
//         const token = sessionStorage.getItem('token');
//         if (token) {
//             try {
//                 const decodedToken = jwtDecode(token);
//                 setIsLoggedIn(true);
//                 setUserRole(decodedToken.user_type);
//             } catch (error) {
//                 console.error("Failed to decode token on app load:", error);
//                 sessionStorage.removeItem('token');
//                 setIsLoggedIn(false);
//                 setUserRole(null);
//             }
//         } else {
//             setIsLoggedIn(false);
//             setUserRole(null);
//         }
//     };

//     useEffect(() => {
//         updateAuthStatus();
//     }, []);

//     const handleLoginSuccess = (token) => {
//         sessionStorage.setItem('token', token);
//         const decodedToken = jwtDecode(token);
//         const newUserRole = decodedToken.user_type;

//         setIsLoggedIn(true);
//         setUserRole(newUserRole);

//         if (newUserRole === 'admin' || newUserRole === 'super_admin') {
//             navigate('/admin');
//         } else {
//             navigate('/');
//         }
//     };

//     const handleLogout = () => {
//         sessionStorage.removeItem('token');
//         setIsLoggedIn(false);
//         setUserRole(null);
//         navigate('/');
//     };

//     return (
//         <CartProvider>
//             {!isSpecialRoute && (
//                 <Navbar isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} />
//             )}

//             <AppRoutes
//                 isLoggedIn={isLoggedIn}
//                 userRole={userRole}
//                 handleLoginSuccess={handleLoginSuccess}
//                 handleLogout={handleLogout}
//             />

//             {!isSpecialRoute && (
//                 <WhatsAppChat />
//             )}

//             {!isSpecialRoute && (
//                 <Footer />
//             )}
//             <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
//         </CartProvider>
//     );
// };

// export default App;




//USERDASHBOARD

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

// Main layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppChat from './components/chatComponent';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import News from './pages/News';
import Products from './pages/Products';
import Cart from './components/Cart';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import UserDashboard from './components/UserDashboard';

// Admin Dashboard Components
import AdminDashboardLayout from './components/Admin/AdminDashboardLayout';
import AdminProductsPage from './components/Admin/AdminProductsPage';
import AdminUsersPage from './components/Admin/AdminUsersPage';
import AdminOrdersPage from './components/Admin/AdminOrdersPage';
import AdminCategoriesPage from './components/Admin/AdminCategoriesPage';
import AdminSalesPage from './components/Admin/AdminSalesPage';
import AdminSalesAnalyticsPage from './components/Admin/AdminSalesAnalyticsPage';
import AdminContactMessagePage from './components/Admin/AdminContactMessagePage';
import AdminNewsPage from './components/Admin/AdminNewsPage';
import AdminDiscountsPage from './components/Admin/AdminDiscountsPage';
import AdminProfileSettingsPage from './components/Admin/AdminProfileSettingsPage';

// Context Providers
import { CartProvider } from './context/CartContext';

// Styling and Notifications
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Unauthorized Page Component
const UnauthorizedPage = () => (
  <div className="container mt-5 text-center alert alert-danger">
    <h4>Access Denied</h4>
    <p>You do not have the necessary permissions to view this page.</p>
    <p>Please ensure you are logged in with an authorized account.</p>
    <a href="/" className="btn btn-primary">Go to Home</a>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.user_type;
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  } catch (error) {
    console.error("Invalid token:", error);
    sessionStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

// App Routes Component
const AppRoutes = ({ handleLoginSuccess, handleLogout, isLoggedIn, userRole }) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/laptops" element={<Products initialCategory="Laptops" />} />
      <Route path="/products/desktops" element={<Products initialCategory="Desktops" />} />
      <Route path="/products/accessories" element={<Products initialCategory="Accessories" />} />
      <Route path="/products/software" element={<Products initialCategory="Software" />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/web-software-development" element={<Services />} />
      <Route path="/services/managed-it" element={<Services />} />
      <Route path="/services/cybersecurity-cloud" element={<Services />} />
      <Route path="/services/hardware-infrastructure" element={<Services />} />
      <Route path="/services/specialized-it" element={<Services />} />
      <Route path="/news" element={<News />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Authenticated Routes */}
      <Route path="/cart" element={<Cart />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminProductsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="sales" element={<AdminSalesPage />} />
        <Route path="sales-analytics" element={<AdminSalesAnalyticsPage />} />
        <Route path="discounts" element={<AdminDiscountsPage />} />
        <Route path="contact-messages" element={<AdminContactMessagePage />} />
        <Route path="news" element={<AdminNewsPage />} />
        <Route path="profile-settings" element={<AdminProfileSettingsPage />} />
      </Route>

      {/* Fallback for unknown routes */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

// Main App Component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const navigate = useNavigate();
  const location = useLocation();

  const isSpecialRoute = location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    const initializeAuth = () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setIsLoggedIn(true);
          setUserRole(decodedToken.user_type);
        } catch (error) {
          console.error("Failed to decode token on app load:", error);
          sessionStorage.removeItem('token');
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLoginSuccess = (token) => {
    sessionStorage.setItem('token', token);
    const decodedToken = jwtDecode(token);
    const newUserRole = decodedToken.user_type;

    setIsLoggedIn(true);
    setUserRole(newUserRole);

    if (newUserRole === 'admin' || newUserRole === 'super_admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard'); // Redirect to dashboard for regular users
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      {!isSpecialRoute && (
        <Navbar isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} />
      )}
      <AppRoutes
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        handleLoginSuccess={handleLoginSuccess}
        handleLogout={handleLogout}
      />
      {!isSpecialRoute && <WhatsAppChat />}
      {!isSpecialRoute && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </CartProvider>
  );
};

export default App;