// src/components/Admin/AdminDiscountsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Spinner, Alert, Pagination, InputGroup, Form, Modal } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; // <--- Import useNavigate

const AdminDiscountsPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDiscounts, setTotalDiscounts] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null); // For editing or new discount
  const [isEditing, setIsEditing] = useState(false); // True if editing, false if creating

  const [loggedInUserRole, setLoggedInUserRole] = useState(null); // Initialize as null to wait for decode
  const navigate = useNavigate(); // <--- Initialize useNavigate

  // IMPORTANT: This should match the base URL for your Flask API
  const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

  // --- Helper function to handle unauthorized errors and redirect ---
  const handleAuthError = useCallback((errMessage) => {
    setError(errMessage);
    sessionStorage.removeItem('token'); // <--- Clear the token from sessionStorage
    navigate('/login'); // Redirect to login page
  }, [navigate]);

  // --- Determine Logged-in User's Role ---
  useEffect(() => {
    const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
    if (!token) {
      handleAuthError("Authentication token missing. Please log in."); // <--- Use helper
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setLoggedInUserRole(decodedToken.user_type || '');
      setLoading(false); // Authentication check done, stop loading if token found
    } catch (err) {
      console.error("Failed to decode token:", err);
      handleAuthError("Invalid or expired token. Please log in again."); // <--- Use helper
    }
  }, [handleAuthError]); // Add handleAuthError to dependencies

  // --- Fetch Discounts ---
  const fetchDiscounts = useCallback(async () => {
    if (loggedInUserRole === null) {
      return; // Wait for role to be determined
    }

    if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
      handleAuthError("You do not have permission to view this page."); // <--- Use helper
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
      if (!token) {
        handleAuthError("Authentication token missing."); // <--- Use helper
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        per_page: 10,
        search: searchQuery,
      });

      const response = await fetch(`${API_BASE_URL}/discounts/?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        if (response.status === 401 || response.status === 403) { // Check for Unauthorized or Forbidden
          handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again."); // <--- Use helper
          return;
        }
        throw new Error(errorData.error || `Failed to fetch discounts: ${response.status}`);
      }

      const data = await response.json();
      setDiscounts(data.discounts || []);
      setTotalPages(data.pages || 1);
      setTotalDiscounts(data.total || 0);

    } catch (err) {
      console.error("Error fetching discounts:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, loggedInUserRole, handleAuthError]); // Add handleAuthError to dependencies

  // Effect hook to trigger fetch when dependencies change
  useEffect(() => {
    // Only fetch discounts if loggedInUserRole has been determined (is not null)
    if (loggedInUserRole !== null) {
      fetchDiscounts();
    }
  }, [fetchDiscounts, loggedInUserRole]); // Re-run fetchDiscounts whenever it changes (due to its dependencies)

  // --- Search Handler ---
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => {
      setCurrentPage(1); // Reset page on new search
    }, 500));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  // --- Pagination Handler ---
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // --- Modal Handlers ---
  const handleCreateDiscount = () => {
    // Initialize with default values for new discount
    setSelectedDiscount({ code: '', percentage: '', is_active: true, start_date: '', end_date: '' });
    setIsEditing(false);
    setShowCreateEditModal(true);
  };

  const handleEditDiscount = (discountItem) => {
    // Convert dates to YYYY-MM-DDTHH:MM format for datetime-local input
    // This is crucial for HTML datetime-local input type
    setSelectedDiscount({
      ...discountItem,
      start_date: discountItem.start_date ? new Date(discountItem.start_date).toISOString().slice(0, 16) : '',
      end_date: discountItem.end_date ? new Date(discountItem.end_date).toISOString().slice(0, 16) : ''
    });
    setIsEditing(true);
    setShowCreateEditModal(true);
  };

  const handleCloseCreateEditModal = () => {
    setShowCreateEditModal(false);
    setSelectedDiscount(null);
    setIsEditing(false);
  };

  const handleSaveDiscount = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!selectedDiscount) {
      alert("Error: Discount data is missing.");
      return;
    }

    setLoading(true);
    setError(null);
    const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
    if (!token) {
      handleAuthError("Authentication token missing."); // <--- Use helper
      return;
    }

    try {
      let url = `${API_BASE_URL}/discounts/`; // POST to /discounts/ for create
      let method = 'POST';

      if (isEditing) {
        url = `${API_BASE_URL}/discounts/${selectedDiscount.discount_id}`; // PUT to /discounts/<id> for update
        method = 'PUT';
      }

      // Prepare payload, convert percentage to number, and dates to ISO string or null
      const payload = {
        code: selectedDiscount.code,
        percentage: parseFloat(selectedDiscount.percentage), // Ensure percentage is a number
        is_active: selectedDiscount.is_active,
        // Convert datetime-local string to ISO 8601 string for Flask
        start_date: selectedDiscount.start_date ? new Date(selectedDiscount.start_date).toISOString() : null,
        end_date: selectedDiscount.end_date ? new Date(selectedDiscount.end_date).toISOString() : null,
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        if (response.status === 401 || response.status === 403) { // Check for Unauthorized or Forbidden
          handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again."); // <--- Use helper
          return;
        }
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} discount: ${response.status}`);
      }

      fetchDiscounts(); // Re-fetch discounts to update the list
      handleCloseCreateEditModal();
      alert(`Discount ${isEditing ? 'updated' : 'created'} successfully!`);

    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} discount:`, err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiscount = async (discountId) => {
    if (!window.confirm("Are you sure you want to delete this discount? This action cannot be undone.")) {
      return;
    }
    setLoading(true);
    setError(null);
    const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
    if (!token) {
      handleAuthError("Authentication token missing."); // <--- Use helper
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/discounts/${discountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        if (response.status === 401 || response.status === 403) { // Check for Unauthorized or Forbidden
          handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again."); // <--- Use helper
          return;
        }
        throw new Error(errorData.error || `Failed to delete discount: ${response.status}`);
      }

      fetchDiscounts(); // Re-fetch discounts to update the list
      alert('Discount deleted successfully!');

    } catch (err) {
      console.error("Error deleting discount:", err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // --- Render Logic ---
  if (loading && loggedInUserRole === null) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading permissions...</span>
        </Spinner>
        <p className="mt-2">Checking user permissions...</p>
      </div>
    );
  }

  // Display general error if present, but only after role check has completed (loggedInUserRole is not null)
  if (error && loggedInUserRole !== null) {
    return <Alert variant="danger" className="m-4">Error: {error}</Alert>;
  }

  // Display access denied message if role is determined and not authorized
  if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
    return <Alert variant="warning" className="m-4">Access Denied: You do not have the necessary permissions to view this page.</Alert>;
  }

  return (
    <div className="container mt-4">
      <h2>Manage Discounts</h2>

      <div className="d-flex justify-content-between mb-3 align-items-center flex-wrap">
        <h4 className="mb-2 mb-md-0">Total Discounts: {totalDiscounts}</h4>
        <InputGroup className="w-md-50 w-100 mb-2 mb-md-0">
          <Form.Control
            type="text"
            placeholder="Search by Code..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button variant="outline-secondary" onClick={handleClearSearch}>Clear Search</Button>
        </InputGroup>
        <Button variant="primary" onClick={handleCreateDiscount}>
          Create New Discount
        </Button>
      </div>

      {loading && ( // Only show loading spinner if actually loading after initial role check
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading discounts...</span>
          </Spinner>
          <p className="mt-2">Loading discounts...</p>
        </div>
      )}

      {!loading && discounts.length === 0 && (
        <Alert variant="info">
          {searchQuery ? "No discounts found for your criteria." : "No discounts available."}
        </Alert>
      )}

      {!loading && discounts.length > 0 && (
        <>
          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Code</th>
                <th>Percentage</th>
                <th>Active</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.discount_id}>
                  <td>{discount.discount_id}</td>
                  <td>{discount.code}</td>
                  <td>{discount.percentage}%</td>
                  <td>{discount.is_active ? 'Yes' : 'No'}</td>
                  <td>{formatDate(discount.start_date)}</td>
                  <td>{formatDate(discount.end_date)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleEditDiscount(discount)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteDiscount(discount.discount_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
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

      {/* Create/Edit Discount Modal */}
      <Modal show={showCreateEditModal} onHide={handleCloseCreateEditModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Discount' : 'Create New Discount'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveDiscount}>
            <Form.Group className="mb-3">
              <Form.Label>Discount Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., SUMMER20"
                value={selectedDiscount?.code || ''}
                onChange={(e) => setSelectedDiscount({ ...selectedDiscount, code: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Percentage Off (%)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0.01"
                max="100"
                placeholder="e.g., 10 for 10%"
                value={selectedDiscount?.percentage || ''}
                onChange={(e) => setSelectedDiscount({ ...selectedDiscount, percentage: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Is Active"
                checked={selectedDiscount?.is_active || false}
                onChange={(e) => setSelectedDiscount({ ...selectedDiscount, is_active: e.target.checked })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date (Optional)</Form.Label>
              <Form.Control
                type="datetime-local"
                value={selectedDiscount?.start_date || ''}
                onChange={(e) => setSelectedDiscount({ ...selectedDiscount, start_date: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date (Optional)</Form.Label>
              <Form.Control
                type="datetime-local"
                value={selectedDiscount?.end_date || ''}
                onChange={(e) => setSelectedDiscount({ ...selectedDiscount, end_date: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : null}
              {isEditing ? 'Save Changes' : 'Create Discount'}
            </Button>
            <Button variant="secondary" className="ms-2" onClick={handleCloseCreateEditModal}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDiscountsPage;














// // src/components/Admin/AdminDiscountsPage.js
// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Spinner, Alert, Pagination, InputGroup, Form, Modal } from 'react-bootstrap';
// import { jwtDecode } from 'jwt-decode'; // Ensure this is imported for token decoding

// const AdminDiscountsPage = () => {
//   const [discounts, setDiscounts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalDiscounts, setTotalDiscounts] = useState(0);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchTimeout, setSearchTimeout] = useState(null);

//   const [showCreateEditModal, setShowCreateEditModal] = useState(false);
//   const [selectedDiscount, setSelectedDiscount] = useState(null); // For editing or new discount
//   const [isEditing, setIsEditing] = useState(false); // True if editing, false if creating

//   const [loggedInUserRole, setLoggedInUserRole] = useState(null);

//   // IMPORTANT: This should match the base URL for your Flask API
//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

//   // --- Determine Logged-in User's Role ---
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setError("Authentication token missing. Please log in.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const decodedToken = jwtDecode(token);
//       setLoggedInUserRole(decodedToken.user_type || '');
//     } catch (err) {
//       console.error("Failed to decode token:", err);
//       setError("Invalid or expired token. Please log in again.");
//       setLoading(false);
//     }
//   }, []);

//   // --- Fetch Discounts ---
//   const fetchDiscounts = useCallback(async () => {
//     if (loggedInUserRole === null) {
//       return; // Wait for role to be determined
//     }

//     if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
//       setError("You do not have permission to view this page.");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error("Authentication token missing.");
//       }

//       const params = new URLSearchParams({
//         page: currentPage,
//         per_page: 10,
//         search: searchQuery,
//       });

//       const response = await fetch(`${API_BASE_URL}/discounts/?${params.toString()}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//         throw new Error(errorData.error || `Failed to fetch discounts: ${response.status}`);
//       }

//       const data = await response.json();
//       setDiscounts(data.discounts || []);
//       setTotalPages(data.pages || 1);
//       setTotalDiscounts(data.total || 0);

//     } catch (err) {
//       console.error("Error fetching discounts:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, loggedInUserRole]);

//   // Effect hook to trigger fetch when dependencies change
//   useEffect(() => {
//     fetchDiscounts();
//   }, [fetchDiscounts]);

//   // --- Search Handler ---
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);
//     if (searchTimeout) clearTimeout(searchTimeout);
//     setSearchTimeout(setTimeout(() => {
//       setCurrentPage(1); // Reset page on new search
//     }, 500));
//   };

//   const handleClearSearch = () => {
//     setSearchQuery('');
//     setCurrentPage(1);
//   };

//   // --- Pagination Handler ---
//   const handlePageChange = (pageNumber) => {
//     if (pageNumber > 0 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   // --- Modal Handlers ---
//   const handleCreateDiscount = () => {
//     // Initialize with default values for new discount
//     setSelectedDiscount({ code: '', percentage: '', is_active: true, start_date: '', end_date: '' });
//     setIsEditing(false);
//     setShowCreateEditModal(true);
//   };

//   const handleEditDiscount = (discountItem) => {
//     // Convert dates to YYYY-MM-DDTHH:MM format for datetime-local input
//     // This is crucial for HTML datetime-local input type
//     setSelectedDiscount({
//       ...discountItem,
//       start_date: discountItem.start_date ? new Date(discountItem.start_date).toISOString().slice(0, 16) : '',
//       end_date: discountItem.end_date ? new Date(discountItem.end_date).toISOString().slice(0, 16) : ''
//     });
//     setIsEditing(true);
//     setShowCreateEditModal(true);
//   };

//   const handleCloseCreateEditModal = () => {
//     setShowCreateEditModal(false);
//     setSelectedDiscount(null);
//     setIsEditing(false);
//   };

//   const handleSaveDiscount = async (e) => {
//     e.preventDefault(); // Prevent default form submission
//     if (!selectedDiscount) {
//       alert("Error: Discount data is missing.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     const token = localStorage.getItem('token');

//     try {
//       let url = `${API_BASE_URL}/discounts/`; // POST to /discounts/ for create
//       let method = 'POST';

//       if (isEditing) {
//         url = `${API_BASE_URL}/discounts/${selectedDiscount.discount_id}`; // PUT to /discounts/<id> for update
//         method = 'PUT';
//       }

//       // Prepare payload, convert percentage to number, and dates to ISO string or null
//       const payload = {
//         code: selectedDiscount.code,
//         percentage: parseFloat(selectedDiscount.percentage), // Ensure percentage is a number
//         is_active: selectedDiscount.is_active,
//         // Convert datetime-local string to ISO 8601 string for Flask
//         start_date: selectedDiscount.start_date ? new Date(selectedDiscount.start_date).toISOString() : null,
//         end_date: selectedDiscount.end_date ? new Date(selectedDiscount.end_date).toISOString() : null,
//       };

//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//         throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} discount: ${response.status}`);
//       }

//       // No need to await response.json() if you don't use its content.
//       // If the backend returns a message or data you want to use, then keep `await response.json();`
//       // For now, we just rely on the success of the response.
//       // await response.json();

//       fetchDiscounts(); // Re-fetch discounts to update the list
//       handleCloseCreateEditModal();
//       alert(`Discount ${isEditing ? 'updated' : 'created'} successfully!`);

//     } catch (err) {
//       console.error(`Error ${isEditing ? 'updating' : 'creating'} discount:`, err);
//       setError(err.message);
//       alert(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteDiscount = async (discountId) => {
//     if (!window.confirm("Are you sure you want to delete this discount? This action cannot be undone.")) {
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     const token = localStorage.getItem('token');

//     try {
//       const response = await fetch(`${API_BASE_URL}/discounts/${discountId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//         throw new Error(errorData.error || `Failed to delete discount: ${response.status}`);
//       }

//       // No need to await response.json() if you don't use its content.
//       // await response.json();
//       fetchDiscounts(); // Re-fetch discounts to update the list
//       alert('Discount deleted successfully!');

//     } catch (err) {
//       console.error("Error deleting discount:", err);
//       setError(err.message);
//       alert(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Format date for display
//   const formatDate = (isoString) => {
//     if (!isoString) return 'N/A';
//     const date = new Date(isoString);
//     return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
//   };

//   // --- Render Logic ---
//   if (loading && loggedInUserRole === null) {
//     return (
//       <div className="text-center my-4">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Loading permissions...</span>
//         </Spinner>
//         <p className="mt-2">Checking user permissions...</p>
//       </div>
//     );
//   }

//   if (error && loggedInUserRole !== null) {
//     return <Alert variant="danger" className="m-4">Error: {error}</Alert>;
//   }

//   if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
//     return <Alert variant="warning" className="m-4">Access Denied: You do not have the necessary permissions to view this page.</Alert>;
//   }

//   return (
//     <div className="container mt-4">
//       <h2>Manage Discounts</h2>

//       <div className="d-flex justify-content-between mb-3 align-items-center flex-wrap">
//         <h4 className="mb-2 mb-md-0">Total Discounts: {totalDiscounts}</h4>
//         <InputGroup className="w-md-50 w-100 mb-2 mb-md-0">
//           <Form.Control
//             type="text"
//             placeholder="Search by Code..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//           />
//           <Button variant="outline-secondary" onClick={handleClearSearch}>Clear Search</Button>
//         </InputGroup>
//         <Button variant="primary" onClick={handleCreateDiscount}>
//           Create New Discount
//         </Button>
//       </div>

//       {loading && (
//         <div className="text-center my-4">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading discounts...</span>
//           </Spinner>
//           <p className="mt-2">Loading discounts articles...</p>
//         </div>
//       )}

//       {!loading && discounts.length === 0 && (
//         <Alert variant="info">
//           {searchQuery ? "No discounts found for your criteria." : "No discounts available."}
//         </Alert>
//       )}

//       {!loading && discounts.length > 0 && (
//         <>
//           <Table striped bordered hover responsive className="mt-3">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Code</th>
//                 <th>Percentage</th>
//                 <th>Active</th>
//                 <th>Start Date</th>
//                 <th>End Date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {discounts.map((discount) => (
//                 <tr key={discount.discount_id}>
//                   <td>{discount.discount_id}</td>
//                   <td>{discount.code}</td>
//                   <td>{discount.percentage}%</td>
//                   <td>{discount.is_active ? 'Yes' : 'No'}</td>
//                   <td>{formatDate(discount.start_date)}</td>
//                   <td>{formatDate(discount.end_date)}</td>
//                   <td>
//                     <div className="d-flex gap-2">
//                       <Button
//                         variant="warning"
//                         size="sm"
//                         onClick={() => handleEditDiscount(discount)}
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         variant="danger"
//                         size="sm"
//                         onClick={() => handleDeleteDiscount(discount.discount_id)}
//                       >
//                         Delete
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           {/* Pagination Controls */}
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

//       {/* Create/Edit Discount Modal */}
//       <Modal show={showCreateEditModal} onHide={handleCloseCreateEditModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>{isEditing ? 'Edit Discount' : 'Create New Discount'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSaveDiscount}>
//             <Form.Group className="mb-3">
//               <Form.Label>Discount Code</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="e.g., SUMMER20"
//                 value={selectedDiscount?.code || ''}
//                 onChange={(e) => setSelectedDiscount({ ...selectedDiscount, code: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Percentage Off (%)</Form.Label>
//               <Form.Control
//                 type="number"
//                 step="0.01"
//                 min="0.01"
//                 max="100"
//                 placeholder="e.g., 10 for 10%"
//                 value={selectedDiscount?.percentage || ''}
//                 onChange={(e) => setSelectedDiscount({ ...selectedDiscount, percentage: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Check
//                 type="checkbox"
//                 label="Is Active"
//                 checked={selectedDiscount?.is_active || false}
//                 onChange={(e) => setSelectedDiscount({ ...selectedDiscount, is_active: e.target.checked })}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Start Date (Optional)</Form.Label>
//               <Form.Control
//                 type="datetime-local"
//                 value={selectedDiscount?.start_date || ''}
//                 onChange={(e) => setSelectedDiscount({ ...selectedDiscount, start_date: e.target.value })}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>End Date (Optional)</Form.Label>
//               <Form.Control
//                 type="datetime-local"
//                 value={selectedDiscount?.end_date || ''}
//                 onChange={(e) => setSelectedDiscount({ ...selectedDiscount, end_date: e.target.value })}
//               />
//             </Form.Group>
//             <Button variant="primary" type="submit" disabled={loading}>
//               {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : null}
//               {isEditing ? 'Save Changes' : 'Create Discount'}
//             </Button>
//             <Button variant="secondary" className="ms-2" onClick={handleCloseCreateEditModal}>
//               Cancel
//             </Button>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default AdminDiscountsPage;