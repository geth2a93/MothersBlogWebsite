import "./Components.css";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
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

export function Navbar() {
  const [logo, setLogo] = useState(null);
  const [genreOpen, setGenreOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5055/api/website-settings")
      .then(res => res.json())
      .then(data => setLogo(data.logo))
      .catch(console.error);
  }, []);

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} className="logo-image" />
        <Link to="/" className="logo">Charlotte Bennardo</Link>
      </div>

      <ul className="nav-links">
       

        <li><Link to="/about">About Me</Link></li>
        <li><Link to="/blog">My Blog</Link></li>
         <li
          className="dropdown-wrapper"
          onMouseEnter={() => setGenreOpen(true)}
          onMouseLeave={() => setGenreOpen(false)}
        >
          <Link to="/books">My Books</Link>

          {genreOpen && (
            <div className="dropdown-menu">
              <Link to="/books/Young-Adult">Young Adult</Link>
              <Link to="/books/Middle-Grade">Middle Grade</Link>
              <Link to="/books/Romance">Romance</Link>
              <Link to="/books/Short-Story">Short Story</Link>
            </div>
          )}
        </li>



        <li><Link to="/teachingresources">Teaching Resources</Link></li>
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="newsletter">
        <h3>Subscribe to my newsletter.</h3>
        <p>Sign up for news and exclusive content.</p>

        <div className="newsletter-form">
          <input className="news-input" type="email" placeholder="Example@example.com" />
          <button className="sign-btn">Sign Up</button>
        </div>
      </div>

      <div className="socials">
        <h3>Follow Me!</h3>

        <div className="social-links">
          <a href="https://facebook.com"  
            target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="https://www.linkedin.com/in/charlotte-bennardo-a2223143/"  target="_blank"  rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
          <a href="https://threads.net"  target="_blank"  rel="noopener noreferrer"><FontAwesomeIcon icon={faThreads} /></a>
          <a href="https://x.com"  target="_blank"  rel="noopener noreferrer"><FontAwesomeIcon icon={faXTwitter} /></a>
          <a href="https://bsky.app"  target="_blank"  rel="noopener noreferrer"><FontAwesomeIcon icon={faBluesky} /></a>
          <a href="https://instagram.com"  target="_blank"  rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
          <a href="https://pinterest.com"  target="_blank"  rel="noopener noreferrer"><FontAwesomeIcon icon={faPinterest} /></a>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}