import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatBookDate } from "../components/dateHelper.js";
import "../css/BookFull.css";

export default function BookDetail() {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const temp = document.createElement("div");
  temp.innerHTML = book.title || "";

  document.title = temp.textContent || temp.innerText || "";
}, []);

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
        <h1 className="book-title" dangerouslySetInnerHTML={{ __html: book.title || "" }}/>


        {/* PUBLISH DATE */}
          {book.date_displayed && (() => {
            const bookDate = formatBookDate(book.date_added);

            return (
              <div className="book-date-section">
                <h2>{bookDate.label} {bookDate.date}</h2>
              </div>
            );
          })()}

        <div className="book-info-box">

        {/* LEFT: COVER */}
        <div className="book-cover-container">
          <img className="book-cover" src={book.book_image_url} alt={book.title}/>
        </div>

        {/* RIGHT: DETAILS */}
          <div className="book-details">

          {/* GENRES */}
          {book.genre_name?.length > 0 && (
            <div className="book-genres-section">
    <h2>Genres</h2>

    <div className="book-genres">
        {book.genre_name.map((genre_name) => (
            <div className="genre-pill" key={genre_name}>
                {genre_name}
            </div>
        ))}
    </div>
</div>
          )}

          {/* SYNOPSIS */}
          <div className="book-synopsis-section">
            <h2>Synopsis</h2>
            <p className="book-synopsis" dangerouslySetInnerHTML={{ __html: book.synopsis || "" }}/>
          </div>

          </div>
        </div>

        {book.awards?.length > 0 && (
  <section className="book-awards-section">
    <h2>Awards</h2>

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
  <section className="review-section">
    <h2 className="section-title">Reviews</h2>

    {book.reviews.map((r) => (
      <div key={r.id} className="review-card">

    {r.name && (
        <div
            className="review-author"
            dangerouslySetInnerHTML={{ __html: r.name }}
        />
    )}

    {r.title && (
        <div
            className="review-title"
            dangerouslySetInnerHTML={{ __html: r.title }}
        />
    )}

    {r.content && (
        <div
            className="review-content"
            dangerouslySetInnerHTML={{ __html: r.content }}
        />
    )}

    {r.rating && (
        <div className="review-rating">
            ★ {r.rating}
        </div>
    )}

    {r.link_url && (
        <a
            href={r.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="review-url"
        >
            Read full review →
        </a>
    )}
</div>
    ))}
  </section>
)}

{book.buy_links?.length > 0 && (
  <section className="buy-section">
    <h2 className="section-title">Buy the Book</h2>

    {book.buy_links.map((link, index) => (
      <div key={index} className="buy-link-card">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="buy-link-site-name"
        >
          {link.name} →
        </a>
      </div>
    ))}
  </section>
)}
      </div>
    </div>
  );
}