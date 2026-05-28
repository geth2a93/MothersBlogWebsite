import { useEffect, useState } from "react";
import "./Home.css";
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
  const { book, blog, author_image } = homeData;

  
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

      <section className="hero">
        <div className="hero-placeholder">
          Hero Image Placeholder
        </div>
      </section>

    {/* Coming Soon */}
      <section className="coming-soon">
        <div className="coming-soon-content">
          <div className="coming-soon-text">
            <h1>COMING SOON</h1>
            <h2>Upcoming Book Title</h2>
            <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap 
            into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software
            </p>

          <button className="read-more-btn"> Read More </button>
          </div>

          <div className="coming-soon-image"> 600 × 600 Image </div>
        </div>
      </section>

    {/* Home Newest */}
      <section className="home-newest">
        <div className="home-newest-content">
        
          <div className="home-newest-image"> 600 × 600 Image </div>
           <div className="home-newest-text">
            <h2>Lorem Ipsum is</h2>
             <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap 
            into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="newsletter">

          <h3>Subscribe to my newsletter</h3>
          <p> Sign up for news and exclusive content.</p>

          <div className="newsletter-form">
            <input type="email" placeholder="Example@example.com" />
            <button> Sign Up </button>
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