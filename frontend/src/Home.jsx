import { useEffect, useState } from "react";
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

function App() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5055/api/")
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
  // const { book, blog, author_image } = homeData;

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

    {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          Charlotte Bennardo
        </div>


        <ul className="nav-links">
          <li><a href="/" >About Me</a></li>
          <li><a href="/blog">My Blog</a></li>
          <li><a href="/books">My Books</a></li>
          <li><a href="/resources">Teaching Resources</a></li>
        </ul>
      </nav>

      {/* Hero Banner */}
      <section className="hero">
        {banner_image ? (
          <img src={banner_image} alt="Website Banner" className="hero-image" />
        ) : (
          <div className="hero-placeholder">
            Hero Image Placeholder
          </div>
        )}
      </section>

    {/* Coming Soon */}
      <section className="coming-soon">
        <div className="coming-soon-content">
          <div className="coming-soon-text">
            <h1>COMING SOON</h1>
             <h2>{book.title}</h2>
            <p>{truncateText(book?.synopsis, 250)}</p>

          <button className="read-more-btn"> Read More </button>
          </div>

          {book?.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="coming-soon-image"
            />
          ) : (
            <div className="coming-soon-image">
              No Image Available
            </div>
          )}

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
                <h2>{blog.title}</h2>
                <p>{truncateText(blog?.preview, 200)}</p>
              </>
            ) : (
              <p>No recent blog posts.</p>
            )}

          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="newsletter">

          <h3>Subscribe to my newsletter.</h3>
          <p> Sign up for news and exclusive content.</p>

          <div className="newsletter-form">
            <input className= "news-input" type="email" placeholder="Example@example.com" />
            <button className="sign-btn"> Sign Up </button>
          </div>
        </div>

        <div className="socials">
          <h3>Follow Me!</h3>

          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faFacebook}/></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedin}/></a>
            <a href="https://threads.net" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faThreads} /></a>
            <a href="https://x.com" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faXTwitter}/></a>
            <a href="https://bsky.app" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faBluesky}/></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faPinterest} /></a> 
          </div>

        </div>
      </footer>
    </div>
  );
}

export default App;