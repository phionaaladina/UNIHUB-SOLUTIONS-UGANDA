import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Spinner, Alert, Pagination, InputGroup, Form, Modal } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './styles/AdminNewsPage.css';

const AdminNewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNews, setTotalNews] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null); // For viewing/editing
  const [isEditing, setIsEditing] = useState(false); // True if editing, false if creating

  const [loggedInUserRole, setLoggedInUserRole] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null); // To set author_id for new news

  const navigate = useNavigate();

  // IMPORTANT: This should match the base URL for your Flask API
  const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

  // --- Helper function to handle unauthorized errors and redirect ---
  const handleAuthError = useCallback((errMessage) => {
    setError(errMessage);
    sessionStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  // --- Determine Logged-in User's Role and ID ---
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      handleAuthError("Authentication token missing. Please log in.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setLoggedInUserRole(decodedToken.user_type || '');
      setLoggedInUserId(decodedToken.user_id || null);
      setLoading(false);
    } catch (err) {
      console.error("Failed to decode token:", err);
      handleAuthError("Invalid or expired token. Please log in again.");
    }
  }, [handleAuthError]);

  // --- Fetch News Articles ---
  const fetchNews = useCallback(async () => {
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
      });

      const response = await fetch(`${API_BASE_URL}/news/?${params.toString()}`, {
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
        throw new Error(errorData.error || `Failed to fetch news: ${response.status}`);
      }

      const data = await response.json();
      setNews(data.news || []);
      setTotalPages(data.pages || 1);
      setTotalNews(data.total || 0);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, loggedInUserRole, handleAuthError]);

  useEffect(() => {
    if (loggedInUserRole !== null) fetchNews();
  }, [fetchNews, loggedInUserRole]);

  // --- Search Handler ---
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => setCurrentPage(1), 500));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  // --- Pagination Handler ---
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  // --- Modal Handlers ---
  const handleViewDetails = (newsItem) => {
    setSelectedNews(newsItem);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedNews(null);
  };

  const handleCreateNews = () => {
    setSelectedNews({ title: '', content: '', image_url: '' });
    setIsEditing(false);
    setShowCreateEditModal(true);
  };

  const handleEditNews = (newsItem) => {
    setSelectedNews(newsItem);
    setIsEditing(true);
    setShowCreateEditModal(true);
  };

  const handleCloseCreateEditModal = () => {
    setShowCreateEditModal(false);
    setSelectedNews(null);
    setIsEditing(false);
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    if (!selectedNews || !loggedInUserId) {
      alert("Error: News data or author ID is missing.");
      return;
    }

    setLoading(true);
    setError(null);
    const token = sessionStorage.getItem('token');
    if (!token) {
      handleAuthError("Authentication token missing.");
      setLoading(false);
      return;
    }

    try {
      let url = `${API_BASE_URL}/news/create`;
      let method = 'POST';

      if (isEditing) {
        url = `${API_BASE_URL}/news/update/${selectedNews.news_id}`;
        method = 'PUT';
      }

      const payload = {
        title: selectedNews.title,
        content: selectedNews.content,
        image_url: selectedNews.image_url,
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
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.error || "Authentication failed or access denied. Please log in again.");
          return;
        }
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} news: ${response.status}`);
      }

      await response.json();
      fetchNews();
      handleCloseCreateEditModal();
      alert(`News article ${isEditing ? 'updated' : 'created'} successfully!`);
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} news:`, err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (newsId) => {
    if (!window.confirm("Are you sure you want to delete this news article? This action cannot be undone.")) return;
    setLoading(true);
    setError(null);
    const token = sessionStorage.getItem('token');
    if (!token) {
      handleAuthError("Authentication token missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/news/delete/${newsId}`, {
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
        throw new Error(errorData.error || `Failed to delete news: ${response.status}`);
      }

      await response.json();
      fetchNews();
      handleCloseViewModal();
      alert('News article deleted successfully!');
    } catch (err) {
      console.error("Error deleting news:", err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading && loggedInUserRole === null) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status" className="loading-spinner">
          <span className="visually-hidden">Loading permissions...</span>
        </Spinner>
        <h4>Checking User Permissions</h4>
        <p>Please wait while we verify your access...</p>
      </div>
    );
  }

  if (error && loggedInUserRole !== null) {
    return <Alert variant="danger" className="error-alert">Error: {error}</Alert>;
  }

  if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'super_admin') {
    return <Alert variant="warning" className="error-alert">Access Denied: You do not have the necessary permissions to view this page.</Alert>;
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div className="header-content">
          <div className="title-section">
            <h2 className="page-title">Manage News Articles</h2>
          </div>
          <div className="header-actions">
            <div className="search-wrapper">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search by Title or Content..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <Button variant="outline-secondary" onClick={handleClearSearch}>
                  Clear Search
                </Button>
              </InputGroup>
            </div>
            <Button variant="primary" onClick={handleCreateNews} className="btn">
              <FaPlus />
            </Button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <Spinner animation="border" role="status" className="loading-spinner">
            <span className="visually-hidden">Loading news...</span>
          </Spinner>
          <h4>Loading News Articles</h4>
          <p>Please wait while we fetch the data...</p>
        </div>
      )}

      {!loading && news.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h4>No News Articles</h4>
          <p>{searchQuery ? "No news articles found for your criteria." : "No news articles available."}</p>
        </div>
      )}

      {!loading && news.length > 0 && (
        <div className="table-responsive">
          <Table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Content Snippet</th>
                <th>Author ID</th>
                <th>Date Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map((newsItem) => (
                <tr key={newsItem.news_id}>
                  <td className="order-id">{newsItem.news_id}</td>
                  <td className="order-user">{newsItem.title}</td>
                  <td className="order-total">{newsItem.content.substring(0, 50)}</td>
                  <td className="order-status">{newsItem.author_id}</td>
                  <td className="order-date">{formatDate(newsItem.date_posted)}</td>
                  <td>
                    <div className="action-buttons">
                      <Button variant="info" className="btn" onClick={() => handleViewDetails(newsItem)}>
                        <FaEye />
                      </Button>
                      <Button variant="warning" className="btn" onClick={() => handleEditNews(newsItem)}>
                        <FaEdit />
                      </Button>
                      <Button variant="danger" className="btn" onClick={() => handleDeleteNews(newsItem.news_id)}>
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
            <div className="pagination-info">
              Page {currentPage} of {totalPages} (Total: {totalNews})
            </div>
          </div>
        </div>
      )}

      <Modal show={showViewModal} onHide={handleCloseViewModal} className="custom-modal">
        <Modal.Header className="custom-modal-header" closeButton>
          <Modal.Title>News Details - ID: {selectedNews?.news_id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNews ? (
            <>
              <div className="order-detail-row"><strong>Title:</strong> {selectedNews.title}</div>
              <div className="order-detail-row"><strong>Author ID:</strong> {selectedNews.author_id}</div>
              <div className="order-detail-row"><strong>Date Posted:</strong> {formatDate(selectedNews.date_posted)}</div>
              {selectedNews.image_url && (
                <div className="order-detail-row">
                  <strong>Image:</strong><br />
                  <img src={selectedNews.image_url} alt="News" className="img-fluid my-2" />
                </div>
              )}
              <hr />
              <h5>Content:</h5>
              <p>{selectedNews.content}</p>
            </>
          ) : (
            <p>No news article selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedNews && (
            <div className="action-buttons">
              <Button variant="warning" className="btn" onClick={() => { handleCloseViewModal(); handleEditNews(selectedNews); }}>
                <FaEdit />
              </Button>
              <Button variant="danger" className="btn" onClick={() => handleDeleteNews(selectedNews.news_id)}>
                <FaTrash />
              </Button>
            </div>
          )}
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCreateEditModal} onHide={handleCloseCreateEditModal} className="custom-modal">
        <Modal.Header className="custom-modal-header" closeButton>
          <Modal.Title>{isEditing ? 'Edit News Article' : 'Create New News Article'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveNews}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter news title"
                value={selectedNews?.title || ''}
                onChange={(e) => setSelectedNews({ ...selectedNews, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter news content"
                value={selectedNews?.content || ''}
                onChange={(e) => setSelectedNews({ ...selectedNews, content: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={selectedNews?.image_url || ''}
                onChange={(e) => setSelectedNews({ ...selectedNews, image_url: e.target.value })}
              />
              {selectedNews?.image_url && (
                <img src={selectedNews.image_url} alt="Preview" className="img-fluid mt-2" style={{ maxHeight: '150px' }} />
              )}
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> : null}
              {isEditing ? 'Save Changes' : 'Create Article'}
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

export default AdminNewsPage;


// // src/components/Admin/AdminNewsPage.js
// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Spinner, Alert, Pagination, InputGroup, Form, Modal } from 'react-bootstrap';
// import { jwtDecode } from 'jwt-decode';

// const AdminNewsPage = () => {
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalNews, setTotalNews] = useState(0);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchTimeout, setSearchTimeout] = useState(null);

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showCreateEditModal, setShowCreateEditModal] = useState(false);
//   const [selectedNews, setSelectedNews] = useState(null); // For viewing/editing
//   const [isEditing, setIsEditing] = useState(false); // True if editing, false if creating

//   const [loggedInUserRole, setLoggedInUserRole] = useState(null);
//   const [loggedInUserId, setLoggedInUserId] = useState(null); // To set author_id for new news

//   // IMPORTANT: This should match the base URL for your Flask API
//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

//   // --- Determine Logged-in User's Role and ID ---
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
//       setLoggedInUserId(decodedToken.user_id || null); // Assuming 'user_id' in token
//     } catch (err) {
//       console.error("Failed to decode token:", err);
//       setError("Invalid or expired token. Please log in again.");
//       setLoading(false);
//     }
//   }, []);

//   // --- Fetch News Articles ---
//   const fetchNews = useCallback(async () => {
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
//         search: searchQuery, // You'll need to implement search on Flask backend for title/content
//       });

//       // Adjust API endpoint to /api/v1/news/
//       const response = await fetch(`${API_BASE_URL}/news/?${params.toString()}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//         throw new Error(errorData.error || `Failed to fetch news: ${response.status}`);
//       }

//       const data = await response.json();
//       setNews(data.news || []); // Flask returns 'news' key
//       setTotalPages(data.pages || 1);
//       setTotalNews(data.total || 0); // Flask returns 'total' key

//     } catch (err) {
//       console.error("Error fetching news:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, loggedInUserRole]);

//   // Effect hook to trigger fetch when dependencies change
//   useEffect(() => {
//     fetchNews();
//   }, [fetchNews]);

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
//   const handleViewDetails = (newsItem) => {
//     setSelectedNews(newsItem);
//     setShowViewModal(true);
//   };

//   const handleCloseViewModal = () => {
//     setShowViewModal(false);
//     setSelectedNews(null);
//   };

//   const handleCreateNews = () => {
//     setSelectedNews({ title: '', content: '', image_url: '' }); // Empty object for new news
//     setIsEditing(false);
//     setShowCreateEditModal(true);
//   };

//   const handleEditNews = (newsItem) => {
//     setSelectedNews(newsItem);
//     setIsEditing(true);
//     setShowCreateEditModal(true);
//   };

//   const handleCloseCreateEditModal = () => {
//     setShowCreateEditModal(false);
//     setSelectedNews(null);
//     setIsEditing(false);
//   };

//   const handleSaveNews = async (e) => {
//     e.preventDefault();
//     if (!selectedNews || !loggedInUserId) {
//       alert("Error: News data or author ID is missing.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     const token = localStorage.getItem('token');

//     try {
//       let url = `${API_BASE_URL}/news/create`;
//       let method = 'POST';

//       if (isEditing) {
//         url = `${API_BASE_URL}/news/update/${selectedNews.news_id}`;
//         method = 'PUT'; // or PATCH
//       }

//       const payload = {
//         title: selectedNews.title,
//         content: selectedNews.content,
//         image_url: selectedNews.image_url,
//         // author_id is sent from backend via JWT for 'create' route
//         // For 'update', author_id doesn't need to be sent typically.
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
//         throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} news: ${response.status}`);
//       }

//       await response.json(); // Parse response if needed
//       fetchNews(); // Re-fetch news to update the list
//       handleCloseCreateEditModal();
//       alert(`News article ${isEditing ? 'updated' : 'created'} successfully!`);

//     } catch (err) {
//       console.error(`Error ${isEditing ? 'updating' : 'creating'} news:`, err);
//       setError(err.message);
//       alert(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteNews = async (newsId) => {
//     if (!window.confirm("Are you sure you want to delete this news article? This action cannot be undone.")) {
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     const token = localStorage.getItem('token');

//     try {
//       const response = await fetch(`${API_BASE_URL}/news/delete/${newsId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//         throw new Error(errorData.error || `Failed to delete news: ${response.status}`);
//       }

//       await response.json();
//       fetchNews(); // Re-fetch news to update the list
//       handleCloseViewModal(); // Close view modal if open
//       alert('News article deleted successfully!');

//     } catch (err) {
//       console.error("Error deleting news:", err);
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
//       <h2>Manage News Articles</h2>

//       <div className="d-flex justify-content-between mb-3 align-items-center flex-wrap">
//         <h4 className="mb-2 mb-md-0">Total Articles: {totalNews}</h4>
//         <InputGroup className="w-md-50 w-100 mb-2 mb-md-0">
//           <Form.Control
//             type="text"
//             placeholder="Search by Title or Content..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//           />
//           <Button variant="outline-secondary" onClick={handleClearSearch}>Clear Search</Button>
//         </InputGroup>
//         <Button variant="primary" onClick={handleCreateNews}>
//           Create New Article
//         </Button>
//       </div>

//       {loading && (
//         <div className="text-center my-4">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading news...</span>
//           </Spinner>
//           <p className="mt-2">Loading news articles...</p>
//         </div>
//       )}

//       {!loading && news.length === 0 && (
//         <Alert variant="info">
//           {searchQuery ? "No news articles found for your criteria." : "No news articles available."}
//         </Alert>
//       )}

//       {!loading && news.length > 0 && (
//         <>
//           <Table striped bordered hover responsive className="mt-3">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Title</th>
//                 <th>Content Snippet</th>
//                 <th>Author ID</th>
//                 <th>Date Posted</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {news.map((newsItem) => (
//                 <tr key={newsItem.news_id}>
//                   <td>{newsItem.news_id}</td>
//                   <td>{newsItem.title}</td>
//                   <td>{newsItem.content.substring(0, 70)}{newsItem.content.length > 70 ? '...' : ''}</td>
//                   <td>{newsItem.author_id}</td>
//                   <td>{formatDate(newsItem.date_posted)}</td>
//                   <td>
//                     <div className="d-flex gap-2">
//                       <Button
//                         variant="info"
//                         size="sm"
//                         onClick={() => handleViewDetails(newsItem)}
//                       >
//                         View
//                       </Button>
//                       <Button
//                         variant="warning"
//                         size="sm"
//                         onClick={() => handleEditNews(newsItem)}
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         variant="danger"
//                         size="sm"
//                         onClick={() => handleDeleteNews(newsItem.news_id)}
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

//       {/* View News Details Modal */}
//       <Modal show={showViewModal} onHide={handleCloseViewModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>News Details - ID: {selectedNews?.news_id}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedNews ? (
//             <>
//               <p><strong>Title:</strong> {selectedNews.title}</p>
//               <p><strong>Author ID:</strong> {selectedNews.author_id}</p>
//               <p><strong>Date Posted:</strong> {formatDate(selectedNews.date_posted)}</p>
//               {selectedNews.image_url && (
//                 <div>
//                   <strong>Image:</strong><br />
//                   <img src={selectedNews.image_url} alt="News" className="img-fluid my-2" style={{ maxHeight: '200px' }} />
//                 </div>
//               )}
//               <hr />
//               <h5>Content:</h5>
//               <p>{selectedNews.content}</p>
//             </>
//           ) : (
//             <p>No news article selected.</p>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           {selectedNews && (
//             <div className="d-flex gap-2">
//               <Button variant="warning" onClick={() => { handleCloseViewModal(); handleEditNews(selectedNews); }}>
//                 Edit
//               </Button>
//               <Button variant="danger" onClick={() => handleDeleteNews(selectedNews.news_id)}>
//                 Delete
//               </Button>
//             </div>
//           )}
//           <Button variant="secondary" onClick={handleCloseViewModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Create/Edit News Modal */}
//       <Modal show={showCreateEditModal} onHide={handleCloseCreateEditModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>{isEditing ? 'Edit News Article' : 'Create New News Article'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSaveNews}>
//             <Form.Group className="mb-3">
//               <Form.Label>Title</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter news title"
//                 value={selectedNews?.title || ''}
//                 onChange={(e) => setSelectedNews({ ...selectedNews, title: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Content</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={5}
//                 placeholder="Enter news content"
//                 value={selectedNews?.content || ''}
//                 onChange={(e) => setSelectedNews({ ...selectedNews, content: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Image URL (Optional)</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter image URL"
//                 value={selectedNews?.image_url || ''}
//                 onChange={(e) => setSelectedNews({ ...selectedNews, image_url: e.target.value })}
//               />
//               {selectedNews?.image_url && (
//                 <img src={selectedNews.image_url} alt="Preview" className="img-fluid mt-2" style={{ maxHeight: '150px' }} />
//               )}
//             </Form.Group>
//             <Button variant="primary" type="submit" disabled={loading}>
//               {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : null}
//               {isEditing ? 'Save Changes' : 'Create Article'}
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

// export default AdminNewsPage;