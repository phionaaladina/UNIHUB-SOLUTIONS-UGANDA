// // src/components/Admin/AdminContactMessagesPage.js
// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Spinner, Alert, Pagination, InputGroup, Form, Modal, Row, Col } from 'react-bootstrap';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom'; // <--- Import useNavigate
// import './styles/AdminContactMessagesPage.css';

// // Renamed component to AdminContactMessagesPage (plural) for consistency
// const AdminContactMessagesPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalMessages, setTotalMessages] = useState(0);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState(''); // 'pending', 'replied', 'archived', or '' for all
//   const [searchTimeout, setSearchTimeout] = useState(null);

//   const [showModal, setShowModal] = useState(false);
//   const [selectedMessage, setSelectedMessage] = useState(null); // Ensure selectedMessage is initialized to null

//   const [loggedInUserRole, setLoggedInUserRole] = useState(null); // Initialize as null to wait for decode
//   const navigate = useNavigate(); // <--- Initialize useNavigate

//   // IMPORTANT: This should match the base URL for your Flask API
//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1'; // Your contact blueprint is at '/api/v1/contact'

//   // --- Helper function to handle unauthorized errors and redirect ---
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

//   // --- Fetch Contact Messages ---
//   const fetchMessages = useCallback(async () => {
//     if (loggedInUserRole === null) {
//       return; // Wait for role to be determined
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
//         handleAuthError("Authentication token missing."); // <--- Use helper
//         return;
//       }

//       const params = new URLSearchParams({
//         page: currentPage,
//         per_page: 10,
//         search: searchQuery,
//         status: statusFilter,
//       });

//       const response = await fetch(`${API_BASE_URL}/contact/?${params.toString()}`, {
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
//         throw new Error(errorData.error || `Failed to fetch messages: ${response.status}`);
//       }

//       const data = await response.json();
//       setMessages(data.messages || []);
//       setTotalPages(data.pages || 1);
//       setTotalMessages(data.total_messages || 0);

//     } catch (err) {
//       console.error("Error fetching messages:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, statusFilter, loggedInUserRole, handleAuthError]); // Add handleAuthError to dependencies

//   // Effect hook to trigger fetch when dependencies change
//   useEffect(() => {
//     // Only fetch messages if loggedInUserRole has been determined (is not null)
//     if (loggedInUserRole !== null) {
//       fetchMessages();
//     }
//   }, [fetchMessages, loggedInUserRole]); // Re-run fetchMessages whenever it changes (due to its dependencies)

//   // --- Search and Filter Handlers ---
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);
//     if (searchTimeout) clearTimeout(searchTimeout);
//     setSearchTimeout(setTimeout(() => {
//       setCurrentPage(1); // Reset page on new search
//     }, 500));
//   };

//   const handleStatusFilterChange = (e) => {
//     const value = e.target.value;
//     setStatusFilter(value);
//     setCurrentPage(1); // Reset page on new filter
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

//   // --- Modal (View Details) Handlers ---
//   const handleViewDetails = (message) => {
//     setSelectedMessage(message);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedMessage(null); // Explicitly set to null on close
//   };

//   // --- Action Handlers (Mark as Replied, Delete) ---
//   const handleMarkAsReplied = async (messageId) => {
//     if (!window.confirm("Are you sure you want to mark this message as 'Replied'?")) {
//       return;
//     }
//     setLoading(true); // Set loading for the action
//     try {
//       const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
//       if (!token) {
//         handleAuthError("Authentication token missing."); // <--- Use helper
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/contact/${messageId}`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ status: 'replied' })
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//         if (response.status === 401 || response.status === 403) { // Check for Unauthorized or Forbidden
//           handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again."); // <--- Use helper
//           return;
//         }
//         throw new Error(errorData.error || `Failed to mark as replied: ${response.status}`);
//       }

//       fetchMessages(); // Re-fetch all messages to update status
//       handleCloseModal();
//       alert('Message marked as replied!');
//     } catch (err) {
//       console.error("Error marking message as replied:", err);
//       alert(`Error: ${err.message}`);
//     } finally {
//       setLoading(false); // Reset loading after action
//     }
//   };

//   const handleDeleteMessage = async (messageId) => {
//     if (!window.confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
//       return;
//     }
//     setLoading(true); // Set loading for the action
//     try {
//       const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
//       if (!token) {
//         handleAuthError("Authentication token missing."); // <--- Use helper
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/contact/${messageId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//         if (response.status === 401 || response.status === 403) { // Check for Unauthorized or Forbidden
//           handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again."); // <--- Use helper
//           return;
//         }
//         throw new Error(errorData.error || `Failed to delete message: ${response.status}`);
//       }

//       fetchMessages(); // Re-fetch all messages
//       handleCloseModal();
//       alert('Message deleted successfully!');
//     } catch (err) {
//       console.error("Error deleting message:", err);
//       alert(`Error: ${err.message}`);
//     } finally {
//       setLoading(false); // Reset loading after action
//     }
//   };

//   // Format date for display
//   const formatDate = (isoString) => {
//     if (!isoString) return 'N/A';
//     const date = new Date(isoString);
//     return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
//   };

//   // --- Render Logic ---
//   // Initial loading state while user role is being determined
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

//   // Display general error if present, but only after role check has completed (loggedInUserRole is not null)
//   if (error && loggedInUserRole !== null) {
//     return <Alert variant="danger" className="m-4">Error: {error}</Alert>;
//   }

//   // Display access denied message if role is determined and not authorized
//   if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
//     return <Alert variant="warning" className="m-4">Access Denied: You do not have the necessary permissions to view this page.</Alert>;
//   }

//   return (
//     <div className="container mt-4">
//       <h2>Contact Messages</h2>

//       <div className="d-flex justify-content-between mb-3 align-items-center flex-wrap">
//         <h4 className="mb-2 mb-md-0">Total Messages: {totalMessages}</h4>
//         <InputGroup className="w-md-50 w-100 mb-2 mb-md-0">
//           <Form.Control
//             type="text"
//             placeholder="Search by Name, Email, or Message..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//           />
//           <Button variant="outline-secondary" onClick={handleClearSearch}>Clear Search</Button>
//         </InputGroup>
//         <Form.Select
//           className="w-auto ml-md-3"
//           value={statusFilter}
//           onChange={handleStatusFilterChange}
//         >
//           <option value="">All Statuses</option>
//           <option value="pending">Pending</option>
//           <option value="replied">Replied</option>
//           <option value="archived">Archived</option>
//         </Form.Select>
//       </div>

//       {loading && ( // Only show loading spinner if actually loading after initial role check
//         <div className="text-center my-4">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading messages...</span>
//           </Spinner>
//           <p className="mt-2">Loading messages...</p>
//         </div>
//       )}

//       {!loading && messages.length === 0 && (
//         <Alert variant="info">
//           {searchQuery || statusFilter ? "No messages found for your criteria." : "No contact messages available."}
//         </Alert>
//       )}

//       {!loading && messages.length > 0 && (
//         <>
//           <Table striped bordered hover responsive className="mt-3">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Message Snippet</th>
//                 <th>Date Sent</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {messages.map((message) => (
//                 <tr key={message.contact_id}>
//                   <td>{message.contact_id}</td>
//                   <td>{message.name}</td>
//                   <td>{message.email}</td>
//                   <td>{message.message.substring(0, 50)}{message.message.length > 50 ? '...' : ''}</td>
//                   <td>{message.date_sent ? formatDate(message.date_sent) : 'N/A'}</td>
//                   <td>{message.status ? (message.status.charAt(0).toUpperCase() + message.status.slice(1)) : 'N/A'}</td>
//                   <td>
//                     <Button
//                       variant="info"
//                       size="sm"
//                       onClick={() => handleViewDetails(message)}
//                     >
//                       View
//                     </Button>
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

//       {/* Message Details Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Message Details - ID: {selectedMessage?.contact_id}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedMessage ? ( // Check selectedMessage here
//             <>
//               <p><strong>Name:</strong> {selectedMessage.name}</p>
//               <p><strong>Email:</strong> {selectedMessage.email}</p>
//               <p><strong>Date Sent:</strong> {formatDate(selectedMessage.date_sent)}</p>
//               <p><strong>Status:</strong> {selectedMessage.status?.charAt(0).toUpperCase() + selectedMessage.status?.slice(1)}</p>
//               {selectedMessage.status === 'replied' && (
//                 <>
//                   <p><strong>Replied On:</strong> {formatDate(selectedMessage.replied_at)}</p>
//                   <p><strong>Replied By:</strong> {selectedMessage.replied_by_user_name || `User ID: ${selectedMessage.replied_by_user_id}`}</p>
//                 </>
//               )}
//               <hr />
//               <h5>Message:</h5>
//               <p>{selectedMessage.message}</p>
//             </>
//           ) : (
//             <p>No message selected.</p> // Fallback if selectedMessage is somehow null here
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           {selectedMessage && ( // Check selectedMessage here too
//             <div className="d-flex justify-content-between w-100 flex-wrap">
//               <div className="mb-2 mb-md-0 d-flex flex-wrap gap-2">
//                 <a
//                   href={`mailto:${selectedMessage.email}?subject=Regarding Your Inquiry (Message ID: ${selectedMessage.contact_id})`}
//                   className="btn btn-primary"
//                 >
//                   Reply via Email
//                 </a>
//                 {selectedMessage.status !== 'replied' && (
//                   <Button
//                     variant="success"
//                     onClick={() => handleMarkAsReplied(selectedMessage.contact_id)}
//                   >
//                     Mark as Replied
//                   </Button>
//                 )}
//                 <Button
//                   variant="danger"
//                   onClick={() => handleDeleteMessage(selectedMessage.contact_id)}
//                 >
//                   Delete Message
//                 </Button>
//               </div>
//               <div>
//                 <Button variant="secondary" onClick={handleCloseModal}>
//                   Close
//                 </Button>
//               </div>
//             </div>
//           )}
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminContactMessagesPage;


import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Spinner, Alert, Pagination, Form, Modal, Row, Col } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaCheck, FaTrash, FaEnvelope, FaTimes, FaSearch, FaFilter } from 'react-icons/fa';
import API_BASE_URL from '../../config';
import './styles/AdminContactMessagesPage.css';

const AdminContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [loggedInUserRole, setLoggedInUserRole] = useState(null);
  const navigate = useNavigate();

  // const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

  const handleAuthError = useCallback((errMessage) => {
    setError(errMessage);
    sessionStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

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

  const fetchMessages = useCallback(async () => {
    if (loggedInUserRole === null) return;

    if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
      handleAuthError("You do not have permission to view this page.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        handleAuthError("Authentication token missing.");
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        per_page: 10,
        search: searchQuery,
        status: statusFilter,
      });

      const response = await fetch(`${API_BASE_URL}/api/v1/contact/?${params.toString()}`, {
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
        throw new Error(errorData.error || `Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data.messages || []);
      setTotalPages(data.pages || 1);
      setTotalMessages(data.total_messages || 0);

    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter, loggedInUserRole, handleAuthError]);

  useEffect(() => {
    if (loggedInUserRole !== null) fetchMessages();
  }, [fetchMessages, loggedInUserRole]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => setCurrentPage(1), 500));
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  const handleViewDetails = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  const handleMarkAsReplied = async (messageId) => {
    if (!window.confirm("Are you sure you want to mark this message as 'Replied'?")) return;
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        handleAuthError("Authentication token missing.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/contact/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'replied' })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again.");
          return;
        }
        throw new Error(errorData.error || `Failed to mark as replied: ${response.status}`);
      }

      fetchMessages();
      handleCloseModal();
      alert('Message marked as replied!');
    } catch (err) {
      console.error("Error marking message as replied:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message? This action cannot be undone.")) return;
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        handleAuthError("Authentication token missing.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/contact/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again.");
          return;
        }
        throw new Error(errorData.error || `Failed to delete message: ${response.status}`);
      }

      fetchMessages();
      handleCloseModal();
      alert('Message deleted successfully!');
    } catch (err) {
      console.error("Error deleting message:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyViaEmail = (email) => {
    window.location.href = `mailto:${email}?subject=Regarding Your Inquiry (Message ID: ${selectedMessage?.contact_id})`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

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

  if (error && loggedInUserRole !== null) {
    return <Alert variant="danger" className="m-4">Error: {error}</Alert>;
  }

  if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
    return <Alert variant="warning" className="m-4">Access Denied: You do not have the necessary permissions to view this page.</Alert>;
  }

  return (
    <div className="messages-container">
      <div className="messages-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">Contact Messages</h1>
            <p className="page-subtitle">Manage customer inquiries.</p>
          </div>
          <div className="header-actions">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search by Name, Email, or Message..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            <div className="filter-wrapper">
              <FaFilter className="filter-icon" />
              <Form.Select value={statusFilter} onChange={handleStatusFilterChange} className="filter-select">
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </Form.Select>
            </div>
            <Button className="btn-add-product" onClick={handleClearSearch}>
              <FaTimes className="me-2" /> Clear Search
            </Button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <Spinner animation="border" className="loading-spinner" />
          <h4>Loading messages...</h4>
          <p>Please wait while we fetch your messages</p>
        </div>
      )}

      {!loading && error && (
        <Alert variant="danger" className="error-alert">
          <i className="bi bi-exclamation-triangle me-2"></i> Error: {error}
        </Alert>
      )}

      {!loading && messages.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><i className="bi bi-envelope"></i></div>
          <h4>No Messages Found</h4>
          <p>{searchQuery || statusFilter ? "No messages found for your criteria." : "No contact messages available."}</p>
        </div>
      )}

      {!loading && messages.length > 0 && (
        <>
          <div className="table-responsive">
            <Table className="messages-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message Snippet</th>
                  <th>Date Sent</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.contact_id}>
                    <td><span className="product-id">{message.contact_id}</span></td>
                    <td>{message.name}</td>
                    <td>{message.email}</td>
                    <td>{message.message.substring(0, 50)}{message.message.length > 50 ? '...' : ''}</td>
                    <td>{formatDate(message.date_sent)}</td>
                    <td>{message.status ? (message.status.charAt(0).toUpperCase() + message.status.slice(1)) : 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <Button variant="info" size="sm" onClick={() => handleViewDetails(message)} title="View">
                          <FaEye />
                        </Button>
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
                  <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
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

      <Modal show={showModal} onHide={handleCloseModal} size="lg" className="custom-modal">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Message Details - ID: {selectedMessage?.contact_id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage ? (
            <>
              <p><strong>Name:</strong> {selectedMessage.name}</p>
              <p><strong>Email:</strong> {selectedMessage.email}</p>
              <p><strong>Date Sent:</strong> {formatDate(selectedMessage.date_sent)}</p>
              <p><strong>Status:</strong> {selectedMessage.status?.charAt(0).toUpperCase() + selectedMessage.status?.slice(1)}</p>
              {selectedMessage.status === 'replied' && (
                <>
                  <p><strong>Replied On:</strong> {formatDate(selectedMessage.replied_at)}</p>
                  <p><strong>Replied By:</strong> {selectedMessage.replied_by_user_name || `User ID: ${selectedMessage.replied_by_user_id}`}</p>
                </>
              )}
              <hr />
              <h5>Message:</h5>
              <p>{selectedMessage.message}</p>
            </>
          ) : (
            <p>No message selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedMessage && (
            <div className="d-flex justify-content-between w-100 flex-wrap">
              <div className="mb-2 mb-md-0 d-flex flex-wrap gap-2">
                <Button variant="primary" className="action-btn" onClick={() => handleReplyViaEmail(selectedMessage.email)} title="Reply via Email">
                  Reply via Email
                </Button>
                {selectedMessage.status !== 'replied' && (
                  <Button variant="success" className="action-btn" onClick={() => handleMarkAsReplied(selectedMessage.contact_id)} title="Mark as Replied">
                    Mark as Replied
                  </Button>
                )}
                <Button variant="danger" className="action-btn" onClick={() => handleDeleteMessage(selectedMessage.contact_id)} title="Delete">
                  Delete
                </Button>
              </div>
              <div>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminContactMessagesPage;