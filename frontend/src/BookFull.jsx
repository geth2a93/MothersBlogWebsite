import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BookDetail() {
  const { title } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5055/api/books/title/${title}`)
      .then(res => res.json())
      .then(setBook)
      .catch(console.error);
  }, [title]);

  if (!book) return <div>Loading...</div>;

  return (
    <div>
      <h1>{book.title}</h1>
      <img src={book.book_image_url} />
      <p>{book.synopsis}</p>

      <h3>Reviews</h3>
      {book.reviews?.map(r => (
        <div key={r.id}>
          <strong>{r.name}</strong>
          <p>{r.content}</p>
        </div>
      ))}
    </div>
  );
}