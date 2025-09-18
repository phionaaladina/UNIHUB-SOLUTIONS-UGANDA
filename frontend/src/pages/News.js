
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function NewsPage() {
//   const [newsList, setNewsList] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/v1/news/')
//       .then((response) => {
//         // ✅ Access the 'news' array inside the object
//         setNewsList(response.data.news);
//       })
//       .catch((error) => {
//         console.error('Error fetching news:', error);
//       });
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h2>Latest News</h2>
//       <div className="row">
//         {newsList.map((news) => (
//           <div className="col-md-4" key={news.news_id}>
//             <div className="card mb-4">
//               {news.image_url && (
//                 <img src={news.image_url} className="card-img-top" alt={news.title} />
//               )}
//               <div className="card-body">
//                 <h5 className="card-title">{news.title}</h5>
//                 <p className="card-text">{news.content.substring(0, 100)}...</p>
//                 <p className="card-text">
//                   <small className="text-muted">{new Date(news.date_posted).toLocaleDateString()}</small>
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default NewsPage;


import React, { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import API_BASE_URL from "../config";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
  const fetchNews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/news`);
      const data = await res.json();
      if (data.news) {
        setNewsList(data.news);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchNews();
}, []);


  if (loading) return <p>Loading news...</p>;

  return (
    <div className="news-container">
      {newsList.length === 0 ? (
        <p>No news available.</p>
      ) : (
        newsList.map((newsItem) => (
          <NewsCard key={newsItem.news_id} news={newsItem} />
        ))
      )}
    </div>
  );
};

export default News;
