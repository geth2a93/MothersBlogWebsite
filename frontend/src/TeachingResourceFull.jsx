import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./TeachingResources.css";

export default function TeachingResourceFull() {
  const { title } = useParams();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5055/api/teachingresources/${title}`)
      .then(res => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then(setResource)
      .catch(err => {
        console.error("Failed to load resource:", err);
        setResource(null);
      })
      .finally(() => setLoading(false));
  }, [title]);

  if (loading) {
    return (
      <div className="teaching-page">
        <div className="teaching-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="teaching-page">
        <div className="teaching-container">
          <p>Resource not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teaching-page">
      <div className="teaching-container">

        {/* TITLE */}
        <h1 className="teaching-title">
          {resource.book_title}
        </h1>

        {/* IMAGE */}
        {resource.book_image_url && (
          <img
            src={resource.book_image_url}
            alt={resource.book_title}
            className="teaching-cover"
          />
        )}

        {/* SECTIONS */}
        <Section title="Word List" content={resource.word_list} />
        <Section title="Activities" content={resource.activities} />
        <Section title="Questions" content={resource.questions} />
        <Section title="Supplies" content={resource.supplies} />
        <Section title="Objectives" content={resource.objectives} />
        <Section title="Procedures" content={resource.procedures} />

        {/* LINKS */}
        <h3 className="section-title">Videos</h3>
        {resource.video_links?.map((v, i) => (
          <div key={i} className="link-item">
            <a href={v.video_link} target="_blank">
              {v.video_title}
            </a>
          </div>
        ))}

        <h3 className="section-title">Book Links</h3>
        {resource.book_links?.map((b, i) => (
          <div key={i} className="link-item">
            <a href={b.book_link} target="_blank">
              {b.book_title}
            </a>
          </div>
        ))}

      </div>
    </div>
  );
}

function Section({ title, content }) {
  if (!content) return null;

  return (
    <div className="teaching-section">
      <h2 className="section-title">{title}</h2>
      <p className="teaching-text">
        {content}
      </p>
    </div>
  );
}