// import React from 'react';
// import { Link } from 'react-router-dom';  // for internal navigation
// import '../styles/NewsCard.css';  

// const NewsCard = ({ news }) => {
//   const fallbackImage = '/default-news.png';

//   const previewContent =
//     news.content.length > 100 ? news.content.slice(0, 100) + '...' : news.content;

//   const date = new Date(news.date_posted);
//   const formattedDate = date.toLocaleDateString();

//   return (
//     <div className="card h-100 text-center shadow-sm border-0 custom-product-card">
//       <img
//         src={news.image_url || fallbackImage}
//         alt={news.title}
//         className="card-img-top p-3 product-image"
//         style={{ objectFit: 'cover', height: '180px' }}
//       />
//       <div className="card-body d-flex flex-column">
//         <h5 className="card-title fw-semibold text-start">{news.title}</h5>
//         <p className="card-text text-muted small text-start">{previewContent}</p>
//         <div className="mt-auto text-start">
//           <p className="text-muted fst-italic mb-1">{formattedDate}</p>
//           <Link
//             to={`/news/${news.news_id}`}
//             className="text-primary fw-semibold"
//             style={{ textDecoration: 'none' }}
//           >
//             Read More
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewsCard;



// import React from 'react';
// import { Link } from 'react-router-dom';  // for internal navigation
// import '../styles/NewsCard.css'; 
// // import News1 from '../assets/news1.jpg';

// // import fallbackImage from '../assets/eComm.jpeg';

// const NewsCard = ({ news }) => {
//   const fallbackImage = '/news1.jpg'; 

//   const previewContent =
//     news.content.length > 100 ? news.content.slice(0, 350) + '...' : news.content;

//   const date = new Date(news.date_posted);
//   const formattedDate = date.toLocaleDateString();

//   return (
//     <div className="news-card">
//       <img
//         src={news.imageUrl || fallbackImage}
//         alt={news.title}
//         className="news-image"
//       />
//       <div className="news-content">
//         <h5 className="news-title">{news.title}</h5>
//         <p className="news-snippet">{previewContent}</p>
//         <div className="news-footer">
//           <p className="news-date">{formattedDate}</p>
//           <Link
//             to={`/news/${news.news_id}`}
//             className="news-readmore"
//           >
//             Read More
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewsCard;



import React, { useState } from 'react';
import '../styles/NewsCard.css';

const NewsCard = ({ news }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const fallbackImage = '/news1.jpg';
  const date = new Date(news.date_posted);
  const formattedDate = date.toLocaleDateString();

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="news-card">
      <img
        src={news.imageUrl || fallbackImage}
        alt={news.title}
        className="news-image"
      />
      <div className="news-content">
        <h5 className="news-title">{news.title}</h5>
        <p className="news-snippet">
          {isExpanded ? news.content : news.content.slice(0, 350) + (news.content.length > 350 ? '...' : '')}
        </p>
        <div className="news-footer">
          <p className="news-date">{formattedDate}</p>
          {news.content.length > 350 && (
            <button onClick={toggleContent} className="news-readmore-btn">
              {isExpanded ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
