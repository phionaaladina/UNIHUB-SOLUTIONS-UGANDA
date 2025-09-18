
// import React from "react";
// import "../styles/ServiceCard.css";
// import { Container, Row, Col, Card, Button } from "react-bootstrap";

// const ServiceCard = ({ sectionTitle, services, userId }) => {
//   const phoneNumber = "+256773874765"; // Your WhatsApp number
//   const guestUserId = 9999;

//   const handleRequestClick = (serviceTitle) => {
//     const sendingUserId = userId || guestUserId;
//     const message = `Hello, I'm interested in your service: ${serviceTitle}`;

//     // Save the message to your backend
//     fetch("http://127.0.0.1:5000/api/v1/chat/save_message", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: sendingUserId,
//         message,
//         timestamp: new Date().toISOString(),
//       }),
//     }).catch((err) => console.error("Error saving message:", err));

//     // Redirect to WhatsApp
//     const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
//     window.open(whatsappUrl, "_blank");
//   };

//   return (
//     <Container className="service-section text-center py-5">
//       <h2 className="section-title mb-4">{sectionTitle}</h2>
//       <Row>
//         {services.map((service, index) => (
//           <Col md={4} className="mb-4" key={index}>
//             <Card className="service-card h-100 shadow-sm">
//               <Card.Img variant="top" src={service.image} className="card-image" />
//               <Card.Body>
//                 <Card.Title className="service-title">{service.title}</Card.Title>
//                 <Card.Text className="service-description">
//                   {service.description.includes("\n") ? (
//                     service.description.split("\n").map((line, idx) => (
//                       <p key={idx} style={{ marginBottom: "0.3rem" }}>{line}</p>
//                     ))
//                   ) : (
//                     <span>{service.description}</span>
//                   )}
//                 </Card.Text>
//                 <Button className="request-btn" onClick={() => handleRequestClick(service.title)}>
//                   Request Now
//                 </Button>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default ServiceCard;


import React from "react";
import "../styles/ServiceCard.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const ServiceCard = ({ sectionTitle, services, userId }) => {
  const phoneNumber = "+256773874765"; // Your WhatsApp number
  const guestUserId = 9999;

  const handleRequestClick = (serviceTitle) => {
    const sendingUserId = userId || guestUserId;
    const message = `Hello, I'm interested in your service: ${serviceTitle}`;

    // Save the message to your backend
    fetch("http://127.0.0.1:5000/api/v1/chat/save_message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: sendingUserId,
        message,
        timestamp: new Date().toISOString(),
      }),
    }).catch((err) => console.error("Error saving message:", err));

    // Redirect to WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Container className="service-section text-center py-5">
      <h2 className="section-title mb-4">{sectionTitle}</h2>
      <Row>
        {services.map((service, index) => (
          <Col md={4} className="mb-4" key={index}>
            <Card className="service-card h-100 shadow-sm">
              <Card.Img variant="top" src={service.image} className="card-image" />
              <Card.Body>
                <Card.Title className="service-title">{service.title}</Card.Title>
                <Card.Text className="service-description">
                  {service.description.includes("\n") ? (
                    service.description.split("\n").map((line, idx) => (
                      <p key={idx} style={{ marginBottom: "0.3rem" }}>{line}</p>
                    ))
                  ) : (
                    <span>{service.description}</span>
                  )}
                </Card.Text>
                <Button className="request-btn" onClick={() => handleRequestClick(service.title)}>
                  Request Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ServiceCard;