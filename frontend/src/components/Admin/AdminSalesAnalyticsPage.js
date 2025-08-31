// import React, { useState, useEffect, useCallback } from 'react';
// import { Card, Form, Spinner, Alert } from 'react-bootstrap';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import './styles/AdminSalesAnalyticsPage.css'; // Import the CSS

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const AdminSalesAnalyticsPage = () => {
//   const [sales, setSales] = useState([]);
//   const [orders, setOrders] = useState([]); // Fetch orders for additional analytics if needed
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dateRange, setDateRange] = useState('all'); // 'all', 'last7', 'last30'
//   const [analyticsData, setAnalyticsData] = useState({
//     totalSales: 0,
//     averageOrderValue: 0,
//     totalTransactions: 0,
//     salesTrend: { labels: [], datasets: [] },
//   });

//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
//   const navigate = useNavigate();

//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     sessionStorage.removeItem('token');
//     navigate('/login');
//   }, [navigate]);

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setLoggedInUserRole(decodedToken.user_type || '');
//       } catch (err) {
//         console.error('Failed to decode token:', err);
//         handleAuthError('Invalid or expired token. Please log in again.');
//       }
//     } else {
//       handleAuthError('Authentication token missing. Please log in.');
//     }
//   }, [handleAuthError]);

//   const fetchData = useCallback(async () => {
//     if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
//       handleAuthError('You do not have permission to view this page.');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       // Fetch sales
//       const salesResponse = await fetch(`${API_BASE_URL}/sales?page=1&per_page=100`, { // Fetch all sales; adjust per_page as needed
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       if (!salesResponse.ok) {
//         const errorData = await salesResponse.json();
//         throw new Error(errorData.error || 'Failed to fetch sales.');
//       }
//       const salesData = await salesResponse.json();
//       setSales(salesData.sales || []);

//       // Fetch orders for additional details if needed (optional, can remove if not required)
//       const ordersResponse = await fetch(`${API_BASE_URL}/orders/admin?page=1&per_page=100`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       if (!ordersResponse.ok) {
//         const errorData = await ordersResponse.json();
//         throw new Error(errorData.error || 'Failed to fetch orders.');
//       }
//       const ordersData = await ordersResponse.json();
//       setOrders(ordersData.orders || []);

//       toast.success('Analytics data fetched successfully!');
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err.message);
//       toast.error(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [loggedInUserRole, handleAuthError]);

//   useEffect(() => {
//     if (loggedInUserRole) {
//       fetchData();
//     }
//   }, [loggedInUserRole, fetchData]);

//   useEffect(() => {
//     if (sales.length === 0) return;

//     const filteredSales = sales.filter(sale => {
//       const saleDate = new Date(sale.sale_date);
//       const now = new Date();
//       if (dateRange === 'last30') return now - saleDate <= 30 * 24 * 60 * 60 * 1000;
//       if (dateRange === 'last7') return now - saleDate <= 7 * 24 * 60 * 60 * 1000;
//       return true;
//     });

//     const totalSales = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
//     const averageOrderValue = filteredSales.length ? (totalSales / filteredSales.length).toFixed(2) : 0;
//     const totalTransactions = filteredSales.length;

//     const salesByDate = filteredSales.reduce((acc, sale) => {
//       const date = new Date(sale.sale_date).toLocaleDateString();
//       acc[date] = (acc[date] || 0) + parseFloat(sale.amount);
//       return acc;
//     }, {});

//     const chartData = {
//       labels: Object.keys(salesByDate),
//       datasets: [{
//         label: 'Sales Amount',
//         data: Object.values(salesByDate),
//         backgroundColor: 'rgba(0, 71, 171, 0.6)',
//         borderColor: 'rgba(0, 71, 171, 1)',
//         borderWidth: 1,
//       }],
//     };

//     setAnalyticsData({
//       totalSales,
//       averageOrderValue,
//       totalTransactions,
//       salesTrend: chartData,
//     });
//   }, [sales, dateRange]);

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Sales Trend' },
//     },
//   };

//   return (
//     <div className="analytics-container">
//       <div className="analytics-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">Sales Analytics</h1>
//           </div>
//           <div className="header-actions">
//             <Form.Select
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//               className="filter-select"
//             >
//               <option value="all">All Time</option>
//               <option value="last30">Last 30 Days</option>
//               <option value="last7">Last 7 Days</option>
//             </Form.Select>
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <div className="loading-container">
//           <Spinner animation="border" className="loading-spinner" />
//           <h4>Loading analytics...</h4>
//           <p>Please wait while we fetch the data!</p>
//         </div>
//       ) : error ? (
//         <Alert variant="danger" className="error-alert">
//           {error}
//         </Alert>
//       ) : (
//         <>
//           <div className="analytics-metrics">
//             <Card className="metric-card">
//               <Card.Body>
//                 <h5>Total Sales</h5>
//                 <p>{analyticsData.totalSales.toFixed(2)}</p>
//               </Card.Body>
//             </Card>
//             <Card className="metric-card">
//               <Card.Body>
//                 <h5>Average Order Value</h5>
//                 <p>{analyticsData.averageOrderValue}</p>
//               </Card.Body>
//             </Card>
//             <Card className="metric-card">
//               <Card.Body>
//                 <h5>Total Transactions</h5>
//                 <p>{analyticsData.totalTransactions}</p>
//               </Card.Body>
//             </Card>
//           </div>

//           <Card className="chart-card">
//             <Card.Body>
//               <Bar data={analyticsData.salesTrend} options={chartOptions} />
//             </Card.Body>
//           </Card>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminSalesAnalyticsPage;









// import React, { useState, useEffect, useCallback } from 'react';
// import { Card, Form, Spinner, Alert } from 'react-bootstrap';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import './styles/AdminSalesAnalyticsPage.css';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const AdminSalesAnalyticsPage = () => {
//   const [sales, setSales] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dateRange, setDateRange] = useState('all');
//   const [analyticsData, setAnalyticsData] = useState({
//     totalSales: 0,
//     averageOrderValue: 0,
//     totalTransactions: 0,
//     salesTrend: { labels: [], datasets: [] },
//     topProducts: [], // New state for most sold products
//   });

//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
//   const navigate = useNavigate();

//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     sessionStorage.removeItem('token');
//     navigate('/login');
//   }, [navigate]);

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setLoggedInUserRole(decodedToken.user_type || '');
//       } catch (err) {
//         console.error('Failed to decode token:', err);
//         handleAuthError('Invalid or expired token. Please log in again.');
//       }
//     } else {
//       handleAuthError('Authentication token missing. Please log in.');
//     }
//   }, [handleAuthError]);

//   const fetchData = useCallback(async () => {
//     if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
//       handleAuthError('You do not have permission to view this page.');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       // Fetch sales
//       const salesResponse = await fetch(`${API_BASE_URL}/sales?page=1&per_page=100`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       if (!salesResponse.ok) {
//         const errorData = await salesResponse.json();
//         throw new Error(errorData.error || 'Failed to fetch sales.');
//       }
//       const salesData = await salesResponse.json();
//       setSales(salesData.sales || []);

//       // Fetch orders for product details
//       const ordersResponse = await fetch(`${API_BASE_URL}/orders/admin?page=1&per_page=100`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       if (!ordersResponse.ok) {
//         const errorData = await ordersResponse.json();
//         throw new Error(errorData.error || 'Failed to fetch orders.');
//       }
//       const ordersData = await ordersResponse.json();
//       setOrders(ordersData.orders || []);

//       toast.success('Analytics data fetched successfully!');
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err.message);
//       toast.error(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [loggedInUserRole, handleAuthError]);

//   useEffect(() => {
//     if (loggedInUserRole) {
//       fetchData();
//     }
//   }, [loggedInUserRole, fetchData]);

//   useEffect(() => {
//     if (sales.length === 0 && orders.length === 0) return;

//     // Use orders for product details since sales might not include cart
//     const allItems = orders.flatMap(order =>
//       order.cart.map(item => ({
//         product_name: item.product_name,
//         quantity: item.quantity,
//         sale_date: order.created_at, // Assuming order date aligns with sale
//       }))
//     );

//     const filteredItems = allItems.filter(item => {
//       const itemDate = new Date(item.sale_date);
//       const now = new Date('2025-08-24T16:44:00Z'); // Current date/time: 04:44 PM EAT
//       if (dateRange === 'last30') return now - itemDate <= 30 * 24 * 60 * 60 * 1000;
//       if (dateRange === 'last7') return now - itemDate <= 7 * 24 * 60 * 60 * 1000;
//       return true;
//     });

//     // Calculate total sales and average order value from sales
//     const filteredSales = sales.filter(sale => {
//       const saleDate = new Date(sale.sale_date);
//       return dateRange === 'all' || (dateRange === 'last30' && now - saleDate <= 30 * 24 * 60 * 60 * 1000) || (dateRange === 'last7' && now - saleDate <= 7 * 24 * 60 * 60 * 1000);
//     });
//     const totalSales = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
//     const averageOrderValue = filteredSales.length ? (totalSales / filteredSales.length).toFixed(2) : 0;
//     const totalTransactions = filteredSales.length;

//     // Calculate sales trend
//     const salesByDate = filteredSales.reduce((acc, sale) => {
//       const date = new Date(sale.sale_date).toLocaleDateString();
//       acc[date] = (acc[date] || 0) + parseFloat(sale.amount);
//       return acc;
//     }, {});

//     // Calculate most sold products
//     const productSales = filteredItems.reduce((acc, item) => {
//       acc[item.product_name] = (acc[item.product_name] || 0) + item.quantity;
//       return acc;
//     }, {});
//     const topProducts = Object.entries(productSales)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 3) // Top 3 products
//       .map(([name, quantity]) => ({ name, quantity }));

//     const chartData = {
//       labels: Object.keys(salesByDate),
//       datasets: [{
//         label: 'Sales Amount',
//         data: Object.values(salesByDate),
//         backgroundColor: 'rgba(0, 71, 171, 0.6)',
//         borderColor: 'rgba(0, 71, 171, 1)',
//         borderWidth: 1,
//       }],
//     };

//     setAnalyticsData({
//       totalSales,
//       averageOrderValue,
//       totalTransactions,
//       salesTrend: chartData,
//       topProducts,
//     });
//   }, [sales, orders, dateRange]);

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Sales Trend' },
//     },
//   };

//   return (
//     <div className="analytics-container">
//       <div className="analytics-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">Sales Analytics</h1>
//           </div>
//           <div className="header-actions">
//             <Form.Select
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//               className="filter-select"
//             >
//               <option value="all">All Time</option>
//               <option value="last30">Last 30 Days</option>
//               <option value="last7">Last 7 Days</option>
//             </Form.Select>
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <div className="loading-container">
//           <Spinner animation="border" className="loading-spinner" />
//           <h4>Loading analytics...</h4>
//           <p>Please wait while we fetch the data!</p>
//         </div>
//       ) : error ? (
//         <Alert variant="danger" className="error-alert">
//           {error}
//         </Alert>
//       ) : (
//         <>
//           <div className="analytics-metrics">
//             <Card className="metric-card">
//               <Card.Body>
//                 <h5>Total Sales</h5>
//                 <p>{analyticsData.totalSales.toFixed(2)}</p>
//               </Card.Body>
//             </Card>
//             <Card className="metric-card">
//               <Card.Body>
//                 <h5>Average Order Value</h5>
//                 <p>{analyticsData.averageOrderValue}</p>
//               </Card.Body>
//             </Card>
//             <Card className="metric-card">
//               <Card.Body>
//                 <h5>Total Transactions</h5>
//                 <p>{analyticsData.totalTransactions}</p>
//               </Card.Body>
//             </Card>
//             <Card className="metric-card">
//               <Card.Body>
//                 <h5>Top Products</h5>
//                 {analyticsData.topProducts.length > 0 ? (
//                   <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
//                     {analyticsData.topProducts.map((product, index) => (
//                       <li key={index}>
//                         {product.name}: {product.quantity} units
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No data available</p>
//                 )}
//               </Card.Body>
//             </Card>
//           </div>

//           <Card className="chart-card">
//             <Card.Body>
//               <Bar data={analyticsData.salesTrend} options={chartOptions} />
//             </Card.Body>
//           </Card>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminSalesAnalyticsPage;










// import React, { useState, useEffect, useCallback } from 'react';
// import { Card, Form, Spinner, Alert } from 'react-bootstrap';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import './styles/AdminSalesAnalyticsPage.css';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const AdminSalesAnalyticsPage = () => {
//   const [sales, setSales] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dateRange, setDateRange] = useState('all');
//   const [analyticsData, setAnalyticsData] = useState({
//     totalSales: 0,
//     averageOrderValue: 0,
//     totalTransactions: 0,
//     salesTrend: { labels: [], datasets: [] },
//     topProductsByQuantity: [],
//     topProductsByRevenue: [],
//     // Optionally add order status distribution later
//   });

//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
//   const navigate = useNavigate();

//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     sessionStorage.removeItem('token');
//     navigate('/login');
//   }, [navigate]);

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setLoggedInUserRole(decodedToken.user_type || '');
//       } catch (err) {
//         console.error('Failed to decode token:', err);
//         handleAuthError('Invalid or expired token. Please log in again.');
//       }
//     } else {
//       handleAuthError('Authentication token missing. Please log in.');
//     }
//   }, [handleAuthError]);

//   const fetchData = useCallback(async () => {
//     if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
//       handleAuthError('You do not have permission to view this page.');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       // Fetch sales for totals and trends
//       const salesResponse = await fetch(`${API_BASE_URL}/sales?page=1&per_page=100`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       if (!salesResponse.ok) {
//         const errorData = await salesResponse.json();
//         throw new Error(errorData.error || 'Failed to fetch sales.');
//       }
//       const salesData = await salesResponse.json();
//       setSales(salesData.sales || []);

//       // Fetch orders for product and order details
//       const ordersResponse = await fetch(`${API_BASE_URL}/orders/admin?page=1&per_page=100`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       if (!ordersResponse.ok) {
//         const errorData = await ordersResponse.json();
//         throw new Error(errorData.error || 'Failed to fetch orders.');
//       }
//       const ordersData = await ordersResponse.json();
//       setOrders(ordersData.orders || []);

//       toast.success('Analytics data fetched successfully!');
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err.message);
//       toast.error(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [loggedInUserRole, handleAuthError]);

//   useEffect(() => {
//     if (loggedInUserRole) {
//       fetchData();
//     }
//   }, [loggedInUserRole, fetchData]);

//   useEffect(() => {
//     if (sales.length === 0 && orders.length === 0) return;

//     const now = new Date('2025-08-24T16:50:00Z'); // 04:50 PM EAT

//     // Filter sales for totals and trends
//     const filteredSales = sales.filter(sale => {
//       const saleDate = new Date(sale.sale_date);
//       if (dateRange === 'last30') return now - saleDate <= 30 * 24 * 60 * 60 * 1000;
//       if (dateRange === 'last7') return now - saleDate <= 7 * 24 * 60 * 60 * 1000;
//       return true;
//     });
//     const totalSales = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
//     const averageOrderValue = filteredSales.length ? (totalSales / filteredSales.length).toFixed(2) : 0;
//     const totalTransactions = filteredSales.length;

//     // Filter orders for product details
//     const filteredOrders = orders.filter(order => {
//       const orderDate = new Date(order.created_at);
//       if (dateRange === 'last30') return now - orderDate <= 30 * 24 * 60 * 60 * 1000;
//       if (dateRange === 'last7') return now - orderDate <= 7 * 24 * 60 * 60 * 1000;
//       return true;
//     });

//     // Calculate sales trend from sales data
//     const salesByDate = filteredSales.reduce((acc, sale) => {
//       const date = new Date(sale.sale_date).toLocaleDateString();
//       acc[date] = (acc[date] || 0) + parseFloat(sale.amount || 0);
//       return acc;
//     }, {});

//     // Calculate top products by quantity and revenue from orders
//     const allItems = filteredOrders.flatMap(order =>
//       order.cart.map(item => ({
//         product_name: item.product_name,
//         quantity: item.quantity,
//         price: parseFloat(item.price || 0),
//         total: parseFloat(item.quantity || 0) * parseFloat(item.price || 0),
//       }))
//     );

//     const productQuantities = allItems.reduce((acc, item) => {
//       acc[item.product_name] = (acc[item.product_name] || 0) + item.quantity;
//       return acc;
//     }, {});
//     const topProductsByQuantity = Object.entries(productQuantities)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 3)
//       .map(([name, quantity]) => ({ name, quantity }));

//     const productRevenue = allItems.reduce((acc, item) => {
//       acc[item.product_name] = (acc[item.product_name] || 0) + item.total;
//       return acc;
//     }, {});
//     const topProductsByRevenue = Object.entries(productRevenue)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 3)
//       .map(([name, revenue]) => ({ name, revenue: revenue.toFixed(2) }));

//     const chartData = {
//       labels: Object.keys(salesByDate),
//       datasets: [{
//         label: 'Sales Amount',
//         data: Object.values(salesByDate),
//         backgroundColor: 'rgba(0, 71, 171, 0.6)',
//         borderColor: 'rgba(0, 71, 171, 1)',
//         borderWidth: 1,
//       }],
//     };

//     setAnalyticsData({
//       totalSales,
//       averageOrderValue,
//       totalTransactions,
//       salesTrend: chartData,
//       topProductsByQuantity,
//       topProductsByRevenue,
//     });
//   }, [sales, orders, dateRange]);

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Sales Trend' },
//     },
//   };

//   return (
//     <div className="analytics-container">
//       <div className="analytics-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">Sales Analytics</h1>
//           </div>
//           <div className="header-actions">
//             <Form.Select
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//               className="filter-select"
//             >
//               <option value="all">All Time</option>
//               <option value="last30">Last 30 Days</option>
//               <option value="last7">Last 7 Days</option>
//             </Form.Select>
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <div className="loading-container">
//           <Spinner animation="border" className="loading-spinner" />
//           <h4>Loading analytics...</h4>
//           <p>Please wait while we fetch the data!</p>
//         </div>
//       ) : error ? (
//         <Alert variant="danger" className="error-alert">
//           {error}
//         </Alert>
//       ) : (
//         <>
//           <div className="analytics-metrics">
//             <Card className="metric-card">
//               <Card.Body>
//                 <h5>Total Sales</h5>
//                 <p>{analyticsData.totalSales.toFixed(2)}</p>
//               </Card.Body>
//             </Card>
//             <Card className="metric-card">
//               <Card.Body>
//                 <h5>Average Order Value</h5>
//                 <p>{analyticsData.averageOrderValue}</p>
//               </Card.Body>
//             </Card>
//             <Card className="metric-card">
//               <Card.Body>
//                 <h5>Total Transactions</h5>
//                 <p>{analyticsData.totalTransactions}</p>
//               </Card.Body>
//             </Card>
//             <Card className="metric-card">
//               <Card.Body>
//                 <h5>Top Products by Quantity</h5>
//                 {analyticsData.topProductsByQuantity.length > 0 ? (
//                   <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
//                     {analyticsData.topProductsByQuantity.map((product, index) => (
//                       <li key={index}>
//                         {product.name}: {product.quantity} units
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No data available</p>
//                 )}
//               </Card.Body>
//             </Card>
//             <Card className="metric-card">
//               <Card.Body>
//                 <h5>Top Products by Revenue</h5>
//                 {analyticsData.topProductsByRevenue.length > 0 ? (
//                   <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
//                     {analyticsData.topProductsByRevenue.map((product, index) => (
//                       <li key={index}>
//                         {product.name}: {product.revenue}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No data available</p>
//                 )}
//               </Card.Body>
//             </Card>
//           </div>

//           <Card className="chart-card">
//             <Card.Body>
//               <Bar data={analyticsData.salesTrend} options={chartOptions} />
//             </Card.Body>
//           </Card>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminSalesAnalyticsPage;






// import React, { useState, useEffect, useCallback } from 'react';
// import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
// import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Calendar, Filter, Download, RefreshCw, Eye, Target } from 'lucide-react';

// const EnhancedAnalyticsDashboard = () => {
//   const [dateRange, setDateRange] = useState('last30');
//   const [activeMetric, setActiveMetric] = useState('revenue');
//   const [loading, setLoading] = useState(false);
//   const [viewMode, setViewMode] = useState('overview');

//   // Mock data - replace with your actual data fetching
//   const [analyticsData, setAnalyticsData] = useState({
//     kpis: {
//       totalRevenue: 45750.80,
//       revenueGrowth: 12.5,
//       totalOrders: 342,
//       ordersGrowth: 8.3,
//       averageOrderValue: 133.77,
//       aovGrowth: 4.2,
//       conversionRate: 3.2,
//       conversionGrowth: -1.1,
//       customerAcquisition: 89,
//       acquisitionGrowth: 15.7,
//       customerLifetimeValue: 420.50,
//       clvGrowth: 7.8
//     },
//     salesTrend: [
//       { date: '2024-07-25', revenue: 2340, orders: 18, customers: 12 },
//       { date: '2024-07-26', revenue: 3120, orders: 24, customers: 18 },
//       { date: '2024-07-27', revenue: 2890, orders: 21, customers: 15 },
//       { date: '2024-07-28', revenue: 4250, orders: 32, customers: 22 },
//       { date: '2024-07-29', revenue: 3780, orders: 28, customers: 19 },
//       { date: '2024-07-30', revenue: 5120, orders: 38, customers: 28 },
//       { date: '2024-07-31', revenue: 4680, orders: 35, customers: 24 }
//     ],
//     topProducts: [
//       { name: 'Premium Headphones', revenue: 8450, quantity: 45, growth: 15.2 },
//       { name: 'Wireless Speaker', revenue: 6230, quantity: 38, growth: 8.7 },
//       { name: 'Smart Watch', revenue: 5890, quantity: 28, growth: 22.1 },
//       { name: 'Gaming Mouse', revenue: 3420, quantity: 52, growth: -3.4 },
//       { name: 'Laptop Stand', revenue: 2180, quantity: 34, growth: 11.8 }
//     ],
//     categoryDistribution: [
//       { name: 'Electronics', value: 45, revenue: 18450 },
//       { name: 'Accessories', value: 28, revenue: 12340 },
//       { name: 'Gaming', value: 15, revenue: 8920 },
//       { name: 'Audio', value: 12, revenue: 6040 }
//     ],
//     customerSegments: [
//       { segment: 'Premium', customers: 45, revenue: 15680, avgOrder: 348.44 },
//       { segment: 'Regular', customers: 128, revenue: 21340, avgOrder: 166.72 },
//       { segment: 'New', customers: 89, revenue: 8730, avgOrder: 98.09 }
//     ],
//     performanceMetrics: [
//       { metric: 'Revenue Goal', current: 75, target: 100, color: '#10b981' },
//       { metric: 'Customer Growth', current: 85, target: 100, color: '#3b82f6' },
//       { metric: 'Order Volume', current: 68, target: 100, color: '#f59e0b' },
//       { metric: 'Conversion Rate', current: 92, target: 100, color: '#8b5cf6' }
//     ]
//   });

//   const COLORS = ['#0047ab', '#fc7f10', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

//   const KPICard = ({ title, value, growth, icon: Icon, format = 'number' }) => {
//     const formatValue = (val) => {
//       if (format === 'currency') return `$${val.toLocaleString()}`;
//       if (format === 'percentage') return `${val}%`;
//       return val.toLocaleString();
//     };

//     const isPositive = growth >= 0;
    
//     return (
//       <div className="kpi-card">
//         <div className="kpi-header">
//           <div className="kpi-icon">
//             <Icon size={24} />
//           </div>
//           <div className={`kpi-trend ${isPositive ? 'positive' : 'negative'}`}>
//             {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
//             {Math.abs(growth)}%
//           </div>
//         </div>
//         <div className="kpi-content">
//           <h3 className="kpi-title">{title}</h3>
//           <div className="kpi-value">{formatValue(value)}</div>
//         </div>
//       </div>
//     );
//   };

//   const ChartCard = ({ title, children, actions = null }) => (
//     <div className="chart-card">
//       <div className="chart-header">
//         <h3>{title}</h3>
//         {actions && <div className="chart-actions">{actions}</div>}
//       </div>
//       <div className="chart-content">
//         {children}
//       </div>
//     </div>
//   );

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="custom-tooltip">
//           <p className="tooltip-label">{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="tooltip-value" style={{ color: entry.color }}>
//               {entry.name}: {entry.name.includes('Revenue') ? `$${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="analytics-dashboard">
//       {/* Header */}
//       <div className="dashboard-header">
//         <div className="header-left">
//           <h1>Sales Analytics Dashboard</h1>
//           <p>Track your business performance and growth metrics</p>
//         </div>
//         <div className="header-right">
//           <div className="view-toggle">
//             <button 
//               className={`toggle-btn ${viewMode === 'overview' ? 'active' : ''}`}
//               onClick={() => setViewMode('overview')}
//             >
//               <Eye size={16} /> Overview
//             </button>
//             <button 
//               className={`toggle-btn ${viewMode === 'detailed' ? 'active' : ''}`}
//               onClick={() => setViewMode('detailed')}
//             >
//               <Target size={16} /> Detailed
//             </button>
//           </div>
//           <select 
//             value={dateRange} 
//             onChange={(e) => setDateRange(e.target.value)}
//             className="date-filter"
//           >
//             <option value="last7">Last 7 Days</option>
//             <option value="last30">Last 30 Days</option>
//             <option value="last90">Last 90 Days</option>
//             <option value="last365">Last Year</option>
//           </select>
//           <button className="action-btn">
//             <Download size={16} /> Export
//           </button>
//           <button className="action-btn primary">
//             <RefreshCw size={16} /> Refresh
//           </button>
//         </div>
//       </div>

//       {/* KPI Grid */}
//       <div className="kpi-grid">
//         <KPICard
//           title="Total Revenue"
//           value={analyticsData.kpis.totalRevenue}
//           growth={analyticsData.kpis.revenueGrowth}
//           icon={DollarSign}
//           format="currency"
//         />
//         <KPICard
//           title="Total Orders"
//           value={analyticsData.kpis.totalOrders}
//           growth={analyticsData.kpis.ordersGrowth}
//           icon={ShoppingCart}
//         />
//         <KPICard
//           title="Average Order Value"
//           value={analyticsData.kpis.averageOrderValue}
//           growth={analyticsData.kpis.aovGrowth}
//           icon={Package}
//           format="currency"
//         />
//         <KPICard
//           title="Conversion Rate"
//           value={analyticsData.kpis.conversionRate}
//           growth={analyticsData.kpis.conversionGrowth}
//           icon={Target}
//           format="percentage"
//         />
//         <KPICard
//           title="New Customers"
//           value={analyticsData.kpis.customerAcquisition}
//           growth={analyticsData.kpis.acquisitionGrowth}
//           icon={Users}
//         />
//         <KPICard
//           title="Customer LTV"
//           value={analyticsData.kpis.customerLifetimeValue}
//           growth={analyticsData.kpis.clvGrowth}
//           icon={TrendingUp}
//           format="currency"
//         />
//       </div>

//       {/* Main Charts Grid */}
//       <div className="charts-grid">
//         {/* Sales Trend */}
//         <ChartCard 
//           title="Revenue & Orders Trend"
//           actions={
//             <div className="metric-toggle">
//               <button 
//                 className={`metric-btn ${activeMetric === 'revenue' ? 'active' : ''}`}
//                 onClick={() => setActiveMetric('revenue')}
//               >
//                 Revenue
//               </button>
//               <button 
//                 className={`metric-btn ${activeMetric === 'orders' ? 'active' : ''}`}
//                 onClick={() => setActiveMetric('orders')}
//               >
//                 Orders
//               </button>
//             </div>
//           }
//         >
//           <ResponsiveContainer width="100%" height={300}>
//             <AreaChart data={analyticsData.salesTrend}>
//               <defs>
//                 <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#0047ab" stopOpacity={0.3}/>
//                   <stop offset="95%" stopColor="#0047ab" stopOpacity={0}/>
//                 </linearGradient>
//                 <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#fc7f10" stopOpacity={0.3}/>
//                   <stop offset="95%" stopColor="#fc7f10" stopOpacity={0}/>
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
//               <XAxis 
//                 dataKey="date" 
//                 stroke="#64748b"
//                 fontSize={12}
//                 tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//               />
//               <YAxis stroke="#64748b" fontSize={12} />
//               <Tooltip content={<CustomTooltip />} />
//               <Area 
//                 type="monotone" 
//                 dataKey="revenue" 
//                 stroke="#0047ab" 
//                 fillOpacity={1}
//                 fill="url(#colorRevenue)"
//                 strokeWidth={3}
//                 name="Revenue"
//               />
//               <Area 
//                 type="monotone" 
//                 dataKey="orders" 
//                 stroke="#fc7f10" 
//                 fillOpacity={1}
//                 fill="url(#colorOrders)"
//                 strokeWidth={3}
//                 name="Orders"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </ChartCard>

//         {/* Category Distribution */}
//         <ChartCard title="Revenue by Category">
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={analyticsData.categoryDistribution}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={60}
//                 outerRadius={120}
//                 paddingAngle={5}
//                 dataKey="value"
//               >
//                 {analyticsData.categoryDistribution.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip 
//                 formatter={(value, name, props) => [
//                   `${value}% ($${props.payload.revenue.toLocaleString()})`,
//                   'Share'
//                 ]}
//               />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </ChartCard>

//         {/* Performance Metrics */}
//         <ChartCard title="Performance Goals">
//           <ResponsiveContainer width="100%" height={300}>
//             <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={analyticsData.performanceMetrics}>
//               <RadialBar dataKey="current" cornerRadius={10} fill="#8884d8" />
//               <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
//             </RadialBarChart>
//           </ResponsiveContainer>
//         </ChartCard>
//       </div>

//       {/* Secondary Charts */}
//       <div className="secondary-charts">
//         {/* Top Products */}
//         <ChartCard title="Top Products Performance">
//           <div className="products-list">
//             {analyticsData.topProducts.map((product, index) => (
//               <div key={index} className="product-item">
//                 <div className="product-info">
//                   <span className="product-name">{product.name}</span>
//                   <span className="product-stats">
//                     ${product.revenue.toLocaleString()} • {product.quantity} units
//                   </span>
//                 </div>
//                 <div className="product-metrics">
//                   <div className="progress-bar">
//                     <div 
//                       className="progress-fill" 
//                       style={{ 
//                         width: `${(product.revenue / analyticsData.topProducts[0].revenue) * 100}%`,
//                         backgroundColor: COLORS[index % COLORS.length]
//                       }}
//                     ></div>
//                   </div>
//                   <div className={`growth-indicator ${product.growth >= 0 ? 'positive' : 'negative'}`}>
//                     {product.growth >= 0 ? '+' : ''}{product.growth}%
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ChartCard>

//         {/* Customer Segments */}
//         <ChartCard title="Customer Segments">
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={analyticsData.customerSegments} layout="horizontal">
//               <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
//               <XAxis type="number" stroke="#64748b" fontSize={12} />
//               <YAxis dataKey="segment" type="category" stroke="#64748b" fontSize={12} />
//               <Tooltip 
//                 formatter={(value, name) => [
//                   name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(),
//                   name === 'revenue' ? 'Revenue' : name === 'customers' ? 'Customers' : 'Avg Order'
//                 ]}
//               />
//               <Bar dataKey="revenue" fill="#0047ab" radius={[0, 4, 4, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartCard>
//       </div>
//     </div>
//   );
// };

// export default EnhancedAnalyticsDashboard;









// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//   RadialBarChart, RadialBar,
// } from 'recharts';
// import {
//   TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
//   Calendar, Filter, Download, RefreshCw, Eye, Target, ArrowRight,
// } from 'lucide-react';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import './styles/AdminSalesAnalyticsPage.css';

// const AdminSalesAnalyticsPage = () => {
//   const [sales, setSales] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dateRange, setDateRange] = useState('all');
//   const [viewMode, setViewMode] = useState('overview');
//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
//   const navigate = useNavigate();

//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     sessionStorage.removeItem('token');
//     navigate('/login');
//     toast.error(errMessage);
//   }, [navigate]);

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setLoggedInUserRole(decodedToken.user_type || '');
//       } catch (err) {
//         handleAuthError('Invalid or expired token. Please log in again.');
//       }
//     } else {
//       handleAuthError('Authentication token missing. Please log in.');
//     }
//   }, [handleAuthError]);

//   const fetchData = useCallback(async () => {
//     if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
//       handleAuthError('You do not have permission to view this page.');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       const [salesResponse, ordersResponse] = await Promise.all([
//         fetch(`${API_BASE_URL}/sales?page=1&per_page=100`, { headers: { 'Authorization': `Bearer ${token}` } }),
//         fetch(`${API_BASE_URL}/orders/admin?page=1&per_page=100`, { headers: { 'Authorization': `Bearer ${token}` } })
//       ]);

//       if (!salesResponse.ok) throw new Error((await salesResponse.json()).error || 'Failed to fetch sales.');
//       if (!ordersResponse.ok) throw new Error((await ordersResponse.json()).error || 'Failed to fetch orders.');

//       setSales((await salesResponse.json()).sales || []);
//       setOrders((await ordersResponse.json()).orders || []);

//       toast.success('Analytics data fetched successfully!');
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err.message);
//       toast.error(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [loggedInUserRole, handleAuthError]);

//   useEffect(() => {
//     if (loggedInUserRole) {
//       fetchData();
//     }
//   }, [loggedInUserRole, fetchData]);

//   const processAnalyticsData = useCallback(() => {
//     if (sales.length === 0 && orders.length === 0) return {
//       kpis: {}, salesTrend: [], topProducts: [], categoryDistribution: [], customerSegments: [], performanceMetrics: []
//     };

//     const now = new Date();
//     const isFiltered = dateRange !== 'all';
//     const filterByDate = (item) => {
//       const itemDate = new Date(item.created_at || item.sale_date);
//       if (dateRange === 'last30') return now - itemDate <= 30 * 24 * 60 * 60 * 1000;
//       if (dateRange === 'last7') return now - itemDate <= 7 * 24 * 60 * 60 * 1000;
//       return true;
//     };

//     const filteredSales = sales.filter(filterByDate);
//     const filteredOrders = orders.filter(filterByDate);

//     // Calculate KPIs
//     const totalRevenue = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
//     const totalTransactions = filteredSales.length;
//     const averageOrderValue = totalTransactions ? totalRevenue / totalTransactions : 0;
    
//     // Growth metrics (mocked as they require previous period data)
//     const revenueGrowth = 12.5; 
//     const ordersGrowth = 8.3;
//     const aovGrowth = 4.2;
//     const conversionGrowth = -1.1;
//     const acquisitionGrowth = 15.7;

//     // Sales Trend (for Area Chart)
//     const salesTrendData = filteredSales.reduce((acc, sale) => {
//       const date = new Date(sale.sale_date).toISOString().split('T')[0];
//       if (!acc[date]) acc[date] = { date, revenue: 0, orders: 0, customers: 0 };
//       acc[date].revenue += parseFloat(sale.amount || 0);
//       return acc;
//     }, {});
    
//     filteredOrders.forEach(order => {
//       const date = new Date(order.created_at).toISOString().split('T')[0];
//       if (!salesTrendData[date]) salesTrendData[date] = { date, revenue: 0, orders: 0, customers: 0 };
//       salesTrendData[date].orders += 1;
//       salesTrendData[date].customers = salesTrendData[date].customers || 0 + 1; // Simplified, assuming new customer per order
//     });

//     // Top Products
//     const allItems = filteredOrders.flatMap(order =>
//       order.cart.map(item => ({ product_name: item.product_name, quantity: item.quantity, price: parseFloat(item.price || 0) }))
//     );
//     const productMetrics = allItems.reduce((acc, item) => {
//       acc[item.product_name] = acc[item.product_name] || { revenue: 0, quantity: 0 };
//       acc[item.product_name].revenue += item.quantity * item.price;
//       acc[item.product_name].quantity += item.quantity;
//       return acc;
//     }, {});
//     const topProductsByRevenue = Object.entries(productMetrics)
//       .sort(([, a], [, b]) => b.revenue - a.revenue)
//       .slice(0, 5)
//       .map(([name, data]) => ({ name, revenue: data.revenue, quantity: data.quantity }));

//     // Category Distribution (Mocked as no category data is fetched)
//     const categoryDistribution = [
//       { name: 'Electronics', value: 45, revenue: 18450 },
//       { name: 'Accessories', value: 28, revenue: 12340 },
//       { name: 'Gaming', value: 15, revenue: 8920 },
//       { name: 'Audio', value: 12, revenue: 6040 }
//     ];

//     // Customer Segments (Mocked)
//     const customerSegments = [
//       { segment: 'Premium', customers: 45, revenue: 15680, avgOrder: 348.44 },
//       { segment: 'Regular', customers: 128, revenue: 21340, avgOrder: 166.72 },
//       { segment: 'New', customers: 89, revenue: 8730, avgOrder: 98.09 }
//     ];

//     return {
//       kpis: {
//         totalRevenue,
//         revenueGrowth,
//         totalOrders: filteredOrders.length,
//         ordersGrowth,
//         averageOrderValue,
//         aovGrowth,
//         conversionRate: 3.2, // Mock
//         conversionGrowth,
//         customerAcquisition: 89, // Mock
//         acquisitionGrowth,
//         customerLifetimeValue: 420.50, // Mock
//         clvGrowth: 7.8 // Mock
//       },
//       salesTrend: Object.values(salesTrendData).sort((a, b) => new Date(a.date) - new Date(b.date)),
//       topProducts: topProductsByRevenue,
//       categoryDistribution,
//       customerSegments,
//     };
//   }, [sales, orders, dateRange]);

//   const analyticsData = processAnalyticsData();

//   const KPICard = ({ title, value, growth, icon: Icon, format = 'number' }) => {
//     const formatValue = (val) => {
//       if (format === 'currency') return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//       if (format === 'percentage') return `${val}%`;
//       return val.toLocaleString();
//     };
//     const isPositive = growth >= 0;
//     return (
//       <div className="kpi-card">
//         <div className="kpi-icon-wrapper">
//           <Icon size={24} className="kpi-icon" />
//         </div>
//         <div className="kpi-content">
//           <h3 className="kpi-title">{title}</h3>
//           <div className="kpi-value">{formatValue(value)}</div>
//           <div className={`kpi-trend ${isPositive ? 'positive' : 'negative'}`}>
//             <span className="kpi-growth-icon">
//               {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
//             </span>
//             <span>{Math.abs(growth)}%</span>
//             <span className="trend-period"> vs. Last Period</span>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const ChartCard = ({ title, children, actions = null }) => (
//     <div className="chart-card">
//       <div className="chart-header">
//         <h3 className="chart-title">{title}</h3>
//         {actions && <div className="chart-actions">{actions}</div>}
//       </div>
//       <div className="chart-content">
//         {children}
//       </div>
//     </div>
//   );

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="custom-tooltip">
//           <p className="tooltip-label">{new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="tooltip-value" style={{ color: entry.stroke || entry.fill }}>
//               {entry.name}: {entry.name.includes('Revenue') ? `$${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   const renderOverview = () => (
//     <>
//       <div className="kpi-grid">
//         <KPICard
//           title="Total Revenue"
//           value={analyticsData.kpis.totalRevenue}
//           growth={analyticsData.kpis.revenueGrowth}
//           icon={DollarSign}
//           format="currency"
//         />
//         <KPICard
//           title="Total Orders"
//           value={analyticsData.kpis.totalOrders}
//           growth={analyticsData.kpis.ordersGrowth}
//           icon={ShoppingCart}
//         />
//         <KPICard
//           title="Average Order Value"
//           value={analyticsData.kpis.averageOrderValue}
//           growth={analyticsData.kpis.aovGrowth}
//           icon={Package}
//           format="currency"
//         />
//         <KPICard
//           title="Conversion Rate"
//           value={analyticsData.kpis.conversionRate}
//           growth={analyticsData.kpis.conversionGrowth}
//           icon={Target}
//           format="percentage"
//         />
//         <KPICard
//           title="New Customers"
//           value={analyticsData.kpis.customerAcquisition}
//           growth={analyticsData.kpis.acquisitionGrowth}
//           icon={Users}
//         />
//         <KPICard
//           title="Customer LTV"
//           value={analyticsData.kpis.customerLifetimeValue}
//           growth={analyticsData.kpis.clvGrowth}
//           icon={TrendingUp}
//           format="currency"
//         />
//       </div>

//       <div className="charts-grid-main">
//         <ChartCard
//           title="Revenue & Orders Trend"
//           actions={
//             <div className="metric-toggle">
//               <button
//                 className={`metric-btn ${analyticsData.salesTrend.length === 0 ? 'active' : ''}`}
//               >
//                 Revenue
//               </button>
//             </div>
//           }
//         >
//           {analyticsData.salesTrend.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={analyticsData.salesTrend}>
//                 <defs>
//                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#0047ab" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#0047ab" stopOpacity={0} />
//                   </linearGradient>
//                   <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#fc7f10" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#fc7f10" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
//                 <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
//                 <YAxis stroke="#64748b" fontSize={12} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="revenue" stroke="#0047ab" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} name="Revenue" />
//                 <Area type="monotone" dataKey="orders" stroke="#fc7f10" fillOpacity={1} fill="url(#colorOrders)" strokeWidth={3} name="Orders" />
//               </AreaChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="no-data-placeholder">No sales data for this period.</div>
//           )}
//         </ChartCard>
        
//         <ChartCard title="Top Products by Revenue">
//           <div className="products-list">
//             {analyticsData.topProducts.length > 0 ? (
//               analyticsData.topProducts.map((product, index) => (
//                 <div key={index} className="product-item">
//                   <div className="product-info">
//                     <span className="product-name">{product.name}</span>
//                     <span className="product-stats">${product.revenue.toLocaleString()} • {product.quantity} units</span>
//                   </div>
//                   <div className="product-metrics">
//                     <div className="progress-bar">
//                       <div
//                         className="progress-fill"
//                         style={{
//                           width: `${(product.revenue / analyticsData.topProducts[0].revenue) * 100}%`,
//                           backgroundColor: ['#0047ab', '#fc7f10', '#10b981', '#f59e0b', '#8b5cf6'][index % 5]
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="no-data-placeholder">No product data for this period.</div>
//             )}
//           </div>
//         </ChartCard>
//       </div>

//       <div className="charts-grid-secondary">
//         <ChartCard title="Revenue by Category">
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={analyticsData.categoryDistribution}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={60}
//                 outerRadius={120}
//                 paddingAngle={5}
//                 dataKey="revenue"
//                 nameKey="name"
//               >
//                 {analyticsData.categoryDistribution.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={['#0047ab', '#fc7f10', '#10b981', '#f59e0b'][index % 4]} />
//                 ))}
//               </Pie>
//               <Tooltip formatter={(value, name, props) => [`$${value.toLocaleString()}`, props.payload.name]} />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </ChartCard>

//         <ChartCard title="Customer Segments">
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={analyticsData.customerSegments} layout="horizontal">
//               <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
//               <XAxis type="number" stroke="#64748b" fontSize={12} />
//               <YAxis dataKey="segment" type="category" stroke="#64748b" fontSize={12} />
//               <Tooltip formatter={(value, name) => [name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(), name === 'revenue' ? 'Revenue' : 'Customers']} />
//               <Bar dataKey="revenue" fill="#0047ab" radius={[0, 4, 4, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartCard>
//       </div>
//     </>
//   );

//   const renderDetailedView = () => (
//     <div className="detailed-view">
//       <ChartCard title="Detailed Sales Trend">
//         {analyticsData.salesTrend.length > 0 ? (
//           <ResponsiveContainer width="100%" height={400}>
//             <LineChart data={analyticsData.salesTrend}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
//               <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
//               <YAxis stroke="#64748b" fontSize={12} />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend />
//               <Line type="monotone" dataKey="revenue" stroke="#0047ab" strokeWidth={2} name="Revenue" dot={{ r: 4 }} />
//               <Line type="monotone" dataKey="orders" stroke="#fc7f10" strokeWidth={2} name="Orders" dot={{ r: 4 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         ) : (
//           <div className="no-data-placeholder">No sales data for this period.</div>
//         )}
//       </ChartCard>

//       <div className="detailed-tables-grid">
//         <ChartCard title="Top Products (Detailed)">
//           <div className="table-responsive">
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Product Name</th>
//                   <th>Revenue</th>
//                   <th>Units Sold</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {analyticsData.topProducts.map((product, index) => (
//                   <tr key={index}>
//                     <td>{product.name}</td>
//                     <td>${product.revenue.toLocaleString()}</td>
//                     <td>{product.quantity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </ChartCard>
        
//         <ChartCard title="Customer Segments (Detailed)">
//           <div className="table-responsive">
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Segment</th>
//                   <th>Customers</th>
//                   <th>Total Revenue</th>
//                   <th>AOV</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {analyticsData.customerSegments.map((segment, index) => (
//                   <tr key={index}>
//                     <td>{segment.segment}</td>
//                     <td>{segment.customers.toLocaleString()}</td>
//                     <td>${segment.revenue.toLocaleString()}</td>
//                     <td>${segment.avgOrder.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </ChartCard>
//       </div>
//     </div>
//   );

//   return (
//     <div className="analytics-dashboard-container">
//       <div className="dashboard-header">
//         <div className="header-left">
//           <h1>Sales Analytics Dashboard</h1>
//           <p className="subtitle">Track your business performance and growth metrics</p>
//         </div>
//         <div className="header-right">
//           <div className="view-toggle">
//             <button
//               className={`toggle-btn ${viewMode === 'overview' ? 'active' : ''}`}
//               onClick={() => setViewMode('overview')}
//             >
//               <Eye size={16} /> Overview
//             </button>
//             <button
//               className={`toggle-btn ${viewMode === 'detailed' ? 'active' : ''}`}
//               onClick={() => setViewMode('detailed')}
//             >
//               <Target size={16} /> Detailed
//             </button>
//           </div>
//           <div className="filter-group">
//             <Calendar size={16} className="filter-icon" />
//             <select
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//               className="date-filter"
//             >
//               <option value="all">All Time</option>
//               <option value="last30">Last 30 Days</option>
//               <option value="last7">Last 7 Days</option>
//             </select>
//           </div>
//           <button className="action-btn">
//             <Download size={16} /> Export
//           </button>
//           <button className="action-btn primary" onClick={fetchData} disabled={loading}>
//             <RefreshCw size={16} /> {loading ? 'Refreshing...' : 'Refresh'}
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="loading-state">
//           <div className="spinner"></div>
//           <p>Loading analytics data...</p>
//         </div>
//       ) : error ? (
//         <div className="error-alert">
//           {error}
//         </div>
//       ) : (
//         <>
//           {viewMode === 'overview' ? renderOverview() : renderDetailedView()}
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminSalesAnalyticsPage;











// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
// } from 'recharts';
// import {
//   TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
//   Calendar, Filter, Download, RefreshCw, Eye, Target, ArrowRight,
// } from 'lucide-react';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { Table } from 'react-bootstrap';
// import './styles/AdminSalesAnalyticsPage.css';

// const AdminSalesAnalyticsPage = () => {
//   const [sales, setSales] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dateRange, setDateRange] = useState('all');
//   const [viewMode, setViewMode] = useState('overview');
//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
//   const navigate = useNavigate();

//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     sessionStorage.removeItem('token');
//     navigate('/login');
//     toast.error(errMessage);
//   }, [navigate]);

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setLoggedInUserRole(decodedToken.user_type || '');
//       } catch (err) {
//         handleAuthError('Invalid or expired token. Please log in again.');
//       }
//     } else {
//       handleAuthError('Authentication token missing. Please log in.');
//     }
//   }, [handleAuthError]);

//   const fetchData = useCallback(async () => {
//     if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
//       handleAuthError('You do not have permission to view this page.');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       const [salesResponse, ordersResponse, usersResponse, productsResponse, categoriesResponse] = await Promise.all([
//         fetch(`${API_BASE_URL}/sales?page=1&per_page=100`, { headers: { 'Authorization': `Bearer ${token}` } }),
//         fetch(`${API_BASE_URL}/orders/admin?page=1&per_page=100`, { headers: { 'Authorization': `Bearer ${token}` } }),
//         fetch(`${API_BASE_URL}/users?page=1&per_page=100`, { headers: { 'Authorization': `Bearer ${token}` } }),
//         fetch(`${API_BASE_URL}/products?page=1&per_page=100`, { headers: { 'Authorization': `Bearer ${token}` } }),
//         fetch(`${API_BASE_URL}/categories?page=1&per_page=100`, { headers: { 'Authorization': `Bearer ${token}` } }),
//       ]);

//       if (!salesResponse.ok) throw new Error((await salesResponse.json()).error || 'Failed to fetch sales.');
//       if (!ordersResponse.ok) throw new Error((await ordersResponse.json()).error || 'Failed to fetch orders.');
//       if (!usersResponse.ok) throw new Error((await usersResponse.json()).error || 'Failed to fetch users.');
//       if (!productsResponse.ok) throw new Error((await productsResponse.json()).error || 'Failed to fetch products.');
//       if (!categoriesResponse.ok) throw new Error((await categoriesResponse.json()).error || 'Failed to fetch categories.');

//       setSales((await salesResponse.json()).sales || []);
//       setOrders((await ordersResponse.json()).orders || []);
//       setUsers((await usersResponse.json()).users || []);
//       setProducts((await productsResponse.json()).products || []);
//       setCategories((await categoriesResponse.json()).categories || []);

//       toast.success('Analytics data fetched successfully!');
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err.message);
//       toast.error(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [loggedInUserRole, handleAuthError]);

//   useEffect(() => {
//     if (loggedInUserRole) {
//       fetchData();
//     }
//   }, [loggedInUserRole, fetchData]);

//   const processAnalyticsData = useCallback(() => {
//     if (sales.length === 0 && orders.length === 0 && users.length === 0 && products.length === 0) {
//       return {
//         kpis: {}, salesTrend: [], topProducts: [], categoryDistribution: [], customerSegments: [],
//       };
//     }

//     const now = new Date('2025-08-24T17:37:00Z'); // 05:37 PM EAT
//     const filterByDate = (item) => {
//       const itemDate = new Date(item.created_at || item.sale_date);
//       if (dateRange === 'last30') return now - itemDate <= 30 * 24 * 60 * 60 * 1000;
//       if (dateRange === 'last7') return now - itemDate <= 7 * 24 * 60 * 60 * 1000;
//       return true;
//     };

//     const filteredSales = sales.filter(filterByDate);
//     const filteredOrders = orders.filter(filterByDate);
//     const filteredUsers = users.filter(filterByDate);

//     // KPIs
//     const totalRevenue = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
//     const totalOrders = filteredOrders.length;
//     const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
//     const totalCustomers = filteredUsers.length;
//     const newCustomers = filteredUsers.filter(user => {
//       const userDate = new Date(user.created_at);
//       return dateRange === 'last30' ? now - userDate <= 30 * 24 * 60 * 60 * 1000 :
//              dateRange === 'last7' ? now - userDate <= 7 * 24 * 60 * 60 * 1000 : true;
//     }).length;

//     // Growth metrics (simplified, requires historical data for accuracy)
//     const revenueGrowth = filteredSales.length > 10 ? ((totalRevenue - filteredSales.slice(-10).reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0)) / totalRevenue * 100) : 0;
//     const ordersGrowth = filteredOrders.length > 10 ? ((totalOrders - filteredOrders.slice(-10).length) / totalOrders * 100) : 0;
//     const aovGrowth = averageOrderValue > 0 && filteredOrders.length > 10 ? ((averageOrderValue - (filteredOrders.slice(-10).reduce((sum, order) => sum + parseFloat(order.cart.reduce((s, item) => s + item.price * item.quantity, 0)), 0) / 10)) / averageOrderValue * 100) : 0;
//     const conversionGrowth = 0; // Requires conversion tracking data
//     const acquisitionGrowth = newCustomers > 0 && filteredUsers.length > 10 ? ((newCustomers - filteredUsers.slice(-10).length) / newCustomers * 100) : 0;

//     // Sales Trend
//     const salesTrendData = filteredSales.reduce((acc, sale) => {
//       const date = new Date(sale.sale_date).toISOString().split('T')[0];
//       acc[date] = acc[date] || { date, revenue: 0, orders: 0 };
//       acc[date].revenue += parseFloat(sale.amount || 0);
//       return acc;
//     }, {});
//     filteredOrders.forEach(order => {
//       const date = new Date(order.created_at).toISOString().split('T')[0];
//       salesTrendData[date] = salesTrendData[date] || { date, revenue: 0, orders: 0 };
//       salesTrendData[date].orders += 1;
//     });
//     const salesTrend = Object.values(salesTrendData).sort((a, b) => new Date(a.date) - new Date(b.date));

//     // Top Products
//     const allItems = filteredOrders.flatMap(order =>
//       order.cart.map(item => ({
//         product_name: item.product_name,
//         quantity: item.quantity,
//         price: parseFloat(item.price || 0),
//       }))
//     );
//     const productMetrics = allItems.reduce((acc, item) => {
//       acc[item.product_name] = acc[item.product_name] || { revenue: 0, quantity: 0 };
//       acc[item.product_name].revenue += item.quantity * item.price;
//       acc[item.product_name].quantity += item.quantity;
//       return acc;
//     }, {});
//     const topProducts = Object.entries(productMetrics)
//       .sort(([, a], [, b]) => b.revenue - a.revenue)
//       .slice(0, 5)
//       .map(([name, data]) => ({
//         name,
//         revenue: data.revenue,
//         quantity: data.quantity,
//       }));

//     // Category Distribution
//     const categorySales = filteredOrders.flatMap(order =>
//       order.cart.map(item => {
//         const product = products.find(p => p.name === item.product_name);
//         return { category_id: product?.category_id, revenue: item.quantity * parseFloat(item.price || 0) };
//       })
//     );
//     const categoryDistribution = categories.map(cat => ({
//       name: cat.name,
//       value: categorySales.filter(cs => cs.category_id === cat.id).length,
//       revenue: categorySales.filter(cs => cs.category_id === cat.id).reduce((sum, cs) => sum + cs.revenue, 0),
//     })).filter(cat => cat.value > 0);

//     // Customer Segments
//     const customerSegments = [
//       { segment: 'Premium', customers: users.filter(u => u.user_type === 'premium' || u.user_type === 'admin').length, revenue: filteredSales.filter(s => users.find(u => u.id === s.user_id)?.user_type === 'premium' || users.find(u => u.id === s.user_id)?.user_type === 'admin').reduce((sum, s) => sum + parseFloat(s.amount || 0), 0), avgOrder: totalOrders ? (filteredSales.filter(s => users.find(u => u.id === s.user_id)?.user_type === 'premium' || users.find(u => u.id === s.user_id)?.user_type === 'admin').reduce((sum, s) => sum + parseFloat(s.amount || 0), 0) / totalOrders) : 0 },
//       { segment: 'Regular', customers: users.filter(u => u.user_type === 'user').length, revenue: filteredSales.filter(s => users.find(u => u.id === s.user_id)?.user_type === 'user').reduce((sum, s) => sum + parseFloat(s.amount || 0), 0), avgOrder: totalOrders ? (filteredSales.filter(s => users.find(u => u.id === s.user_id)?.user_type === 'user').reduce((sum, s) => sum + parseFloat(s.amount || 0), 0) / totalOrders) : 0 },
//       { segment: 'New', customers: newCustomers, revenue: filteredSales.filter(s => filteredUsers.find(u => u.id === s.user_id)).reduce((sum, s) => sum + parseFloat(s.amount || 0), 0), avgOrder: totalOrders ? (filteredSales.filter(s => filteredUsers.find(u => u.id === s.user_id)).reduce((sum, s) => sum + parseFloat(s.amount || 0), 0) / totalOrders) : 0 },
//     ];

//     return {
//       kpis: {
//         totalRevenue,
//         revenueGrowth,
//         totalOrders,
//         ordersGrowth,
//         averageOrderValue,
//         aovGrowth,
//         conversionRate: 3.2, // Still mocked, requires conversion tracking
//         conversionGrowth,
//         customerAcquisition: newCustomers,
//         acquisitionGrowth,
//         customerLifetimeValue: 420.50, // Still mocked, requires historical data
//         clvGrowth: 7.8, // Still mocked
//       },
//       salesTrend,
//       topProducts,
//       categoryDistribution,
//       customerSegments,
//     };
//   }, [sales, orders, users, products, categories, dateRange]);

//   const analyticsData = processAnalyticsData();

//   const KPICard = ({ title, value, growth, icon: Icon, format = 'number' }) => {
//     const formatValue = (val) => {
//       if (format === 'currency') return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//       if (format === 'percentage') return `${val.toFixed(1)}%`;
//       return val.toLocaleString();
//     };
//     const isPositive = growth >= 0;
//     return (
//       <div className="kpi-card">
//         <div className="kpi-icon-wrapper">
//           <Icon size={24} className="kpi-icon" />
//         </div>
//         <div className="kpi-content">
//           <h3 className="kpi-title">{title}</h3>
//           <div className="kpi-value">{formatValue(value)}</div>
//           <div className={`kpi-trend ${isPositive ? 'positive' : 'negative'}`}>
//             <span className="kpi-growth-icon">
//               {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
//             </span>
//             <span>{Math.abs(growth).toFixed(1)}%</span>
//             <span className="trend-period"> vs. Last Period</span>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const ChartCard = ({ title, children, actions = null }) => (
//     <div className="chart-card">
//       <div className="chart-header">
//         <h3 className="chart-title">{title}</h3>
//         {actions && <div className="chart-actions">{actions}</div>}
//       </div>
//       <div className="chart-content">
//         {children}
//       </div>
//     </div>
//   );

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="custom-tooltip">
//           <p className="tooltip-label">{new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="tooltip-value" style={{ color: entry.stroke || entry.fill }}>
//               {entry.name.includes('Revenue') ? `$${entry.value.toLocaleString()}` : entry.value.toLocaleString()} {entry.name}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   const renderOverview = () => (
//     <>
//       <div className="kpi-grid">
//         <KPICard title="Total Revenue" value={analyticsData.kpis.totalRevenue} growth={analyticsData.kpis.revenueGrowth} icon={DollarSign} format="currency" />
//         <KPICard title="Total Orders" value={analyticsData.kpis.totalOrders} growth={analyticsData.kpis.ordersGrowth} icon={ShoppingCart} />
//         <KPICard title="Average Order Value" value={analyticsData.kpis.averageOrderValue} growth={analyticsData.kpis.aovGrowth} icon={Package} format="currency" />
//         <KPICard title="Conversion Rate" value={analyticsData.kpis.conversionRate} growth={analyticsData.kpis.conversionGrowth} icon={Target} format="percentage" />
//         <KPICard title="New Customers" value={analyticsData.kpis.customerAcquisition} growth={analyticsData.kpis.acquisitionGrowth} icon={Users} />
//         <KPICard title="Customer LTV" value={analyticsData.kpis.customerLifetimeValue} growth={analyticsData.kpis.clvGrowth} icon={TrendingUp} format="currency" />
//       </div>

//       <div className="charts-grid-main">
//         <ChartCard title="Revenue & Orders Trend">
//           {analyticsData.salesTrend.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={analyticsData.salesTrend}>
//                 <defs>
//                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#0047ab" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#0047ab" stopOpacity={0} />
//                   </linearGradient>
//                   <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#fc7f10" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#fc7f10" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
//                 <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
//                 <YAxis stroke="#64748b" fontSize={12} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="revenue" stroke="#0047ab" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} name="Revenue" />
//                 <Area type="monotone" dataKey="orders" stroke="#fc7f10" fillOpacity={1} fill="url(#colorOrders)" strokeWidth={2} name="Orders" />
//               </AreaChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="no-data-placeholder">No sales data for this period.</div>
//           )}
//         </ChartCard>
//         <ChartCard title="Top Products by Revenue">
//           <div className="products-list">
//             {analyticsData.topProducts.length > 0 ? (
//               analyticsData.topProducts.map((product, index) => (
//                 <div key={index} className="product-item">
//                   <div className="product-info">
//                     <span className="product-name">{product.name}</span>
//                     <span className="product-stats">${product.revenue.toLocaleString()} • {product.quantity} units</span>
//                   </div>
//                   <div className="product-metrics">
//                     <div className="progress-bar">
//                       <div
//                         className="progress-fill"
//                         style={{
//                           width: `${(product.revenue / analyticsData.topProducts[0].revenue) * 100}%`,
//                           backgroundColor: ['#0047ab', '#fc7f10', '#10b981', '#f59e0b', '#8b5cf6'][index % 5],
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="no-data-placeholder">No product data for this period.</div>
//             )}
//           </div>
//         </ChartCard>
//       </div>

//       <div className="charts-grid-secondary">
//         <ChartCard title="Revenue by Category">
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={analyticsData.categoryDistribution}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={60}
//                 outerRadius={120}
//                 paddingAngle={5}
//                 dataKey="revenue"
//                 nameKey="name"
//               >
//                 {analyticsData.categoryDistribution.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={['#0047ab', '#fc7f10', '#10b981', '#f59e0b'][index % 4]} />
//                 ))}
//               </Pie>
//               <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </ChartCard>
//         <ChartCard title="Customer Segments">
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={analyticsData.customerSegments} layout="horizontal">
//               <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
//               <XAxis type="number" stroke="#64748b" fontSize={12} />
//               <YAxis dataKey="segment" type="category" stroke="#64748b" fontSize={12} />
//               <Tooltip formatter={(value, name) => [name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(), name === 'revenue' ? 'Revenue' : 'Customers']} />
//               <Bar dataKey="revenue" fill="#0047ab" radius={[0, 4, 4, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartCard>
//       </div>
//     </>
//   );

//   const renderDetailedView = () => (
//     <div className="detailed-view">
//       <ChartCard title="Detailed Sales Trend">
//         {analyticsData.salesTrend.length > 0 ? (
//           <ResponsiveContainer width="100%" height={400}>
//             <LineChart data={analyticsData.salesTrend}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
//               <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
//               <YAxis stroke="#64748b" fontSize={12} />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend />
//               <Line type="monotone" dataKey="revenue" stroke="#0047ab" strokeWidth={2} name="Revenue" dot={{ r: 4 }} />
//               <Line type="monotone" dataKey="orders" stroke="#fc7f10" strokeWidth={2} name="Orders" dot={{ r: 4 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         ) : (
//           <div className="no-data-placeholder">No sales data for this period.</div>
//         )}
//       </ChartCard>

//       <div className="detailed-tables-grid">
//         <ChartCard title="Top Products (Detailed)">
//           <div className="table-responsive">
//             <Table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Product Name</th>
//                   <th>Revenue</th>
//                   <th>Units Sold</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {analyticsData.topProducts.map((product, index) => (
//                   <tr key={index}>
//                     <td>{product.name}</td>
//                     <td>${product.revenue.toLocaleString()}</td>
//                     <td>{product.quantity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </ChartCard>
//         <ChartCard title="Customer Segments (Detailed)">
//           <div className="table-responsive">
//             <Table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Segment</th>
//                   <th>Customers</th>
//                   <th>Total Revenue</th>
//                   <th>AOV</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {analyticsData.customerSegments.map((segment, index) => (
//                   <tr key={index}>
//                     <td>{segment.segment}</td>
//                     <td>{segment.customers.toLocaleString()}</td>
//                     <td>${segment.revenue.toLocaleString()}</td>
//                     <td>${segment.avgOrder.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </ChartCard>
//       </div>
//     </div>
//   );

//   return (
//     <div className="analytics-dashboard-container">
//       <div className="dashboard-header">
//         <div className="header-left">
//           <h1>Sales Analytics Dashboard</h1>
//           <p className="subtitle">Track your business performance and growth metrics</p>
//         </div>
//         <div className="header-right">
//           <div className="view-toggle">
//             <button
//               className={`toggle-btn ${viewMode === 'overview' ? 'active' : ''}`}
//               onClick={() => setViewMode('overview')}
//             >
//               <Eye size={16} /> Overview
//             </button>
//             <button
//               className={`toggle-btn ${viewMode === 'detailed' ? 'active' : ''}`}
//               onClick={() => setViewMode('detailed')}
//             >
//               <Target size={16} /> Detailed
//             </button>
//           </div>
//           <div className="filter-group">
//             <Calendar size={16} className="filter-icon" />
//             <select
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//               className="date-filter"
//             >
//               <option value="all">All Time</option>
//               <option value="last30">Last 30 Days</option>
//               <option value="last7">Last 7 Days</option>
//             </select>
//           </div>
//           <button className="action-btn">
//             <Download size={16} /> Export
//           </button>
//           <button className="action-btn primary" onClick={fetchData} disabled={loading}>
//             <RefreshCw size={16} /> {loading ? 'Refreshing...' : 'Refresh'}
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="loading-state">
//           <div className="spinner"></div>
//           <p>Loading analytics data...</p>
//         </div>
//       ) : error ? (
//         <div className="error-alert">
//           {error}
//         </div>
//       ) : (
//         <>
//           {viewMode === 'overview' ? renderOverview() : renderDetailedView()}
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminSalesAnalyticsPage;




// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
// } from 'recharts';
// import {
//   TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
//   Calendar, Filter, Download, RefreshCw, Eye, Target, ArrowRight,
// } from 'lucide-react';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { Table } from 'react-bootstrap';
// import './styles/AdminSalesAnalyticsPage.css';

// const AdminSalesAnalyticsPage = () => {
//   const [sales, setSales] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dateRange, setDateRange] = useState('all');
//   const [viewMode, setViewMode] = useState('overview');
//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1'; // Adjust if your backend URL differs
//   const navigate = useNavigate();

//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     sessionStorage.removeItem('token');
//     navigate('/login');
//     toast.error(errMessage);
//   }, [navigate]);

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setLoggedInUserRole(decodedToken.user_type || '');
//         console.log('Decoded Token Role:', decodedToken.user_type); // Debug token role
//       } catch (err) {
//         handleAuthError('Invalid or expired token. Please log in again.');
//         console.error('Token Decode Error:', err);
//       }
//     } else {
//       handleAuthError('Authentication token missing. Please log in.');
//       console.log('No token found in sessionStorage');
//     }
//   }, [handleAuthError]);

//   const fetchData = useCallback(async () => {
//     if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
//       handleAuthError('You do not have permission to view this page.');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       console.log('Attempting to fetch data with API_BASE_URL:', API_BASE_URL);
//       console.log('Token used:', token);

//       const fetchOptions = { headers: { 'Authorization': `Bearer ${token}` }, method: 'GET' };
//       const [salesResponse, ordersResponse, usersResponse, productsResponse, categoriesResponse] = await Promise.all([
//         fetch(`${API_BASE_URL}/sales?page=1&per_page=100`, fetchOptions),
//         fetch(`${API_BASE_URL}/orders/admin?page=1&per_page=100`, fetchOptions),
//         fetch(`${API_BASE_URL}/users?page=1&per_page=100`, fetchOptions),
//         fetch(`${API_BASE_URL}/products?page=1&per_page=100`, fetchOptions),
//         fetch(`${API_BASE_URL}/categories?page=1&per_page=100`, fetchOptions),
//       ]);

//       // Log detailed response info
//       console.log('Sales Response:', { status: salesResponse.status, ok: salesResponse.ok, url: salesResponse.url });
//       console.log('Orders Response:', { status: ordersResponse.status, ok: ordersResponse.ok, url: ordersResponse.url });
//       console.log('Users Response:', { status: usersResponse.status, ok: usersResponse.ok, url: usersResponse.url });
//       console.log('Products Response:', { status: productsResponse.status, ok: productsResponse.ok, url: productsResponse.url });
//       console.log('Categories Response:', { status: categoriesResponse.status, ok: categoriesResponse.ok, url: categoriesResponse.url });

//       if (!salesResponse.ok) {
//         const errorText = await salesResponse.text();
//         throw new Error(`Failed to fetch sales (Status: ${salesResponse.status}, Message: ${errorText || 'No response body'})`);
//       }
//       if (!ordersResponse.ok) {
//         const errorText = await ordersResponse.text();
//         throw new Error(`Failed to fetch orders (Status: ${ordersResponse.status}, Message: ${errorText || 'No response body'})`);
//       }
//       if (!usersResponse.ok) {
//         const errorText = await usersResponse.text();
//         throw new Error(`Failed to fetch users (Status: ${usersResponse.status}, Message: ${errorText || 'No response body'})`);
//       }
//       if (!productsResponse.ok) {
//         const errorText = await productsResponse.text();
//         throw new Error(`Failed to fetch products (Status: ${productsResponse.status}, Message: ${errorText || 'No response body'})`);
//       }
//       if (!categoriesResponse.ok) {
//         const errorText = await categoriesResponse.text();
//         throw new Error(`Failed to fetch categories (Status: ${categoriesResponse.status}, Message: ${errorText || 'No response body'})`);
//       }

//       const salesData = await salesResponse.json();
//       const ordersData = await ordersResponse.json();
//       const usersData = await usersResponse.json();
//       const productsData = await productsResponse.json();
//       const categoriesData = await categoriesResponse.json();

//       console.log('Sales Data:', salesData);
//       console.log('Orders Data:', ordersData);
//       console.log('Users Data:', usersData);
//       console.log('Products Data:', productsData);
//       console.log('Categories Data:', categoriesData);

//       setSales(salesData.sales || []);
//       setOrders(ordersData.orders || []);
//       setUsers(usersData.users || []);
//       setProducts(productsData.products || []);
//       setCategories(categoriesData.categories || []);

//       toast.success('Analytics data fetched successfully!');
//     } catch (err) {
//       console.error('Fetch Error Details:', err);
//       setError(err.message);
//       toast.error(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [loggedInUserRole, handleAuthError]);

//   useEffect(() => {
//     if (loggedInUserRole) {
//       fetchData();
//     }
//   }, [loggedInUserRole, fetchData]);

//   const processAnalyticsData = useCallback(() => {
//     if (sales.length === 0 && orders.length === 0 && users.length === 0 && products.length === 0) {
//       return {
//         kpis: {}, salesTrend: [], topProducts: [], categoryDistribution: [], customerSegments: [],
//       };
//     }

//     const now = new Date('2025-08-24T15:06:00Z'); // 06:06 PM EAT
//     const filterByDate = (item) => {
//       const itemDate = new Date(item.created_at || item.sale_date);
//       if (dateRange === 'last30') return now - itemDate <= 30 * 24 * 60 * 60 * 1000;
//       if (dateRange === 'last7') return now - itemDate <= 7 * 24 * 60 * 60 * 1000;
//       return true;
//     };

//     const filteredSales = sales.filter(filterByDate);
//     const filteredOrders = orders.filter(filterByDate);
//     const filteredUsers = users.filter(filterByDate);

//     // KPIs
//     const totalRevenue = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
//     const totalOrders = filteredOrders.length;
//     const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
//     const totalCustomers = filteredUsers.length;
//     const newCustomers = filteredUsers.filter(user => {
//       const userDate = new Date(user.created_at);
//       return dateRange === 'last30' ? now - userDate <= 30 * 24 * 60 * 60 * 1000 :
//              dateRange === 'last7' ? now - userDate <= 7 * 24 * 60 * 60 * 1000 : true;
//     }).length;

//     // Growth metrics (simplified with last 10 items as proxy)
//     const revenueGrowth = filteredSales.length > 10 ? ((totalRevenue - filteredSales.slice(-10).reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0)) / totalRevenue * 100) : 0;
//     const ordersGrowth = filteredOrders.length > 10 ? ((totalOrders - filteredOrders.slice(-10).length) / totalOrders * 100) : 0;
//     const aovGrowth = averageOrderValue > 0 && filteredOrders.length > 10 ? ((averageOrderValue - (filteredOrders.slice(-10).reduce((sum, order) => sum + parseFloat(order.cart.reduce((s, item) => s + item.price * item.quantity, 0)), 0) / 10)) / averageOrderValue * 100) : 0;
//     const conversionGrowth = 0; // Requires conversion tracking
//     const acquisitionGrowth = newCustomers > 0 && filteredUsers.length > 10 ? ((newCustomers - filteredUsers.slice(-10).length) / newCustomers * 100) : 0;

//     // Sales Trend
//     const salesTrendData = filteredSales.reduce((acc, sale) => {
//       const date = new Date(sale.sale_date).toISOString().split('T')[0];
//       acc[date] = acc[date] || { date, revenue: 0, orders: 0 };
//       acc[date].revenue += parseFloat(sale.amount || 0);
//       return acc;
//     }, {});
//     filteredOrders.forEach(order => {
//       const date = new Date(order.created_at).toISOString().split('T')[0];
//       salesTrendData[date] = salesTrendData[date] || { date, revenue: 0, orders: 0 };
//       salesTrendData[date].orders += 1;
//     });
//     const salesTrend = Object.values(salesTrendData).sort((a, b) => new Date(a.date) - new Date(b.date));

//     // Top Products
//     const allItems = filteredOrders.flatMap(order =>
//       order.cart.map(item => ({
//         product_name: item.product_name,
//         quantity: item.quantity,
//         price: parseFloat(item.price || 0),
//       }))
//     );
//     const productMetrics = allItems.reduce((acc, item) => {
//       acc[item.product_name] = acc[item.product_name] || { revenue: 0, quantity: 0 };
//       acc[item.product_name].revenue += item.quantity * item.price;
//       acc[item.product_name].quantity += item.quantity;
//       return acc;
//     }, {});
//     const topProducts = Object.entries(productMetrics)
//       .sort(([, a], [, b]) => b.revenue - a.revenue)
//       .slice(0, 5)
//       .map(([name, data]) => ({
//         name,
//         revenue: data.revenue,
//         quantity: data.quantity,
//       }));

//     // Category Distribution
//     const categorySales = filteredOrders.flatMap(order =>
//       order.cart.map(item => {
//         const product = products.find(p => p.name === item.product_name);
//         return { category_id: product?.category_id, revenue: item.quantity * parseFloat(item.price || 0) };
//       })
//     );
//     const categoryDistribution = categories.map(cat => ({
//       name: cat.name,
//       value: categorySales.filter(cs => cs.category_id === cat.id).length,
//       revenue: categorySales.filter(cs => cs.category_id === cat.id).reduce((sum, cs) => sum + cs.revenue, 0),
//     })).filter(cat => cat.value > 0);

//     // Customer Segments
//     const customerSegments = [
//       { segment: 'Premium', customers: users.filter(u => u.user_type === 'premium' || u.user_type === 'admin').length, revenue: filteredSales.filter(s => users.find(u => u.id === s.user_id)?.user_type === 'premium' || users.find(u => u.id === s.user_id)?.user_type === 'admin').reduce((sum, s) => sum + parseFloat(s.amount || 0), 0), avgOrder: totalOrders ? (filteredSales.filter(s => users.find(u => u.id === s.user_id)?.user_type === 'premium' || users.find(u => u.id === s.user_id)?.user_type === 'admin').reduce((sum, s) => sum + parseFloat(s.amount || 0), 0) / totalOrders) : 0 },
//       { segment: 'Regular', customers: users.filter(u => u.user_type === 'user').length, revenue: filteredSales.filter(s => users.find(u => u.id === s.user_id)?.user_type === 'user').reduce((sum, s) => sum + parseFloat(s.amount || 0), 0), avgOrder: totalOrders ? (filteredSales.filter(s => users.find(u => u.id === s.user_id)?.user_type === 'user').reduce((sum, s) => sum + parseFloat(s.amount || 0), 0) / totalOrders) : 0 },
//       { segment: 'New', customers: newCustomers, revenue: filteredSales.filter(s => filteredUsers.find(u => u.id === s.user_id)).reduce((sum, s) => sum + parseFloat(s.amount || 0), 0), avgOrder: totalOrders ? (filteredSales.filter(s => filteredUsers.find(u => u.id === s.user_id)).reduce((sum, s) => sum + parseFloat(s.amount || 0), 0) / totalOrders) : 0 },
//     ];

//     return {
//       kpis: {
//         totalRevenue,
//         revenueGrowth,
//         totalOrders,
//         ordersGrowth,
//         averageOrderValue,
//         aovGrowth,
//         conversionRate: 3.2, // Mocked, requires tracking
//         conversionGrowth,
//         customerAcquisition: newCustomers,
//         acquisitionGrowth,
//         customerLifetimeValue: 420.50, // Mocked, requires historical data
//         clvGrowth: 7.8, // Mocked
//       },
//       salesTrend,
//       topProducts,
//       categoryDistribution,
//       customerSegments,
//     };
//   }, [sales, orders, users, products, categories, dateRange]);

//   const analyticsData = processAnalyticsData();

//   const KPICard = ({ title, value, growth, icon: Icon, format = 'number' }) => {
//     const formatValue = (val) => {
//       if (format === 'currency') return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//       if (format === 'percentage') return `${val.toFixed(1)}%`;
//       return val.toLocaleString();
//     };
//     const isPositive = growth >= 0;
//     return (
//       <div className="kpi-card">
//         <div className="kpi-icon-wrapper">
//           <Icon size={24} className="kpi-icon" />
//         </div>
//         <div className="kpi-content">
//           <h3 className="kpi-title">{title}</h3>
//           <div className="kpi-value">{formatValue(value)}</div>
//           <div className={`kpi-trend ${isPositive ? 'positive' : 'negative'}`}>
//             <span className="kpi-growth-icon">
//               {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
//             </span>
//             <span>{Math.abs(growth).toFixed(1)}%</span>
//             <span className="trend-period"> vs. Last Period</span>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const ChartCard = ({ title, children, actions = null }) => (
//     <div className="chart-card">
//       <div className="chart-header">
//         <h3 className="chart-title">{title}</h3>
//         {actions && <div className="chart-actions">{actions}</div>}
//       </div>
//       <div className="chart-content">
//         {children}
//       </div>
//     </div>
//   );

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="custom-tooltip">
//           <p className="tooltip-label">{new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="tooltip-value" style={{ color: entry.stroke || entry.fill }}>
//               {entry.name.includes('Revenue') ? `$${entry.value.toLocaleString()}` : entry.value.toLocaleString()} {entry.name}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   const renderOverview = () => (
//     <>
//       <div className="kpi-grid">
//         <KPICard title="Total Revenue" value={analyticsData.kpis.totalRevenue} growth={analyticsData.kpis.revenueGrowth} icon={DollarSign} format="currency" />
//         <KPICard title="Total Orders" value={analyticsData.kpis.totalOrders} growth={analyticsData.kpis.ordersGrowth} icon={ShoppingCart} />
//         <KPICard title="Average Order Value" value={analyticsData.kpis.averageOrderValue} growth={analyticsData.kpis.aovGrowth} icon={Package} format="currency" />
//         <KPICard title="Conversion Rate" value={analyticsData.kpis.conversionRate} growth={analyticsData.kpis.conversionGrowth} icon={Target} format="percentage" />
//         <KPICard title="New Customers" value={analyticsData.kpis.customerAcquisition} growth={analyticsData.kpis.acquisitionGrowth} icon={Users} />
//         <KPICard title="Customer LTV" value={analyticsData.kpis.customerLifetimeValue} growth={analyticsData.kpis.clvGrowth} icon={TrendingUp} format="currency" />
//       </div>

//       <div className="charts-grid-main">
//         <ChartCard title="Revenue & Orders Trend">
//           {analyticsData.salesTrend.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={analyticsData.salesTrend}>
//                 <defs>
//                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#0047ab" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#0047ab" stopOpacity={0} />
//                   </linearGradient>
//                   <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#fc7f10" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#fc7f10" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
//                 <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
//                 <YAxis stroke="#64748b" fontSize={12} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="revenue" stroke="#0047ab" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} name="Revenue" />
//                 <Area type="monotone" dataKey="orders" stroke="#fc7f10" fillOpacity={1} fill="url(#colorOrders)" strokeWidth={2} name="Orders" />
//               </AreaChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="no-data-placeholder">No sales data for this period.</div>
//           )}
//         </ChartCard>
//         <ChartCard title="Top Products by Revenue">
//           <div className="products-list">
//             {analyticsData.topProducts.length > 0 ? (
//               analyticsData.topProducts.map((product, index) => (
//                 <div key={index} className="product-item">
//                   <div className="product-info">
//                     <span className="product-name">{product.name}</span>
//                     <span className="product-stats">${product.revenue.toLocaleString()} • {product.quantity} units</span>
//                   </div>
//                   <div className="product-metrics">
//                     <div className="progress-bar">
//                       <div
//                         className="progress-fill"
//                         style={{
//                           width: `${(product.revenue / analyticsData.topProducts[0].revenue) * 100}%`,
//                           backgroundColor: ['#0047ab', '#fc7f10', '#10b981', '#f59e0b', '#8b5cf6'][index % 5],
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="no-data-placeholder">No product data for this period.</div>
//             )}
//           </div>
//         </ChartCard>
//       </div>

//       <div className="charts-grid-secondary">
//         <ChartCard title="Revenue by Category">
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={analyticsData.categoryDistribution}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={60}
//                 outerRadius={120}
//                 paddingAngle={5}
//                 dataKey="revenue"
//                 nameKey="name"
//               >
//                 {analyticsData.categoryDistribution.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={['#0047ab', '#fc7f10', '#10b981', '#f59e0b'][index % 4]} />
//                 ))}
//               </Pie>
//               <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </ChartCard>
//         <ChartCard title="Customer Segments">
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={analyticsData.customerSegments} layout="horizontal">
//               <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
//               <XAxis type="number" stroke="#64748b" fontSize={12} />
//               <YAxis dataKey="segment" type="category" stroke="#64748b" fontSize={12} />
//               <Tooltip formatter={(value, name) => [name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(), name === 'revenue' ? 'Revenue' : 'Customers']} />
//               <Bar dataKey="revenue" fill="#0047ab" radius={[0, 4, 4, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartCard>
//       </div>
//     </>
//   );

//   const renderDetailedView = () => (
//     <div className="detailed-view">
//       <ChartCard title="Detailed Sales Trend">
//         {analyticsData.salesTrend.length > 0 ? (
//           <ResponsiveContainer width="100%" height={400}>
//             <LineChart data={analyticsData.salesTrend}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
//               <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
//               <YAxis stroke="#64748b" fontSize={12} />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend />
//               <Line type="monotone" dataKey="revenue" stroke="#0047ab" strokeWidth={2} name="Revenue" dot={{ r: 4 }} />
//               <Line type="monotone" dataKey="orders" stroke="#fc7f10" strokeWidth={2} name="Orders" dot={{ r: 4 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         ) : (
//           <div className="no-data-placeholder">No sales data for this period.</div>
//         )}
//       </ChartCard>

//       <div className="detailed-tables-grid">
//         <ChartCard title="Top Products (Detailed)">
//           <div className="table-responsive">
//             <Table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Product Name</th>
//                   <th>Revenue</th>
//                   <th>Units Sold</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {analyticsData.topProducts.map((product, index) => (
//                   <tr key={index}>
//                     <td>{product.name}</td>
//                     <td>${product.revenue.toLocaleString()}</td>
//                     <td>{product.quantity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </ChartCard>
//         <ChartCard title="Customer Segments (Detailed)">
//           <div className="table-responsive">
//             <Table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Segment</th>
//                   <th>Customers</th>
//                   <th>Total Revenue</th>
//                   <th>AOV</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {analyticsData.customerSegments.map((segment, index) => (
//                   <tr key={index}>
//                     <td>{segment.segment}</td>
//                     <td>{segment.customers.toLocaleString()}</td>
//                     <td>${segment.revenue.toLocaleString()}</td>
//                     <td>${segment.avgOrder.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </ChartCard>
//       </div>
//     </div>
//   );

//   return (
//     <div className="analytics-dashboard-container">
//       <div className="dashboard-header">
//         <div className="header-left">
//           <h1>Sales Analytics Dashboard</h1>
//           <p className="subtitle">Track your business performance and growth metrics</p>
//         </div>
//         <div className="header-right">
//           <div className="view-toggle">
//             <button
//               className={`toggle-btn ${viewMode === 'overview' ? 'active' : ''}`}
//               onClick={() => setViewMode('overview')}
//             >
//               <Eye size={16} /> Overview
//             </button>
//             <button
//               className={`toggle-btn ${viewMode === 'detailed' ? 'active' : ''}`}
//               onClick={() => setViewMode('detailed')}
//             >
//               <Target size={16} /> Detailed
//             </button>
//           </div>
//           <div className="filter-group">
//             <Calendar size={16} className="filter-icon" />
//             <select
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//               className="date-filter"
//             >
//               <option value="all">All Time</option>
//               <option value="last30">Last 30 Days</option>
//               <option value="last7">Last 7 Days</option>
//             </select>
//           </div>
//           <button className="action-btn">
//             <Download size={16} /> Export
//           </button>
//           <button className="action-btn primary" onClick={fetchData} disabled={loading}>
//             <RefreshCw size={16} /> {loading ? 'Refreshing...' : 'Refresh'}
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="loading-state">
//           <div className="spinner"></div>
//           <p>Loading analytics data...</p>
//         </div>
//       ) : error ? (
//         <div className="error-alert">
//           {error}
//         </div>
//       ) : (
//         <>
//           {viewMode === 'overview' ? renderOverview() : renderDetailedView()}
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminSalesAnalyticsPage;



// import React, { useState, useEffect, useCallback } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// const SalesAnalytics = () => {
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dateRange, setDateRange] = useState('30');
//   const [analytics, setAnalytics] = useState({
//     totalRevenue: 0,
//     totalSales: 0,
//     averageOrderValue: 0,
//     topProducts: [],
//     dailyTrends: [],
//     monthlyTrends: [],
//     statusBreakdown: [],
//     revenueGrowth: 0
//   });

//   // Real authentication state
//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const [loggedInUserId, setLoggedInUserId] = useState(null);
//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

//   // Colors for charts
//   const colors = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#65a30d'];

//   // Authentication handling
//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     // In a real app, you'd navigate to login page here
//     console.error('Authentication error:', errMessage);
//   }, []);

//   // Initialize authentication
//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = JSON.parse(atob(token.split('.')[1])); // Simple JWT decode
//         setLoggedInUserRole(decodedToken.user_type || '');
//         setLoggedInUserId(decodedToken.sub);
//       } catch (err) {
//         console.error('Failed to decode token:', err);
//         handleAuthError('Invalid or expired token. Please log in again.');
//       }
//     } else {
//       handleAuthError('Authentication token missing. Please log in.');
//     }
//   }, [handleAuthError]);

//   const processAnalytics = (sales, orders) => {
//     if (!sales.length && !orders.length) {
//       setAnalytics({
//         totalRevenue: 0,
//         totalSales: 0,
//         averageOrderValue: 0,
//         topProducts: [],
//         dailyTrends: [],
//         monthlyTrends: [],
//         statusBreakdown: [],
//         revenueGrowth: 0
//       });
//       return;
//     }

//     // Calculate basic metrics
//     const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
//     const totalSales = sales.length;
//     const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

//     // Process daily trends
//     const dailyTrends = processDailyTrends(sales);
    
//     // Process monthly trends
//     const monthlyTrends = processMonthlyTrends(sales);

//     // Process order status breakdown
//     const statusBreakdown = processStatusBreakdown(orders);

//     // Process top products from orders
//     const topProducts = processTopProducts(orders);

//     // Calculate revenue growth
//     const revenueGrowth = calculateGrowthRate(dailyTrends);

//     setAnalytics({
//       totalRevenue,
//       totalSales,
//       averageOrderValue,
//       topProducts,
//       dailyTrends,
//       monthlyTrends,
//       statusBreakdown,
//       revenueGrowth
//     });
//   };

//   const processDailyTrends = (sales) => {
//     const trends = {};
    
//     sales.forEach(sale => {
//       const saleDate = sale.sale_date || sale.created_at;
//       if (!saleDate) return;
      
//       const date = new Date(saleDate).toISOString().split('T')[0];
//       if (!trends[date]) {
//         trends[date] = { date: date.slice(5), revenue: 0, sales: 0 };
//       }
//       trends[date].revenue += parseFloat(sale.amount || 0);
//       trends[date].sales += 1;
//     });

//     // Filter by date range
//     const cutoffDate = new Date();
//     cutoffDate.setDate(cutoffDate.getDate() - parseInt(dateRange));
    
//     return Object.values(trends)
//       .filter(trend => {
//         const trendDate = new Date('2024-' + trend.date);
//         return trendDate >= cutoffDate;
//       })
//       .sort((a, b) => new Date('2024-' + a.date) - new Date('2024-' + b.date));
//   };

//   const processMonthlyTrends = (sales) => {
//     const trends = {};
    
//     sales.forEach(sale => {
//       const saleDate = sale.sale_date || sale.created_at;
//       if (!saleDate) return;
      
//       const date = new Date(saleDate);
//       const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
//       if (!trends[monthKey]) {
//         trends[monthKey] = { month: monthKey.slice(5), revenue: 0, sales: 0 };
//       }
//       trends[monthKey].revenue += parseFloat(sale.amount || 0);
//       trends[monthKey].sales += 1;
//     });

//     return Object.values(trends)
//       .sort((a, b) => a.month.localeCompare(b.month))
//       .slice(-12);
//   };

//   const processStatusBreakdown = (orders) => {
//     const statusCount = {};
    
//     orders.forEach(order => {
//       const status = order.status || 'pending';
//       statusCount[status] = (statusCount[status] || 0) + 1;
//     });

//     return Object.entries(statusCount).map(([status, count]) => ({
//       status: status.charAt(0).toUpperCase() + status.slice(1),
//       count,
//       value: count
//     }));
//   };

//   const processTopProducts = (orders) => {
//     const productSales = {};
    
//     orders.forEach(order => {
//       if (order.cart && Array.isArray(order.cart)) {
//         order.cart.forEach(item => {
//           const productName = item.product_name || 'Unknown Product';
//           if (!productSales[productName]) {
//             productSales[productName] = {
//               name: productName.length > 15 ? productName.substring(0, 15) + '...' : productName,
//               quantity: 0,
//               revenue: 0
//             };
//           }
//           productSales[productName].quantity += item.quantity || 0;
//           productSales[productName].revenue += (item.quantity || 0) * (parseFloat(item.price) || 0);
//         });
//       }
//     });

//     return Object.values(productSales)
//       .sort((a, b) => b.revenue - a.revenue)
//       .slice(0, 8);
//   };

//   const calculateGrowthRate = (dailyTrends) => {
//     if (dailyTrends.length < 14) return 0;
    
//     const firstWeek = dailyTrends.slice(0, 7).reduce((sum, day) => sum + day.revenue, 0);
//     const lastWeek = dailyTrends.slice(-7).reduce((sum, day) => sum + day.revenue, 0);
    
//     if (firstWeek === 0) return 0;
//     return ((lastWeek - firstWeek) / firstWeek) * 100;
//   };

//   // Fetch real data from your backend
//   const fetchSalesData = useCallback(async () => {
//     if (!loggedInUserRole || (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin')) {
//       handleAuthError('You do not have permission to view this page.');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       // Fetch sales data with pagination to get all records
//       const salesParams = new URLSearchParams({
//         per_page: '1000',
//         search: ''
//       });

//       // Fetch orders data for additional analytics
//       const ordersParams = new URLSearchParams({
//         per_page: '1000'
//       });

//       console.log('Fetching sales data...');
//       const salesResponse = await fetch(`${API_BASE_URL}/sales?${salesParams.toString()}`, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Fetching orders data...');
//       const ordersResponse = await fetch(`${API_BASE_URL}/orders/admin?${ordersParams.toString()}`, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!salesResponse.ok) {
//         const salesError = await salesResponse.json();
//         if (salesResponse.status === 401 || salesResponse.status === 403) {
//           handleAuthError(salesError.error || 'Authentication failed. Please log in again.');
//           return;
//         }
//         throw new Error(salesError.error || 'Failed to fetch sales data');
//       }

//       if (!ordersResponse.ok) {
//         const ordersError = await ordersResponse.json();
//         if (ordersResponse.status === 401 || ordersResponse.status === 403) {
//           handleAuthError(ordersError.error || 'Authentication failed. Please log in again.');
//           return;
//         }
//         throw new Error(ordersError.error || 'Failed to fetch orders data');
//       }

//       const salesData = await salesResponse.json();
//       const ordersData = await ordersResponse.json();

//       console.log('Sales API Response:', salesData);
//       console.log('Orders API Response:', ordersData);

//       const sales = salesData.sales || [];
//       const orders = ordersData.orders || [];

//       setSalesData(sales);
//       processAnalytics(sales, orders);

//     } catch (err) {
//       console.error('Error fetching analytics data:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [loggedInUserRole, dateRange, handleAuthError]);

//   // Trigger data fetch when dependencies change
//   useEffect(() => {
//     if (loggedInUserRole) {
//       fetchSalesData();
//     }
//   }, [fetchSalesData, loggedInUserRole]);

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-UG', {
//       style: 'currency',
//       currency: 'UGX',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const formatNumber = (num) => {
//     if (num >= 1000000) {
//       return (num / 1000000).toFixed(1) + 'M';
//     }
//     if (num >= 1000) {
//       return (num / 1000).toFixed(1) + 'K';
//     }
//     return num.toString();
//   };

//   if (loading) {
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         backgroundColor: '#f8fafc'
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{
//             width: '40px',
//             height: '40px',
//             border: '4px solid #e5e7eb',
//             borderTop: '4px solid #2563eb',
//             borderRadius: '50%',
//             animation: 'spin 1s linear infinite',
//             margin: '0 auto 20px'
//           }}></div>
//           <h3 style={{ color: '#1f2937', marginBottom: '10px' }}>Loading Analytics...</h3>
//           <p style={{ color: '#6b7280' }}>Processing your sales data</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{
//         padding: '40px',
//         textAlign: 'center',
//         backgroundColor: '#fef2f2',
//         border: '1px solid #fecaca',
//         borderRadius: '12px',
//         margin: '20px'
//       }}>
//         <h3 style={{ color: '#dc2626', marginBottom: '10px' }}>Error Loading Analytics</h3>
//         <p style={{ color: '#7f1d1d' }}>{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           style={{
//             padding: '10px 20px',
//             backgroundColor: '#dc2626',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer'
//           }}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   const cardStyle = {
//     backgroundColor: 'white',
//     borderRadius: '12px',
//     boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
//     border: 'none',
//     marginBottom: '20px'
//   };

//   const headerStyle = {
//     backgroundColor: 'white',
//     borderBottom: '1px solid #e5e7eb',
//     borderRadius: '12px 12px 0 0',
//     padding: '20px',
//     margin: 0
//   };

//   return (
//     <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
      
//       {/* Header */}
//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '30px',
//         backgroundColor: 'white',
//         padding: '25px',
//         borderRadius: '12px',
//         boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//       }}>
//         <div>
//           <h1 style={{
//             fontSize: '32px',
//             fontWeight: 'bold',
//             color: '#1f2937',
//             margin: '0 0 8px 0'
//           }}>
//             📊 Sales Analytics
//           </h1>
//           <p style={{ color: '#6b7280', margin: 0, fontSize: '16px' }}>
//             Comprehensive insights into your sales performance
//           </p>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//           <button
//             onClick={fetchSalesData}
//             disabled={loading}
//             style={{
//               padding: '8px 16px',
//               backgroundColor: loading ? '#9ca3af' : '#2563eb',
//               color: 'white',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: loading ? 'not-allowed' : 'pointer',
//               fontSize: '14px',
//               fontWeight: '500'
//             }}
//           >
//             {loading ? 'Loading...' : 'Refresh Data'}
//           </button>
//           <span style={{ color: '#6b7280' }}>📅</span>
//           <select
//             value={dateRange}
//             onChange={(e) => setDateRange(e.target.value)}
//             style={{
//               padding: '8px 12px',
//               borderRadius: '8px',
//               border: '1px solid #d1d5db',
//               backgroundColor: 'white',
//               color: '#1f2937',
//               minWidth: '150px'
//             }}
//           >
//             <option value="7">Last 7 days</option>
//             <option value="30">Last 30 days</option>
//             <option value="60">Last 60 days</option>
//             <option value="90">Last 90 days</option>
//           </select>
//         </div>
//       </div>

//       {/* Key Metrics Cards */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//         gap: '20px',
//         marginBottom: '30px'
//       }}>
//         <div style={{
//           ...cardStyle,
//           background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
//           color: 'white'
//         }}>
//           <div style={{ padding: '25px', textAlign: 'center' }}>
//             <div style={{ fontSize: '24px', marginBottom: '10px' }}>💰</div>
//             <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>
//               {formatCurrency(analytics.totalRevenue)}
//             </h3>
//             <p style={{ margin: 0, opacity: 0.9 }}>Total Revenue</p>
//           </div>
//         </div>

//         <div style={{
//           ...cardStyle,
//           background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
//           color: 'white'
//         }}>
//           <div style={{ padding: '25px', textAlign: 'center' }}>
//             <div style={{ fontSize: '24px', marginBottom: '10px' }}>🛒</div>
//             <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>
//               {analytics.totalSales}
//             </h3>
//             <p style={{ margin: 0, opacity: 0.9 }}>Total Sales</p>
//           </div>
//         </div>

//         <div style={{
//           ...cardStyle,
//           background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
//           color: 'white'
//         }}>
//           <div style={{ padding: '25px', textAlign: 'center' }}>
//             <div style={{ fontSize: '24px', marginBottom: '10px' }}>📈</div>
//             <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>
//               {formatCurrency(analytics.averageOrderValue)}
//             </h3>
//             <p style={{ margin: 0, opacity: 0.9 }}>Avg Order Value</p>
//           </div>
//         </div>

//         <div style={{
//           ...cardStyle,
//           background: analytics.revenueGrowth >= 0
//             ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
//             : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
//           color: 'white'
//         }}>
//           <div style={{ padding: '25px', textAlign: 'center' }}>
//             <div style={{ fontSize: '24px', marginBottom: '10px' }}>
//               {analytics.revenueGrowth >= 0 ? '📈' : '📉'}
//             </div>
//             <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>
//               {analytics.revenueGrowth.toFixed(1)}%
//             </h3>
//             <p style={{ margin: 0, opacity: 0.9 }}>Revenue Growth</p>
//           </div>
//         </div>
//       </div>

//       {/* Charts Row 1 */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: '2fr 1fr',
//         gap: '20px',
//         marginBottom: '20px'
//       }}>
//         <div style={cardStyle}>
//           <div style={headerStyle}>
//             <h5 style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
//               Revenue Trends
//             </h5>
//           </div>
//           <div style={{ padding: '20px' }}>
//             <ResponsiveContainer width="100%" height={320}>
//               <AreaChart data={analytics.dailyTrends}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="date" stroke="#6b7280" />
//                 <YAxis stroke="#6b7280" tickFormatter={formatNumber} />
//                 <Tooltip
//                   formatter={(value) => [formatCurrency(value), 'Revenue']}
//                   labelStyle={{ color: '#1f2937' }}
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#2563eb"
//                   fill="#3b82f680"
//                   strokeWidth={3}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div style={cardStyle}>
//           <div style={headerStyle}>
//             <h5 style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
//               Order Status Distribution
//             </h5>
//           </div>
//           <div style={{ padding: '20px' }}>
//             <ResponsiveContainer width="100%" height={320}>
//               <PieChart>
//                 <Pie
//                   data={analytics.statusBreakdown}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={50}
//                   outerRadius={100}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {analytics.statusBreakdown.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Charts Row 2 */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: '1fr 1fr',
//         gap: '20px'
//       }}>
//         <div style={cardStyle}>
//           <div style={headerStyle}>
//             <h5 style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
//               Top Products by Revenue
//             </h5>
//           </div>
//           <div style={{ padding: '20px' }}>
//             <ResponsiveContainer width="100%" height={350}>
//               <BarChart data={analytics.topProducts} layout="horizontal">
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis type="number" stroke="#6b7280" tickFormatter={formatNumber} />
//                 <YAxis
//                   type="category"
//                   dataKey="name"
//                   stroke="#6b7280"
//                   width={120}
//                   tick={{ fontSize: 12 }}
//                 />
//                 <Tooltip
//                   formatter={(value) => [formatCurrency(value), 'Revenue']}
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div style={cardStyle}>
//           <div style={headerStyle}>
//             <h5 style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
//               Monthly Performance
//             </h5>
//           </div>
//           <div style={{ padding: '20px' }}>
//             <ResponsiveContainer width="100%" height={350}>
//               <LineChart data={analytics.monthlyTrends}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="month" stroke="#6b7280" />
//                 <YAxis stroke="#6b7280" tickFormatter={formatNumber} />
//                 <Tooltip
//                   formatter={(value, name) => [
//                     name === 'revenue' ? formatCurrency(value) : value,
//                     name === 'revenue' ? 'Revenue' : 'Sales Count'
//                   ]}
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#2563eb"
//                   strokeWidth={3}
//                   dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
//                   name="Revenue"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="sales"
//                   stroke="#059669"
//                   strokeWidth={3}
//                   dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
//                   name="Sales Count"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesAnalytics;









// import React, { useState, useEffect, useCallback } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// const SalesAnalytics = () => {
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dateRange, setDateRange] = useState('30');
//   const [analytics, setAnalytics] = useState({
//     totalRevenue: 0,
//     totalSales: 0,
//     averageOrderValue: 0,
//     topProducts: [],
//     dailyTrends: [],
//     monthlyTrends: [],
//     statusBreakdown: [],
//     revenueGrowth: 0
//   });

//   // Real authentication state
//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const [loggedInUserId, setLoggedInUserId] = useState(null);
//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

//   // Colors for charts
//   const colors = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#65a30d'];

//   // Authentication handling
//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     // In a real app, you'd navigate to login page here
//     console.error('Authentication error:', errMessage);
//   }, []);

//   // Initialize authentication
//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = JSON.parse(atob(token.split('.')[1])); // Simple JWT decode
//         setLoggedInUserRole(decodedToken.user_type || '');
//         setLoggedInUserId(decodedToken.sub);
//       } catch (err) {
//         console.error('Failed to decode token:', err);
//         handleAuthError('Invalid or expired token. Please log in again.');
//       }
//     } else {
//       handleAuthError('Authentication token missing. Please log in.');
//     }
//   }, [handleAuthError]);

//   const processAnalytics = (sales, orders) => {
//     if (!sales.length && !orders.length) {
//       setAnalytics({
//         totalRevenue: 0,
//         totalSales: 0,
//         averageOrderValue: 0,
//         topProducts: [],
//         dailyTrends: [],
//         monthlyTrends: [],
//         statusBreakdown: [],
//         revenueGrowth: 0
//       });
//       return;
//     }

//     // Calculate basic metrics
//     const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
//     const totalSales = sales.length;
//     const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

//     // Process daily trends
//     const dailyTrends = processDailyTrends(sales);
    
//     // Process monthly trends
//     const monthlyTrends = processMonthlyTrends(sales);

//     // Process order status breakdown
//     const statusBreakdown = processStatusBreakdown(orders);

//     // Process top products from orders
//     const topProducts = processTopProducts(orders);

//     // Calculate revenue growth
//     const revenueGrowth = calculateGrowthRate(dailyTrends);

//     setAnalytics({
//       totalRevenue,
//       totalSales,
//       averageOrderValue,
//       topProducts,
//       dailyTrends,
//       monthlyTrends,
//       statusBreakdown,
//       revenueGrowth
//     });
//   };

//   const processDailyTrends = (sales) => {
//     const trends = {};
    
//     sales.forEach(sale => {
//       const saleDate = sale.sale_date || sale.created_at;
//       if (!saleDate) return;
      
//       const date = new Date(saleDate).toISOString().split('T')[0];
//       if (!trends[date]) {
//         trends[date] = { date: date.slice(5), revenue: 0, sales: 0 };
//       }
//       trends[date].revenue += parseFloat(sale.amount || 0);
//       trends[date].sales += 1;
//     });

//     // Filter by date range
//     const cutoffDate = new Date();
//     cutoffDate.setDate(cutoffDate.getDate() - parseInt(dateRange));
    
//     return Object.values(trends)
//       .filter(trend => {
//         const trendDate = new Date('2024-' + trend.date);
//         return trendDate >= cutoffDate;
//       })
//       .sort((a, b) => new Date('2024-' + a.date) - new Date('2024-' + b.date));
//   };

//   const processMonthlyTrends = (sales) => {
//     const trends = {};
    
//     sales.forEach(sale => {
//       const saleDate = sale.sale_date || sale.created_at;
//       if (!saleDate) return;
      
//       const date = new Date(saleDate);
//       const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
//       if (!trends[monthKey]) {
//         trends[monthKey] = { month: monthKey.slice(5), revenue: 0, sales: 0 };
//       }
//       trends[monthKey].revenue += parseFloat(sale.amount || 0);
//       trends[monthKey].sales += 1;
//     });

//     return Object.values(trends)
//       .sort((a, b) => a.month.localeCompare(b.month))
//       .slice(-12);
//   };

//   const processStatusBreakdown = (orders) => {
//     const statusCount = {};
    
//     orders.forEach(order => {
//       const status = order.status || 'pending';
//       statusCount[status] = (statusCount[status] || 0) + 1;
//     });

//     return Object.entries(statusCount).map(([status, count]) => ({
//       status: status.charAt(0).toUpperCase() + status.slice(1),
//       count,
//       value: count
//     }));
//   };

//   const processTopProducts = (orders) => {
//     const productSales = {};
    
//     orders.forEach(order => {
//       if (order.cart && Array.isArray(order.cart)) {
//         order.cart.forEach(item => {
//           const productName = item.product_name || 'Unknown Product';
//           if (!productSales[productName]) {
//             productSales[productName] = {
//               name: productName.length > 15 ? productName.substring(0, 15) + '...' : productName,
//               quantity: 0,
//               revenue: 0
//             };
//           }
//           productSales[productName].quantity += item.quantity || 0;
//           productSales[productName].revenue += (item.quantity || 0) * (parseFloat(item.price) || 0);
//         });
//       }
//     });

//     return Object.values(productSales)
//       .sort((a, b) => b.revenue - a.revenue)
//       .slice(0, 8);
//   };

//   const calculateGrowthRate = (dailyTrends) => {
//     if (dailyTrends.length < 14) return 0;
    
//     const firstWeek = dailyTrends.slice(0, 7).reduce((sum, day) => sum + day.revenue, 0);
//     const lastWeek = dailyTrends.slice(-7).reduce((sum, day) => sum + day.revenue, 0);
    
//     if (firstWeek === 0) return 0;
//     return ((lastWeek - firstWeek) / firstWeek) * 100;
//   };

//   // Fetch real data from your backend
//   const fetchSalesData = useCallback(async () => {
//     if (!loggedInUserRole || (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin')) {
//       handleAuthError('You do not have permission to view this page.');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       // Fetch sales data with pagination to get all records
//       const salesParams = new URLSearchParams({
//         per_page: '1000',
//         search: ''
//       });

//       // Fetch orders data for additional analytics
//       const ordersParams = new URLSearchParams({
//         per_page: '1000'
//       });

//       console.log('Fetching sales data...');
//       const salesResponse = await fetch(`${API_BASE_URL}/sales?${salesParams.toString()}`, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Fetching orders data...');
//       const ordersResponse = await fetch(`${API_BASE_URL}/orders/admin?${ordersParams.toString()}`, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!salesResponse.ok) {
//         const salesError = await salesResponse.json();
//         if (salesResponse.status === 401 || salesResponse.status === 403) {
//           handleAuthError(salesError.error || 'Authentication failed. Please log in again.');
//           return;
//         }
//         throw new Error(salesError.error || 'Failed to fetch sales data');
//       }

//       if (!ordersResponse.ok) {
//         const ordersError = await ordersResponse.json();
//         if (ordersResponse.status === 401 || ordersResponse.status === 403) {
//           handleAuthError(ordersError.error || 'Authentication failed. Please log in again.');
//           return;
//         }
//         throw new Error(ordersError.error || 'Failed to fetch orders data');
//       }

//       const salesData = await salesResponse.json();
//       const ordersData = await ordersResponse.json();

//       console.log('Sales API Response:', salesData);
//       console.log('Orders API Response:', ordersData);

//       const sales = salesData.sales || [];
//       const orders = ordersData.orders || [];

//       setSalesData(sales);
//       processAnalytics(sales, orders);

//     } catch (err) {
//       console.error('Error fetching analytics data:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [loggedInUserRole, dateRange, handleAuthError]);

//   // Trigger data fetch when dependencies change
//   useEffect(() => {
//     if (loggedInUserRole) {
//       fetchSalesData();
//     }
//   }, [fetchSalesData, loggedInUserRole]);

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-UG', {
//       style: 'currency',
//       currency: 'UGX',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const formatNumber = (num) => {
//     if (num >= 1000000) {
//       return (num / 1000000).toFixed(1) + 'M';
//     }
//     if (num >= 1000) {
//       return (num / 1000).toFixed(1) + 'K';
//     }
//     return num.toString();
//   };

//   if (loading) {
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         backgroundColor: '#f8fafc'
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{
//             width: '40px',
//             height: '40px',
//             border: '4px solid #e5e7eb',
//             borderTop: '4px solid #2563eb',
//             borderRadius: '50%',
//             animation: 'spin 1s linear infinite',
//             margin: '0 auto 20px'
//           }}></div>
//           <h3 style={{ color: '#1f2937', marginBottom: '10px' }}>Loading Analytics...</h3>
//           <p style={{ color: '#6b7280' }}>Processing your sales data</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{
//         padding: '40px',
//         textAlign: 'center',
//         backgroundColor: '#fef2f2',
//         border: '1px solid #fecaca',
//         borderRadius: '12px',
//         margin: '20px'
//       }}>
//         <h3 style={{ color: '#dc2626', marginBottom: '10px' }}>Error Loading Analytics</h3>
//         <p style={{ color: '#7f1d1d' }}>{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           style={{
//             padding: '10px 20px',
//             backgroundColor: '#dc2626',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer'
//           }}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   const cardStyle = {
//     backgroundColor: 'white',
//     borderRadius: '12px',
//     boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
//     border: 'none',
//     marginBottom: '20px'
//   };

//   const headerStyle = {
//     backgroundColor: 'white',
//     borderBottom: '1px solid #e5e7eb',
//     borderRadius: '12px 12px 0 0',
//     padding: '20px',
//     margin: 0
//   };

//   return (
//     <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
      
//       {/* Header */}
//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '30px',
//         backgroundColor: 'white',
//         padding: '25px',
//         borderRadius: '12px',
//         boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//       }}>
//         <div>
//           <h1 style={{
//             fontSize: '32px',
//             fontWeight: 'bold',
//             color: '#1f2937',
//             margin: '0 0 8px 0'
//           }}>
//             📊 Sales Analytics
//           </h1>
//           <p style={{ color: '#6b7280', margin: 0, fontSize: '16px' }}>
//             Comprehensive insights into your sales performance
//           </p>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//           <button
//             onClick={fetchSalesData}
//             disabled={loading}
//             style={{
//               padding: '8px 16px',
//               backgroundColor: loading ? '#9ca3af' : '#2563eb',
//               color: 'white',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: loading ? 'not-allowed' : 'pointer',
//               fontSize: '14px',
//               fontWeight: '500'
//             }}
//           >
//             {loading ? 'Loading...' : 'Refresh Data'}
//           </button>
//           <span style={{ color: '#6b7280' }}>📅</span>
//           <select
//             value={dateRange}
//             onChange={(e) => setDateRange(e.target.value)}
//             style={{
//               padding: '8px 12px',
//               borderRadius: '8px',
//               border: '1px solid #d1d5db',
//               backgroundColor: 'white',
//               color: '#1f2937',
//               minWidth: '150px'
//             }}
//           >
//             <option value="7">Last 7 days</option>
//             <option value="30">Last 30 days</option>
//             <option value="60">Last 60 days</option>
//             <option value="90">Last 90 days</option>
//           </select>
//         </div>
//       </div>

//       {/* Key Metrics Cards */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//         gap: '20px',
//         marginBottom: '30px'
//       }}>
//         <div style={{
//           ...cardStyle,
//           background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
//           color: 'white'
//         }}>
//           <div style={{ padding: '25px', textAlign: 'center' }}>
//             <div style={{ fontSize: '24px', marginBottom: '10px' }}>💰</div>
//             <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>
//               {formatCurrency(analytics.totalRevenue)}
//             </h3>
//             <p style={{ margin: 0, opacity: 0.9 }}>Total Revenue</p>
//           </div>
//         </div>

//         <div style={{
//           ...cardStyle,
//           background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
//           color: 'white'
//         }}>
//           <div style={{ padding: '25px', textAlign: 'center' }}>
//             <div style={{ fontSize: '24px', marginBottom: '10px' }}>🛒</div>
//             <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>
//               {analytics.totalSales}
//             </h3>
//             <p style={{ margin: 0, opacity: 0.9 }}>Total Sales</p>
//           </div>
//         </div>

//         <div style={{
//           ...cardStyle,
//           background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
//           color: 'white'
//         }}>
//           <div style={{ padding: '25px', textAlign: 'center' }}>
//             <div style={{ fontSize: '24px', marginBottom: '10px' }}>📈</div>
//             <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>
//               {formatCurrency(analytics.averageOrderValue)}
//             </h3>
//             <p style={{ margin: 0, opacity: 0.9 }}>Avg Order Value</p>
//           </div>
//         </div>

//         <div style={{
//           ...cardStyle,
//           background: analytics.revenueGrowth >= 0
//             ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
//             : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
//           color: 'white'
//         }}>
//           <div style={{ padding: '25px', textAlign: 'center' }}>
//             <div style={{ fontSize: '24px', marginBottom: '10px' }}>
//               {analytics.revenueGrowth >= 0 ? '📈' : '📉'}
//             </div>
//             <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>
//               {analytics.revenueGrowth.toFixed(1)}%
//             </h3>
//             <p style={{ margin: 0, opacity: 0.9 }}>Revenue Growth</p>
//           </div>
//         </div>
//       </div>

//       {/* Charts Row 1 */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: '2fr 1fr',
//         gap: '20px',
//         marginBottom: '20px'
//       }}>
//         <div style={cardStyle}>
//           <div style={headerStyle}>
//             <h5 style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
//               Revenue Trends
//             </h5>
//           </div>
//           <div style={{ padding: '20px' }}>
//             <ResponsiveContainer width="100%" height={320}>
//               <AreaChart data={analytics.dailyTrends}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="date" stroke="#6b7280" />
//                 <YAxis stroke="#6b7280" tickFormatter={formatNumber} />
//                 <Tooltip
//                   formatter={(value) => [formatCurrency(value), 'Revenue']}
//                   labelStyle={{ color: '#1f2937' }}
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#2563eb"
//                   fill="#3b82f680"
//                   strokeWidth={3}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div style={cardStyle}>
//           <div style={headerStyle}>
//             <h5 style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
//               Order Status Distribution
//             </h5>
//           </div>
//           <div style={{ padding: '20px' }}>
//             <ResponsiveContainer width="100%" height={320}>
//               <PieChart>
//                 <Pie
//                   data={analytics.statusBreakdown}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={50}
//                   outerRadius={100}
//                   paddingAngle={5}
//                   dataKey="count"
//                   label={({ status, count, percent }) => `${status}: ${count} (${(percent * 100).toFixed(0)}%)`}
//                   labelLine={false}
//                 >
//                   {analytics.statusBreakdown.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   formatter={(value, name, props) => [
//                     `${value} orders (${((value / analytics.totalSales) * 100).toFixed(1)}%)`, 
//                     props.payload.status
//                   ]}
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Legend 
//                   formatter={(value, entry) => `${entry.payload.status}: ${entry.payload.count} orders`}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Charts Row 2 */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: '1fr 1fr',
//         gap: '20px'
//       }}>
//         <div style={cardStyle}>
//           <div style={headerStyle}>
//             <h5 style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
//               Top Products by Revenue
//             </h5>
//           </div>
//           <div style={{ padding: '20px' }}>
//             <ResponsiveContainer width="100%" height={350}>
//               <BarChart data={analytics.topProducts} layout="horizontal">
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis type="number" stroke="#6b7280" tickFormatter={formatNumber} />
//                 <YAxis
//                   type="category"
//                   dataKey="name"
//                   stroke="#6b7280"
//                   width={120}
//                   tick={{ fontSize: 12 }}
//                 />
//                 <Tooltip
//                   formatter={(value) => [formatCurrency(value), 'Revenue']}
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div style={cardStyle}>
//           <div style={headerStyle}>
//             <h5 style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
//               Monthly Performance
//             </h5>
//           </div>
//           <div style={{ padding: '20px' }}>
//             <ResponsiveContainer width="100%" height={350}>
//               <LineChart data={analytics.monthlyTrends}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="month" stroke="#6b7280" />
//                 <YAxis stroke="#6b7280" tickFormatter={formatNumber} />
//                 <Tooltip
//                   formatter={(value, name) => [
//                     name === 'revenue' ? formatCurrency(value) : value,
//                     name === 'revenue' ? 'Revenue' : 'Sales Count'
//                   ]}
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#2563eb"
//                   strokeWidth={3}
//                   dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
//                   name="Revenue"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="sales"
//                   stroke="#059669"
//                   strokeWidth={3}
//                   dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
//                   name="Sales Count"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesAnalytics;



// import React, { useState, useEffect, useCallback } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
// import './styles/AdminSalesAnalyticsPage.css';

// const SalesAnalytics = () => {
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dateRange, setDateRange] = useState('30');
//   const [analytics, setAnalytics] = useState({
//     totalRevenue: 0,
//     totalSales: 0,
//     averageOrderValue: 0,
//     topProducts: [],
//     dailyTrends: [],
//     monthlyTrends: [],
//     statusBreakdown: [],
//     revenueGrowth: 0
//   });

//   // Real authentication state
//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const [loggedInUserId, setLoggedInUserId] = useState(null);
//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

//   // Brand colors for charts
//   const colors = ['#0047ab', '#fc7f10', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#336cc7', '#fd9843'];

//   // Authentication handling
//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     // In a real app, you'd navigate to login page here
//     console.error('Authentication error:', errMessage);
//   }, []);

//   // Initialize authentication
//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = JSON.parse(atob(token.split('.')[1])); // Simple JWT decode
//         setLoggedInUserRole(decodedToken.user_type || '');
//         setLoggedInUserId(decodedToken.sub);
//       } catch (err) {
//         console.error('Failed to decode token:', err);
//         handleAuthError('Invalid or expired token. Please log in again.');
//       }
//     } else {
//       handleAuthError('Authentication token missing. Please log in.');
//     }
//   }, [handleAuthError]);

//   const processAnalytics = (sales, orders) => {
//     if (!sales.length && !orders.length) {
//       setAnalytics({
//         totalRevenue: 0,
//         totalSales: 0,
//         averageOrderValue: 0,
//         topProducts: [],
//         dailyTrends: [],
//         monthlyTrends: [],
//         statusBreakdown: [],
//         revenueGrowth: 0
//       });
//       return;
//     }

//     // Calculate basic metrics
//     const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
//     const totalSales = sales.length;
//     const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

//     // Process daily trends
//     const dailyTrends = processDailyTrends(sales);
    
//     // Process monthly trends
//     const monthlyTrends = processMonthlyTrends(sales);

//     // Process order status breakdown
//     const statusBreakdown = processStatusBreakdown(orders);

//     // Process top products from orders
//     const topProducts = processTopProducts(orders);

//     // Calculate revenue growth
//     const revenueGrowth = calculateGrowthRate(dailyTrends);

//     setAnalytics({
//       totalRevenue,
//       totalSales,
//       averageOrderValue,
//       topProducts,
//       dailyTrends,
//       monthlyTrends,
//       statusBreakdown,
//       revenueGrowth
//     });
//   };

//   const processDailyTrends = (sales) => {
//     const trends = {};
    
//     sales.forEach(sale => {
//       const saleDate = sale.sale_date || sale.created_at;
//       if (!saleDate) return;
      
//       const date = new Date(saleDate).toISOString().split('T')[0];
//       if (!trends[date]) {
//         trends[date] = { date: date.slice(5), revenue: 0, sales: 0 };
//       }
//       trends[date].revenue += parseFloat(sale.amount || 0);
//       trends[date].sales += 1;
//     });

//     // Filter by date range
//     const cutoffDate = new Date();
//     cutoffDate.setDate(cutoffDate.getDate() - parseInt(dateRange));
    
//     return Object.values(trends)
//       .filter(trend => {
//         const trendDate = new Date('2024-' + trend.date);
//         return trendDate >= cutoffDate;
//       })
//       .sort((a, b) => new Date('2024-' + a.date) - new Date('2024-' + b.date));
//   };

//   const processMonthlyTrends = (sales) => {
//     const trends = {};
    
//     sales.forEach(sale => {
//       const saleDate = sale.sale_date || sale.created_at;
//       if (!saleDate) return;
      
//       const date = new Date(saleDate);
//       const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
//       if (!trends[monthKey]) {
//         trends[monthKey] = { month: monthKey.slice(5), revenue: 0, sales: 0 };
//       }
//       trends[monthKey].revenue += parseFloat(sale.amount || 0);
//       trends[monthKey].sales += 1;
//     });

//     return Object.values(trends)
//       .sort((a, b) => a.month.localeCompare(b.month))
//       .slice(-12);
//   };

//   const processStatusBreakdown = (orders) => {
//     const statusCount = {};
    
//     orders.forEach(order => {
//       const status = order.status || 'pending';
//       statusCount[status] = (statusCount[status] || 0) + 1;
//     });

//     return Object.entries(statusCount).map(([status, count]) => ({
//       status: status.charAt(0).toUpperCase() + status.slice(1),
//       count,
//       value: count
//     }));
//   };

//   const processTopProducts = (orders) => {
//     const productSales = {};
    
//     orders.forEach(order => {
//       if (order.cart && Array.isArray(order.cart)) {
//         order.cart.forEach(item => {
//           const productName = item.product_name || 'Unknown Product';
//           if (!productSales[productName]) {
//             productSales[productName] = {
//               name: productName.length > 15 ? productName.substring(0, 15) + '...' : productName,
//               quantity: 0,
//               revenue: 0
//             };
//           }
//           productSales[productName].quantity += item.quantity || 0;
//           productSales[productName].revenue += (item.quantity || 0) * (parseFloat(item.price) || 0);
//         });
//       }
//     });

//     return Object.values(productSales)
//       .sort((a, b) => b.revenue - a.revenue)
//       .slice(0, 8);
//   };

//   const calculateGrowthRate = (dailyTrends) => {
//     if (dailyTrends.length < 14) return 0;
    
//     const firstWeek = dailyTrends.slice(0, 7).reduce((sum, day) => sum + day.revenue, 0);
//     const lastWeek = dailyTrends.slice(-7).reduce((sum, day) => sum + day.revenue, 0);
    
//     if (firstWeek === 0) return 0;
//     return ((lastWeek - firstWeek) / firstWeek) * 100;
//   };

//   // Fetch real data from your backend
//   const fetchSalesData = useCallback(async () => {
//     if (!loggedInUserRole || (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin')) {
//       handleAuthError('You do not have permission to view this page.');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       // Fetch sales data with pagination to get all records
//       const salesParams = new URLSearchParams({
//         per_page: '1000',
//         search: ''
//       });

//       // Fetch orders data for additional analytics
//       const ordersParams = new URLSearchParams({
//         per_page: '1000'
//       });

//       console.log('Fetching sales data...');
//       const salesResponse = await fetch(`${API_BASE_URL}/sales?${salesParams.toString()}`, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Fetching orders data...');
//       const ordersResponse = await fetch(`${API_BASE_URL}/orders/admin?${ordersParams.toString()}`, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!salesResponse.ok) {
//         const salesError = await salesResponse.json();
//         if (salesResponse.status === 401 || salesResponse.status === 403) {
//           handleAuthError(salesError.error || 'Authentication failed. Please log in again.');
//           return;
//         }
//         throw new Error(salesError.error || 'Failed to fetch sales data');
//       }

//       if (!ordersResponse.ok) {
//         const ordersError = await ordersResponse.json();
//         if (ordersResponse.status === 401 || ordersResponse.status === 403) {
//           handleAuthError(ordersError.error || 'Authentication failed. Please log in again.');
//           return;
//         }
//         throw new Error(ordersError.error || 'Failed to fetch orders data');
//       }

//       const salesData = await salesResponse.json();
//       const ordersData = await ordersResponse.json();

//       console.log('Sales API Response:', salesData);
//       console.log('Orders API Response:', ordersData);

//       const sales = salesData.sales || [];
//       const orders = ordersData.orders || [];

//       setSalesData(sales);
//       processAnalytics(sales, orders);

//     } catch (err) {
//       console.error('Error fetching analytics data:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [loggedInUserRole, dateRange, handleAuthError]);

//   // Trigger data fetch when dependencies change
//   useEffect(() => {
//     if (loggedInUserRole) {
//       fetchSalesData();
//     }
//   }, [fetchSalesData, loggedInUserRole]);

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-UG', {
//       style: 'currency',
//       currency: 'UGX',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const formatNumber = (num) => {
//     if (num >= 1000000) {
//       return (num / 1000000).toFixed(1) + 'M';
//     }
//     if (num >= 1000) {
//       return (num / 1000).toFixed(1) + 'K';
//     }
//     return num.toString();
//   };

//   // Custom label formatter for pie chart
//   const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, status }) => {
//     if (percent < 0.05) return null; // Don't show labels for slices less than 5%
    
//     const RADIAN = Math.PI / 180;
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//       <text 
//         x={x} 
//         y={y} 
//         fill="white" 
//         textAnchor={x > cx ? 'start' : 'end'} 
//         dominantBaseline="central"
//         fontSize="12"
//         fontWeight="500"
//       >
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-content">
//           <div className="loading-spinner"></div>
//           <h3 className="loading-title">Loading Analytics...</h3>
//           <p className="loading-subtitle">Processing your sales data</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <h3 className="error-title">Error Loading Analytics</h3>
//         <p className="error-message">{error}</p>
//         <button
//           className="error-button"
//           onClick={() => window.location.reload()}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="sales-analytics">
//       {/* Header */}
//       <div className="header-section">
//         <div className="header-content">
//           <h1>📊 Sales Analytics</h1>
//           <p>Comprehensive insights into your sales performance</p>
//         </div>
//         <div className="header-controls">
//           <button
//             className="refresh-button"
//             onClick={fetchSalesData}
//             disabled={loading}
//           >
//             {loading ? 'Loading...' : 'Refresh Data'}
//           </button>
//           <span className="date-icon">📅</span>
//           <select
//             className="date-select"
//             value={dateRange}
//             onChange={(e) => setDateRange(e.target.value)}
//           >
//             <option value="7">Last 7 days</option>
//             <option value="30">Last 30 days</option>
//             <option value="60">Last 60 days</option>
//             <option value="90">Last 90 days</option>
//           </select>
//         </div>
//       </div>

//       {/* Key Metrics Cards */}
//       <div className="metrics-grid">
//         <div className="metric-card revenue">
//           <div className="metric-content">
//             <span className="metric-icon">💰</span>
//             <h3 className="metric-value">
//               {formatCurrency(analytics.totalRevenue)}
//             </h3>
//             <p className="metric-label">Total Revenue</p>
//           </div>
//         </div>

//         <div className="metric-card sales">
//           <div className="metric-content">
//             <span className="metric-icon">🛒</span>
//             <h3 className="metric-value">
//               {analytics.totalSales}
//             </h3>
//             <p className="metric-label">Total Sales</p>
//           </div>
//         </div>

//         <div className="metric-card average">
//           <div className="metric-content">
//             <span className="metric-icon">📈</span>
//             <h3 className="metric-value">
//               {formatCurrency(analytics.averageOrderValue)}
//             </h3>
//             <p className="metric-label">Avg Order Value</p>
//           </div>
//         </div>

//         <div className={`metric-card growth ${analytics.revenueGrowth < 0 ? 'negative' : ''}`}>
//           <div className="metric-content">
//             <span className="metric-icon">
//               {analytics.revenueGrowth >= 0 ? '📈' : '📉'}
//             </span>
//             <h3 className="metric-value">
//               {analytics.revenueGrowth.toFixed(1)}%
//             </h3>
//             <p className="metric-label">Revenue Growth</p>
//           </div>
//         </div>
//       </div>

//       {/* Charts Row 1 */}
//       <div className="charts-row-1">
//         <div className="chart-card">
//           <div className="chart-header">
//             <h5 className="chart-title">Revenue Trends</h5>
//           </div>
//           <div className="chart-content">
//             <ResponsiveContainer width="100%" height={320}>
//               <AreaChart data={analytics.dailyTrends}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis tickFormatter={formatNumber} />
//                 <Tooltip
//                   formatter={(value) => [formatCurrency(value), 'Revenue']}
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#0047ab"
//                   fill="#0047ab40"
//                   strokeWidth={3}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="chart-card">
//           <div className="chart-header">
//             <h5 className="chart-title">Order Status Distribution</h5>
//           </div>
//           <div className="chart-content">
//             <ResponsiveContainer width="100%" height={320}>
//               <PieChart>
//                 <Pie
//                   data={analytics.statusBreakdown}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={renderPieLabel}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="count"
//                 >
//                   {analytics.statusBreakdown.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   formatter={(value, name, props) => [
//                     `${value} orders (${((value / analytics.totalSales) * 100).toFixed(1)}%)`, 
//                     props.payload.status
//                   ]}
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Legend 
//                   formatter={(value, entry) => (
//                     <span style={{ color: '#495057' }}>
//                       {entry.payload.status}: {entry.payload.count} orders
//                     </span>
//                   )}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Charts Row 2 */}
//       <div className="charts-row-2">
//         <div className="chart-card">
//           <div className="chart-header">
//             <h5 className="chart-title">Top Products by Revenue</h5>
//           </div>
//           <div className="chart-content">
//             <ResponsiveContainer width="100%" height={350}>
//               <BarChart data={analytics.topProducts} layout="horizontal">
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" tickFormatter={formatNumber} />
//                 <YAxis
//                   type="category"
//                   dataKey="name"
//                   width={120}
//                   tick={{ fontSize: 12 }}
//                 />
//                 <Tooltip
//                   formatter={(value) => [formatCurrency(value), 'Revenue']}
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Bar dataKey="revenue" fill="#0047ab" radius={[0, 4, 4, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="chart-card">
//           <div className="chart-header">
//             <h5 className="chart-title">Monthly Performance</h5>
//           </div>
//           <div className="chart-content">
//             <ResponsiveContainer width="100%" height={350}>
//               <LineChart data={analytics.monthlyTrends}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis tickFormatter={formatNumber} />
//                 <Tooltip
//                   formatter={(value, name) => [
//                     name === 'revenue' ? formatCurrency(value) : value,
//                     name === 'revenue' ? 'Revenue' : 'Sales Count'
//                   ]}
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#0047ab"
//                   strokeWidth={3}
//                   dot={{ fill: '#0047ab', strokeWidth: 2, r: 4 }}
//                   name="Revenue"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="sales"
//                   stroke="#10b981"
//                   strokeWidth={3}
//                   dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
//                   name="Sales Count"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesAnalytics;


// import React, { useState, useEffect, useCallback } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
// import './styles/AdminSalesAnalyticsPage.css';

// const SalesAnalytics = () => {
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dateRange, setDateRange] = useState('30');
//   const [analytics, setAnalytics] = useState({
//     totalRevenue: 0,
//     totalSales: 0,
//     averageOrderValue: 0,
//     topProducts: [],
//     dailyTrends: [],
//     monthlyTrends: [],
//     statusBreakdown: [],
//     revenueGrowth: 0
//   });

//   // Real authentication state
//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const [loggedInUserId, setLoggedInUserId] = useState(null);
//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

//   // Brand colors for charts
//   const colors = ['#0047ab', '#fc7f10', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#336cc7', '#fd9843'];

//   // Authentication handling
//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     // In a real app, you'd navigate to login page here
//     console.error('Authentication error:', errMessage);
//   }, []);

//   // Initialize authentication
//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = JSON.parse(atob(token.split('.')[1])); // Simple JWT decode
//         setLoggedInUserRole(decodedToken.user_type || '');
//         setLoggedInUserId(decodedToken.sub);
//       } catch (err) {
//         console.error('Failed to decode token:', err);
//         handleAuthError('Invalid or expired token. Please log in again.');
//       }
//     } else {
//       handleAuthError('Authentication token missing. Please log in.');
//     }
//   }, [handleAuthError]);

//   const processAnalytics = (sales, orders) => {
//     if (!sales.length && !orders.length) {
//       setAnalytics({
//         totalRevenue: 0,
//         totalSales: 0,
//         averageOrderValue: 0,
//         topProducts: [],
//         dailyTrends: [],
//         monthlyTrends: [],
//         statusBreakdown: [],
//         revenueGrowth: 0
//       });
//       return;
//     }

//     // Calculate basic metrics
//     const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
//     const totalSales = sales.length;
//     const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

//     // Process daily trends
//     const dailyTrends = processDailyTrends(sales);
    
//     // Process monthly trends
//     const monthlyTrends = processMonthlyTrends(sales);

//     // Process order status breakdown
//     const statusBreakdown = processStatusBreakdown(orders);

//     // Process top products from orders
//     const topProducts = processTopProducts(sales, orders);

//     // Calculate revenue growth
//     const revenueGrowth = calculateGrowthRate(dailyTrends);

//     setAnalytics({
//       totalRevenue,
//       totalSales,
//       averageOrderValue,
//       topProducts,
//       dailyTrends,
//       monthlyTrends,
//       statusBreakdown,
//       revenueGrowth
//     });
//   };

//   const processDailyTrends = (sales) => {
//     const trends = {};
    
//     sales.forEach(sale => {
//       const saleDate = sale.sale_date || sale.created_at;
//       if (!saleDate) return;
      
//       const date = new Date(saleDate).toISOString().split('T')[0];
//       if (!trends[date]) {
//         trends[date] = { date: date.slice(5), revenue: 0, sales: 0 };
//       }
//       trends[date].revenue += parseFloat(sale.amount || 0);
//       trends[date].sales += 1;
//     });

//     // Filter by date range
//     const cutoffDate = new Date();
//     cutoffDate.setDate(cutoffDate.getDate() - parseInt(dateRange));
    
//     return Object.values(trends)
//       .filter(trend => {
//         const trendDate = new Date('2024-' + trend.date);
//         return trendDate >= cutoffDate;
//       })
//       .sort((a, b) => new Date('2024-' + a.date) - new Date('2024-' + b.date));
//   };

//   const processMonthlyTrends = (sales) => {
//     const trends = {};
    
//     sales.forEach(sale => {
//       const saleDate = sale.sale_date || sale.created_at;
//       if (!saleDate) return;
      
//       const date = new Date(saleDate);
//       const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
//       if (!trends[monthKey]) {
//         trends[monthKey] = { month: monthKey.slice(5), revenue: 0, sales: 0 };
//       }
//       trends[monthKey].revenue += parseFloat(sale.amount || 0);
//       trends[monthKey].sales += 1;
//     });

//     return Object.values(trends)
//       .sort((a, b) => a.month.localeCompare(b.month))
//       .slice(-12);
//   };

//   const processStatusBreakdown = (orders) => {
//     const statusCount = {};
    
//     orders.forEach(order => {
//       const status = order.status || 'pending';
//       statusCount[status] = (statusCount[status] || 0) + 1;
//     });

//     return Object.entries(statusCount).map(([status, count]) => ({
//       status: status.charAt(0).toUpperCase() + status.slice(1),
//       count,
//       value: count
//     }));
//   };

//   const processTopProducts = (sales, orders) => {
//     const productSales = {};
    
//     console.log('Processing top products from sales:', sales.length);
//     console.log('Sample sales data:', sales.slice(0, 2));
    
//     // Process from sales data first (this is likely where your product info is)
//     sales.forEach(sale => {
//       const productName = sale.product_name || sale.product || sale.item_name || sale.description || 'Unknown Product';
//       const price = parseFloat(sale.amount) || parseFloat(sale.price) || parseFloat(sale.total) || 0;
//       const quantity = parseInt(sale.quantity) || 1; // Default to 1 if no quantity field
      
//       if (productName && productName !== 'Unknown Product') {
//         if (!productSales[productName]) {
//           productSales[productName] = {
//             name: productName.length > 20 ? productName.substring(0, 20) + '...' : productName,
//             fullName: productName,
//             quantity: 0,
//             revenue: 0
//           };
//         }
//         productSales[productName].quantity += quantity;
//         productSales[productName].revenue += price; // Use the sale amount directly
//       }
//     });
    
//     // If sales don't have product details, try orders as fallback
//     if (Object.keys(productSales).length === 0) {
//       console.log('No products found in sales, trying orders...');
//       orders.forEach(order => {
//         if (order.cart && Array.isArray(order.cart)) {
//           order.cart.forEach(item => {
//             const productName = item.product_name || item.name || 'Unknown Product';
//             const price = parseFloat(item.price) || parseFloat(item.unit_price) || 0;
//             const quantity = parseInt(item.quantity) || 0;
            
//             if (!productSales[productName]) {
//               productSales[productName] = {
//                 name: productName.length > 20 ? productName.substring(0, 20) + '...' : productName,
//                 fullName: productName,
//                 quantity: 0,
//                 revenue: 0
//               };
//             }
//             productSales[productName].quantity += quantity;
//             productSales[productName].revenue += quantity * price;
//           });
//         }
//       });
//     }

//     console.log('Product sales data:', productSales);
    
//     const topProducts = Object.values(productSales)
//       .filter(product => product.revenue > 0) // Only include products with actual revenue
//       .sort((a, b) => b.revenue - a.revenue)
//       .slice(0, 8);
      
//     console.log('Top products result:', topProducts);
    
//     return topProducts;
//   };

//   const calculateGrowthRate = (dailyTrends) => {
//     if (dailyTrends.length < 14) return 0;
    
//     const firstWeek = dailyTrends.slice(0, 7).reduce((sum, day) => sum + day.revenue, 0);
//     const lastWeek = dailyTrends.slice(-7).reduce((sum, day) => sum + day.revenue, 0);
    
//     if (firstWeek === 0) return 0;
//     return ((lastWeek - firstWeek) / firstWeek) * 100;
//   };

//   // Fetch real data from your backend
//   const fetchSalesData = useCallback(async () => {
//     if (!loggedInUserRole || (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin')) {
//       handleAuthError('You do not have permission to view this page.');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       // Fetch sales data with pagination to get all records
//       const salesParams = new URLSearchParams({
//         per_page: '1000',
//         search: ''
//       });

//       // Fetch orders data for additional analytics
//       const ordersParams = new URLSearchParams({
//         per_page: '1000'
//       });

//       console.log('Fetching sales data...');
//       const salesResponse = await fetch(`${API_BASE_URL}/sales?${salesParams.toString()}`, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Fetching orders data...');
//       const ordersResponse = await fetch(`${API_BASE_URL}/orders/admin?${ordersParams.toString()}`, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!salesResponse.ok) {
//         const salesError = await salesResponse.json();
//         if (salesResponse.status === 401 || salesResponse.status === 403) {
//           handleAuthError(salesError.error || 'Authentication failed. Please log in again.');
//           return;
//         }
//         throw new Error(salesError.error || 'Failed to fetch sales data');
//       }

//       if (!ordersResponse.ok) {
//         const ordersError = await ordersResponse.json();
//         if (ordersResponse.status === 401 || ordersResponse.status === 403) {
//           handleAuthError(ordersError.error || 'Authentication failed. Please log in again.');
//           return;
//         }
//         throw new Error(ordersError.error || 'Failed to fetch orders data');
//       }

//       const salesData = await salesResponse.json();
//       const ordersData = await ordersResponse.json();

//       console.log('Sales API Response:', salesData);
//       console.log('Orders API Response:', ordersData);

//       const sales = salesData.sales || [];
//       const orders = ordersData.orders || [];

//       setSalesData(sales);
//       processAnalytics(sales, orders);

//     } catch (err) {
//       console.error('Error fetching analytics data:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [loggedInUserRole, dateRange, handleAuthError]);

//   // Trigger data fetch when dependencies change
//   useEffect(() => {
//     if (loggedInUserRole) {
//       fetchSalesData();
//     }
//   }, [fetchSalesData, loggedInUserRole]);

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-UG', {
//       style: 'currency',
//       currency: 'UGX',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const formatNumber = (num) => {
//     if (num >= 1000000) {
//       return (num / 1000000).toFixed(1) + 'M';
//     }
//     if (num >= 1000) {
//       return (num / 1000).toFixed(1) + 'K';
//     }
//     return num.toString();
//   };

//   // Custom label formatter for pie chart
//   const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, status }) => {
//     if (percent < 0.05) return null; // Don't show labels for slices less than 5%
    
//     const RADIAN = Math.PI / 180;
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//       <text 
//         x={x} 
//         y={y} 
//         fill="white" 
//         textAnchor={x > cx ? 'start' : 'end'} 
//         dominantBaseline="central"
//         fontSize="12"
//         fontWeight="500"
//       >
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-content">
//           <div className="loading-spinner"></div>
//           <h3 className="loading-title">Loading Analytics...</h3>
//           <p className="loading-subtitle">Processing your sales data</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <h3 className="error-title">Error Loading Analytics</h3>
//         <p className="error-message">{error}</p>
//         <button
//           className="error-button"
//           onClick={() => window.location.reload()}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="sales-analytics">
//       {/* Header */}
//       <div className="header-section">
//         <div className="header-content">
//           <h1>📊 Sales Analytics</h1>
//           <p>Comprehensive insights into your sales performance</p>
//         </div>
//         <div className="header-controls">
//           <button
//             className="refresh-button"
//             onClick={fetchSalesData}
//             disabled={loading}
//           >
//             {loading ? 'Loading...' : 'Refresh Data'}
//           </button>
//           <span className="date-icon">📅</span>
//           <select
//             className="date-select"
//             value={dateRange}
//             onChange={(e) => setDateRange(e.target.value)}
//           >
//             <option value="7">Last 7 days</option>
//             <option value="30">Last 30 days</option>
//             <option value="60">Last 60 days</option>
//             <option value="90">Last 90 days</option>
//           </select>
//         </div>
//       </div>

//       {/* Key Metrics Cards */}
//       <div className="metrics-grid">
//         <div className="metric-card revenue">
//           <div className="metric-content">
//             <span className="metric-icon">💰</span>
//             <h3 className="metric-value">
//               {formatCurrency(analytics.totalRevenue)}
//             </h3>
//             <p className="metric-label">Total Revenue</p>
//           </div>
//         </div>

//         <div className="metric-card sales">
//           <div className="metric-content">
//             <span className="metric-icon">🛒</span>
//             <h3 className="metric-value">
//               {analytics.totalSales}
//             </h3>
//             <p className="metric-label">Total Sales</p>
//           </div>
//         </div>

//         <div className="metric-card average">
//           <div className="metric-content">
//             <span className="metric-icon">📈</span>
//             <h3 className="metric-value">
//               {formatCurrency(analytics.averageOrderValue)}
//             </h3>
//             <p className="metric-label">Avg Order Value</p>
//           </div>
//         </div>

//         <div className={`metric-card growth ${analytics.revenueGrowth < 0 ? 'negative' : ''}`}>
//           <div className="metric-content">
//             <span className="metric-icon">
//               {analytics.revenueGrowth >= 0 ? '📈' : '📉'}
//             </span>
//             <h3 className="metric-value">
//               {analytics.revenueGrowth.toFixed(1)}%
//             </h3>
//             <p className="metric-label">Revenue Growth</p>
//           </div>
//         </div>
//       </div>

//       {/* Charts Row 1 */}
//       <div className="charts-row-1">
//         <div className="chart-card">
//           <div className="chart-header">
//             <h5 className="chart-title">Revenue Trends</h5>
//           </div>
//           <div className="chart-content">
//             <ResponsiveContainer width="100%" height={320}>
//               <AreaChart data={analytics.dailyTrends}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis tickFormatter={formatNumber} />
//                 <Tooltip
//                   formatter={(value) => [formatCurrency(value), 'Revenue']}
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#0047ab"
//                   fill="#0047ab40"
//                   strokeWidth={3}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="chart-card">
//           <div className="chart-header">
//             <h5 className="chart-title">Order Status Distribution</h5>
//           </div>
//           <div className="chart-content">
//             <ResponsiveContainer width="100%" height={320}>
//               <PieChart>
//                 <Pie
//                   data={analytics.statusBreakdown}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={renderPieLabel}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="count"
//                 >
//                   {analytics.statusBreakdown.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   formatter={(value, name, props) => [
//                     `${value} orders (${((value / analytics.totalSales) * 100).toFixed(1)}%)`, 
//                     props.payload.status
//                   ]}
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Legend 
//                   formatter={(value, entry) => (
//                     <span style={{ color: '#495057' }}>
//                       {entry.payload.status}: {entry.payload.count} orders
//                     </span>
//                   )}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Charts Row 2 */}
//       <div className="charts-row-2">
//         <div className="chart-card">
//           <div className="chart-header">
//             <h5 className="chart-title">Top Products by Revenue</h5>
//           </div>
//           <div className="chart-content">
//             {analytics.topProducts.length > 0 ? (
//               <ResponsiveContainer width="100%" height={350}>
//                 <BarChart data={analytics.topProducts} layout="horizontal" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis 
//                     type="number" 
//                     tickFormatter={formatCurrency} 
//                     stroke="#6c757d"
//                   />
//                   <YAxis
//                     type="category"
//                     dataKey="name"
//                     width={140}
//                     tick={{ fontSize: 11, fill: '#6c757d' }}
//                     stroke="#6c757d"
//                   />
//                   <Tooltip
//                     formatter={(value, name) => [formatCurrency(value), 'Revenue']}
//                     labelFormatter={(label) => `Product: ${label}`}
//                     contentStyle={{
//                       backgroundColor: 'white',
//                       border: '1px solid #e5e7eb',
//                       borderRadius: '8px',
//                       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
//                     }}
//                   />
//                   <Bar 
//                     dataKey="revenue" 
//                     fill="#0047ab" 
//                     radius={[0, 4, 4, 0]}
//                     stroke="#003580"
//                     strokeWidth={1}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 alignItems: 'center', 
//                 height: '350px',
//                 color: '#6c757d',
//                 flexDirection: 'column'
//               }}>
//                 <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
//                 <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>No Product Data Available</h4>
//                 <p style={{ margin: 0, textAlign: 'center' }}>
//                   Product sales data will appear here once orders with cart items are processed.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="chart-card">
//           <div className="chart-header">
//             <h5 className="chart-title">Monthly Performance</h5>
//           </div>
//           <div className="chart-content">
//             <ResponsiveContainer width="100%" height={350}>
//               <LineChart data={analytics.monthlyTrends}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis tickFormatter={formatNumber} />
//                 <Tooltip
//                   formatter={(value, name) => [
//                     name === 'revenue' ? formatCurrency(value) : value,
//                     name === 'revenue' ? 'Revenue' : 'Sales Count'
//                   ]}
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#0047ab"
//                   strokeWidth={3}
//                   dot={{ fill: '#0047ab', strokeWidth: 2, r: 4 }}
//                   name="Revenue"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="sales"
//                   stroke="#10b981"
//                   strokeWidth={3}
//                   dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
//                   name="Sales Count"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesAnalytics;


// import React, { useState, useEffect, useCallback } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
// import './styles/AdminSalesAnalyticsPage.css';

// const SalesAnalytics = () => {
//     const [salesData, setSalesData] = useState([]);
//     const [ordersData, setOrdersData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [dateRange, setDateRange] = useState('30');
//     const [analytics, setAnalytics] = useState({
//         totalRevenue: 0,
//         totalSales: 0,
//         averageOrderValue: 0,
//         topProducts: [],
//         dailyTrends: [],
//         monthlyTrends: [],
//         statusBreakdown: [],
//         revenueGrowth: 0
//     });

//     // Real authentication state
//     const [loggedInUserRole, setLoggedInUserRole] = useState('');
//     const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

//     // Brand colors for charts
//     const colors = ['#0047ab', '#fc7f10', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#336cc7', '#fd9843'];

//     // Authentication handling
//     const handleAuthError = useCallback((errMessage) => {
//         setError(errMessage);
//         console.error('Authentication error:', errMessage);
//     }, []);

//     // Initialize authentication
//     useEffect(() => {
//         const token = sessionStorage.getItem('token');
//         if (token) {
//             try {
//                 const decodedToken = JSON.parse(atob(token.split('.')[1]));
//                 setLoggedInUserRole(decodedToken.user_type || '');
//             } catch (err) {
//                 console.error('Failed to decode token:', err);
//                 handleAuthError('Invalid or expired token. Please log in again.');
//             }
//         } else {
//             handleAuthError('Authentication token missing. Please log in.');
//         }
//     }, [handleAuthError]);

//     const processAnalytics = useCallback(() => {
//         if (!salesData.length && !ordersData.length) {
//             setAnalytics({
//                 totalRevenue: 0,
//                 totalSales: 0,
//                 averageOrderValue: 0,
//                 topProducts: [],
//                 dailyTrends: [],
//                 monthlyTrends: [],
//                 statusBreakdown: [],
//                 revenueGrowth: 0
//             });
//             return;
//         }

//         // Calculate basic metrics from sales data
//         const totalRevenue = salesData.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
//         const totalSales = salesData.length;
//         const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

//         // Process daily trends
//         const dailyTrends = processDailyTrends(salesData);
        
//         // Process monthly trends
//         const monthlyTrends = processMonthlyTrends(salesData);

//         // Process order status breakdown
//         const statusBreakdown = processStatusBreakdown(ordersData);

//         // Process top products from orders (more reliable)
//         const topProducts = processTopProducts(ordersData);

//         // Calculate revenue growth
//         const revenueGrowth = calculateGrowthRate(dailyTrends);

//         setAnalytics({
//             totalRevenue,
//             totalSales,
//             averageOrderValue,
//             topProducts,
//             dailyTrends,
//             monthlyTrends,
//             statusBreakdown,
//             revenueGrowth
//         });
//     }, [salesData, ordersData, dateRange]);

//     const processDailyTrends = (sales) => {
//         const trends = {};
        
//         sales.forEach(sale => {
//             const saleDate = sale.sale_date || sale.created_at;
//             if (!saleDate) return;
            
//             const date = new Date(saleDate).toISOString().split('T')[0];
//             if (!trends[date]) {
//                 trends[date] = { date: date.slice(5), revenue: 0, sales: 0 };
//             }
//             trends[date].revenue += parseFloat(sale.amount || 0);
//             trends[date].sales += 1;
//         });

//         const cutoffDate = new Date();
//         cutoffDate.setDate(cutoffDate.getDate() - parseInt(dateRange));
        
//         return Object.values(trends)
//             .filter(trend => {
//                 const trendDate = new Date(`2024-${trend.date}`);
//                 return trendDate >= cutoffDate;
//             })
//             .sort((a, b) => new Date(`2024-${a.date}`) - new Date(`2024-${b.date}`));
//     };

//     const processMonthlyTrends = (sales) => {
//         const trends = {};
        
//         sales.forEach(sale => {
//             const saleDate = sale.sale_date || sale.created_at;
//             if (!saleDate) return;
            
//             const date = new Date(saleDate);
//             const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
//             if (!trends[monthKey]) {
//                 trends[monthKey] = { month: monthKey.slice(5), revenue: 0, sales: 0 };
//             }
//             trends[monthKey].revenue += parseFloat(sale.amount || 0);
//             trends[monthKey].sales += 1;
//         });

//         return Object.values(trends)
//             .sort((a, b) => a.month.localeCompare(b.month))
//             .slice(-12);
//     };

//     const processStatusBreakdown = (orders) => {
//         const statusCount = {};
        
//         orders.forEach(order => {
//             const status = order.status || 'pending';
//             statusCount[status] = (statusCount[status] || 0) + 1;
//         });

//         return Object.entries(statusCount).map(([status, count]) => ({
//             status: status.charAt(0).toUpperCase() + status.slice(1),
//             count,
//             value: count
//         }));
//     };

//     const processTopProducts = (orders) => {
//         const productSales = {};
        
//         orders.forEach(order => {
//             if (order.cart && Array.isArray(order.cart)) {
//                 order.cart.forEach(item => {
//                     const productName = item.product_name || item.name || 'Unknown Product';
//                     const price = parseFloat(item.price) || parseFloat(item.unit_price) || 0;
//                     const quantity = parseInt(item.quantity) || 0;
                    
//                     if (productName && price > 0 && quantity > 0) {
//                         if (!productSales[productName]) {
//                             productSales[productName] = {
//                                 name: productName.length > 20 ? productName.substring(0, 20) + '...' : productName,
//                                 fullName: productName,
//                                 revenue: 0,
//                                 quantity: 0
//                             };
//                         }
//                         productSales[productName].revenue += price * quantity;
//                         productSales[productName].quantity += quantity;
//                     }
//                 });
//             }
//         });
        
//         const topProducts = Object.values(productSales)
//             .sort((a, b) => b.revenue - a.revenue)
//             .slice(0, 8);
            
//         return topProducts;
//     };

//     const calculateGrowthRate = (dailyTrends) => {
//         if (dailyTrends.length < 14) return 0;
        
//         const firstWeek = dailyTrends.slice(0, 7).reduce((sum, day) => sum + day.revenue, 0);
//         const lastWeek = dailyTrends.slice(-7).reduce((sum, day) => sum + day.revenue, 0);
        
//         if (firstWeek === 0) return 0;
//         return ((lastWeek - firstWeek) / firstWeek) * 100;
//     };

//     // Fetch real data from your backend
// const fetchSalesData = useCallback(async () => {
//     if (!loggedInUserRole || (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin')) {
//         handleAuthError('You do not have permission to view this page.');
//         return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//         const token = sessionStorage.getItem('token');
//         if (!token) {
//             handleAuthError('Authentication token missing. Please log in.');
//             return;
//         }

//         // Updated fetch for sales analytics
//         const salesResponse = await fetch(`${API_BASE_URL}/sales?all_sales=true`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//         });

//         // The orders response is fine as it is, as long as it fetches all orders
//         const ordersResponse = await fetch(`${API_BASE_URL}/orders/admin?per_page=1000`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//         });

//         if (!salesResponse.ok) {
//             const salesError = await salesResponse.json();
//             if (salesResponse.status === 401 || salesResponse.status === 403) {
//                 handleAuthError(salesError.error || 'Authentication failed. Please log in again.');
//                 return;
//             }
//             throw new Error(salesError.error || 'Failed to fetch sales data');
//         }

//         if (!ordersResponse.ok) {
//             const ordersError = await ordersResponse.json();
//             if (ordersResponse.status === 401 || ordersResponse.status === 403) {
//                 handleAuthError(ordersError.error || 'Authentication failed. Please log in again.');
//                 return;
//             }
//             throw new Error(ordersError.error || 'Failed to fetch orders data');
//         }

//         const salesJson = await salesResponse.json();
//         const ordersJson = await ordersResponse.json();

//         setSalesData(salesJson.sales || []);
//         setOrdersData(ordersJson.orders || []);

//     } catch (err) {
//         console.error('Error fetching analytics data:', err);
//         setError(err.message);
//     } finally {
//         setLoading(false);
//     }
// }, [loggedInUserRole, handleAuthError]);

//     // Trigger data fetch when dependencies change
//     useEffect(() => {
//         if (loggedInUserRole) {
//             fetchSalesData();
//         }
//     }, [fetchSalesData, loggedInUserRole]);

//     // Process analytics data whenever sales or orders data changes
//     useEffect(() => {
//         if (!loading) {
//             processAnalytics();
//         }
//     }, [loading, processAnalytics]);

//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat('en-UG', {
//             style: 'currency',
//             currency: 'UGX',
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0
//         }).format(amount);
//     };

//     const formatNumber = (num) => {
//         if (num >= 1000000) {
//             return (num / 1000000).toFixed(1) + 'M';
//         }
//         if (num >= 1000) {
//             return (num / 1000).toFixed(1) + 'K';
//         }
//         return num.toString();
//     };

//     // Custom label formatter for pie chart
//     const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, status }) => {
//         if (percent < 0.05) return null;
        
//         const RADIAN = Math.PI / 180;
//         const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//         const x = cx + radius * Math.cos(-midAngle * RADIAN);
//         const y = cy + radius * Math.sin(-midAngle * RADIAN);

//         return (
//             <text 
//                 x={x} 
//                 y={y} 
//                 fill="white" 
//                 textAnchor={x > cx ? 'start' : 'end'} 
//                 dominantBaseline="central"
//                 fontSize="12"
//                 fontWeight="500"
//             >
//                 {`${(percent * 100).toFixed(0)}%`}
//             </text>
//         );
//     };

//     if (loading) {
//         return (
//             <div className="loading-container">
//                 <div className="loading-content">
//                     <div className="loading-spinner"></div>
//                     <h3 className="loading-title">Loading Analytics...</h3>
//                     <p className="loading-subtitle">Processing your sales data</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="error-container">
//                 <h3 className="error-title">Error Loading Analytics</h3>
//                 <p className="error-message">{error}</p>
//                 <button
//                     className="error-button"
//                     onClick={() => window.location.reload()}
//                 >
//                     Try Again
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="sales-analytics">
//             {/* Header */}
//             <div className="header-section">
//                 <div className="header-content">
//                     <h1>📊 Sales Analytics</h1>
//                     <p>Comprehensive insights into your sales performance</p>
//                 </div>
//                 <div className="header-controls">
//                     <button
//                         className="refresh-button"
//                         onClick={fetchSalesData}
//                         disabled={loading}
//                     >
//                         {loading ? 'Loading...' : 'Refresh Data'}
//                     </button>
//                     <span className="date-icon">📅</span>
//                     <select
//                         className="date-select"
//                         value={dateRange}
//                         onChange={(e) => setDateRange(e.target.value)}
//                     >
//                         <option value="7">Last 7 days</option>
//                         <option value="30">Last 30 days</option>
//                         <option value="60">Last 60 days</option>
//                         <option value="90">Last 90 days</option>
//                     </select>
//                 </div>
//             </div>

//             {/* Key Metrics Cards */}
//             <div className="metrics-grid">
//                 <div className="metric-card revenue">
//                     <div className="metric-content">
//                         <span className="metric-icon">💰</span>
//                         <h3 className="metric-value">
//                             {formatCurrency(analytics.totalRevenue)}
//                         </h3>
//                         <p className="metric-label">Total Revenue</p>
//                     </div>
//                 </div>

//                 <div className="metric-card sales">
//                     <div className="metric-content">
//                         <span className="metric-icon">🛒</span>
//                         <h3 className="metric-value">
//                             {analytics.totalSales}
//                         </h3>
//                         <p className="metric-label">Total Sales</p>
//                     </div>
//                 </div>

//                 <div className="metric-card average">
//                     <div className="metric-content">
//                         <span className="metric-icon">📈</span>
//                         <h3 className="metric-value">
//                             {formatCurrency(analytics.averageOrderValue)}
//                         </h3>
//                         <p className="metric-label">Avg Order Value</p>
//                     </div>
//                 </div>

//                 <div className={`metric-card growth ${analytics.revenueGrowth < 0 ? 'negative' : ''}`}>
//                     <div className="metric-content">
//                         <span className="metric-icon">
//                             {analytics.revenueGrowth >= 0 ? '📈' : '📉'}
//                         </span>
//                         <h3 className="metric-value">
//                             {analytics.revenueGrowth.toFixed(1)}%
//                         </h3>
//                         <p className="metric-label">Revenue Growth</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Charts Row 1 */}
//             <div className="charts-row-1">
//                 <div className="chart-card">
//                     <div className="chart-header">
//                         <h5 className="chart-title">Revenue Trends</h5>
//                     </div>
//                     <div className="chart-content">
//                         <ResponsiveContainer width="100%" height={320}>
//                             <AreaChart data={analytics.dailyTrends}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="date" />
//                                 <YAxis tickFormatter={formatNumber} />
//                                 <Tooltip
//                                     formatter={(value) => [formatCurrency(value), 'Revenue']}
//                                     contentStyle={{
//                                         backgroundColor: 'white',
//                                         border: '1px solid #e5e7eb',
//                                         borderRadius: '8px'
//                                     }}
//                                 />
//                                 <Area
//                                     type="monotone"
//                                     dataKey="revenue"
//                                     stroke="#0047ab"
//                                     fill="#0047ab40"
//                                     strokeWidth={3}
//                                 />
//                             </AreaChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>

//                 <div className="chart-card">
//                     <div className="chart-header">
//                         <h5 className="chart-title">Order Status Distribution</h5>
//                     </div>
//                     <div className="chart-content">
//                         <ResponsiveContainer width="100%" height={320}>
//                             <PieChart>
//                                 <Pie
//                                     data={analytics.statusBreakdown}
//                                     cx="50%"
//                                     cy="50%"
//                                     labelLine={false}
//                                     label={renderPieLabel}
//                                     outerRadius={80}
//                                     fill="#8884d8"
//                                     dataKey="count"
//                                 >
//                                     {analytics.statusBreakdown.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip
//                                     formatter={(value, name, props) => [
//                                         `${value} orders (${((value / analytics.totalSales) * 100).toFixed(1)}%)`, 
//                                         props.payload.status
//                                     ]}
//                                     contentStyle={{
//                                         backgroundColor: 'white',
//                                         border: '1px solid #e5e7eb',
//                                         borderRadius: '8px'
//                                     }}
//                                 />
//                                 <Legend 
//                                     formatter={(value, entry) => (
//                                         <span style={{ color: '#495057' }}>
//                                             {entry.payload.status}: {entry.payload.count} orders
//                                         </span>
//                                     )}
//                                 />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>
//             </div>

//             {/* Charts Row 2 */}
//             <div className="charts-row-2">
//                 <div className="chart-card">
//                     <div className="chart-header">
//                         <h5 className="chart-title">Top Products by Revenue</h5>
//                     </div>
//                     <div className="chart-content">
//                         {analytics.topProducts.length > 0 ? (
//                             <ResponsiveContainer width="100%" height={350}>
//                                 <BarChart data={analytics.topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
//                                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                                     <XAxis 
//                                         type="number" 
//                                         tickFormatter={formatCurrency} 
//                                         stroke="#6c757d"
//                                     />
//                                     <YAxis
//                                         type="category"
//                                         dataKey="name"
//                                         width={140}
//                                         tick={{ fontSize: 11, fill: '#6c757d' }}
//                                         stroke="#6c757d"
//                                     />
//                                     <Tooltip
//                                         formatter={(value, name) => [formatCurrency(value), 'Revenue']}
//                                         labelFormatter={(label) => `Product: ${label}`}
//                                         contentStyle={{
//                                             backgroundColor: 'white',
//                                             border: '1px solid #e5e7eb',
//                                             borderRadius: '8px',
//                                             boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
//                                         }}
//                                     />
//                                     <Bar 
//                                         dataKey="revenue" 
//                                         fill="#0047ab" 
//                                         radius={[0, 4, 4, 0]}
//                                         stroke="#003580"
//                                         strokeWidth={1}
//                                     />
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         ) : (
//                             <div style={{ 
//                                 display: 'flex', 
//                                 justifyContent: 'center', 
//                                 alignItems: 'center', 
//                                 height: '350px',
//                                 color: '#6c757d',
//                                 flexDirection: 'column'
//                             }}>
//                                 <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
//                                 <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>No Product Data Available</h4>
//                                 <p style={{ margin: 0, textAlign: 'center' }}>
//                                     Product sales data will appear here once orders with cart items are processed.
//                                 </p>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div className="chart-card">
//                     <div className="chart-header">
//                         <h5 className="chart-title">Monthly Performance</h5>
//                     </div>
//                     <div className="chart-content">
//                         <ResponsiveContainer width="100%" height={350}>
//                             <LineChart data={analytics.monthlyTrends}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="month" />
//                                 <YAxis tickFormatter={formatNumber} />
//                                 <Tooltip
//                                     formatter={(value, name) => [
//                                         name === 'revenue' ? formatCurrency(value) : value,
//                                         name === 'revenue' ? 'Revenue' : 'Sales Count'
//                                     ]}
//                                     contentStyle={{
//                                         backgroundColor: 'white',
//                                         border: '1px solid #e5e7eb',
//                                         borderRadius: '8px'
//                                     }}
//                                 />
//                                 <Legend />
//                                 <Line
//                                     type="monotone"
//                                     dataKey="revenue"
//                                     stroke="#0047ab"
//                                     strokeWidth={3}
//                                     dot={{ fill: '#0047ab', strokeWidth: 2, r: 4 }}
//                                     name="Revenue"
//                                 />
//                                 <Line
//                                     type="monotone"
//                                     dataKey="sales"
//                                     stroke="#10b981"
//                                     strokeWidth={3}
//                                     dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
//                                     name="Sales Count"
//                                 />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SalesAnalytics;



import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const SalesAnalytics = () => {
    const [salesData, setSalesData] = useState([]);
    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState('30');
    const [analytics, setAnalytics] = useState({
        totalRevenue: 0,
        totalSales: 0,
        averageOrderValue: 0,
        topProducts: [],
        dailyTrends: [],
        monthlyTrends: [],
        statusBreakdown: [],
        revenueGrowth: 0
    });

    // Real authentication state
    const [loggedInUserRole, setLoggedInUserRole] = useState('');
    const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

    // Brand colors for charts
    const colors = ['#0047ab', '#fc7f10', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#336cc7', '#fd9843'];

    // Authentication handling
    const handleAuthError = useCallback((errMessage) => {
        setError(errMessage);
        console.error('Authentication error:', errMessage);
    }, []);

    // Initialize authentication
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setLoggedInUserRole(decodedToken.user_type || '');
            } catch (err) {
                console.error('Failed to decode token:', err);
                handleAuthError('Invalid or expired token. Please log in again.');
            }
        } else {
            handleAuthError('Authentication token missing. Please log in.');
        }
    }, [handleAuthError]);

    const processAnalytics = useCallback(() => {
        if (!salesData.length && !ordersData.length) {
            setAnalytics({
                totalRevenue: 0,
                totalSales: 0,
                averageOrderValue: 0,
                topProducts: [],
                dailyTrends: [],
                monthlyTrends: [],
                statusBreakdown: [],
                revenueGrowth: 0
            });
            return;
        }

        // Calculate basic metrics from sales data
        const totalRevenue = salesData.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const totalSales = salesData.length;
        const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

        // Process daily trends
        const dailyTrends = processDailyTrends(salesData);
        
        // Process monthly trends
        const monthlyTrends = processMonthlyTrends(salesData);

        // Process order status breakdown
        const statusBreakdown = processStatusBreakdown(ordersData);

        // Process top products from orders (more reliable)
        const topProducts = processTopProducts(ordersData);

        // Calculate revenue growth
        const revenueGrowth = calculateGrowthRate(dailyTrends);

        setAnalytics({
            totalRevenue,
            totalSales,
            averageOrderValue,
            topProducts,
            dailyTrends,
            monthlyTrends,
            statusBreakdown,
            revenueGrowth
        });
    }, [salesData, ordersData, dateRange]);

    const processDailyTrends = (sales) => {
        const trends = {};
        
        sales.forEach(sale => {
            const saleDate = sale.sale_date || sale.created_at;
            if (!saleDate) return;
            
            const date = new Date(saleDate).toISOString().split('T')[0];
            if (!trends[date]) {
                // Storing the full date string as `fullDate` for proper comparison
                trends[date] = { date: date.slice(5), fullDate: date, revenue: 0, sales: 0 };
            }
            trends[date].revenue += parseFloat(sale.amount || 0);
            trends[date].sales += 1;
        });

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(dateRange));
        
        return Object.values(trends)
            .filter(trend => {
                // Use the full date string for accurate comparison
                return new Date(trend.fullDate) >= cutoffDate;
            })
            .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
    };

    const processMonthlyTrends = (sales) => {
        const trends = {};
        
        sales.forEach(sale => {
            const saleDate = sale.sale_date || sale.created_at;
            if (!saleDate) return;
            
            const date = new Date(saleDate);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!trends[monthKey]) {
                trends[monthKey] = { month: monthKey.slice(5), revenue: 0, sales: 0 };
            }
            trends[monthKey].revenue += parseFloat(sale.amount || 0);
            trends[monthKey].sales += 1;
        });

        return Object.values(trends)
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-12);
    };

    const processStatusBreakdown = (orders) => {
        const statusCount = {};
        
        orders.forEach(order => {
            const status = order.status || 'pending';
            statusCount[status] = (statusCount[status] || 0) + 1;
        });

        return Object.entries(statusCount).map(([status, count]) => ({
            status: status.charAt(0).toUpperCase() + status.slice(1),
            count,
            value: count
        }));
    };

    const processTopProducts = (orders) => {
        const productSales = {};
        
        orders.forEach(order => {
            if (order.cart && Array.isArray(order.cart)) {
                order.cart.forEach(item => {
                    const productName = item.product_name || item.name || 'Unknown Product';
                    const price = parseFloat(item.price) || parseFloat(item.unit_price) || 0;
                    const quantity = parseInt(item.quantity) || 0;
                    
                    if (productName && price > 0 && quantity > 0) {
                        if (!productSales[productName]) {
                            productSales[productName] = {
                                name: productName.length > 20 ? productName.substring(0, 20) + '...' : productName,
                                fullName: productName,
                                revenue: 0,
                                quantity: 0
                            };
                        }
                        productSales[productName].revenue += price * quantity;
                        productSales[productName].quantity += quantity;
                    }
                });
            }
        });
        
        const topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 8);
            
        return topProducts;
    };

    const calculateGrowthRate = (dailyTrends) => {
        if (dailyTrends.length < 14) return 0;
        
        const firstWeek = dailyTrends.slice(0, 7).reduce((sum, day) => sum + day.revenue, 0);
        const lastWeek = dailyTrends.slice(-7).reduce((sum, day) => sum + day.revenue, 0);
        
        if (firstWeek === 0) return 0;
        return ((lastWeek - firstWeek) / firstWeek) * 100;
    };

    // Fetch real data from your backend
const fetchSalesData = useCallback(async () => {
    if (!loggedInUserRole || (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin')) {
        handleAuthError('You do not have permission to view this page.');
        return;
    }

    setLoading(true);
    setError(null);

    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            handleAuthError('Authentication token missing. Please log in.');
            return;
        }

        // Updated fetch for sales analytics
        const salesResponse = await fetch(`${API_BASE_URL}/sales?all_sales=true`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // The orders response is fine as it is, as long as it fetches all orders
        const ordersResponse = await fetch(`${API_BASE_URL}/orders/admin?per_page=1000`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!salesResponse.ok) {
            const salesError = await salesResponse.json();
            if (salesResponse.status === 401 || salesResponse.status === 403) {
                handleAuthError(salesError.error || 'Authentication failed. Please log in again.');
                return;
            }
            throw new Error(salesError.error || 'Failed to fetch sales data');
        }

        if (!ordersResponse.ok) {
            const ordersError = await ordersResponse.json();
            if (ordersResponse.status === 401 || ordersResponse.status === 403) {
                handleAuthError(ordersError.error || 'Authentication failed. Please log in again.');
                return;
            }
            throw new Error(ordersError.error || 'Failed to fetch orders data');
        }

        const salesJson = await salesResponse.json();
        const ordersJson = await ordersResponse.json();

        setSalesData(salesJson.sales || []);
        setOrdersData(ordersJson.orders || []);

    } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
}, [loggedInUserRole, handleAuthError]);

    // Trigger data fetch when dependencies change
    useEffect(() => {
        if (loggedInUserRole) {
            fetchSalesData();
        }
    }, [fetchSalesData, loggedInUserRole]);

    // Process analytics data whenever sales or orders data changes
    useEffect(() => {
        if (!loading) {
            processAnalytics();
        }
    }, [loading, processAnalytics]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-UG', {
            style: 'currency',
            currency: 'UGX',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    // Custom label formatter for pie chart
    const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, status }) => {
        if (percent < 0.05) return null;
        
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                fontSize="12"
                fontWeight="500"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <h3 className="loading-title">Loading Analytics...</h3>
                    <p className="loading-subtitle">Processing your sales data</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h3 className="error-title">Error Loading Analytics</h3>
                <p className="error-message">{error}</p>
                <button
                    className="error-button"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="sales-analytics">
            {/* Header */}
            <div className="header-section">
                <div className="header-content">
                    <h1>📊 Sales Analytics</h1>
                    <p>Comprehensive insights into your sales performance</p>
                </div>
                <div className="header-controls">
                    <button
                        className="refresh-button"
                        onClick={fetchSalesData}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Refresh Data'}
                    </button>
                    <span className="date-icon">📅</span>
                    <select
                        className="date-select"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="60">Last 60 days</option>
                        <option value="90">Last 90 days</option>
                    </select>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="metrics-grid">
                <div className="metric-card revenue">
                    <div className="metric-content">
                        <span className="metric-icon">💰</span>
                        <h3 className="metric-value">
                            {formatCurrency(analytics.totalRevenue)}
                        </h3>
                        <p className="metric-label">Total Revenue</p>
                    </div>
                </div>

                <div className="metric-card sales">
                    <div className="metric-content">
                        <span className="metric-icon">🛒</span>
                        <h3 className="metric-value">
                            {analytics.totalSales}
                        </h3>
                        <p className="metric-label">Total Sales</p>
                    </div>
                </div>

                <div className="metric-card average">
                    <div className="metric-content">
                        <span className="metric-icon">📈</span>
                        <h3 className="metric-value">
                            {formatCurrency(analytics.averageOrderValue)}
                        </h3>
                        <p className="metric-label">Avg Order Value</p>
                    </div>
                </div>

                <div className={`metric-card growth ${analytics.revenueGrowth < 0 ? 'negative' : ''}`}>
                    <div className="metric-content">
                        <span className="metric-icon">
                            {analytics.revenueGrowth >= 0 ? '📈' : '📉'}
                        </span>
                        <h3 className="metric-value">
                            {analytics.revenueGrowth.toFixed(1)}%
                        </h3>
                        <p className="metric-label">Revenue Growth</p>
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="charts-row-1">
                <div className="chart-card">
                    <div className="chart-header">
                        <h5 className="chart-title">Revenue Trends</h5>
                    </div>
                    <div className="chart-content">
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={analytics.dailyTrends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={formatNumber} />
                                <Tooltip
                                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#0047ab"
                                    fill="#0047ab40"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <h5 className="chart-title">Order Status Distribution</h5>
                    </div>
                    <div className="chart-content">
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={analytics.statusBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderPieLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {analytics.statusBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name, props) => [
                                        `${value} orders (${((value / analytics.totalSales) * 100).toFixed(1)}%)`, 
                                        props.payload.status
                                    ]}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend 
                                    formatter={(value, entry) => (
                                        <span style={{ color: '#495057' }}>
                                            {entry.payload.status}: {entry.payload.count} orders
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="charts-row-2">
                <div className="chart-card">
                    <div className="chart-header">
                        <h5 className="chart-title">Top Products by Revenue</h5>
                    </div>
                    <div className="chart-content">
                        {analytics.topProducts.length > 0 ? (
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={analytics.topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis 
                                        type="number" 
                                        tickFormatter={formatCurrency} 
                                        stroke="#6c757d"
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        width={140}
                                        tick={{ fontSize: 11, fill: '#6c757d' }}
                                        stroke="#6c757d"
                                    />
                                    <Tooltip
                                        formatter={(value, name) => [formatCurrency(value), 'Revenue']}
                                        labelFormatter={(label) => `Product: ${label}`}
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Bar 
                                        dataKey="revenue" 
                                        fill="#0047ab" 
                                        radius={[0, 4, 4, 0]}
                                        stroke="#003580"
                                        strokeWidth={1}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                height: '350px',
                                color: '#6c757d',
                                flexDirection: 'column'
                            }}>
                                <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
                                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>No Product Data Available</h4>
                                <p style={{ margin: 0, textAlign: 'center' }}>
                                    Product sales data will appear here once orders with cart items are processed.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <h5 className="chart-title">Monthly Performance</h5>
                    </div>
                    <div className="chart-content">
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={analytics.monthlyTrends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis tickFormatter={formatNumber} />
                                <Tooltip
                                    formatter={(value, name) => [
                                        name === 'revenue' ? formatCurrency(value) : value,
                                        name === 'revenue' ? 'Revenue' : 'Sales Count'
                                    ]}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#0047ab"
                                    strokeWidth={3}
                                    dot={{ fill: '#0047ab', strokeWidth: 2, r: 4 }}
                                    name="Revenue"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                                    name="Sales Count"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesAnalytics;
