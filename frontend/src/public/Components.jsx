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
    fetch("/api/website-settings")
      .then(res => res.json())
      .then(data => setLogo(data.logo))
      .catch(console.error);
  }, []);

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetch("/api/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data))
      .catch((err) => console.error("Failed to load genres:", err));
  }, []);
  

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <img src={logo} className="logo-image" />
          <span className="logo">Charlotte Bennardo</span>
        </Link>
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
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/books/${genre.name.replaceAll(" ", "-")}`}
                >
                  {genre.name}
                </Link>
               ))}
            </div>
          )}
        </li>



        <li><Link to="/teachingresources">Teaching Resources</Link></li>
      </ul>
    </nav>
  );
}



export function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/addsub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong.");
        return;
      }

      setMessage("Successfully subscribed!");
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      setMessage("Unable to subscribe. Please try again.");
    }
  };

  return (
    <footer className="footer">
      <div className="newsletter">
        <h3>Subscribe to my newsletter.</h3>
        <p>Sign up for news and exclusive content.</p>

        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <input
            className="news-input"
            type="email"
            placeholder="Example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="sign-btn" type="submit">
            Sign Up
          </button>
        </form>

        {message && <p>{message}</p>}
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