// src/components/Admin/AdminSalesPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Spinner, Alert, Pagination, InputGroup, Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Ensure toast is imported
import './styles/AdminSalesPage.css';

const AdminSalesPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [loggedInUserRole, setLoggedInUserRole] = useState(null);
  const navigate = useNavigate();

  // Helper function to handle unauthorized errors and redirect
  const handleAuthError = useCallback((errMessage) => {
    setError(errMessage);
    sessionStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  // --- Determine Logged-in User's Role ---
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      handleAuthError("Authentication token missing. Please log in.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setLoggedInUserRole(decodedToken.user_type || '');
      setLoading(false);
    } catch (err) {
      console.error("Failed to decode token:", err);
      handleAuthError("Invalid or expired token. Please log in again.");
    }
  }, [handleAuthError]);

  // --- Fetch Sales ---
  const fetchSales = useCallback(async () => {
    if (loggedInUserRole === null) {
      return;
    }

    if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
      handleAuthError("You do not have permission to view this page.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        handleAuthError("Authentication token missing. Please log in.");
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        per_page: 10,
        search: searchQuery
      });

      const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

      const response = await fetch(`${API_BASE_URL}/sales?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again.");
          return;
        }
        throw new Error(errorData.error || `Failed to fetch sales: ${response.status}`);
      }

      const data = await response.json();
      setSales(data.sales || []);
      setTotalPages(data.pages || 1);
      setTotalSales(data.total_sales || 0);

    } catch (err) {
      console.error("Error fetching sales:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, loggedInUserRole, handleAuthError]);

  // --- Effect Hook to Trigger Fetch ---
  useEffect(() => {
    if (loggedInUserRole !== null) {
      fetchSales();
    }
  }, [fetchSales, loggedInUserRole]);

  // --- Search Handler with Debounce ---
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

  // --- Pagination Handler ---
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Sales Overview</h2>

      <div className="d-flex justify-content-between mb-3 align-items-center">
        {/* Removed currency from Total Sales display */}
        <h4>Total Sales: {totalSales.toFixed(2)}</h4>
        <InputGroup className="w-auto">
          <Form.Control
            type="text"
            placeholder="Search by Sale ID, Order ID, or User..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ minWidth: '250px' }}
          />
          <Button variant="outline-secondary" onClick={() => {
            setSearchQuery('');
            setCurrentPage(1);
          }}>Clear Search</Button>
        </InputGroup>
      </div>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading sales...</span>
          </Spinner>
          <p className="mt-2">Loading sales...</p>
        </div>
      )}

      {error && <Alert variant="danger">Error: {error}</Alert>}

      {!loading && !error && sales.length === 0 && (
        <Alert variant="info">
          {searchQuery ? "No sales found for your search criteria." : "No sales available."}
        </Alert>
      )}

      {!loading && !error && sales.length > 0 && (
        <>
          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Order ID</th>
                <th>Sale Date</th>
                <th>Amount</th> {/* Column header remains "Amount" */}
                <th>Order Status</th>
                <th>Customer Name</th>
                <th>Customer Email</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.sale_id}>
                  <td>{sale.sale_id}</td>
                  <td>{sale.order_id}</td>
                  {/* Safely display date, converting from ISO string */}
                  <td>{sale.sale_date ? new Date(sale.sale_date).toLocaleDateString() : 'N/A'}</td>
                  {/* Display amount, assuming it's a number from backend. Removed 'UGX ' */}
                  <td>{parseFloat(sale.amount).toFixed(2)}</td> 
                  {/* Access nested order_details and user_details */}
                  <td>{sale.order_details?.status || 'N/A'}</td>
                  <td>
                    {sale.user_details ? `${sale.user_details.first_name || ''} ${sale.user_details.last_name || ''}`.trim() : 'N/A'}
                  </td>
                  <td>{sale.user_details?.email || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          <Pagination className="justify-content-center mt-3">
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
        </>
      )}
    </div>
  );
};

export default AdminSalesPage;




// // import React, { useState, useEffect, useCallback } from 'react';
// // import { Button, Table, Spinner, Alert, Pagination, InputGroup, Form } from 'react-bootstrap';
// // import { jwtDecode } from 'jwt-decode';
// // import { useNavigate } from 'react-router-dom';
// // import { toast } from 'react-toastify';
// // import API_BASE_URL from '../../config';
// // import './styles/AdminSalesPage.css'; // Ensure this path is correct

// // const AdminSalesPage = () => {
// //   const [sales, setSales] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [totalSales, setTotalSales] = useState(0);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [searchTimeout, setSearchTimeout] = useState(null);

// //   const [loggedInUserRole, setLoggedInUserRole] = useState(null);
// //   const navigate = useNavigate();

// //   const handleAuthError = useCallback((errMessage) => {
// //     setError(errMessage);
// //     sessionStorage.removeItem('token');
// //     navigate('/login');
// //   }, [navigate]);

// //   useEffect(() => {
// //     const token = sessionStorage.getItem('token');
// //     if (!token) {
// //       handleAuthError("Authentication token missing. Please log in.");
// //       return;
// //     }

// //     try {
// //       const decodedToken = jwtDecode(token);
// //       setLoggedInUserRole(decodedToken.user_type || '');
// //       setLoading(false);
// //     } catch (err) {
// //       console.error("Failed to decode token:", err);
// //       handleAuthError("Invalid or expired token. Please log in again.");
// //     }
// //   }, [handleAuthError]);

// //   const fetchSales = useCallback(async () => {
// //     if (loggedInUserRole === null) return;
// //     if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
// //       handleAuthError("You do not have permission to view this page.");
// //       return;
// //     }

// //     setLoading(true);
// //     setError(null);

// //     try {
// //       const token = sessionStorage.getItem('token');
// //       if (!token) {
// //         handleAuthError("Authentication token missing. Please log in.");
// //         return;
// //       }

// //       const params = new URLSearchParams({
// //         page: currentPage,
// //         per_page: 10, // Adjust to 6 if API supports exact limit
// //         search: searchQuery,
// //       });

// //       // const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
// //       const response = await fetch(`${API_BASE_URL}/api/v1/sales?${params.toString()}`, {
// //         method: 'GET',
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });

// //       if (!response.ok) {
// //         const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
// //         if (response.status === 401 || response.status === 403) {
// //           handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again.");
// //           return;
// //         }
// //         throw new Error(errorData.error || `Failed to fetch sales: ${response.status}`);
// //       }

// //       const data = await response.json();
// //       console.log("API Response:", data); // Debug: Log the full response
// //       const fetchedSales = data.sales || [];
// //       setSales(fetchedSales);
// //       setTotalSales(fetchedSales.length || 0); // Use actual count from response
// //       setTotalPages(Math.ceil(fetchedSales.length / 10) || 1); // Adjust based on actual data
// //     } catch (err) {
// //       console.error("Error fetching sales:", err);
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [currentPage, searchQuery, loggedInUserRole, handleAuthError]);

// //   useEffect(() => {
// //     if (loggedInUserRole !== null) {
// //       fetchSales();
// //     }
// //   }, [fetchSales, loggedInUserRole]);

// //   const handleSearchChange = (e) => {
// //     const value = e.target.value;
// //     setSearchQuery(value);

// //     if (searchTimeout) clearTimeout(searchTimeout);
// //     setSearchTimeout(setTimeout(() => setCurrentPage(1), 500));
// //   };

// //   const handlePageChange = (pageNumber) => {
// //     if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
// //   };

// //   return (
// //     <div className="sales-container">
// //       <div className="sales-header">
// //         <div className="header-content">
// //           <div className="title-section">
// //             <h1 className="page-title">Sales Overview</h1>
// //           </div>
// //           <div className="header-actions">
// //             <div className="stat-card-compact">
// //               <div className="stat-content text-center">
// //                 <div className="stat-number">{totalSales}</div>
// //                 <div className="stat-label">Total Sales</div>
// //               </div>
// //             </div>
// //             <div className="search-wrapper">
// //               <InputGroup>
// //                 <Form.Control
// //                   type="text"
// //                   placeholder="Search by Sale ID, Order ID, or User..."
// //                   value={searchQuery}
// //                   onChange={handleSearchChange}
// //                   className="search-input"
// //                 />
// //                 <Button variant="outline-secondary" onClick={() => {
// //                   setSearchQuery('');
// //                   setCurrentPage(1);
// //                 }}>Clear</Button>
// //               </InputGroup>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {loading && (
// //         <div className="loading-container">
// //           <Spinner animation="border" className="loading-spinner" />
// //           <p>Loading sales...</p>
// //         </div>
// //       )}

// //       {error && <Alert variant="danger" className="error-alert">{error}</Alert>}

// //       {!loading && !error && sales.length === 0 && (
// //         <Alert variant="info" className="info-alert">
// //           {searchQuery ? "No sales found for your search criteria." : "No sales available."}
// //         </Alert>
// //       )}

// //       {!loading && !error && sales.length > 0 && (
// //         <>
// //           <div className="table-responsive">
// //             <Table className="sales-table">
// //               <thead>
// //                 <tr>
// //                   <th>Sale ID</th>
// //                   <th>Order ID</th>
// //                   <th>Sale Date</th>
// //                   <th>Amount</th>
// //                   <th>Order Status</th>
// //                   <th>Customer Name</th>
// //                   <th>Customer Email</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {sales.map((sale) => (
// //                   <tr key={sale.sale_id}>
// //                     <td>{sale.sale_id}</td>
// //                     <td>{sale.order_id}</td>
// //                     <td>{sale.sale_date ? new Date(sale.sale_date).toLocaleDateString() : 'N/A'}</td>
// //                     <td>{parseFloat(sale.amount).toFixed(2)}</td>
// //                     <td>{sale.order_details?.status || 'N/A'}</td>
// //                     <td>{sale.user_details ? `${sale.user_details.first_name || ''} ${sale.user_details.last_name || ''}`.trim() : 'N/A'}</td>
// //                     <td>{sale.user_details?.email || 'N/A'}</td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </Table>
// //           </div>
// //           {totalPages > 1 && (
// //             <div className="pagination-wrapper">
// //               <Pagination className="custom-pagination">
// //                 <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
// //                 {[...Array(totalPages)].map((_, index) => (
// //                   <Pagination.Item
// //                     key={index + 1}
// //                     active={index + 1 === currentPage}
// //                     onClick={() => handlePageChange(index + 1)}
// //                   >
// //                     {index + 1}
// //                   </Pagination.Item>
// //                 ))}
// //                 <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
// //               </Pagination>
// //             </div>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default AdminSalesPage;






// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Spinner, Alert, Pagination, InputGroup, Form } from 'react-bootstrap';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import API_BASE_URL from '../../config';
// import './styles/AdminSalesPage.css';

// const AdminSalesPage = () => {
//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalSales, setTotalSales] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchTimeout, setSearchTimeout] = useState(null);
//   const [loggedInUserRole, setLoggedInUserRole] = useState(null);
//   const navigate = useNavigate();

//   const handleAuthError = useCallback((errMessage) => {
//     console.error('Auth Error:', errMessage); // Debug auth issues
//     setError(errMessage);
//     sessionStorage.removeItem('token');
//     navigate('/login');
//   }, [navigate]);

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       handleAuthError("Authentication token missing. Please log in.");
//       return;
//     }

//     try {
//       const decodedToken = jwtDecode(token);
//       setLoggedInUserRole(decodedToken.user_type || '');
//       setLoading(false);
//     } catch (err) {
//       console.error("Failed to decode token:", err);
//       handleAuthError("Invalid or expired token. Please log in again.");
//     }
//   }, [handleAuthError]);

//   const fetchSales = useCallback(async () => {
//     if (loggedInUserRole === null) return;
//     if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
//       handleAuthError("You do not have permission to view this page.");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError("Authentication token missing. Please log in.");
//         return;
//       }

//       const params = new URLSearchParams({
//         page: currentPage,
//         per_page: 10,
//         search: searchQuery,
//       });

//       const response = await fetch(`${API_BASE_URL}/api/v1/sales?${params.toString()}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       console.log('Sales API Response Status:', response.status); // Debug
//       const data = await response.json();
//       console.log('Sales API Response Data:', data); // Debug

//       if (!response.ok) {
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(data.error || "Authentication failed or access denied. Please log in again.");
//           return;
//         }
//         throw new Error(data.error || `Failed to fetch sales: ${response.status}`);
//       }

//       setSales(data.sales || []);
//       setTotalSales(data.total_sales || 0); // Use backend-provided total
//       setTotalPages(data.pages || 1); // Use backend-provided pages
//     } catch (err) {
//       console.error("Error fetching sales:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, loggedInUserRole, handleAuthError]);

//   useEffect(() => {
//     if (loggedInUserRole !== null) {
//       fetchSales();
//     }
//   }, [fetchSales, loggedInUserRole]);

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);

//     if (searchTimeout) clearTimeout(searchTimeout);
//     setSearchTimeout(setTimeout(() => setCurrentPage(1), 500));
//   };

//   const handlePageChange = (pageNumber) => {
//     if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
//   };

//   return (
//     <div className="sales-container">
//       <div className="sales-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">Sales Overview</h1>
//           </div>
//           <div className="header-actions">
//             <div className="stat-card-compact">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{totalSales}</div>
//                 <div className="stat-label">Total Sales</div>
//               </div>
//             </div>
//             <div className="search-wrapper">
//               <InputGroup>
//                 <Form.Control
//                   type="text"
//                   placeholder="Search by Sale ID, Order ID, or User..."
//                   value={searchQuery}
//                   onChange={handleSearchChange}
//                   className="search-input"
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

//       {loading && (
//         <div className="loading-container">
//           <Spinner animation="border" className="loading-spinner" />
//           <p>Loading sales...</p>
//         </div>
//       )}

//       {error && <Alert variant="danger" className="error-alert">{error}</Alert>}

//       {!loading && !error && sales.length === 0 && (
//         <Alert variant="info" className="info-alert">
//           {searchQuery ? "No sales found for your search criteria." : "No sales available."}
//         </Alert>
//       )}

//       {!loading && !error && sales.length > 0 && (
//         <>
//           <div className="table-responsive">
//             <Table className="sales-table">
//               <thead>
//                 <tr>
//                   <th>Sale ID</th>
//                   <th>Order ID</th>
//                   <th>Sale Date</th>
//                   <th>Amount</th>
//                   <th>Order Status</th>
//                   <th>Customer Name</th>
//                   <th>Customer Email</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sales.map((sale) => (
//                   <tr key={sale.sale_id}>
//                     <td>{sale.sale_id}</td>
//                     <td>{sale.order_id}</td>
//                     <td>{sale.sale_date ? new Date(sale.sale_date).toLocaleDateString() : 'N/A'}</td>
//                     <td>{parseFloat(sale.amount).toFixed(2)}</td>
//                     <td>{sale.order_details?.status || 'N/A'}</td>
//                     <td>{sale.user_details ? `${sale.user_details.first_name || ''} ${sale.user_details.last_name || ''}`.trim() : 'N/A'}</td>
//                     <td>{sale.user_details?.email || 'N/A'}</td>
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
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminSalesPage;


















// // src/components/Admin/AdminSalesPage.js
// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Spinner, Alert, Pagination, InputGroup, Form } from 'react-bootstrap';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom'; // <--- Import useNavigate

// const AdminSalesPage = () => {
//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalSales, setTotalSales] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchTimeout, setSearchTimeout] = useState(null);

//   const [loggedInUserRole, setLoggedInUserRole] = useState(null); // Initialize as null to wait for decode
//   const navigate = useNavigate(); // <--- Initialize useNavigate

//   // Helper function to handle unauthorized errors and redirect
//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     sessionStorage.removeItem('token'); // <--- Clear the token from sessionStorage
//     navigate('/login'); // Redirect to login page
//   }, [navigate]);

//   // --- Determine Logged-in User's Role ---
//   useEffect(() => {
//     const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
//     if (!token) {
//       handleAuthError("Authentication token missing. Please log in."); // <--- Use helper
//       return;
//     }

//     try {
//       const decodedToken = jwtDecode(token);
//       setLoggedInUserRole(decodedToken.user_type || '');
//       setLoading(false); // Authentication check done, stop loading if token found
//     } catch (err) {
//       console.error("Failed to decode token:", err);
//       handleAuthError("Invalid or expired token. Please log in again."); // <--- Use helper
//     }
//   }, [handleAuthError]); // Add handleAuthError to dependencies

//   // --- Fetch Sales ---
//   const fetchSales = useCallback(async () => {
//     // Only proceed if the user role has been determined AND it's an admin/super_admin
//     if (loggedInUserRole === null) {
//       return; // Wait for the useEffect above to set the role
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

//       // Construct URL parameters for pagination and search
//       const params = new URLSearchParams({
//         page: currentPage,
//         per_page: 10, // Assuming 10 items per page
//         search: searchQuery // Pass the search query to the backend
//       });

//       const API_BASE_URL = 'http://127.0.0.1:5000/api/v1'; // Define here or as a global constant if not already

//       const response = await fetch(`${API_BASE_URL}/sales?${params.toString()}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//         if (response.status === 401 || response.status === 403) { // Check for Unauthorized or Forbidden
//           handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again."); // <--- Use helper
//           return;
//         }
//         throw new Error(errorData.error || `Failed to fetch sales: ${response.status}`);
//       }

//       const data = await response.json();
//       setSales(data.sales || []);
//       setTotalPages(data.pages || 1);
//       setTotalSales(data.total_sales || 0);

//     } catch (err) {
//       console.error("Error fetching sales:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, loggedInUserRole, handleAuthError]); // Dependencies for useCallback

//   // --- Effect Hook to Trigger Fetch ---
//   useEffect(() => {
//     // Only fetch sales if loggedInUserRole has been determined (is not null)
//     if (loggedInUserRole !== null) {
//       fetchSales();
//     }
//   }, [fetchSales, loggedInUserRole]); // Re-run fetchSales whenever it changes (due to its dependencies)

//   // --- Search Handler with Debounce ---
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value); // Update search query immediately for input display

//     // Clear previous timeout to debounce requests
//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }
//     // Set a new timeout to fetch data after user stops typing
//     setSearchTimeout(
//       setTimeout(() => {
//         setCurrentPage(1); // Reset to first page on new search
//       }, 500) // 500ms debounce time
//     );
//   };

//   // --- Pagination Handler ---
//   const handlePageChange = (pageNumber) => {
//     if (pageNumber > 0 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Sales Overview</h2>

//       <div className="d-flex justify-content-between mb-3 align-items-center">
//         {/* Changed Total Sales display to UGX */}
//         <h4>Total Sales: UGX {totalSales.toFixed(2)}</h4>
//         <InputGroup className="w-auto">
//           <Form.Control
//             type="text"
//             placeholder="Search by Sale ID, Order ID, or User..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             style={{ minWidth: '250px' }}
//           />
//           <Button variant="outline-secondary" onClick={() => {
//             setSearchQuery(''); // Clear input
//             setCurrentPage(1); // Reset page
//           }}>Clear Search</Button>
//         </InputGroup>
//       </div>

//       {loading && (
//         <div className="text-center my-4">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading sales...</span>
//           </Spinner>
//           <p className="mt-2">Loading sales...</p>
//         </div>
//       )}

//       {error && <Alert variant="danger">Error: {error}</Alert>}

//       {!loading && !error && sales.length === 0 && (
//         <Alert variant="info">
//           {searchQuery ? "No sales found for your search criteria." : "No sales available."}
//         </Alert>
//       )}

//       {!loading && !error && sales.length > 0 && (
//         <>
//           <Table striped bordered hover responsive className="mt-3">
//             <thead>
//               <tr>
//                 <th>Sale ID</th>
//                 <th>Order ID</th>
//                 <th>Sale Date</th>
//                 <th>Amount</th> {/* Column header remains "Amount" */}
//                 <th>Order Status</th>
//                 <th>Customer Name</th>
//                 <th>Customer Email</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sales.map((sale) => (
//                 <tr key={sale.sale_id}>
//                   <td>{sale.sale_id}</td>
//                   <td>{sale.order_id}</td>
//                   {/* Safely display date, converting from ISO string */}
//                   <td>{sale.sale_date ? new Date(sale.sale_date).toLocaleDateString() : 'N/A'}</td>
//                   {/* Display amount, assuming it's a number from backend. Removed '$' and added 'UGX ' */}
//                   <td>UGX {parseFloat(sale.amount).toFixed(2)}</td> 
//                   {/* Access nested order_details and user_details */}
//                   <td>{sale.order_details?.status || 'N/A'}</td>
//                   <td>
//                     {sale.user_details ? `${sale.user_details.first_name || ''} ${sale.user_details.last_name || ''}`.trim() : 'N/A'}
//                   </td>
//                   <td>{sale.user_details?.email || 'N/A'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           {/* Pagination Controls */}
//           <Pagination className="justify-content-center mt-3">
//             <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
//             {/* Generate pagination items dynamically */}
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
//     </div>
//   );
// };

// export default AdminSalesPage;









