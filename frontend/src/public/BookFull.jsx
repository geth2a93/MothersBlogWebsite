import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatBookDate } from "./dateHelper.js";
import "./BookFull.css";

export default function BookDetail() {
  const { title } = useParams();
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`/api/books/title/${slug}`)
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
  }, [slug]);

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

        <div className="book-info-box">

        {/* LEFT: COVER */}
        <div className="book-cover-container">
          <img className="book-cover" src={book.book_image_url} alt={book.title}/>
        </div>

        {/* RIGHT: DETAILS */}
          <div className="book-details">

          {/* GENRES */}
          {book.genre_name?.length > 0 && (
            <div className="book-genres">
              <div className="genres-list">
                {book.genre.map((genre_name) => (
                  <div className="review-author" key={genre_name}>
                  {genre_name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PUBLISH DATE */}
          {book.date_displayed && (() => {
            const bookDate = formatBookDate(book.date_added);

            return (
              <div className="book-date-section">
                <h2>{bookDate.label}</h2>
                <p className="book-date">{bookDate.date}</p>
              </div>
            );
          })()}

          {/* SYNOPSIS */}
          <div className="book-synopsis-section">
            <h2>Synopsis</h2>
            <p className="book-synopsis">
              {book.synopsis}
            </p>
          </div>

          </div>
        </div>

        {book.awards?.length > 0 && (
          <section>
             <div className="book-awards-section">
              <h2>Awards</h2>
              </div>
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
          
          </section>
          )}

        {/* REVIEWS */}
{book.reviews?.length > 0 && (
  <section>
    <h3 className="section-title">Reviews</h3>

    {book.reviews.map((r) => (
      <div key={r.id} className="buy-link-card">
        <div className="review-author">{r.name}</div>
        <div className="review-content">{r.content}</div>
      </div>
    ))}
  </section>
)}

{book.buy_links?.length > 0 && (
  <section>
    <h3 className="section-title">Buy Now</h3>

    {book.buy_links.map((link, index) => (
      <div key={index} className="review-card">
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="buy-link-site-name">{link.name}</a>
      </div>
    ))}
  </section>
)}

      </div>
    </div>
  );
}