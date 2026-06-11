import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";
import "./Components.css";
import "./Styles.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faPinterest,
  faThreads,
  faBluesky,
  faLinkedin
} from "@fortawesome/free-brands-svg-icons";

function Home() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api")
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
  


  const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength
    ? text.substring(0, maxLength) + "..."
    : text;
};



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

            <h1>COMING SOON</h1>
            <h2> {book?.title}
            {!book && (
              <p>No Title available.</p> 
              )} 
            </h2>

            <p>{truncateText(book?.synopsis, 1000)}
             {!book && (
              <p>No book data available.</p> 
              )}
            </p>

          <button className="read-more-btn" onClick={() => navigate(`/books/${book?.id}`)} style={{display: "block"} }> 
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
        
           {blog?.title_pic ? (
            <img
              src={blog.title_pic}
              alt={blog.title}
              className="home-newest-image"
            />
          ) : (
            <div className="home-newest-image">
              No Image Available
            </div>
          )}

           <div className="home-newest-text">
             {blog ? (
              <>
                <h2>{blog?.title}</h2>
                <p>{truncateText(blog?.preview, 1000)}</p>
                <button className="read-more-btn"  onClick={() => navigate(`/blog/${blog?.id}`)}
                  > Read More </button>
              </>
            ) : (
              <p>No recent blog posts.</p>
            )}

          </div>
        </div>
      </section>
      
    </div>
  );
}

export default Home;