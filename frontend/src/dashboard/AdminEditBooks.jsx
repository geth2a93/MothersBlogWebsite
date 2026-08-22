import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminEditBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        `/admin/displayallbooks`,
        
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

  const handleDelete = async (title) => {
    const confirmed = window.confirm(
      `Delete "${title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const slug = title.replace(/\s+/g, "-");

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
        prev.filter((book) => book.title !== title)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete book");
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-section-header">
        <h2>All Books</h2>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>ISBN</th>
              <th>Date Added</th>
              <th>Genres</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>

                <td>{book.isbn || "-"}</td>

                <td>
                  {book.date_added
                    ? new Date(
                        book.date_added
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  {book.genres.length > 0
                    ? book.genres.join(", ")
                    : "-"}
                </td>

                <td>
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/book-edit/${book.title.replace(/\s+/g, "-")}`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(book.title)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}