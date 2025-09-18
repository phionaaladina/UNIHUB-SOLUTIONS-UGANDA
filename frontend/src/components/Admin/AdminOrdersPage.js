// // src/components/Admin/AdminOrdersPage.js
// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Modal, Form, Spinner, Alert, Pagination, InputGroup } from 'react-bootstrap';
// import { jwtDecode } from 'jwt-decode'; // For client-side role check
// import { useNavigate } from 'react-router-dom'; // <--- Import useNavigate
// import { toast } from 'react-toastify'; // Import toast for notifications

// const AdminOrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // State for view/edit modal
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [currentOrder, setCurrentOrder] = useState(null); // Order being viewed/edited

//   // State for status update form
//   const [newOrderStatus, setNewOrderStatus] = useState('');

//   // State for pagination and search
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalOrders, setTotalOrders] = useState(0); // New: total count for display
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchTimeout, setSearchTimeout] = useState(null); // For debounced search

//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const [loggedInUserId, setLoggedInUserId] = useState(null);

//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
//   const navigate = useNavigate(); // <--- Initialize useNavigate

//   // Helper function to handle unauthorized errors and redirect
//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     sessionStorage.removeItem('token'); // <--- Clear the token from sessionStorage
//     navigate('/login'); // Redirect to login page
//   }, [navigate]);

//   // --- Determine Logged-in User's Role and ID ---
//   useEffect(() => {
//     const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setLoggedInUserRole(decodedToken.user_type || '');
//         setLoggedInUserId(decodedToken.sub);
//         setLoading(false); // Authentication check done, stop loading if token found
//       } catch (err) {
//         console.error("Failed to decode token:", err);
//         setLoggedInUserRole('');
//         setLoggedInUserId(null);
//         handleAuthError("Invalid or expired token. Please log in again."); // <--- Use helper
//       }
//     } else {
//       handleAuthError("Authentication token missing. Please log in to view this page."); // <--- Use helper
//     }
//   }, [handleAuthError]); // Add handleAuthError to dependencies

//   // --- Fetch Orders ---
//   const fetchOrders = useCallback(async () => {
//     // Only fetch if role is determined and it's an admin/super_admin
//     if (!loggedInUserRole) {
//       // If role isn't determined yet, wait for the useEffect above to set it.
//       // Or if it's determined but not admin/super_admin, handleAuthError would have been called.
//       return;
//     }

//     if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
//       handleAuthError("You do not have permission to view this page."); // <--- Use helper
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
//       if (!token) {
//         handleAuthError("Authentication token missing. Please log in."); // <--- Use helper
//         return;
//       }

//       const params = new URLSearchParams({
//         page: currentPage,
//         per_page: 10, // You can adjust per_page
//         search: searchQuery
//       });

//       const response = await fetch(`${API_BASE_URL}/orders/admin?${params.toString()}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) { // Check for Unauthorized or Forbidden
//           handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again."); // <--- Use helper
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to fetch orders.');
//       }

//       const data = await response.json();
//       setOrders(data.orders || []);
//       setTotalPages(data.pages || 1);
//       setTotalOrders(data.total_orders || 0);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, loggedInUserRole, handleAuthError]); // Re-fetch when page, search query, user role, or auth error handler changes

//   useEffect(() => {
//     // Trigger fetch only after loggedInUserRole is determined
//     if (loggedInUserRole) {
//       fetchOrders();
//     }
//   }, [fetchOrders, loggedInUserRole]); // Initial fetch and re-fetch when fetchOrders useCallback changes

//   // --- Handle Order View/Edit Click ---
//   const handleViewEditClick = (order) => {
//     setCurrentOrder(order);
//     setNewOrderStatus(order.status); // Pre-fill status for edit
//     setShowOrderModal(true);
//   };

//   // --- Handle Status Update ---
//   const handleUpdateStatus = async () => {
//     if (!currentOrder || !newOrderStatus) {
//       toast.error("No order selected or status not set."); // Changed alert to toast
//       return;
//     }

//     setLoading(true); // Indicate that an operation is ongoing
//     try {
//       const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
//       if (!token) {
//         handleAuthError("Authentication token missing. Please log in."); // <--- Use helper
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/orders/admin/${currentOrder.order_id}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ status: newOrderStatus })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) { // Check for Unauthorized or Forbidden
//           handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again."); // <--- Use helper
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to update order status.');
//       }

//       toast.success('Order status updated successfully!'); // Changed alert to toast
//       setShowOrderModal(false);
//       fetchOrders(); // Refresh order list
//     } catch (err) {
//       console.error("Error updating order status:", err);
//       setError(err.message); // Display error on the page
//       toast.error(`Error updating status: ${err.message}`); // Changed alert to toast
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Handle Order Deletion ---
//   const handleDeleteOrder = async (orderId) => {
//     if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
//       if (!token) {
//         handleAuthError("Authentication token missing. Please log in."); // <--- Use helper
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/orders/admin/${orderId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) { // Check for Unauthorized or Forbidden
//           handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again."); // <--- Use helper
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to delete order.');
//       }

//       toast.success('Order deleted successfully!'); // Changed alert to toast
//       fetchOrders(); // Refresh order list
//     } catch (err) {
//       console.error("Error deleting order:", err);
//       setError(err.message);
//       toast.error(`Error deleting order: ${err.message}`); // Changed alert to toast
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Pagination Handlers ---
//   const handlePageChange = (pageNumber) => {
//     if (pageNumber > 0 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   // --- Search Handler with Debounce ---
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value); // Update immediately for input field feedback

//     // Clear previous timeout
//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }

//     // Set new timeout for fetching data
//     setSearchTimeout(
//       setTimeout(() => {
//         setCurrentPage(1); // Reset to first page on new search
//         // fetchOrders will be called due to searchQuery dependency in its useCallback
//       }, 500) // 500ms debounce
//     );
//   };

//   // Allowed statuses for admin update
//   const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

//   // --- Render ---
//   return (
//     <div className="container mt-4">
//       <h2>Orders Management</h2>

//       <div className="d-flex justify-content-between mb-3 align-items-center">
//         {/* Removed currency from Total Orders display */}
//         <h4>Total Orders: {totalOrders}</h4>
//         <InputGroup className="w-auto">
//           <Form.Control
//             type="text"
//             placeholder="Search by Order ID or User info..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             style={{ minWidth: '250px' }}
//           />
//           <Button variant="outline-secondary" onClick={() => {
//             setSearchQuery('');
//             setCurrentPage(1);
//           }}>Clear</Button>
//         </InputGroup>
//       </div>

//       {loading && !error && (
//         <div className="text-center my-4">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading orders...</span>
//           </Spinner>
//           <p className="mt-2">Loading orders...</p>
//         </div>
//       )}

//       {error && <Alert variant="danger">Error: {error}</Alert>}

//       {!loading && !error && orders.length === 0 && (
//         <Alert variant="info">No orders found. Adjust your search criteria.</Alert>
//       )}

//       {!loading && !error && orders.length > 0 && (
//         <>
//           <Table striped bordered hover responsive className="mt-3">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>User</th>
//                 <th>Total Amount</th>
//                 <th>Status</th>
//                 <th>Created At</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.order_id}>
//                   <td>{order.order_id}</td>
//                   <td>
//                     {order.user_details ? (
//                       <>
//                         {order.user_details.first_name} {order.user_details.last_name} ({order.user_details.email})
//                       </>
//                     ) : 'N/A'}
//                   </td>
//                   {/* Removed currency from Total Amount in table */}
//                   <td>{parseFloat(order.total_amount).toFixed(2)}</td>
//                   <td>{order.status}</td>
//                   <td>{new Date(order.created_at).toLocaleDateString()}</td>
//                   <td>
//                     <Button variant="info" size="sm" className="me-2" onClick={() => handleViewEditClick(order)}>
//                       Details / Update Status
//                     </Button>
//                     {(loggedInUserRole === 'super_admin') && ( // Only Super Admin can delete
//                       <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order.order_id)}>
//                         Delete
//                       </Button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           <Pagination className="justify-content-center mt-3">
//             <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
//             {[...Array(totalPages)].map((_, index) => (
//               <Pagination.Item
//                 key={index + 1}
//                 active={index + 1 === currentPage}
//                 onClick={() => handlePageChange(index + 1)}
//               >
//                 {index + 1}
//               </Pagination.Item>
//             ))}
//             <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
//           </Pagination>
//         </>
//       )}

//       {/* Order Details/Status Update Modal */}
//       <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Order Details (ID: {currentOrder?.order_id})</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {currentOrder && (
//             <>
//               <h5>Order Information</h5>
//               <p><strong>User:</strong> {currentOrder.user_details ? `${currentOrder.user_details.first_name} ${currentOrder.user_details.last_name} (${currentOrder.user_details.email})` : 'N/A'}</p>
//               {/* Removed currency from Total Amount in modal */}
//               <p><strong>Total Amount:</strong> {parseFloat(currentOrder.total_amount).toFixed(2)}</p>
//               <p><strong>Current Status:</strong> {currentOrder.status}</p>
//               <p><strong>Created At:</strong> {new Date(currentOrder.created_at).toLocaleString()}</p>
//               {currentOrder.updated_at && <p><strong>Last Updated:</strong> {new Date(currentOrder.updated_at).toLocaleString()}</p>}

//               <h5 className="mt-4">Order Items</h5>
//               {currentOrder.items && currentOrder.items.length > 0 ? (
//                 <Table striped bordered hover size="sm">
//                   <thead>
//                     <tr>
//                       <th>Product Name</th>
//                       <th>Quantity</th>
//                       <th>Price per item (at purchase)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentOrder.items.map((item, index) => (
//                       <tr key={index}>
//                         <td>
//                           {item.product_image_url && (
//                             <img src={item.product_image_url} alt={item.product_name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
//                           )}
//                           {item.product_name}
//                         </td>
//                         <td>{item.quantity}</td>
//                         {/* Removed currency from Price per item */}
//                         <td>{parseFloat(item.price_at_purchase).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               ) : (
//                 <p>No items found for this order.</p>
//               )}

//               <h5 className="mt-4">Update Order Status</h5>
//               <Form.Group className="mb-3">
//                 <Form.Label>New Status</Form.Label>
//                 <Form.Select
//                   value={newOrderStatus}
//                   onChange={(e) => setNewOrderStatus(e.target.value)}
//                   disabled={loading} // Disable while an update is in progress
//                 >
//                   {allowedStatuses.map(status => (
//                     <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleUpdateStatus} disabled={loading}>
//             {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Update Status'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminOrdersPage;









// // import React, { useState, useEffect, useCallback } from 'react';
// // import { Button, Table, Modal, Form, Spinner, Alert, Pagination, InputGroup } from 'react-bootstrap';
// // import { jwtDecode } from 'jwt-decode';

// // const AdminOrdersPage = () => {
// //   const [orders, setOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   // State for view/edit modal
// //   const [showOrderModal, setShowOrderModal] = useState(false);
// //   const [currentOrder, setCurrentOrder] = useState(null); // Order being viewed/edited

// //   // State for status update form
// //   const [newOrderStatus, setNewOrderStatus] = useState('');

// //   // State for pagination and search
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [totalOrders, setTotalOrders] = useState(0); // New: total count for display
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [searchTimeout, setSearchTimeout] = useState(null); // For debounced search

// //   const [loggedInUserRole, setLoggedInUserRole] = useState('');
// //   const [loggedInUserId, setLoggedInUserId] = useState(null);

// //   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

// //   // --- Determine Logged-in User's Role and ID ---
// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     if (token) {
// //       try {
// //         const decodedToken = jwtDecode(token);
// //         setLoggedInUserRole(decodedToken.user_type || '');
// //         setLoggedInUserId(decodedToken.sub);
// //       } catch (err) {
// //         console.error("Failed to decode token:", err);
// //         setError("Invalid or expired token. Please log in again.");
// //         setLoading(false);
// //       }
// //     } else {
// //       setError("Authentication token missing. Please log in.");
// //       setLoading(false);
// //     }
// //   }, []);

// //   // --- Fetch Orders ---
// //   const fetchOrders = useCallback(async () => {
// //     if (!loggedInUserRole) {
// //       // Don't fetch if role isn't determined yet (and prevent unauthorized access)
// //       return;
// //     }

// //     if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
// //       setError("You do not have permission to view this page.");
// //       setLoading(false);
// //       return;
// //     }

// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const token = localStorage.getItem('token');
// //       if (!token) {
// //         throw new Error("Authentication token missing. Please log in.");
// //       }

// //       const params = new URLSearchParams({
// //         page: currentPage,
// //         per_page: 10, // You can adjust per_page
// //         search: searchQuery
// //       });

// //       const response = await fetch(`${API_BASE_URL}/orders/admin?${params.toString()}`, {
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });

// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData.error || 'Failed to fetch orders.');
// //       }

// //       const data = await response.json();
// //       setOrders(data.orders || []);
// //       setTotalPages(data.pages || 1);
// //       setTotalOrders(data.total_orders || 0);
// //     } catch (err) {
// //       console.error("Error fetching orders:", err);
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [currentPage, searchQuery, loggedInUserRole]); // Re-fetch when page, search query, or user role changes

// //   useEffect(() => {
// //     fetchOrders();
// //   }, [fetchOrders]); // Initial fetch and re-fetch when fetchOrders useCallback changes

// //   // --- Handle Order View/Edit Click ---
// //   const handleViewEditClick = (order) => {
// //     setCurrentOrder(order);
// //     setNewOrderStatus(order.status); // Pre-fill status for edit
// //     setShowOrderModal(true);
// //   };

// //   // --- Handle Status Update ---
// //   const handleUpdateStatus = async () => {
// //     if (!currentOrder || !newOrderStatus) {
// //       alert("No order selected or status not set.");
// //       return;
// //     }

// //     setLoading(true); // Indicate that an operation is ongoing
// //     try {
// //       const token = localStorage.getItem('token');
// //       const response = await fetch(`${API_BASE_URL}/orders/admin/${currentOrder.order_id}/status`, {
// //         method: 'PATCH',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${token}`
// //         },
// //         body: JSON.stringify({ status: newOrderStatus })
// //       });

// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData.error || 'Failed to update order status.');
// //       }

// //       alert('Order status updated successfully!');
// //       setShowOrderModal(false);
// //       fetchOrders(); // Refresh order list
// //     } catch (err) {
// //       console.error("Error updating order status:", err);
// //       setError(err.message); // Display error on the page
// //       alert(`Error updating status: ${err.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // --- Handle Order Deletion ---
// //   const handleDeleteOrder = async (orderId) => {
// //     if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const token = localStorage.getItem('token');
// //       const response = await fetch(`${API_BASE_URL}/orders/admin/${orderId}`, {
// //         method: 'DELETE',
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });

// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData.error || 'Failed to delete order.');
// //       }

// //       alert('Order deleted successfully!');
// //       fetchOrders(); // Refresh order list
// //     } catch (err) {
// //       console.error("Error deleting order:", err);
// //       setError(err.message);
// //       alert(`Error deleting order: ${err.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // --- Pagination Handlers ---
// //   const handlePageChange = (pageNumber) => {
// //     if (pageNumber > 0 && pageNumber <= totalPages) {
// //       setCurrentPage(pageNumber);
// //     }
// //   };

// //   // --- Search Handler with Debounce ---
// //   const handleSearchChange = (e) => {
// //     const value = e.target.value;
// //     setSearchQuery(value); // Update immediately for input field feedback

// //     // Clear previous timeout
// //     if (searchTimeout) {
// //       clearTimeout(searchTimeout);
// //     }

// //     // Set new timeout for fetching data
// //     setSearchTimeout(
// //       setTimeout(() => {
// //         setCurrentPage(1); // Reset to first page on new search
// //         // fetchOrders will be called due to searchQuery dependency in its useCallback
// //       }, 500) // 500ms debounce
// //     );
// //   };

// //   // Allowed statuses for admin update
// //   const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// //   // --- Render ---
// //   return (
// //     <div className="container mt-4">
// //       <h2>Orders Management</h2>

// //       <div className="d-flex justify-content-between mb-3 align-items-center">
// //         <h4>Total Orders: {totalOrders}</h4>
// //         <InputGroup className="w-auto">
// //           <Form.Control
// //             type="text"
// //             placeholder="Search by Order ID or User info..."
// //             value={searchQuery}
// //             onChange={handleSearchChange}
// //             style={{ minWidth: '250px' }}
// //           />
// //           <Button variant="outline-secondary" onClick={() => {
// //             setSearchQuery('');
// //             setCurrentPage(1);
// //           }}>Clear</Button>
// //         </InputGroup>
// //       </div>

// //       {loading && !error && (
// //         <div className="text-center my-4">
// //           <Spinner animation="border" role="status">
// //             <span className="visually-hidden">Loading orders...</span>
// //           </Spinner>
// //           <p className="mt-2">Loading orders...</p>
// //         </div>
// //       )}

// //       {error && <Alert variant="danger">Error: {error}</Alert>}

// //       {!loading && !error && orders.length === 0 && (
// //         <Alert variant="info">No orders found. Adjust your search criteria.</Alert>
// //       )}

// //       {!loading && !error && orders.length > 0 && (
// //         <>
// //           <Table striped bordered hover responsive className="mt-3">
// //             <thead>
// //               <tr>
// //                 <th>Order ID</th>
// //                 <th>User</th>
// //                 <th>Total Amount</th>
// //                 <th>Status</th>
// //                 <th>Created At</th>
// //                 <th>Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {orders.map((order) => (
// //                 <tr key={order.order_id}>
// //                   <td>{order.order_id}</td>
// //                   <td>
// //                     {order.user_details ? (
// //                       <>
// //                         {order.user_details.first_name} {order.user_details.last_name} ({order.user_details.email})
// //                       </>
// //                     ) : 'N/A'}
// //                   </td>
// //                   <td>${order.total_amount}</td>
// //                   <td>{order.status}</td>
// //                   <td>{new Date(order.created_at).toLocaleDateString()}</td>
// //                   <td>
// //                     <Button variant="info" size="sm" className="me-2" onClick={() => handleViewEditClick(order)}>
// //                       Details / Update Status
// //                     </Button>
// //                     {(loggedInUserRole === 'super_admin') && ( // Only Super Admin can delete
// //                       <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order.order_id)}>
// //                         Delete
// //                       </Button>
// //                     )}
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </Table>

// //           <Pagination className="justify-content-center mt-3">
// //             <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
// //             {[...Array(totalPages)].map((_, index) => (
// //               <Pagination.Item
// //                 key={index + 1}
// //                 active={index + 1 === currentPage}
// //                 onClick={() => handlePageChange(index + 1)}
// //               >
// //                 {index + 1}
// //               </Pagination.Item>
// //             ))}
// //             <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
// //           </Pagination>
// //         </>
// //       )}

// //       {/* Order Details/Status Update Modal */}
// //       <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
// //         <Modal.Header closeButton>
// //           <Modal.Title>Order Details (ID: {currentOrder?.order_id})</Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           {currentOrder && (
// //             <>
// //               <h5>Order Information</h5>
// //               <p><strong>User:</strong> {currentOrder.user_details ? `${currentOrder.user_details.first_name} ${currentOrder.user_details.last_name} (${currentOrder.user_details.email})` : 'N/A'}</p>
// //               <p><strong>Total Amount:</strong> ${currentOrder.total_amount}</p>
// //               <p><strong>Current Status:</strong> {currentOrder.status}</p>
// //               <p><strong>Created At:</strong> {new Date(currentOrder.created_at).toLocaleString()}</p>
// //               {currentOrder.updated_at && <p><strong>Last Updated:</strong> {new Date(currentOrder.updated_at).toLocaleString()}</p>}

// //               <h5 className="mt-4">Order Items</h5>
// //               {currentOrder.items && currentOrder.items.length > 0 ? (
// //                 <Table striped bordered hover size="sm">
// //                   <thead>
// //                     <tr>
// //                       <th>Product Name</th>
// //                       <th>Quantity</th>
// //                       <th>Price per item (at purchase)</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {currentOrder.items.map((item, index) => (
// //                       <tr key={index}>
// //                         <td>
// //                           {item.product_image_url && (
// //                             <img src={item.product_image_url} alt={item.product_name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
// //                           )}
// //                           {item.product_name}
// //                         </td>
// //                         <td>{item.quantity}</td>
// //                         <td>${item.price_at_purchase}</td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </Table>
// //               ) : (
// //                 <p>No items found for this order.</p>
// //               )}

// //               <h5 className="mt-4">Update Order Status</h5>
// //               <Form.Group className="mb-3">
// //                 <Form.Label>New Status</Form.Label>
// //                 <Form.Select
// //                   value={newOrderStatus}
// //                   onChange={(e) => setNewOrderStatus(e.target.value)}
// //                   disabled={loading} // Disable while an update is in progress
// //                 >
// //                   {allowedStatuses.map(status => (
// //                     <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
// //                   ))}
// //                 </Form.Select>
// //               </Form.Group>
// //             </>
// //           )}
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
// //             Close
// //           </Button>
// //           <Button variant="primary" onClick={handleUpdateStatus} disabled={loading}>
// //             {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Update Status'}
// //           </Button>
// //         </Modal.Footer>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default AdminOrdersPage;



// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Modal, Form, Spinner, Alert, Pagination, InputGroup } from 'react-bootstrap';
// import { jwtDecode } from 'jwt-decode'; // For client-side role check
// import { useNavigate } from 'react-router-dom'; // <--- Import useNavigate
// import { toast } from 'react-toastify'; // Import toast for notifications

// const AdminOrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // State for view/edit modal
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [currentOrder, setCurrentOrder] = useState(null); // Order being viewed/edited

//   // State for status update form
//   const [newOrderStatus, setNewOrderStatus] = useState('');

//   // State for pagination and search
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalOrders, setTotalOrders] = useState(0); // New: total count for display
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchTimeout, setSearchTimeout] = useState(null); // For debounced search

//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const [loggedInUserId, setLoggedInUserId] = useState(null);

//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
//   const navigate = useNavigate(); // <--- Initialize useNavigate

//   // Helper function to handle unauthorized errors and redirect
//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     sessionStorage.removeItem('token'); // <--- Clear the token from sessionStorage
//     navigate('/login'); // Redirect to login page
//   }, [navigate]);

//   // --- Determine Logged-in User's Role and ID ---
//   useEffect(() => {
//     const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setLoggedInUserRole(decodedToken.user_type || '');
//         setLoggedInUserId(decodedToken.sub);
//         setLoading(false); // Authentication check done, stop loading if token found
//       } catch (err) {
//         console.error("Failed to decode token:", err);
//         setLoggedInUserRole('');
//         setLoggedInUserId(null);
//         handleAuthError("Invalid or expired token. Please log in again."); // <--- Use helper
//       }
//     } else {
//       handleAuthError("Authentication token missing. Please log in to view this page."); // <--- Use helper
//     }
//   }, [handleAuthError]); // Add handleAuthError to dependencies

//   // --- Fetch Orders ---
//   const fetchOrders = useCallback(async () => {
//     // Only fetch if role is determined and it's an admin/super_admin
//     if (!loggedInUserRole) {
//       // If role isn't determined yet, wait for the useEffect above to set it.
//       // Or if it's determined but not admin/super_admin, handleAuthError would have been called.
//       return;
//     }

//     if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
//       handleAuthError("You do not have permission to view this page."); // <--- Use helper
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
//       if (!token) {
//         handleAuthError("Authentication token missing. Please log in."); // <--- Use helper
//         return;
//       }

//       const params = new URLSearchParams({
//         page: currentPage,
//         per_page: 10, // You can adjust per_page
//         search: searchQuery
//       });

//       const response = await fetch(`${API_BASE_URL}/orders/admin?${params.toString()}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) { // Check for Unauthorized or Forbidden
//           handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again."); // <--- Use helper
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to fetch orders.');
//       }

//       const data = await response.json();
//       setOrders(data.orders || []);
//       setTotalPages(data.pages || 1);
//       setTotalOrders(data.total_orders || 0);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, loggedInUserRole, handleAuthError]); // Re-fetch when page, search query, user role, or auth error handler changes

//   useEffect(() => {
//     // Trigger fetch only after loggedInUserRole is determined
//     if (loggedInUserRole) {
//       fetchOrders();
//     }
//   }, [fetchOrders, loggedInUserRole]); // Initial fetch and re-fetch when fetchOrders useCallback changes

//   // --- Handle Order View/Edit Click ---
//   const handleViewEditClick = (order) => {
//     setCurrentOrder(order);
//     setNewOrderStatus(order.status); // Pre-fill status for edit
//     setShowOrderModal(true);
//   };

//   // --- Handle Status Update ---
//   const handleUpdateStatus = async () => {
//     if (!currentOrder || !newOrderStatus) {
//       toast.error("No order selected or status not set."); // Changed alert to toast
//       return;
//     }

//     setLoading(true); // Indicate that an operation is ongoing
//     try {
//       const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
//       if (!token) {
//         handleAuthError("Authentication token missing. Please log in."); // <--- Use helper
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/orders/admin/${currentOrder.order_id}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ status: newOrderStatus })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) { // Check for Unauthorized or Forbidden
//           handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again."); // <--- Use helper
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to update order status.');
//       }

//       toast.success('Order status updated successfully!'); // Changed alert to toast
//       setShowOrderModal(false);
//       fetchOrders(); // Refresh order list
//     } catch (err) {
//       console.error("Error updating order status:", err);
//       setError(err.message); // Display error on the page
//       toast.error(`Error updating status: ${err.message}`); // Changed alert to toast
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Handle Order Deletion ---
//   const handleDeleteOrder = async (orderId) => {
//     if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
//       if (!token) {
//         handleAuthError("Authentication token missing. Please log in."); // <--- Use helper
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/orders/admin/${orderId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) { // Check for Unauthorized or Forbidden
//           handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again."); // <--- Use helper
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to delete order.');
//       }

//       toast.success('Order deleted successfully!'); // Changed alert to toast
//       fetchOrders(); // Refresh order list
//     } catch (err) {
//       console.error("Error deleting order:", err);
//       setError(err.message);
//       toast.error(`Error deleting order: ${err.message}`); // Changed alert to toast
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Pagination Handlers ---
//   const handlePageChange = (pageNumber) => {
//     if (pageNumber > 0 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   // --- Search Handler with Debounce ---
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value); // Update immediately for input field feedback

//     // Clear previous timeout
//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }

//     // Set new timeout for fetching data
//     setSearchTimeout(
//       setTimeout(() => {
//         setCurrentPage(1); // Reset to first page on new search
//         // fetchOrders will be called due to searchQuery dependency in its useCallback
//       }, 500) // 500ms debounce
//     );
//   };

//   // Allowed statuses for admin update
//   const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

//   // --- Render ---
//   return (
//     <div className="container mt-4">
//       <h2>Orders Management</h2>

//       <div className="d-flex justify-content-between mb-3 align-items-center">
//         {/* Removed currency from Total Orders display */}
//         <h4>Total Orders: {totalOrders}</h4>
//         <InputGroup className="w-auto">
//           <Form.Control
//             type="text"
//             placeholder="Search by Order ID or User info..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             style={{ minWidth: '250px' }}
//           />
//           <Button variant="outline-secondary" onClick={() => {
//             setSearchQuery('');
//             setCurrentPage(1);
//           }}>Clear</Button>
//         </InputGroup>
//       </div>

//       {loading && !error && (
//         <div className="text-center my-4">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading orders...</span>
//           </Spinner>
//           <p className="mt-2">Loading orders...</p>
//         </div>
//       )}

//       {error && <Alert variant="danger">Error: {error}</Alert>}

//       {!loading && !error && orders.length === 0 && (
//         <Alert variant="info">No orders found. Adjust your search criteria.</Alert>
//       )}

//       {!loading && !error && orders.length > 0 && (
//         <>
//           <Table striped bordered hover responsive className="mt-3">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>User</th>
//                 <th>Total Amount</th>
//                 <th>Status</th>
//                 <th>Created At</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.order_id}>
//                   <td>{order.order_id}</td>
//                   <td>
//                     {order.user_details ? (
//                       <>
//                         {order.user_details.first_name} {order.user_details.last_name} ({order.user_details.email})
//                       </>
//                     ) : 'N/A'}
//                   </td>
//                   {/* Removed currency from Total Amount in table */}
//                   <td>{parseFloat(order.total_amount).toFixed(2)}</td>
//                   <td>{order.status}</td>
//                   <td>{new Date(order.created_at).toLocaleDateString()}</td>
//                   <td>
//                     <Button variant="info" size="sm" className="me-2" onClick={() => handleViewEditClick(order)}>
//                       Details / Update Status
//                     </Button>
//                     {(loggedInUserRole === 'super_admin') && ( // Only Super Admin can delete
//                       <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order.order_id)}>
//                         Delete
//                       </Button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           <Pagination className="justify-content-center mt-3">
//             <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
//             {[...Array(totalPages)].map((_, index) => (
//               <Pagination.Item
//                 key={index + 1}
//                 active={index + 1 === currentPage}
//                 onClick={() => handlePageChange(index + 1)}
//               >
//                 {index + 1}
//               </Pagination.Item>
//             ))}
//             <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
//           </Pagination>
//         </>
//       )}

//       {/* Order Details/Status Update Modal */}
//       <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Order Details (ID: {currentOrder?.order_id})</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {currentOrder && (
//             <>
//               <h5>Order Information</h5>
//               <p><strong>User:</strong> {currentOrder.user_details ? `${currentOrder.user_details.first_name} ${currentOrder.user_details.last_name} (${currentOrder.user_details.email})` : 'N/A'}</p>
//               <p><strong>Total Amount:</strong> {parseFloat(currentOrder.total_amount).toFixed(2)}</p>
//               <p><strong>Current Status:</strong> {currentOrder.status}</p>
//               <p><strong>Created At:</strong> {new Date(currentOrder.created_at).toLocaleString()}</p>
//               {currentOrder.updated_at && <p><strong>Last Updated:</strong> {new Date(currentOrder.updated_at).toLocaleString()}</p>}

//               <h5 className="mt-4">Customer & Delivery Details</h5>
//               <p><strong>Customer Name:</strong> {currentOrder.customer_name || 'N/A'}</p>
//               <p><strong>Email:</strong> {currentOrder.customer_email || 'N/A'}</p>
//               <p><strong>Phone:</strong> {currentOrder.customer_phone || 'N/A'}</p>
//               <p><strong>Address:</strong> {currentOrder.delivery_address || 'N/A'}</p>
//               <p><strong>City:</strong> {currentOrder.city || 'N/A'}</p>
//               {currentOrder.special_notes && <p><strong>Notes:</strong> {currentOrder.special_notes}</p>}

//               <h5 className="mt-4">Payment Details</h5>
//               <p><strong>Payment Method:</strong> {currentOrder.payment_method || 'N/A'}</p>
//               {currentOrder.momo_number && (
//                 <p><strong>MoMo Number:</strong> {currentOrder.momo_number} ({currentOrder.momo_network})</p>
//               )}
//               {currentOrder.payment_proof_url && (
//                 <p><strong>Payment Proof:</strong> <a href={currentOrder.payment_proof_url} target="_blank" rel="noopener noreferrer">View Proof</a></p>
//               )}
              
//               <h5 className="mt-4">Order Items</h5>
//               {currentOrder.items && currentOrder.items.length > 0 ? (
//                 <Table striped bordered hover size="sm">
//                   <thead>
//                     <tr>
//                       <th>Product Name</th>
//                       <th>Quantity</th>
//                       <th>Price per item (at purchase)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentOrder.items.map((item, index) => (
//                       <tr key={index}>
//                         <td>
//                           {item.product_image_url && (
//                             <img src={item.product_image_url} alt={item.product_name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
//                           )}
//                           {item.product_name}
//                         </td>
//                         <td>{item.quantity}</td>
//                         <td>{parseFloat(item.price_at_purchase).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               ) : (
//                 <p>No items found for this order.</p>
//               )}

//               <h5 className="mt-4">Update Order Status</h5>
//               <Form.Group className="mb-3">
//                 <Form.Label>New Status</Form.Label>
//                 <Form.Select
//                   value={newOrderStatus}
//                   onChange={(e) => setNewOrderStatus(e.target.value)}
//                   disabled={loading} // Disable while an update is in progress
//                 >
//                   {allowedStatuses.map(status => (
//                     <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleUpdateStatus} disabled={loading}>
//             {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Update Status'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminOrdersPage;












// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Modal, Form, Spinner, Alert, Pagination, InputGroup } from 'react-bootstrap';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { FaEye, FaTrash } from 'react-icons/fa';
// import './styles/AdminOrdersPage.css';

// const AdminOrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [currentOrder, setCurrentOrder] = useState(null);
//   const [newOrderStatus, setNewOrderStatus] = useState('');

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchTimeout, setSearchTimeout] = useState(null);

//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const [loggedInUserId, setLoggedInUserId] = useState(null);

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
//         setLoggedInUserId(decodedToken.sub);
//         setLoading(false);
//       } catch (err) {
//         console.error('Failed to decode token:', err);
//         setLoggedInUserRole('');
//         setLoggedInUserId(null);
//         handleAuthError('Invalid or expired token. Please log in again.');
//       }
//     } else {
//       handleAuthError('Authentication token missing. Please log in to view this page.');
//     }
//   }, [handleAuthError]);

//   const fetchOrders = useCallback(async () => {
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

//       const params = new URLSearchParams({
//         page: currentPage,
//         per_page: 10,
//         search: searchQuery,
//       });

//       const response = await fetch(`${API_BASE_URL}/orders/admin?${params.toString()}`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to fetch orders.');
//       }

//       const data = await response.json();
//       const filteredOrders = data.orders.map(order => ({
//         order_id: order.order_id,
//         status: order.status,
//         total: order.total,
//         created_at: order.created_at,
//         updated_at: order.updated_at,
//         payment_method: order.payment_method,
//         payment_proof_url: order.payment_proof_url,
//         customer_info: {
//           name: order.customer_info.name,
//           email: order.customer_info.email,
//           contact: order.customer_info.contact,
//           address: order.customer_info.address,
//           city: order.customer_info.city,
//           notes: order.customer_info.notes,
//           momo_number: order.customer_info.momoNumber,
//           momo_network: order.customer_info.momoNetwork,
//         },
//         user_details: order.user_details || null,
//         cart: order.cart.map(item => ({
//           product_id: item.product_id,
//           product_name: item.product_name,
//           product_image_url: item.product_image_url,
//           quantity: item.quantity,
//           price: item.price,
//         })),
//       }));
//       setOrders(filteredOrders);
//       setTotalPages(data.pages || 1);
//       setTotalOrders(data.total_orders || 0);
//     } catch (err) {
//       console.error('Error fetching orders:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, loggedInUserRole, handleAuthError]);

//   useEffect(() => {
//     if (loggedInUserRole) {
//       fetchOrders();
//     }
//   }, [fetchOrders, loggedInUserRole]);

//   const handleViewEditClick = (order) => {
//     setCurrentOrder(order);
//     setNewOrderStatus(order.status || '');
//     setShowOrderModal(true);
//   };

//   const handleUpdateStatus = async () => {
//     if (!currentOrder || !newOrderStatus) {
//       toast.error('No order selected or status not set.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/orders/admin/${currentOrder.order_id}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newOrderStatus }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to update order status.');
//       }

//       toast.success('Order status updated successfully!');
//       setShowOrderModal(false);
//       fetchOrders();
//     } catch (err) {
//       console.error('Error updating order status:', err);
//       setError(err.message);
//       toast.error(`Error updating status: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteOrder = async (orderId) => {
//     if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/orders/admin/${orderId}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to delete order.');
//       }

//       toast.success('Order deleted successfully!');
//       fetchOrders();
//     } catch (err) {
//       console.error('Error deleting order:', err);
//       setError(err.message);
//       toast.error(`Error deleting order: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (pageNumber) => {
//     if (pageNumber > 0 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);

//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }

//     setSearchTimeout(
//       setTimeout(() => {
//         setCurrentPage(1);
//       }, 500)
//     );
//   };

//   const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

//   return (
//     <div className="orders-container">
//       <div className="orders-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">Orders Management</h1>
//           </div>
//           <div className="header-actions">
//             <div className="stat-card-compact">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{totalOrders}</div>
//                 <div className="stat-label">Total Orders</div>
//               </div>
//             </div>
//             <div className="search-wrapper">
//               <InputGroup>
//                 <Form.Control
//                   type="text"
//                   placeholder="Search by Order ID or User info..."
//                   value={searchQuery}
//                   onChange={handleSearchChange}
//                   className="search-input"
//                   title="Search by Order ID, name, email, or phone"
//                 />
//                 <Button variant="outline-secondary" onClick={() => {
//                   setSearchQuery('');
//                   setCurrentPage(1);
//                 }}>Clear</Button>
//               </InputGroup>
//             </div>
//           </div>
//         </div>
//       </div>

//       {loading && !error && (
//         <div className="loading-container">
//           <Spinner animation="border" className="loading-spinner" />
//           <h4>Loading orders...</h4>
//           <p>Please wait while we fetch your orders!</p>
//         </div>
//       )}

//       {error && (
//         <Alert variant="danger" className="error-alert" onClose={() => setError(null)} dismissible>
//           {error}
//         </Alert>
//       )}

//       {!loading && !error && orders.length === 0 && (
//         <div className="empty-state">
//           <div className="empty-icon"><i className="bi bi-folder"></i></div>
//           <h4>No Orders Found</h4>
//           <p>Adjust your search criteria to find orders.</p>
//         </div>
//       )}

//       {!loading && !error && orders.length > 0 && (
//         <>
//           <div className="table-responsive">
//             <Table className="orders-table">
//               <thead>
//                 <tr>
//                   <th>Order ID</th>
//                   <th>User</th>
//                   <th>Total Amount</th>
//                   <th>Status</th>
//                   <th>Created At</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((order) => (
//                   <tr key={order.order_id}>
//                     <td><span className="order-id">{order.order_id}</span></td>
//                     <td>
//                       {order.user_details ? (
//                         <span className="order-user">
//                           {order.user_details.first_name} {order.user_details.last_name} ({order.user_details.email})
//                         </span>
//                       ) : (
//                         <span className="order-user">Guest ({order.customer_info.email})</span>
//                       )}
//                     </td>
//                     <td><span className="order-total">{parseFloat(order.total).toFixed(2)}</span></td>
//                     <td><span className="order-status">{order.status}</span></td>
//                     <td><span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span></td>
//                     <td>
//                       <div className="action-buttons">
//                         <Button variant="info" size="sm" onClick={() => handleViewEditClick(order)} title="Details / Update Status">
//                           <FaEye />
//                         </Button>
//                         {loggedInUserRole === 'super_admin' && (
//                           <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order.order_id)} title="Delete">
//                             <FaTrash />
//                           </Button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//           {totalPages > 1 && (
//             <div className="pagination-wrapper">
//               <Pagination className="custom-pagination">
//                 <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
//                 {[...Array(totalPages)].map((_, index) => (
//                   <Pagination.Item
//                     key={index + 1}
//                     active={index + 1 === currentPage}
//                     onClick={() => handlePageChange(index + 1)}
//                   >
//                     {index + 1}
//                   </Pagination.Item>
//                 ))}
//                 <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
//               </Pagination>
//               <div className="pagination-info">Page {currentPage} of {totalPages}</div>
//             </div>
//           )}
//         </>
//       )}

//       <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} className="custom-modal" size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Order Details (ID: {currentOrder?.order_id})</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {currentOrder && (
//             <>
//               <h5>Order Information</h5>
//               <div className="order-detail-row"><strong>User:</strong> {currentOrder.user_details ? `${currentOrder.user_details.first_name} ${currentOrder.user_details.last_name} (${currentOrder.user_details.email})` : `Guest (${currentOrder.customer_info.email})`}</div>
//               <div className="order-detail-row"><strong>Total Amount:</strong> {parseFloat(currentOrder.total).toFixed(2)}</div>
//               <div className="order-detail-row"><strong>Current Status:</strong> {currentOrder.status}</div>
//               <div className="order-detail-row"><strong>Created At:</strong> {new Date(currentOrder.created_at).toLocaleString()}</div>
//               {currentOrder.updated_at && <div className="order-detail-row"><strong>Last Updated:</strong> {new Date(currentOrder.updated_at).toLocaleString()}</div>}

//               <h5 className="mt-4">Customer & Delivery Details</h5>
//               <div className="order-detail-row"><strong>Customer Name:</strong> {currentOrder.customer_info.name || 'N/A'}</div>
//               <div className="order-detail-row"><strong>Email:</strong> {currentOrder.customer_info.email || 'N/A'}</div>
//               <div className="order-detail-row"><strong>Phone:</strong> {currentOrder.customer_info.contact || 'N/A'}</div>
//               <div className="order-detail-row"><strong>Address:</strong> {currentOrder.customer_info.address || 'N/A'}</div>
//               <div className="order-detail-row"><strong>City:</strong> {currentOrder.customer_info.city || 'N/A'}</div>
//               {currentOrder.customer_info.notes && <div className="order-detail-row"><strong>Notes:</strong> {currentOrder.customer_info.notes}</div>}

//               <h5 className="mt-4">Payment Details</h5>
//               <div className="order-detail-row"><strong>Payment Method:</strong> {currentOrder.payment_method || 'N/A'}</div>
//               {currentOrder.momo_number && (
//                 <div className="order-detail-row"><strong>MoMo Number:</strong> {currentOrder.momo_number} ({currentOrder.momo_network})</div>
//               )}
//               {currentOrder.payment_proof_url && (
//                 <div className="order-detail-row"><strong>Payment Proof:</strong> <a href={currentOrder.payment_proof_url} target="_blank" rel="noopener noreferrer">View Proof</a></div>
//               )}

//               <h5 className="mt-4">Order Items</h5>
//               {currentOrder.cart && currentOrder.cart.length > 0 ? (
//                 <Table striped bordered hover size="sm">
//                   <thead>
//                     <tr>
//                       <th>Product Name</th>
//                       <th>Quantity</th>
//                       <th>Price per Item (at purchase)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentOrder.cart.map((item, index) => (
//                       <tr key={index}>
//                         <td>
//                           {item.product_image_url && (
//                             <img src={item.product_image_url} alt={item.product_name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
//                           )}
//                           {item.product_name}
//                         </td>
//                         <td>{item.quantity}</td>
//                         <td>{parseFloat(item.price).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               ) : (
//                 <p>No items found for this order.</p>
//               )}

//               <h5 className="mt-4">Update Order Status</h5>
//               <Form.Group className="mb-3">
//                 <Form.Label>New Status</Form.Label>
//                 <Form.Select
//                   value={newOrderStatus}
//                   onChange={(e) => setNewOrderStatus(e.target.value)}
//                   disabled={loading}
//                 >
//                   {allowedStatuses.map(status => (
//                     <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleUpdateStatus} disabled={loading}>
//             {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Update Status'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminOrdersPage;












// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Modal, Form, Spinner, Alert, Pagination, InputGroup } from 'react-bootstrap';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { FaEye, FaTrash } from 'react-icons/fa';
// import './styles/AdminOrdersPage.css';

// const AdminOrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [currentOrder, setCurrentOrder] = useState(null);
//   const [newOrderStatus, setNewOrderStatus] = useState('');

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchTimeout, setSearchTimeout] = useState(null);

//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const [loggedInUserId, setLoggedInUserId] = useState(null);

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
//         setLoggedInUserId(decodedToken.sub);
//         setLoading(false);
//       } catch (err) {
//         console.error('Failed to decode token:', err);
//         setLoggedInUserRole('');
//         setLoggedInUserId(null);
//         handleAuthError('Invalid or expired token. Please log in again.');
//       }
//     } else {
//       handleAuthError('Authentication token missing. Please log in to view this page.');
//     }
//   }, [handleAuthError]);

//   const fetchOrders = useCallback(async () => {
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

//       const params = new URLSearchParams({
//         page: currentPage,
//         per_page: 10,
//         search: searchQuery,
//       });

//       const response = await fetch(`${API_BASE_URL}/orders/admin?${params.toString()}`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to fetch orders.');
//       }

//       const data = await response.json();
//       // FIXED: Use 'id' field from backend instead of 'order_id'
//       const filteredOrders = data.orders.map(order => ({
//         id: order.id, // CHANGED: Use 'id' from backend
//         order_id: order.id, // ADDED: Keep order_id for compatibility, but use 'id' as source
//         status: order.status,
//         total: order.total,
//         created_at: order.created_at,
//         updated_at: order.updated_at,
//         payment_method: order.payment_method,
//         payment_proof_url: order.payment_proof_url,
//         customer_info: {
//           name: order.customer_info.name,
//           email: order.customer_info.email,
//           contact: order.customer_info.contact,
//           address: order.customer_info.address,
//           city: order.customer_info.city,
//           notes: order.customer_info.notes,
//           momo_number: order.customer_info.momoNumber,
//           momo_network: order.customer_info.momoNetwork,
//         },
//         user_details: order.user_details || null,
//         cart: order.cart.map(item => ({
//           product_id: item.product_id,
//           product_name: item.product_name,
//           product_image_url: item.product_image_url,
//           quantity: item.quantity,
//           price: item.price,
//         })),
//       }));
//       setOrders(filteredOrders);
//       setTotalPages(data.pages || 1);
//       setTotalOrders(data.total_orders || 0);
//     } catch (err) {
//       console.error('Error fetching orders:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, loggedInUserRole, handleAuthError]);

//   useEffect(() => {
//     if (loggedInUserRole) {
//       fetchOrders();
//     }
//   }, [fetchOrders, loggedInUserRole]);

//   const handleViewEditClick = (order) => {
//     setCurrentOrder(order);
//     setNewOrderStatus(order.status || '');
//     setShowOrderModal(true);
//   };

//   const handleUpdateStatus = async () => {
//     if (!currentOrder || !newOrderStatus) {
//       toast.error('No order selected or status not set.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       // FIXED: Use 'id' field instead of 'order_id'
//       const response = await fetch(`${API_BASE_URL}/orders/admin/${currentOrder.id}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newOrderStatus }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to update order status.');
//       }

//       toast.success('Order status updated successfully!');
//       setShowOrderModal(false);
//       fetchOrders();
//     } catch (err) {
//       console.error('Error updating order status:', err);
//       setError(err.message);
//       toast.error(`Error updating status: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteOrder = async (orderId) => {
//     if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       // FIXED: orderId parameter already contains the correct ID
//       const response = await fetch(`${API_BASE_URL}/orders/admin/${orderId}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to delete order.');
//       }

//       toast.success('Order deleted successfully!');
//       fetchOrders();
//     } catch (err) {
//       console.error('Error deleting order:', err);
//       setError(err.message);
//       toast.error(`Error deleting order: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (pageNumber) => {
//     if (pageNumber > 0 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);

//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }

//     setSearchTimeout(
//       setTimeout(() => {
//         setCurrentPage(1);
//       }, 500)
//     );
//   };

//   const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

//   return (
//     <div className="orders-container">
//       <div className="orders-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">Orders Management</h1>
//           </div>
//           <div className="header-actions">
//             <div className="stat-card-compact">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{totalOrders}</div>
//                 <div className="stat-label">Total Orders</div>
//               </div>
//             </div>
//             <div className="search-wrapper">
//               <InputGroup>
//                 <Form.Control
//                   type="text"
//                   placeholder="Search by Order ID or User info..."
//                   value={searchQuery}
//                   onChange={handleSearchChange}
//                   className="search-input"
//                   title="Search by Order ID, name, email, or phone"
//                 />
//                 <Button variant="outline-secondary" onClick={() => {
//                   setSearchQuery('');
//                   setCurrentPage(1);
//                 }}>Clear</Button>
//               </InputGroup>
//             </div>
//           </div>
//         </div>
//       </div>

//       {loading && !error && (
//         <div className="loading-container">
//           <Spinner animation="border" className="loading-spinner" />
//           <h4>Loading orders...</h4>
//           <p>Please wait while we fetch your orders!</p>
//         </div>
//       )}

//       {error && (
//         <Alert variant="danger" className="error-alert" onClose={() => setError(null)} dismissible>
//           {error}
//         </Alert>
//       )}

//       {!loading && !error && orders.length === 0 && (
//         <div className="empty-state">
//           <div className="empty-icon"><i className="bi bi-folder"></i></div>
//           <h4>No Orders Found</h4>
//           <p>Adjust your search criteria to find orders.</p>
//         </div>
//       )}

//       {!loading && !error && orders.length > 0 && (
//         <>
//           <div className="table-responsive">
//             <Table className="orders-table">
//               <thead>
//                 <tr>
//                   <th>Order ID</th>
//                   <th>User</th>
//                   <th>Total Amount</th>
//                   <th>Status</th>
//                   <th>Created At</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((order) => (
//                   <tr key={order.id}>
//                     {/* FIXED: Display order.id instead of order.order_id */}
//                     <td><span className="order-id">{order.id}</span></td>
//                     <td>
//                       {order.user_details ? (
//                         <span className="order-user">
//                           {order.user_details.first_name} {order.user_details.last_name} ({order.user_details.email})
//                         </span>
//                       ) : (
//                         <span className="order-user">Guest ({order.customer_info.email})</span>
//                       )}
//                     </td>
//                     <td><span className="order-total">{parseFloat(order.total).toFixed(2)}</span></td>
//                     <td><span className="order-status">{order.status}</span></td>
//                     <td><span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span></td>
//                     <td>
//                       <div className="action-buttons">
//                         <Button variant="info" size="sm" onClick={() => handleViewEditClick(order)} title="Details / Update Status">
//                           <FaEye />
//                         </Button>
//                         {loggedInUserRole === 'super_admin' && (
//                           <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order.id)} title="Delete">
//                             <FaTrash />
//                           </Button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//           {totalPages > 1 && (
//             <div className="pagination-wrapper">
//               <Pagination className="custom-pagination">
//                 <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
//                 {[...Array(totalPages)].map((_, index) => (
//                   <Pagination.Item
//                     key={index + 1}
//                     active={index + 1 === currentPage}
//                     onClick={() => handlePageChange(index + 1)}
//                   >
//                     {index + 1}
//                   </Pagination.Item>
//                 ))}
//                 <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
//               </Pagination>
//               <div className="pagination-info">Page {currentPage} of {totalPages}</div>
//             </div>
//           )}
//         </>
//       )}

//       <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} className="custom-modal" size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           {/* FIXED: Use currentOrder?.id instead of currentOrder?.order_id */}
//           <Modal.Title>Order Details (ID: {currentOrder?.id})</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {currentOrder && (
//             <>
//               <h5>Order Information</h5>
//               <div className="order-detail-row"><strong>User:</strong> {currentOrder.user_details ? `${currentOrder.user_details.first_name} ${currentOrder.user_details.last_name} (${currentOrder.user_details.email})` : `Guest (${currentOrder.customer_info.email})`}</div>
//               <div className="order-detail-row"><strong>Total Amount:</strong> {parseFloat(currentOrder.total).toFixed(2)}</div>
//               <div className="order-detail-row"><strong>Current Status:</strong> {currentOrder.status}</div>
//               <div className="order-detail-row"><strong>Created At:</strong> {new Date(currentOrder.created_at).toLocaleString()}</div>
//               {currentOrder.updated_at && <div className="order-detail-row"><strong>Last Updated:</strong> {new Date(currentOrder.updated_at).toLocaleString()}</div>}

//               <h5 className="mt-4">Customer & Delivery Details</h5>
//               <div className="order-detail-row"><strong>Customer Name:</strong> {currentOrder.customer_info.name || 'N/A'}</div>
//               <div className="order-detail-row"><strong>Email:</strong> {currentOrder.customer_info.email || 'N/A'}</div>
//               <div className="order-detail-row"><strong>Phone:</strong> {currentOrder.customer_info.contact || 'N/A'}</div>
//               <div className="order-detail-row"><strong>Address:</strong> {currentOrder.customer_info.address || 'N/A'}</div>
//               <div className="order-detail-row"><strong>City:</strong> {currentOrder.customer_info.city || 'N/A'}</div>
//               {currentOrder.customer_info.notes && <div className="order-detail-row"><strong>Notes:</strong> {currentOrder.customer_info.notes}</div>}

//               <h5 className="mt-4">Payment Details</h5>
//               <div className="order-detail-row"><strong>Payment Method:</strong> {currentOrder.payment_method || 'N/A'}</div>
//               {currentOrder.customer_info.momo_number && (
//                 <div className="order-detail-row"><strong>MoMo Number:</strong> {currentOrder.customer_info.momo_number} ({currentOrder.customer_info.momo_network})</div>
//               )}
//               {currentOrder.payment_proof_url && (
//                 <div className="order-detail-row"><strong>Payment Proof:</strong> <a href={currentOrder.payment_proof_url} target="_blank" rel="noopener noreferrer">View Proof</a></div>
//               )}

//               <h5 className="mt-4">Order Items</h5>
//               {currentOrder.cart && currentOrder.cart.length > 0 ? (
//                 <Table striped bordered hover size="sm">
//                   <thead>
//                     <tr>
//                       <th>Product Name</th>
//                       <th>Quantity</th>
//                       <th>Price per Item (at purchase)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentOrder.cart.map((item, index) => (
//                       <tr key={index}>
//                         <td>
//                           {item.product_image_url && (
//                             <img src={item.product_image_url} alt={item.product_name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
//                           )}
//                           {item.product_name}
//                         </td>
//                         <td>{item.quantity}</td>
//                         <td>{parseFloat(item.price).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               ) : (
//                 <p>No items found for this order.</p>
//               )}

//               <h5 className="mt-4">Update Order Status</h5>
//               <Form.Group className="mb-3">
//                 <Form.Label>New Status</Form.Label>
//                 <Form.Select
//                   value={newOrderStatus}
//                   onChange={(e) => setNewOrderStatus(e.target.value)}
//                   disabled={loading}
//                 >
//                   {allowedStatuses.map(status => (
//                     <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleUpdateStatus} disabled={loading}>
//             {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Update Status'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminOrdersPage;



import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Modal, Form, Spinner, Alert, Pagination, InputGroup, Row, Col, Card } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaTrash, FaEdit, FaPlus, FaMinus } from 'react-icons/fa';
import './styles/AdminOrdersPage.css';
import API_BASE_URL from '../config';


const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState('');

  // Edit form states
  const [editFormData, setEditFormData] = useState({
    customer_info: {
      name: '',
      email: '',
      contact: '',
      address: '',
      city: '',
      notes: '',
      momo_number: '',
      momo_network: ''
    },
    cart: [],
    payment_method: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [loggedInUserRole, setLoggedInUserRole] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
  const navigate = useNavigate();

  const handleAuthError = useCallback((errMessage) => {
    setError(errMessage);
    sessionStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setLoggedInUserRole(decodedToken.user_type || '');
        setLoggedInUserId(decodedToken.sub);
        setLoading(false);
      } catch (err) {
        console.error('Failed to decode token:', err);
        setLoggedInUserRole('');
        setLoggedInUserId(null);
        handleAuthError('Invalid or expired token. Please log in again.');
      }
    } else {
      handleAuthError('Authentication token missing. Please log in to view this page.');
    }
  }, [handleAuthError]);

  const fetchOrders = useCallback(async () => {
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

      const params = new URLSearchParams({
        page: currentPage,
        per_page: 10,
        search: searchQuery,
      });

      const response = await fetch(`${API_BASE_URL}/orders/admin?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
          return;
        }
        throw new Error(errorData.error || 'Failed to fetch orders.');
      }

      const data = await response.json();
      const filteredOrders = data.orders.map(order => ({
        id: order.id,
        order_id: order.id,
        status: order.status,
        total: order.total,
        created_at: order.created_at,
        updated_at: order.updated_at,
        payment_method: order.payment_method,
        payment_proof_url: order.payment_proof_url,
        customer_info: {
          name: order.customer_info.name,
          email: order.customer_info.email,
          contact: order.customer_info.contact,
          address: order.customer_info.address,
          city: order.customer_info.city,
          notes: order.customer_info.notes,
          momo_number: order.customer_info.momoNumber,
          momo_network: order.customer_info.momoNetwork,
        },
        user_details: order.user_details || null,
        cart: order.cart.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_image_url: item.product_image_url,
          quantity: item.quantity,
          price: item.price,
        })),
      }));
      setOrders(filteredOrders);
      setTotalPages(data.pages || 1);
      setTotalOrders(data.total_orders || 0);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, loggedInUserRole, handleAuthError]);

  useEffect(() => {
    if (loggedInUserRole) {
      fetchOrders();
    }
  }, [fetchOrders, loggedInUserRole]);

  const handleViewEditClick = (order) => {
    setCurrentOrder(order);
    setNewOrderStatus(order.status || '');
    setShowOrderModal(true);
  };

  const handleEditClick = (order) => {
    setCurrentOrder(order);
    setEditFormData({
      customer_info: {
        name: order.customer_info.name || '',
        email: order.customer_info.email || '',
        contact: order.customer_info.contact || '',
        address: order.customer_info.address || '',
        city: order.customer_info.city || '',
        notes: order.customer_info.notes || '',
        momo_number: order.customer_info.momo_number || '',
        momo_network: order.customer_info.momo_network || ''
      },
      cart: [...order.cart],
      payment_method: order.payment_method || 'cod'
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (field, value, index = null) => {
    if (field.startsWith('customer_info.')) {
      const customerField = field.split('.')[1];
      setEditFormData(prev => ({
        ...prev,
        customer_info: {
          ...prev.customer_info,
          [customerField]: value
        }
      }));
    } else if (field === 'payment_method') {
      setEditFormData(prev => ({
        ...prev,
        payment_method: value
      }));
    } else if (field.startsWith('cart.')) {
      const cartField = field.split('.')[1];
      setEditFormData(prev => ({
        ...prev,
        cart: prev.cart.map((item, i) => 
          i === index ? { ...item, [cartField]: value } : item
        )
      }));
    }
  };

  const handleRemoveCartItem = (index) => {
    setEditFormData(prev => ({
      ...prev,
      cart: prev.cart.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateOrder = async () => {
    if (!currentOrder) {
      toast.error('No order selected.');
      return;
    }

    // Validate required fields
    if (!editFormData.customer_info.name || !editFormData.customer_info.email || 
        !editFormData.customer_info.contact || !editFormData.customer_info.address) {
      toast.error('Please fill in all required customer information fields.');
      return;
    }

    if (editFormData.cart.length === 0) {
      toast.error('Order must contain at least one item.');
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        handleAuthError('Authentication token missing. Please log in.');
        return;
      }

      // Prepare the data to send to backend
      const updateData = {
        customer_info: editFormData.customer_info,
        cart: editFormData.cart,
        payment_method: editFormData.payment_method
      };

      const response = await fetch(`${API_BASE_URL}/orders/admin/${currentOrder.id}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
          return;
        }
        throw new Error(errorData.error || 'Failed to update order.');
      }

      toast.success('Order updated successfully!');
      setShowEditModal(false);
      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
      setError(err.message);
      toast.error(`Error updating order: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!currentOrder || !newOrderStatus) {
      toast.error('No order selected or status not set.');
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        handleAuthError('Authentication token missing. Please log in.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/orders/admin/${currentOrder.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newOrderStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
          return;
        }
        throw new Error(errorData.error || 'Failed to update order status.');
      }

      toast.success('Order status updated successfully!');
      setShowOrderModal(false);
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.message);
      toast.error(`Error updating status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        handleAuthError('Authentication token missing. Please log in.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/orders/admin/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
          return;
        }
        throw new Error(errorData.error || 'Failed to delete order.');
      }

      toast.success('Order deleted successfully!');
      fetchOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
      setError(err.message);
      toast.error(`Error deleting order: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(() => {
        setCurrentPage(1);
      }, 500)
    );
  };

  const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const paymentMethods = ['cod', 'momo'];
  const momoNetworks = ['MTN', 'Airtel'];

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">Orders Management</h1>
          </div>
          <div className="header-actions">
            <div className="stat-card-compact">
              <div className="stat-content text-center">
                <div className="stat-number">{totalOrders}</div>
                <div className="stat-label">Total Orders</div>
              </div>
            </div>
            <div className="search-wrapper">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search by Order ID or User info..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                  title="Search by Order ID, name, email, or phone"
                />
                <Button variant="outline-secondary" onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}>Clear</Button>
              </InputGroup>
            </div>
          </div>
        </div>
      </div>

      {loading && !error && (
        <div className="loading-container">
          <Spinner animation="border" className="loading-spinner" />
          <h4>Loading orders...</h4>
          <p>Please wait while we fetch your orders!</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="error-alert" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><i className="bi bi-folder"></i></div>
          <h4>No Orders Found</h4>
          <p>Adjust your search criteria to find orders.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <div className="table-responsive">
            <Table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><span className="order-id">{order.id}</span></td>
                    <td>
                      {order.user_details ? (
                        <span className="order-user">
                          {order.user_details.first_name} {order.user_details.last_name} ({order.user_details.email})
                        </span>
                      ) : (
                        <span className="order-user">Guest ({order.customer_info.email})</span>
                      )}
                    </td>
                    <td><span className="order-total">{parseFloat(order.total).toFixed(2)}</span></td>
                    <td><span className="order-status">{order.status}</span></td>
                    <td><span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span></td>
                    <td>
                      <div className="action-buttons">
                        <Button variant="info" size="sm" onClick={() => handleViewEditClick(order)} title="View Details">
                          <FaEye />
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => handleEditClick(order)} title="Edit Order">
                          <FaEdit />
                        </Button>
                        {loggedInUserRole === 'super_admin' && (
                          <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order.id)} title="Delete">
                            <FaTrash />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <Pagination className="custom-pagination">
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              </Pagination>
              <div className="pagination-info">Page {currentPage} of {totalPages}</div>
            </div>
          )}
        </>
      )}

      {/* View Order Modal */}
      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} className="custom-modal" size="lg">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Order Details (ID: {currentOrder?.id})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentOrder && (
            <>
              <h5>Order Information</h5>
              <div className="order-detail-row"><strong>User:</strong> {currentOrder.user_details ? `${currentOrder.user_details.first_name} ${currentOrder.user_details.last_name} (${currentOrder.user_details.email})` : `Guest (${currentOrder.customer_info.email})`}</div>
              <div className="order-detail-row"><strong>Total Amount:</strong> {parseFloat(currentOrder.total).toFixed(2)}</div>
              <div className="order-detail-row"><strong>Current Status:</strong> {currentOrder.status}</div>
              <div className="order-detail-row"><strong>Created At:</strong> {new Date(currentOrder.created_at).toLocaleString()}</div>
              {currentOrder.updated_at && <div className="order-detail-row"><strong>Last Updated:</strong> {new Date(currentOrder.updated_at).toLocaleString()}</div>}

              <h5 className="mt-4">Customer & Delivery Details</h5>
              <div className="order-detail-row"><strong>Customer Name:</strong> {currentOrder.customer_info.name || 'N/A'}</div>
              <div className="order-detail-row"><strong>Email:</strong> {currentOrder.customer_info.email || 'N/A'}</div>
              <div className="order-detail-row"><strong>Phone:</strong> {currentOrder.customer_info.contact || 'N/A'}</div>
              <div className="order-detail-row"><strong>Address:</strong> {currentOrder.customer_info.address || 'N/A'}</div>
              <div className="order-detail-row"><strong>City:</strong> {currentOrder.customer_info.city || 'N/A'}</div>
              {currentOrder.customer_info.notes && <div className="order-detail-row"><strong>Notes:</strong> {currentOrder.customer_info.notes}</div>}

              <h5 className="mt-4">Payment Details</h5>
              <div className="order-detail-row"><strong>Payment Method:</strong> {currentOrder.payment_method || 'N/A'}</div>
              {currentOrder.customer_info.momo_number && (
                <div className="order-detail-row"><strong>MoMo Number:</strong> {currentOrder.customer_info.momo_number} ({currentOrder.customer_info.momo_network})</div>
              )}
              {currentOrder.payment_proof_url && (
                <div className="order-detail-row"><strong>Payment Proof:</strong> <a href={currentOrder.payment_proof_url} target="_blank" rel="noopener noreferrer">View Proof</a></div>
              )}

              <h5 className="mt-4">Order Items</h5>
              {currentOrder.cart && currentOrder.cart.length > 0 ? (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Price per Item</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrder.cart.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.product_image_url && (
                            <img src={item.product_image_url} alt={item.product_name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
                          )}
                          {item.product_name}
                        </td>
                        <td>{item.quantity}</td>
                        <td>{parseFloat(item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No items found for this order.</p>
              )}

              <h5 className="mt-4">Update Order Status</h5>
              <Form.Group className="mb-3">
                <Form.Label>New Status</Form.Label>
                <Form.Select
                  value={newOrderStatus}
                  onChange={(e) => setNewOrderStatus(e.target.value)}
                  disabled={loading}
                >
                  {allowedStatuses.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus} disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Order Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className="custom-modal" size="xl">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Edit Order (ID: {currentOrder?.id})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentOrder && (
            <>
              <h5>Customer Information</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Customer Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.customer_info.name}
                      onChange={(e) => handleEditFormChange('customer_info.name', e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      value={editFormData.customer_info.email}
                      onChange={(e) => handleEditFormChange('customer_info.email', e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone *</Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.customer_info.contact}
                      onChange={(e) => handleEditFormChange('customer_info.contact', e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.customer_info.city}
                      onChange={(e) => handleEditFormChange('customer_info.city', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Delivery Address *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editFormData.customer_info.address}
                  onChange={(e) => handleEditFormChange('customer_info.address', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Special Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editFormData.customer_info.notes}
                  onChange={(e) => handleEditFormChange('customer_info.notes', e.target.value)}
                />
              </Form.Group>

              <h5 className="mt-4">Payment Information</h5>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Select
                      value={editFormData.payment_method}
                      onChange={(e) => handleEditFormChange('payment_method', e.target.value)}
                    >
                      {paymentMethods.map(method => (
                        <option key={method} value={method}>{method.toUpperCase()}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                {editFormData.payment_method === 'momo' && (
                  <>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>MoMo Number</Form.Label>
                        <Form.Control
                          type="text"
                          value={editFormData.customer_info.momo_number}
                          onChange={(e) => handleEditFormChange('customer_info.momo_number', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>MoMo Network</Form.Label>
                        <Form.Select
                          value={editFormData.customer_info.momo_network}
                          onChange={(e) => handleEditFormChange('customer_info.momo_network', e.target.value)}
                        >
                          <option value="">Select Network</option>
                          {momoNetworks.map(network => (
                            <option key={network} value={network}>{network}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </>
                )}
              </Row>

              <h5 className="mt-4">Order Items</h5>
              {editFormData.cart.map((item, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <div className="d-flex align-items-center">
                          {item.product_image_url && (
                            <img 
                              src={item.product_image_url} 
                              alt={item.product_name} 
                              style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} 
                            />
                          )}
                          <div>
                            <strong>{item.product_name}</strong>
                            <div className="text-muted">Price: ${parseFloat(item.price).toFixed(2)}</div>
                          </div>
                        </div>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Quantity</Form.Label>
                          <Form.Control
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleEditFormChange('cart.quantity', parseInt(e.target.value) || 1, index)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2} className="text-end">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveCartItem(index)}
                          title="Remove Item"
                        >
                          <FaMinus />
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
              
              {editFormData.cart.length === 0 && (
                <Alert variant="warning">
                  This order has no items. Please add at least one item before saving.
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateOrder} disabled={loading || editFormData.cart.length === 0}>
            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;










// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Modal, Form, Spinner, Alert, Pagination, InputGroup, Row, Col, Card } from 'react-bootstrap';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { FaEye, FaTrash, FaEdit, FaPlus, FaMinus } from 'react-icons/fa';
// import API_BASE_URL from '../../config';
// import './styles/AdminOrdersPage.css';

// const AdminOrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [currentOrder, setCurrentOrder] = useState(null);
//   const [newOrderStatus, setNewOrderStatus] = useState('');

//   // Edit form states
//   const [editFormData, setEditFormData] = useState({
//     customer_info: {
//       name: '',
//       email: '',
//       contact: '',
//       address: '',
//       city: '',
//       notes: '',
//       momo_number: '',
//       momo_network: ''
//     },
//     cart: [],
//     payment_method: ''
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchTimeout, setSearchTimeout] = useState(null);

//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const [loggedInUserId, setLoggedInUserId] = useState(null);

//   // const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
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
//         setLoggedInUserId(decodedToken.sub);
//         setLoading(false);
//       } catch (err) {
//         console.error('Failed to decode token:', err);
//         setLoggedInUserRole('');
//         setLoggedInUserId(null);
//         handleAuthError('Invalid or expired token. Please log in again.');
//       }
//     } else {
//       handleAuthError('Authentication token missing. Please log in to view this page.');
//     }
//   }, [handleAuthError]);

//   const fetchOrders = useCallback(async () => {
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

//       const params = new URLSearchParams({
//         page: currentPage,
//         per_page: 10,
//         search: searchQuery,
//       });

//       const response = await fetch(`${API_BASE_URL}/api/v1/orders/admin?${params.toString()}`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to fetch orders.');
//       }

//       const data = await response.json();
//       const filteredOrders = data.orders.map(order => ({
//         id: order.id,
//         order_id: order.id,
//         status: order.status,
//         total: order.total,
//         created_at: order.created_at,
//         updated_at: order.updated_at,
//         payment_method: order.payment_method,
//         payment_proof_url: order.payment_proof_url,
//         customer_info: {
//           name: order.customer_info.name,
//           email: order.customer_info.email,
//           contact: order.customer_info.contact,
//           address: order.customer_info.address,
//           city: order.customer_info.city,
//           notes: order.customer_info.notes,
//           momo_number: order.customer_info.momoNumber,
//           momo_network: order.customer_info.momoNetwork,
//         },
//         user_details: order.user_details || null,
//         cart: order.cart.map(item => ({
//           product_id: item.product_id,
//           product_name: item.product_name,
//           product_image_url: item.product_image_url,
//           quantity: item.quantity,
//           price: item.price,
//         })),
//       }));
//       setOrders(filteredOrders);
//       setTotalPages(data.pages || 1);
//       setTotalOrders(data.total_orders || 0);
//     } catch (err) {
//       console.error('Error fetching orders:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, loggedInUserRole, handleAuthError]);

//   useEffect(() => {
//     if (loggedInUserRole) {
//       fetchOrders();
//     }
//   }, [fetchOrders, loggedInUserRole]);

//   const handleViewEditClick = (order) => {
//     setCurrentOrder(order);
//     setNewOrderStatus(order.status || '');
//     setShowOrderModal(true);
//   };

//   const handleEditClick = (order) => {
//     setCurrentOrder(order);
//     setEditFormData({
//       customer_info: {
//         name: order.customer_info.name || '',
//         email: order.customer_info.email || '',
//         contact: order.customer_info.contact || '',
//         address: order.customer_info.address || '',
//         city: order.customer_info.city || '',
//         notes: order.customer_info.notes || '',
//         momo_number: order.customer_info.momo_number || '',
//         momo_network: order.customer_info.momo_network || ''
//       },
//       cart: [...order.cart],
//       payment_method: order.payment_method || 'cod'
//     });
//     setShowEditModal(true);
//   };

//   const handleEditFormChange = (field, value, index = null) => {
//     if (field.startsWith('customer_info.')) {
//       const customerField = field.split('.')[1];
//       setEditFormData(prev => ({
//         ...prev,
//         customer_info: {
//           ...prev.customer_info,
//           [customerField]: value
//         }
//       }));
//     } else if (field === 'payment_method') {
//       setEditFormData(prev => ({
//         ...prev,
//         payment_method: value
//       }));
//     } else if (field.startsWith('cart.')) {
//       const cartField = field.split('.')[1];
//       setEditFormData(prev => ({
//         ...prev,
//         cart: prev.cart.map((item, i) => 
//           i === index ? { ...item, [cartField]: value } : item
//         )
//       }));
//     }
//   };

//   const handleRemoveCartItem = (index) => {
//     setEditFormData(prev => ({
//       ...prev,
//       cart: prev.cart.filter((_, i) => i !== index)
//     }));
//   };

//   const handleUpdateOrder = async () => {
//     if (!currentOrder) {
//       toast.error('No order selected.');
//       return;
//     }

//     // Validate required fields
//     if (!editFormData.customer_info.name || !editFormData.customer_info.email || 
//         !editFormData.customer_info.contact || !editFormData.customer_info.address) {
//       toast.error('Please fill in all required customer information fields.');
//       return;
//     }

//     if (editFormData.cart.length === 0) {
//       toast.error('Order must contain at least one item.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       // Prepare the data to send to backend
//       const updateData = {
//         customer_info: editFormData.customer_info,
//         cart: editFormData.cart,
//         payment_method: editFormData.payment_method
//       };

//       const response = await fetch(`${API_BASE_URL}/orders/admin/${currentOrder.id}/edit`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(updateData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to update order.');
//       }

//       toast.success('Order updated successfully!');
//       setShowEditModal(false);
//       fetchOrders();
//     } catch (err) {
//       console.error('Error updating order:', err);
//       setError(err.message);
//       toast.error(`Error updating order: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateStatus = async () => {
//     if (!currentOrder || !newOrderStatus) {
//       toast.error('No order selected or status not set.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/orders/admin/${currentOrder.id}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newOrderStatus }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to update order status.');
//       }

//       toast.success('Order status updated successfully!');
//       setShowOrderModal(false);
//       fetchOrders();
//     } catch (err) {
//       console.error('Error updating order status:', err);
//       setError(err.message);
//       toast.error(`Error updating status: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteOrder = async (orderId) => {
//     if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/api/v1/orders/admin/${orderId}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to delete order.');
//       }

//       toast.success('Order deleted successfully!');
//       fetchOrders();
//     } catch (err) {
//       console.error('Error deleting order:', err);
//       setError(err.message);
//       toast.error(`Error deleting order: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (pageNumber) => {
//     if (pageNumber > 0 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);

//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }

//     setSearchTimeout(
//       setTimeout(() => {
//         setCurrentPage(1);
//       }, 500)
//     );
//   };

//   const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
//   const paymentMethods = ['cod', 'momo'];
//   const momoNetworks = ['MTN', 'Airtel'];

//   return (
//     <div className="orders-container">
//       <div className="orders-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">Orders Management</h1>
//           </div>
//           <div className="header-actions">
//             <div className="stat-card-compact">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{totalOrders}</div>
//                 <div className="stat-label">Total Orders</div>
//               </div>
//             </div>
//             <div className="search-wrapper">
//               <InputGroup>
//                 <Form.Control
//                   type="text"
//                   placeholder="Search by Order ID or User info..."
//                   value={searchQuery}
//                   onChange={handleSearchChange}
//                   className="search-input"
//                   title="Search by Order ID, name, email, or phone"
//                 />
//                 <Button variant="outline-secondary" onClick={() => {
//                   setSearchQuery('');
//                   setCurrentPage(1);
//                 }}>Clear</Button>
//               </InputGroup>
//             </div>
//           </div>
//         </div>
//       </div>

//       {loading && !error && (
//         <div className="loading-container">
//           <Spinner animation="border" className="loading-spinner" />
//           <h4>Loading orders...</h4>
//           <p>Please wait while we fetch your orders!</p>
//         </div>
//       )}

//       {error && (
//         <Alert variant="danger" className="error-alert" onClose={() => setError(null)} dismissible>
//           {error}
//         </Alert>
//       )}

//       {!loading && !error && orders.length === 0 && (
//         <div className="empty-state">
//           <div className="empty-icon"><i className="bi bi-folder"></i></div>
//           <h4>No Orders Found</h4>
//           <p>Adjust your search criteria to find orders.</p>
//         </div>
//       )}

//       {!loading && !error && orders.length > 0 && (
//         <>
//           <div className="table-responsive">
//             <Table className="orders-table">
//               <thead>
//                 <tr>
//                   <th>Order ID</th>
//                   <th>User</th>
//                   <th>Total Amount</th>
//                   <th>Status</th>
//                   <th>Created At</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((order) => (
//                   <tr key={order.id}>
//                     <td><span className="order-id">{order.id}</span></td>
//                     <td>
//                       {order.user_details ? (
//                         <span className="order-user">
//                           {order.user_details.first_name} {order.user_details.last_name} ({order.user_details.email})
//                         </span>
//                       ) : (
//                         <span className="order-user">Guest ({order.customer_info.email})</span>
//                       )}
//                     </td>
//                     <td><span className="order-total">{parseFloat(order.total).toFixed(2)}</span></td>
//                     <td><span className="order-status">{order.status}</span></td>
//                     <td><span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span></td>
//                     <td>
//                       <div className="action-buttons">
//                         <Button variant="info" size="sm" onClick={() => handleViewEditClick(order)} title="View Details">
//                           <FaEye />
//                         </Button>
//                         <Button variant="warning" size="sm" onClick={() => handleEditClick(order)} title="Edit Order">
//                           <FaEdit />
//                         </Button>
//                         {loggedInUserRole === 'super_admin' && (
//                           <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order.id)} title="Delete">
//                             <FaTrash />
//                           </Button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//           {totalPages > 1 && (
//             <div className="pagination-wrapper">
//               <Pagination className="custom-pagination">
//                 <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
//                 {[...Array(totalPages)].map((_, index) => (
//                   <Pagination.Item
//                     key={index + 1}
//                     active={index + 1 === currentPage}
//                     onClick={() => handlePageChange(index + 1)}
//                   >
//                     {index + 1}
//                   </Pagination.Item>
//                 ))}
//                 <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
//               </Pagination>
//               <div className="pagination-info">Page {currentPage} of {totalPages}</div>
//             </div>
//           )}
//         </>
//       )}

//       {/* View Order Modal */}
//       <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} className="custom-modal" size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Order Details (ID: {currentOrder?.id})</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {currentOrder && (
//             <>
//               <h5>Order Information</h5>
//               <div className="order-detail-row"><strong>User:</strong> {currentOrder.user_details ? `${currentOrder.user_details.first_name} ${currentOrder.user_details.last_name} (${currentOrder.user_details.email})` : `Guest (${currentOrder.customer_info.email})`}</div>
//               <div className="order-detail-row"><strong>Total Amount:</strong> {parseFloat(currentOrder.total).toFixed(2)}</div>
//               <div className="order-detail-row"><strong>Current Status:</strong> {currentOrder.status}</div>
//               <div className="order-detail-row"><strong>Created At:</strong> {new Date(currentOrder.created_at).toLocaleString()}</div>
//               {currentOrder.updated_at && <div className="order-detail-row"><strong>Last Updated:</strong> {new Date(currentOrder.updated_at).toLocaleString()}</div>}

//               <h5 className="mt-4">Customer & Delivery Details</h5>
//               <div className="order-detail-row"><strong>Customer Name:</strong> {currentOrder.customer_info.name || 'N/A'}</div>
//               <div className="order-detail-row"><strong>Email:</strong> {currentOrder.customer_info.email || 'N/A'}</div>
//               <div className="order-detail-row"><strong>Phone:</strong> {currentOrder.customer_info.contact || 'N/A'}</div>
//               <div className="order-detail-row"><strong>Address:</strong> {currentOrder.customer_info.address || 'N/A'}</div>
//               <div className="order-detail-row"><strong>City:</strong> {currentOrder.customer_info.city || 'N/A'}</div>
//               {currentOrder.customer_info.notes && <div className="order-detail-row"><strong>Notes:</strong> {currentOrder.customer_info.notes}</div>}

//               <h5 className="mt-4">Payment Details</h5>
//               <div className="order-detail-row"><strong>Payment Method:</strong> {currentOrder.payment_method || 'N/A'}</div>
//               {currentOrder.customer_info.momo_number && (
//                 <div className="order-detail-row"><strong>MoMo Number:</strong> {currentOrder.customer_info.momo_number} ({currentOrder.customer_info.momo_network})</div>
//               )}
//               {currentOrder.payment_proof_url && (
//                 <div className="order-detail-row"><strong>Payment Proof:</strong> <a href={currentOrder.payment_proof_url} target="_blank" rel="noopener noreferrer">View Proof</a></div>
//               )}

//               <h5 className="mt-4">Order Items</h5>
//               {currentOrder.cart && currentOrder.cart.length > 0 ? (
//                 <Table striped bordered hover size="sm">
//                   <thead>
//                     <tr>
//                       <th>Product Name</th>
//                       <th>Quantity</th>
//                       <th>Price per Item</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentOrder.cart.map((item, index) => (
//                       <tr key={index}>
//                         <td>
//                           {item.product_image_url && (
//                             <img src={item.product_image_url} alt={item.product_name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
//                           )}
//                           {item.product_name}
//                         </td>
//                         <td>{item.quantity}</td>
//                         <td>{parseFloat(item.price).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               ) : (
//                 <p>No items found for this order.</p>
//               )}

//               <h5 className="mt-4">Update Order Status</h5>
//               <Form.Group className="mb-3">
//                 <Form.Label>New Status</Form.Label>
//                 <Form.Select
//                   value={newOrderStatus}
//                   onChange={(e) => setNewOrderStatus(e.target.value)}
//                   disabled={loading}
//                 >
//                   {allowedStatuses.map(status => (
//                     <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleUpdateStatus} disabled={loading}>
//             {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Update Status'}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Edit Order Modal */}
//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className="custom-modal" size="xl">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Edit Order (ID: {currentOrder?.id})</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {currentOrder && (
//             <>
//               <h5>Customer Information</h5>
//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Customer Name *</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={editFormData.customer_info.name}
//                       onChange={(e) => handleEditFormChange('customer_info.name', e.target.value)}
//                       required
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Email *</Form.Label>
//                     <Form.Control
//                       type="email"
//                       value={editFormData.customer_info.email}
//                       onChange={(e) => handleEditFormChange('customer_info.email', e.target.value)}
//                       required
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Phone *</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={editFormData.customer_info.contact}
//                       onChange={(e) => handleEditFormChange('customer_info.contact', e.target.value)}
//                       required
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>City</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={editFormData.customer_info.city}
//                       onChange={(e) => handleEditFormChange('customer_info.city', e.target.value)}
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Form.Group className="mb-3">
//                 <Form.Label>Delivery Address *</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={2}
//                   value={editFormData.customer_info.address}
//                   onChange={(e) => handleEditFormChange('customer_info.address', e.target.value)}
//                   required
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Special Notes</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={2}
//                   value={editFormData.customer_info.notes}
//                   onChange={(e) => handleEditFormChange('customer_info.notes', e.target.value)}
//                 />
//               </Form.Group>

//               <h5 className="mt-4">Payment Information</h5>
//               <Row>
//                 <Col md={4}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Payment Method</Form.Label>
//                     <Form.Select
//                       value={editFormData.payment_method}
//                       onChange={(e) => handleEditFormChange('payment_method', e.target.value)}
//                     >
//                       {paymentMethods.map(method => (
//                         <option key={method} value={method}>{method.toUpperCase()}</option>
//                       ))}
//                     </Form.Select>
//                   </Form.Group>
//                 </Col>
//                 {editFormData.payment_method === 'momo' && (
//                   <>
//                     <Col md={4}>
//                       <Form.Group className="mb-3">
//                         <Form.Label>MoMo Number</Form.Label>
//                         <Form.Control
//                           type="text"
//                           value={editFormData.customer_info.momo_number}
//                           onChange={(e) => handleEditFormChange('customer_info.momo_number', e.target.value)}
//                         />
//                       </Form.Group>
//                     </Col>
//                     <Col md={4}>
//                       <Form.Group className="mb-3">
//                         <Form.Label>MoMo Network</Form.Label>
//                         <Form.Select
//                           value={editFormData.customer_info.momo_network}
//                           onChange={(e) => handleEditFormChange('customer_info.momo_network', e.target.value)}
//                         >
//                           <option value="">Select Network</option>
//                           {momoNetworks.map(network => (
//                             <option key={network} value={network}>{network}</option>
//                           ))}
//                         </Form.Select>
//                       </Form.Group>
//                     </Col>
//                   </>
//                 )}
//               </Row>

//               <h5 className="mt-4">Order Items</h5>
//               {editFormData.cart.map((item, index) => (
//                 <Card key={index} className="mb-2">
//                   <Card.Body>
//                     <Row className="align-items-center">
//                       <Col md={6}>
//                         <div className="d-flex align-items-center">
//                           {item.product_image_url && (
//                             <img 
//                               src={item.product_image_url} 
//                               alt={item.product_name} 
//                               style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} 
//                             />
//                           )}
//                           <div>
//                             <strong>{item.product_name}</strong>
//                             <div className="text-muted">Price: ${parseFloat(item.price).toFixed(2)}</div>
//                           </div>
//                         </div>
//                       </Col>
//                       <Col md={4}>
//                         <Form.Group>
//                           <Form.Label>Quantity</Form.Label>
//                           <Form.Control
//                             type="number"
//                             min="1"
//                             value={item.quantity}
//                             onChange={(e) => handleEditFormChange('cart.quantity', parseInt(e.target.value) || 1, index)}
//                           />
//                         </Form.Group>
//                       </Col>
//                       <Col md={2} className="text-end">
//                         <Button
//                           variant="outline-danger"
//                           size="sm"
//                           onClick={() => handleRemoveCartItem(index)}
//                           title="Remove Item"
//                         >
//                           <FaMinus />
//                         </Button>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               ))}
              
//               {editFormData.cart.length === 0 && (
//                 <Alert variant="warning">
//                   This order has no items. Please add at least one item before saving.
//                 </Alert>
//               )}
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEditModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleUpdateOrder} disabled={loading || editFormData.cart.length === 0}>
//             {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save Changes'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminOrdersPage;




// import React, { useState, useEffect, useCallback } from 'react';
// import { toast } from 'react-toastify';
// import moment from 'moment';
// import Modal from 'react-modal';
// import { useNavigate } from 'react-router-dom';

// const API_BASE_URL = 'http://127.0.0.1:5000';

// const AdminOrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [currentOrder, setCurrentOrder] = useState(null);
//   const [newOrderStatus, setNewOrderStatus] = useState('');
//   const [loggedInUserRole, setLoggedInUserRole] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     customer_info: {
//       name: '',
//       email: '',
//       contact: '',
//       address: '',
//       city: '',
//       notes: '',
//       momo_number: '',
//       momo_network: '',
//     },
//     payment_method: '',
//     cart: [],
//   });

//   const navigate = useNavigate();

//   const handleAuthError = (message) => {
//     toast.error(message);
//     sessionStorage.removeItem('token');
//     navigate('/login');
//   };

//   const fetchOrders = useCallback(async () => {
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

//       const params = new URLSearchParams({
//         page: currentPage,
//         per_page: 10,
//         search: searchQuery,
//       });

//       const response = await fetch(`${API_BASE_URL}/api/v1/orders/admin?${params.toString()}`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to fetch orders.');
//       }

//       const data = await response.json();
//       const filteredOrders = data.orders.map(order => ({
//         id: order.id,
//         order_id: order.order_id,
//         status: order.status,
//         total: order.total,
//         created_at: order.created_at,
//         updated_at: order.updated_at,
//         payment_method: order.payment_method,
//         payment_proof_url: order.payment_proof_url,
//         customer_info: {
//           name: order.customer_info.name,
//           email: order.customer_info.email,
//           contact: order.customer_info.contact,
//           address: order.customer_info.address,
//           city: order.customer_info.city,
//           notes: order.customer_info.notes,
//           momo_number: order.customer_info.momoNumber,
//           momo_network: order.customer_info.momoNetwork,
//         },
//         user_details: order.user_details || null,
//         cart: order.cart,
//       }));
//       setOrders(filteredOrders);
//       setTotalOrders(data.total_orders || 0);
//       setTotalPages(data.pages || 1);
//     } catch (err) {
//       console.error('Error fetching orders:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, loggedInUserRole, navigate]);

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       const decodedToken = JSON.parse(atob(token.split('.')[1]));
//       setLoggedInUserRole(decodedToken.user_type);
//     }
//     fetchOrders();
//   }, [fetchOrders]);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleViewClick = (order) => {
//     setCurrentOrder(order);
//     setNewOrderStatus(order.status);
//     setShowOrderModal(true);
//   };

//   const handleEditClick = (order) => {
//     setCurrentOrder(order);
//     setEditFormData({
//       customer_info: { ...order.customer_info },
//       payment_method: order.payment_method,
//       cart: order.cart.map(item => ({
//         product_id: item.product_id,
//         product_name: item.product_name,
//         quantity: item.quantity,
//         price: item.price,
//       })),
//     });
//     setShowEditModal(true);
//   };

//   const handleEditFormChange = (e, field, subField = null) => {
//     if (subField) {
//       setEditFormData({
//         ...editFormData,
//         [field]: {
//           ...editFormData[field],
//           [subField]: e.target.value,
//         },
//       });
//     } else {
//       setEditFormData({
//         ...editFormData,
//         [field]: e.target.value,
//       });
//     }
//   };

//   const handleRemoveCartItem = (index) => {
//     const updatedCart = editFormData.cart.filter((_, i) => i !== index);
//     setEditFormData({ ...editFormData, cart: updatedCart });
//   };

//   const handleUpdateOrder = async () => {
//     if (!currentOrder) {
//       toast.error('No order selected.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/api/v1/orders/admin/${currentOrder.id}/edit`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(editFormData),
//       });

//       const responseData = await response.json();
//       console.log('Edit Order Response:', responseData);

//       if (!response.ok) {
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(responseData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(responseData.error || 'Failed to update order.');
//       }

//       toast.success('Order updated successfully!');
//       setShowEditModal(false);
//       fetchOrders();
//     } catch (err) {
//       console.error('Error updating order:', err);
//       setError(err.message);
//       toast.error(`Error updating order: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateStatus = async () => {
//     if (!currentOrder || !newOrderStatus) {
//       toast.error('No order selected or status not set.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/api/v1/orders/admin/${currentOrder.id}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newOrderStatus }),
//       });

//       const responseData = await response.json();
//       console.log('Status Update Response:', responseData);

//       if (!response.ok) {
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(responseData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(responseData.error || 'Failed to update order status.');
//       }

//       toast.success('Order status updated successfully!');
//       setShowOrderModal(false);
//       fetchOrders();
//     } catch (err) {
//       console.error('Error updating order status:', err);
//       setError(err.message);
//       toast.error(`Error updating status: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteOrder = async (orderId) => {
//     if (!window.confirm('Are you sure you want to delete this order?')) return;

//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/api/v1/orders/admin/${orderId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to delete order.');
//       }

//       toast.success('Order deleted successfully!');
//       fetchOrders();
//     } catch (err) {
//       console.error('Error deleting order:', err);
//       setError(err.message);
//       toast.error(`Error deleting order: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       {loading && <div>Loading...</div>}

//       <input
//         type="text"
//         value={searchQuery}
//         onChange={handleSearchChange}
//         placeholder="Search by order ID, customer name, or email"
//         className="mb-4 p-2 border rounded w-full"
//       />

//       <table className="min-w-full bg-white border">
//         <thead>
//           <tr>
//             <th className="py-2 px-4 border">Order ID</th>
//             <th className="py-2 px-4 border">Customer</th>
//             <th className="py-2 px-4 border">Status</th>
//             <th className="py-2 px-4 border">Total</th>
//             <th className="py-2 px-4 border">Created</th>
//             <th className="py-2 px-4 border">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map(order => (
//             <tr key={order.id}>
//               <td className="py-2 px-4 border">{order.order_id}</td>
//               <td className="py-2 px-4 border">{order.customer_info.name}</td>
//               <td className="py-2 px-4 border">{order.status}</td>
//               <td className="py-2 px-4 border">GHS {order.total}</td>
//               <td className="py-2 px-4 border">{moment(order.created_at).format('YYYY-MM-DD HH:mm')}</td>
//               <td className="py-2 px-4 border">
//                 <button
//                   onClick={() => handleViewClick(order)}
//                   className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
//                 >
//                   View
//                 </button>
//                 <button
//                   onClick={() => handleEditClick(order)}
//                   className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDeleteOrder(order.id)}
//                   className="bg-red-500 text-white px-2 py-1 rounded"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="mt-4 flex justify-between">
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>Page {currentPage} of {totalPages} (Total Orders: {totalOrders})</span>
//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

//       <Modal isOpen={showOrderModal} onRequestClose={() => setShowOrderModal(false)} className="modal" overlayClassName="overlay">
//         {currentOrder && (
//           <div className="bg-white p-6 rounded max-w-2xl mx-auto mt-20">
//             <h2 className="text-xl font-bold mb-4">Order Details</h2>
//             <p><strong>Order ID:</strong> {currentOrder.order_id}</p>
//             <p><strong>Customer Name:</strong> {currentOrder.customer_info.name}</p>
//             <p><strong>Email:</strong> {currentOrder.customer_info.email}</p>
//             <p><strong>Contact:</strong> {currentOrder.customer_info.contact}</p>
//             <p><strong>Address:</strong> {currentOrder.customer_info.address}, {currentOrder.customer_info.city}</p>
//             <p><strong>Notes:</strong> {currentOrder.customer_info.notes || 'None'}</p>
//             <p><strong>Payment Method:</strong> {currentOrder.payment_method}</p>
//             {currentOrder.payment_method === 'momo' && (
//               <>
//                 <p><strong>MoMo Number:</strong> {currentOrder.customer_info.momo_number}</p>
//                 <p><strong>MoMo Network:</strong> {currentOrder.customer_info.momo_network}</p>
//               </>
//             )}
//             {currentOrder.payment_proof_url && (
//               <p><strong>Payment Proof:</strong> <a href={`${API_BASE_URL}${currentOrder.payment_proof_url}`} target="_blank" rel="noopener noreferrer">View</a></p>
//             )}
//             <p><strong>Total:</strong> GHS {currentOrder.total}</p>
//             <p><strong>Created:</strong> {moment(currentOrder.created_at).format('YYYY-MM-DD HH:mm')}</p>
//             <p><strong>Updated:</strong> {moment(currentOrder.updated_at).format('YYYY-MM-DD HH:mm')}</p>
//             <h3 className="font-bold mt-4">Items:</h3>
//             <ul>
//               {currentOrder.cart.map((item, index) => (
//                 <li key={index}>
//                   {item.product_name} (ID: {item.product_id}) - Quantity: {item.quantity}, Price: GHS {item.price}
//                 </li>
//               ))}
//             </ul>
//             <div className="mt-4">
//               <label className="block mb-2">Update Status:</label>
//               <select
//                 value={newOrderStatus}
//                 onChange={(e) => setNewOrderStatus(e.target.value)}
//                 className="border p-2 rounded w-full"
//               >
//                 <option value="">Select Status</option>
//                 {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
//                   <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
//                 ))}
//               </select>
//               <button
//                 onClick={handleUpdateStatus}
//                 className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
//                 disabled={loading}
//               >
//                 Update Status
//               </button>
//             </div>
//             <button
//               onClick={() => setShowOrderModal(false)}
//               className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
//             >
//               Close
//             </button>
//           </div>
//         )}
//       </Modal>

//       <Modal isOpen={showEditModal} onRequestClose={() => setShowEditModal(false)} className="modal" overlayClassName="overlay">
//         {currentOrder && (
//           <div className="bg-white p-6 rounded max-w-2xl mx-auto mt-20">
//             <h2 className="text-xl font-bold mb-4">Edit Order</h2>
//             <div className="mb-4">
//               <label className="block mb-1">Customer Name:</label>
//               <input
//                 type="text"
//                 value={editFormData.customer_info.name}
//                 onChange={(e) => handleEditFormChange(e, 'customer_info', 'name')}
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1">Email:</label>
//               <input
//                 type="email"
//                 value={editFormData.customer_info.email}
//                 onChange={(e) => handleEditFormChange(e, 'customer_info', 'email')}
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1">Contact:</label>
//               <input
//                 type="text"
//                 value={editFormData.customer_info.contact}
//                 onChange={(e) => handleEditFormChange(e, 'customer_info', 'contact')}
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1">Address:</label>
//               <input
//                 type="text"
//                 value={editFormData.customer_info.address}
//                 onChange={(e) => handleEditFormChange(e, 'customer_info', 'address')}
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1">City:</label>
//               <input
//                 type="text"
//                 value={editFormData.customer_info.city}
//                 onChange={(e) => handleEditFormChange(e, 'customer_info', 'city')}
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1">Notes:</label>
//               <textarea
//                 value={editFormData.customer_info.notes}
//                 onChange={(e) => handleEditFormChange(e, 'customer_info', 'notes')}
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1">Payment Method:</label>
//               <select
//                 value={editFormData.payment_method}
//                 onChange={(e) => handleEditFormChange(e, 'payment_method')}
//                 className="border p-2 rounded w-full"
//               >
//                 <option value="cod">Cash on Delivery</option>
//                 <option value="momo">Mobile Money</option>
//               </select>
//             </div>
//             {editFormData.payment_method === 'momo' && (
//               <>
//                 <div className="mb-4">
//                   <label className="block mb-1">MoMo Number:</label>
//                   <input
//                     type="text"
//                     value={editFormData.customer_info.momo_number}
//                     onChange={(e) => handleEditFormChange(e, 'customer_info', 'momo_number')}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block mb-1">MoMo Network:</label>
//                   <input
//                     type="text"
//                     value={editFormData.customer_info.momo_network}
//                     onChange={(e) => handleEditFormChange(e, 'customer_info', 'momo_network')}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>
//               </>
//             )}
//             <h3 className="font-bold mt-4">Cart Items:</h3>
//             <ul>
//               {editFormData.cart.map((item, index) => (
//                 <li key={index} className="mb-2">
//                   {item.product_name} (ID: {item.product_id}) - Quantity: {item.quantity}, Price: GHS {item.price}
//                   <button
//                     onClick={() => handleRemoveCartItem(index)}
//                     className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
//                   >
//                     Remove
//                   </button>
//                 </li>
//               ))}
//             </ul>
//             <button
//               onClick={handleUpdateOrder}
//               className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
//               disabled={loading}
//             >
//               Save Changes
//             </button>
//             <button
//               onClick={() => setShowEditModal(false)}
//               className="mt-4 bg-gray-500 text-white px-4 py-2 rounded ml-2"
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default AdminOrdersPage;








// import React, { useState, useEffect, useCallback } from 'react';
// import { toast } from 'react-toastify';
// import moment from 'moment';
// import Modal from 'react-modal';
// import { useNavigate } from 'react-router-dom';
// import API_BASE_URL from '../../config';

// const AdminOrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [currentOrder, setCurrentOrder] = useState(null);
//   const [newOrderStatus, setNewOrderStatus] = useState('');
//   const [loggedInUserRole, setLoggedInUserRole] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     customer_info: {
//       name: '',
//       email: '',
//       contact: '',
//       address: '',
//       city: '',
//       notes: '',
//       momo_number: '',
//       momo_network: '',
//     },
//     payment_method: '',
//     cart: [],
//   });

//   const navigate = useNavigate();

//   const handleAuthError = (message) => {
//     console.error('Auth Error:', message); // Debug auth issues
//     toast.error(message);
//     sessionStorage.removeItem('token');
//     navigate('/login');
//   };

//   const fetchOrders = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         console.warn('No token found in sessionStorage');
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       // Decode token to check role
//       let userRole;
//       try {
//         const decodedToken = JSON.parse(atob(token.split('.')[1]));
//         userRole = decodedToken.user_type;
//         setLoggedInUserRole(userRole);
//       } catch (err) {
//         console.error('Error decoding token:', err);
//         handleAuthError('Invalid or expired token. Please log in again.');
//         return;
//       }

//       if (userRole !== 'admin' && userRole !== 'super_admin') {
//         console.warn('User role not authorized:', userRole);
//         handleAuthError('You do not have permission to view this page.');
//         return;
//       }

//       const params = new URLSearchParams({
//         page: currentPage,
//         per_page: 10,
//         search: searchQuery,
//       });

//       const response = await fetch(`${API_BASE_URL}/api/v1/orders/admin?${params.toString()}`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });

//       console.log('Orders API Response Status:', response.status); // Debug
//       const responseData = await response.json();
//       console.log('Orders API Response Data:', responseData); // Debug

//       if (!response.ok) {
//         if (response.status === 401 || response.status === 403) {
//           console.warn('Auth failure in fetchOrders:', responseData.error);
//           setError(responseData.error || 'Authentication failed or access denied. Please log in again.');
//           return; // Avoid immediate logout
//         }
//         throw new Error(responseData.error || 'Failed to fetch orders.');
//       }

//       const filteredOrders = responseData.orders.map(order => ({
//         id: order.id,
//         order_id: order.order_id,
//         status: order.status,
//         total: order.total,
//         created_at: order.created_at,
//         updated_at: order.updated_at,
//         payment_method: order.payment_method,
//         payment_proof_url: order.payment_proof_url,
//         customer_info: {
//           name: order.customer_info.name,
//           email: order.customer_info.email,
//           contact: order.customer_info.contact,
//           address: order.customer_info.address,
//           city: order.customer_info.city,
//           notes: order.customer_info.notes,
//           momo_number: order.customer_info.momoNumber,
//           momo_network: order.customer_info.momoNetwork,
//         },
//         user_details: order.user_details || null,
//         cart: order.cart,
//       }));
//       setOrders(filteredOrders);
//       setTotalOrders(responseData.total_orders || 0);
//       setTotalPages(responseData.pages || 1);
//     } catch (err) {
//       console.error('Error fetching orders:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, navigate]);

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = JSON.parse(atob(token.split('.')[1]));
//         setLoggedInUserRole(decodedToken.user_type);
//       } catch (err) {
//         console.error('Error decoding token on mount:', err);
//         handleAuthError('Invalid or expired token. Please log in again.');
//       }
//     } else {
//       handleAuthError('Authentication token missing. Please log in.');
//     }
//   }, []);

//   useEffect(() => {
//     if (loggedInUserRole !== null) {
//       fetchOrders();
//     }
//   }, [fetchOrders, loggedInUserRole]);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleViewClick = (order) => {
//     setCurrentOrder(order);
//     setNewOrderStatus(order.status);
//     setShowOrderModal(true);
//   };

//   const handleEditClick = (order) => {
//     setCurrentOrder(order);
//     setEditFormData({
//       customer_info: { ...order.customer_info },
//       payment_method: order.payment_method,
//       cart: order.cart.map(item => ({
//         product_id: item.product_id,
//         product_name: item.product_name,
//         quantity: item.quantity,
//         price: item.price,
//       })),
//     });
//     setShowEditModal(true);
//   };

//   const handleEditFormChange = (e, field, subField = null) => {
//     if (subField) {
//       setEditFormData({
//         ...editFormData,
//         [field]: {
//           ...editFormData[field],
//           [subField]: e.target.value,
//         },
//       });
//     } else {
//       setEditFormData({
//         ...editFormData,
//         [field]: e.target.value,
//       });
//     }
//   };

//   const handleRemoveCartItem = (index) => {
//     const updatedCart = editFormData.cart.filter((_, i) => i !== index);
//     setEditFormData({ ...editFormData, cart: updatedCart });
//   };

//   const handleUpdateOrder = async () => {
//     if (!currentOrder) {
//       toast.error('No order selected.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/api/v1/orders/admin/${currentOrder.id}/edit`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(editFormData),
//       });

//       const responseData = await response.json();
//       console.log('Edit Order Response:', responseData);

//       if (!response.ok) {
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(responseData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(responseData.error || 'Failed to update order.');
//       }

//       toast.success('Order updated successfully!');
//       setShowEditModal(false);
//       fetchOrders();
//     } catch (err) {
//       console.error('Error updating order:', err);
//       setError(err.message);
//       toast.error(`Error updating order: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateStatus = async () => {
//     if (!currentOrder || !newOrderStatus) {
//       toast.error('No order selected or status not set.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/api/v1/orders/admin/${currentOrder.id}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newOrderStatus }),
//       });

//       const responseData = await response.json();
//       console.log('Status Update Response:', responseData);

//       if (!response.ok) {
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(responseData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(responseData.error || 'Failed to update order status.');
//       }

//       toast.success('Order status updated successfully!');
//       setShowOrderModal(false);
//       fetchOrders();
//     } catch (err) {
//       console.error('Error updating order status:', err);
//       setError(err.message);
//       toast.error(`Error updating status: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteOrder = async (orderId) => {
//     if (!window.confirm('Are you sure you want to delete this order?')) return;

//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/api/v1/orders/admin/${orderId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (errorData.status === 401 || errorData.status === 403) {
//           handleAuthError(errorData.error || 'Authentication failed or access denied. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to delete order.');
//       }

//       toast.success('Order deleted successfully!');
//       fetchOrders();
//     } catch (err) {
//       console.error('Error deleting order:', err);
//       setError(err.message);
//       toast.error(`Error deleting order: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       {loading && <div>Loading...</div>}

//       <input
//         type="text"
//         value={searchQuery}
//         onChange={handleSearchChange}
//         placeholder="Search by order ID, customer name, or email"
//         className="mb-4 p-2 border rounded w-full"
//       />

//       <table className="min-w-full bg-white border">
//         <thead>
//           <tr>
//             <th className="py-2 px-4 border">Order ID</th>
//             <th className="py-2 px-4 border">Customer</th>
//             <th className="py-2 px-4 border">Status</th>
//             <th className="py-2 px-4 border">Total</th>
//             <th className="py-2 px-4 border">Created</th>
//             <th className="py-2 px-4 border">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map(order => (
//             <tr key={order.id}>
//               <td className="py-2 px-4 border">{order.order_id}</td>
//               <td className="py-2 px-4 border">{order.customer_info.name}</td>
//               <td className="py-2 px-4 border">{order.status}</td>
//               <td className="py-2 px-4 border">GHS {order.total}</td>
//               <td className="py-2 px-4 border">{moment(order.created_at).format('YYYY-MM-DD HH:mm')}</td>
//               <td className="py-2 px-4 border">
//                 <button
//                   onClick={() => handleViewClick(order)}
//                   className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
//                 >
//                   View
//                 </button>
//                 <button
//                   onClick={() => handleEditClick(order)}
//                   className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDeleteOrder(order.id)}
//                   className="bg-red-500 text-white px-2 py-1 rounded"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="mt-4 flex justify-between">
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>Page {currentPage} of {totalPages} (Total Orders: {totalOrders})</span>
//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

//       <Modal isOpen={showOrderModal} onRequestClose={() => setShowOrderModal(false)} className="modal" overlayClassName="overlay">
//         {currentOrder && (
//           <div className="bg-white p-6 rounded max-w-2xl mx-auto mt-20">
//             <h2 className="text-xl font-bold mb-4">Order Details</h2>
//             <p><strong>Order ID:</strong> {currentOrder.order_id}</p>
//             <p><strong>Customer Name:</strong> {currentOrder.customer_info.name}</p>
//             <p><strong>Email:</strong> {currentOrder.customer_info.email}</p>
//             <p><strong>Contact:</strong> {currentOrder.customer_info.contact}</p>
//             <p><strong>Address:</strong> {currentOrder.customer_info.address}, {currentOrder.customer_info.city}</p>
//             <p><strong>Notes:</strong> {currentOrder.customer_info.notes || 'None'}</p>
//             <p><strong>Payment Method:</strong> {currentOrder.payment_method}</p>
//             {currentOrder.payment_method === 'momo' && (
//               <>
//                 <p><strong>MoMo Number:</strong> {currentOrder.customer_info.momo_number}</p>
//                 <p><strong>MoMo Network:</strong> {currentOrder.customer_info.momo_network}</p>
//               </>
//             )}
//             {currentOrder.payment_proof_url && (
//               <p><strong>Payment Proof:</strong> <a href={`${API_BASE_URL}${currentOrder.payment_proof_url}`} target="_blank" rel="noopener noreferrer">View</a></p>
//             )}
//             <p><strong>Total:</strong> GHS {currentOrder.total}</p>
//             <p><strong>Created:</strong> {moment(currentOrder.created_at).format('YYYY-MM-DD HH:mm')}</p>
//             <p><strong>Updated:</strong> {moment(currentOrder.updated_at).format('YYYY-MM-DD HH:mm')}</p>
//             <h3 className="font-bold mt-4">Items:</h3>
//             <ul>
//               {currentOrder.cart.map((item, index) => (
//                 <li key={index}>
//                   {item.product_name} (ID: {item.product_id}) - Quantity: {item.quantity}, Price: GHS {item.price}
//                 </li>
//               ))}
//             </ul>
//             <div className="mt-4">
//               <label className="block mb-2">Update Status:</label>
//               <select
//                 value={newOrderStatus}
//                 onChange={(e) => setNewOrderStatus(e.target.value)}
//                 className="border p-2 rounded w-full"
//               >
//                 <option value="">Select Status</option>
//                 {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
//                   <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
//                 ))}
//               </select>
//               <button
//                 onClick={handleUpdateStatus}
//                 className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
//                 disabled={loading}
//               >
//                 Update Status
//               </button>
//             </div>
//             <button
//               onClick={() => setShowOrderModal(false)}
//               className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
//             >
//               Close
//             </button>
//           </div>
//         )}
//       </Modal>

//       <Modal isOpen={showEditModal} onRequestClose={() => setShowEditModal(false)} className="modal" overlayClassName="overlay">
//         {currentOrder && (
//           <div className="bg-white p-6 rounded max-w-2xl mx-auto mt-20">
//             <h2 className="text-xl font-bold mb-4">Edit Order</h2>
//             <div className="mb-4">
//               <label className="block mb-1">Customer Name:</label>
//               <input
//                 type="text"
//                 value={editFormData.customer_info.name}
//                 onChange={(e) => handleEditFormChange(e, 'customer_info', 'name')}
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1">Email:</label>
//               <input
//                 type="email"
//                 value={editFormData.customer_info.email}
//                 onChange={(e) => handleEditFormChange(e, 'customer_info', 'email')}
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1">Contact:</label>
//               <input
//                 type="text"
//                 value={editFormData.customer_info.contact}
//                 onChange={(e) => handleEditFormChange(e, 'customer_info', 'contact')}
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1">Address:</label>
//               <input
//                 type="text"
//                 value={editFormData.customer_info.address}
//                 onChange={(e) => handleEditFormChange(e, 'customer_info', 'address')}
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1">City:</label>
//               <input
//                 type="text"
//                 value={editFormData.customer_info.city}
//                 onChange={(e) => handleEditFormChange(e, 'customer_info', 'city')}
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1">Notes:</label>
//               <textarea
//                 value={editFormData.customer_info.notes}
//                 onChange={(e) => handleEditFormChange(e, 'customer_info', 'notes')}
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1">Payment Method:</label>
//               <select
//                 value={editFormData.payment_method}
//                 onChange={(e) => handleEditFormChange(e, 'payment_method')}
//                 className="border p-2 rounded w-full"
//               >
//                 <option value="cod">Cash on Delivery</option>
//                 <option value="momo">Mobile Money</option>
//               </select>
//             </div>
//             {editFormData.payment_method === 'momo' && (
//               <>
//                 <div className="mb-4">
//                   <label className="block mb-1">MoMo Number:</label>
//                   <input
//                     type="text"
//                     value={editFormData.customer_info.momo_number}
//                     onChange={(e) => handleEditFormChange(e, 'customer_info', 'momo_number')}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block mb-1">MoMo Network:</label>
//                   <input
//                     type="text"
//                     value={editFormData.customer_info.momo_network}
//                     onChange={(e) => handleEditFormChange(e, 'customer_info', 'momo_network')}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>
//               </>
//             )}
//             <h3 className="font-bold mt-4">Cart Items:</h3>
//             <ul>
//               {editFormData.cart.map((item, index) => (
//                 <li key={index} className="mb-2">
//                   {item.product_name} (ID: {item.product_id}) - Quantity: {item.quantity}, Price: GHS {item.price}
//                   <button
//                     onClick={() => handleRemoveCartItem(index)}
//                     className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
//                   >
//                     Remove
//                   </button>
//                 </li>
//               ))}
//             </ul>
//             <button
//               onClick={handleUpdateOrder}
//               className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
//               disabled={loading}
//             >
//               Save Changes
//             </button>
//             <button
//               onClick={() => setShowEditModal(false)}
//               className="mt-4 bg-gray-500 text-white px-4 py-2 rounded ml-2"
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default AdminOrdersPage;