import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./display.css";

export default function AdminEditBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        "/admin/displayallbooks",
        {
          credentials: "include",
        }
      );

      console.log(response.status);

      const data = await response.json();
      setBooks(data.books || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (slug, title) => {
    const confirmed = window.confirm(
      `Delete "${title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/admin/deletebook/${slug}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setBooks((prev) =>
        prev.filter((book) => book.slug !== slug)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete book");
    }
  };

  const handlePublish = async (slug, title) => {
    const confirmed = window.confirm(
      `Publish "${title}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/admin/publishbook/${slug}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Publish failed");
      }

      setBooks((prev) =>
        prev.map((book) => book.slug === slug
    ? {
              ...book,
              displayed: true,
            }
          : book)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to publish book");
    }
  };

  return (
    <div className="display-list-container">
      <h1>All Books</h1>

      <div className="display-list-card">
        {loading ? (
          <p className="display-list-message">
            Loading...
          </p>
        ) : books.length === 0 ? (
          <p className="display-list-message">
            No books found.
          </p>
        ) : (
          <div className="display-table-wrapper">
            <table className="display-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>ISBN</th>
                  <th>Publish Date</th>
                  <th>Genres</th>
                  <th>Visible to Public</th>
                  <th>Actions</th>
                  
                </tr>
              </thead>

              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>

                    <td className="display-title">
                      {book.title}
                    </td>

                    <td>
                      {book.isbn || "-"}
                    </td>

                    <td>
                      {book.date_added ? book.date_added.split(" 00:00:00")[0]: "-"}
                    </td>

                    <td className="display-genres">
                      {book.genres &&
                      book.genres.length > 0
                        ? book.genres.join(", ")
                        : "-"}
                    </td>

                    <td>
                      {book.displayed ? "Displayed" : "Hidden"}
                    </td>


                    <td className="display-actions">
                      <button
                        className="edit-button" onClick={() =>navigate( `/dashboard/book-edit/${book.slug}`)}>
                        Edit
                      </button>

                      <button className="delete-button" onClick={() => handleDelete(book.slug, book.title)}>
                        Delete
                      </button>
                      <button className="publish-button" onClick={() => handlePublish(book.slug, book.title)}>
                        Publish
                      </button>


                    </td>

                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}