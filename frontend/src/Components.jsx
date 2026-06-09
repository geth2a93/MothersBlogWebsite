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

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Charlotte Bennardo</div>

      <ul className="nav-links">
        <li><a href="/">About Me</a></li>
        <li><a href="/blog">My Blog</a></li>
        <li><a href="/books">My Books</a></li>
        <li><a href="/resources">Teaching Resources</a></li>
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
          <a href="https://facebook.com"><FontAwesomeIcon icon={faFacebook} /></a>
          <a href="https://linkedin.com"><FontAwesomeIcon icon={faLinkedin} /></a>
          <a href="https://threads.net"><FontAwesomeIcon icon={faThreads} /></a>
          <a href="https://x.com"><FontAwesomeIcon icon={faXTwitter} /></a>
          <a href="https://bsky.app"><FontAwesomeIcon icon={faBluesky} /></a>
          <a href="https://instagram.com"><FontAwesomeIcon icon={faInstagram} /></a>
          <a href="https://pinterest.com"><FontAwesomeIcon icon={faPinterest} /></a>
        </div>
      </div>
    </footer>
  );
}

export function PreviewCard({
  title, image, preview, link})
  {
  return (
  <div className = "preview-card"> 
      <img src={image}alt={title}className="preview-card-image"/>

    <div className="preview-card-content"> 
      <h2>{title}</h2>
      <p>{preview}</p> 
      <a href={link}> Read More </a> 
    </div>
  </div>
  );
}

export function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="page-content">
        {children}
      </main>
      <Footer />
    </>
  );
}
