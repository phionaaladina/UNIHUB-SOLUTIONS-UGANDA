// import React from 'react';

// const WhatsAppChat = () => {
//   const userId = 1; // Replace with actual user id or handle dynamically
//   const message = "Hello, I want to learn more about your services.";

//   // WhatsApp URL with phone number and message
//   const phoneNumber = "256773874765"; // without plus sign for wa.me
//   const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

//   const handleClick = () => {
//     // Send message info to your backend to save in DB
//     fetch('http://127.0.0.1:5000/api/v1/chat/save_message', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         userId,
//         message,
//         timestamp: new Date().toISOString()
//       }),
//     })
//     .then(res => res.json())
//     .then(data => {
//       if(data.success) {
//         console.log('Message saved with chat_id:', data.chat_id);
//       } else {
//         console.error('Backend error:', data.error);
//       }
//     })
//     .catch(err => console.error('Error saving message:', err));

//     // Open WhatsApp in new tab
//     window.open(whatsappUrl, '_blank');
//   };

//   return (
//     <button onClick={handleClick}>
//       Chat with us on WhatsApp
//     </button>
//   );
// };

// export default WhatsAppChat;


// import React from 'react';

// const WhatsAppChat = ({ userId }) => {
//   const phoneNumber = "+256773874765"; // WhatsApp phone number in international format
//   const message = "Hello, I want to learn more about your services.";
//   const guestUserId = 9999;

//   // Use logged-in user ID or guest ID if not logged in
//   const sendingUserId = userId || guestUserId;

//   const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

//   const handleClick = () => {
//     fetch('http://127.0.0.1:5000/api/v1/chat/save_message', {
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         userId: sendingUserId,
//         message,
//         timestamp: new Date().toISOString()
//       }),
//     }).catch(err => console.error('Error saving message:', err));

//     window.open(whatsappUrl, '_blank');
//   };

//   return (
//     <button onClick={handleClick}>
//       Chat with us on WhatsApp
//     </button>
//   );
// };

// export default WhatsAppChat;

import React from 'react';
import API_BASE_URL from "../config";

const WhatsAppChat = ({ userId }) => {
  const phoneNumber = "+256773874765"; // Your WhatsApp number
  const message = "Hello, I want to learn more about your services.";
  const guestUserId = 9999;

  // Use logged-in user ID or guest ID if not logged in
  const sendingUserId = userId || guestUserId;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    // This fetch call will only work if your backend is running and accessible
    fetch(`${API_BASE_URL}/api/v1/chat/save_message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: sendingUserId,
        message,
        timestamp: new Date().toISOString(),
      }),
    }).catch(err => console.error('Error saving message:', err));

    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Ensure Bootstrap CSS and Bootstrap Icons are loaded in your project's index.html
          or a parent component for these classes and icons to work.
          Example for index.html head:
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
      */}
      <a
        href={whatsappUrl}
        className="position-fixed bottom-0 end-0 me-4 mb-4 btn btn-success rounded-circle shadow-lg"
        style={{
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem', // Adjust icon size
          zIndex: 1000,
          transition: 'background-color 0.3s ease' // Smooth hover effect
        }}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        onClick={handleClick} // Keep your logging logic
      >
        {/* Bootstrap WhatsApp icon */}
        <i className="bi bi-whatsapp text-white"></i>
      </a>
    </>
  );
};

export default WhatsAppChat;
