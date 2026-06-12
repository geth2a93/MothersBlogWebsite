import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./BookFull.css";

export default function BookDetail() {
  const { title } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:5055/api/books/title/${title}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setBook(data);
      })
      .catch(err => {
        console.error("Book fetch failed:", err);
        setBook(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [title]);

  if (loading) {
    return (
      <div className="book-page">
        <div className="book-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-page">
        <div className="book-container">
          <p>Book not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-page">
      <div className="book-container">

        {/* TITLE */}
        <h1 className="book-title">{book.title}</h1>

        {/* COVER */}
        <img
          className="book-cover"
          src={book.book_image_url}
          alt={book.title}
        />

        {/* SYNOPSIS */}
        <p className="book-synopsis">{book.synopsis}</p>

        {/* AWARDS */}
        <h3 className="section-title">Awards</h3>

        {book.awards?.length > 0 ? (
          <div className="awards-container">
            {book.awards.map((a, index) => (
              <div key={index} className="award-card">

                {a.award_url && (
                  <img
                    src={a.award_url}
                    alt={a.award_title}
                    className="award-image"
                  />
                )}

                {a.award_title && (
                  <p className="award-title">
                    {a.award_title}
                  </p>
                )}

              </div>
            ))}
          </div>
        ) : (
          <p>No awards listed.</p>
        )}

        {/* REVIEWS */}
        <h3 className="section-title">Reviews</h3>

        {book.reviews?.length > 0 ? (
          book.reviews.map(r => (
            <div key={r.id} className="review-card">
              <div className="review-author">{r.name}</div>
              <div className="review-content">{r.content}</div>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}

      </div>
    </div>
  );
}