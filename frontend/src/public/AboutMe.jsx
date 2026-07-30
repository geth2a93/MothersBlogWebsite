import { useEffect, useState } from "react";
import "./AboutMe.css";

export default function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5055/api/aboutme")
      .then((res) => res.json())
      .then((data) => {
        setAbout(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="about-page">Loading...</div>;
  }

  return (
    <div className="about-page">

      <div className="about-container">
        {about?.author_image && (
          <div className="about-image">
            <img
              src={about.author_image}
              alt="Author"
            />
          </div>
        )}

        <div className="about-content">
          <h1>About the Author</h1>
          <p>{about?.content}</p>
        </div>

      </div>
      
    </div>
  );
}