import { useEffect, useState } from "react";
import { useNavigate, useParams  } from "react-router-dom";
import { formatBookDate, formatDate } from "../components/dateHelper.js";
import MediaRenderer from "../components/MediaRenderer.jsx";
import "../css/Home.css"

function Home() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/")
      .then((res) => res.json())
      .then((data) => {
        setHomeData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  if (!homeData) {
    return <div>No content available.</div>;
  }
  
  const { latest, banner_image } = homeData;
  const book = latest?.book;
  const blog = latest?.blog;
  
  const isBookComingSoon = book?.date && book.date >= new Date().toISOString().split("T")[0];

  const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength
    ? text.substring(0, maxLength) + "..."
    : text;
};

const bookDate = book?.date_displayed
  ? formatBookDate(book.date)
  : null;



  return (
    <div className="app">

      {/* Hero Banner */}
      <section className="hero">
        {banner_image ? (
          <img src={banner_image} alt="Website Banner" className="hero-image" />
        ) : (
          <div className="hero-placeholder">
            No banner available.
          </div>
        )}
      </section>

    {/* Coming Soon */}
      <section className="coming-soon">
        <div className="coming-soon-content">
          <div className="coming-soon-text">

            <h1>{isBookComingSoon ? "COMING SOON" : "OUT NOW"}</h1>
            
            {book ? ( <h2>{book.title}</h2> ) : ( <h2>No Title available.</h2> )}
            {bookDate && (
            <div className="book-date-section">
            <h2>{bookDate.label}</h2>
            <p className="book-date">{bookDate.date}</p>
            </div>
            )}
            {book ? ( <p> {truncateText(book.synopsis, 500)} </p> ) : ( <p>No book data available.</p> )}           

          <button className="read-more-btn"  onClick={() => navigate(`/books/title/${book.slug}`)} > 
            Read More </button>
          </div>
          
          <div className="book-cover-container">
          {book?.image ? (
            <img
              src={book?.image}
              alt={book?.title}
              className="coming-soon-image"
            />
          ) : (
            <div className="coming-soon-placeholder">
              No Image Available
            </div>
          )}
          </div>
          
        </div>
      </section>

    {/* Home Newest */}
      <section className="home-newest">
        <div className="home-newest-content">
        
          
           <div className="home-newest-text">
             {blog ? (
              <>
                <h1>What's New</h1>
                <h2>{blog?.title}</h2>
                <p className="content-date">{formatDate(latest.blog.date)}</p>
                <p>{truncateText(blog?.preview, 500)}</p>
                <button className="read-more-btn"  onClick={() => navigate(`/blog/${blog.slug}`)}> Read More </button>
              </>
            ) : (
              <p>No recent blog posts.</p>
            )}

          </div>

           {blog?.title_media ? (
            <MediaRenderer
              media={blog.title_media}
              contentType={blog.url_content_type}
              title={blog.title}
              className="home-newest-image"
            />
            ) : (
          <div className="home-newest-image">
          No Image Available
        </div>
      )}

        </div>
      </section>
      
    </div>
  );
}

export default Home;