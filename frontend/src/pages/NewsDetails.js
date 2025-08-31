import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/NewsDetails.css'; // Optional for styling

const NewsDetails = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    // Fetch news by ID from backend API
      fetch(`http://localhost:5000/api/v1/news/${id}`)
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.error('Error fetching news:', err));
  }, [id]);

  if (!news) return <div>Loading...</div>;

  const formattedDate = new Date(news.date_posted).toLocaleDateString();

  return (
    <div className="news-details-container">
      <h2 className="news-details-title">{news.title}</h2>
      <p className="news-details-date">{formattedDate}</p>
      <img
        src={news.imageUrl || '/news1.jpg'}
        alt={news.title}
        className="news-details-image"
      />
      <p className="news-details-content">{news.content}</p>
    </div>
  );
};

export default NewsDetails;
