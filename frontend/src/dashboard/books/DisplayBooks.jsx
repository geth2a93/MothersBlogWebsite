import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/display.css";

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
          method: "DELETE",
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
      `Publish "${title}" book to public?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/admin/publishbook/${slug}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Publish failed");
      }

      setBooks((prev) =>
        prev.map((book) => 
          book.slug === slug
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

  const getPlainText = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return div.textContent || div.innerText || "";
};

  return (
    <div className="display-list-container">
    <div className="display-list-card">
     <div className="display-list-header">
       <h1>All Books</h1>
      <div>
        <button onClick={() =>navigate( `/dashboard/newbook`)} 
         className="add-button">
        + Add Book  </button>
      </div>
    </div>

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
                    <td className="display-title" dangerouslySetInnerHTML={{ __html: book.title || "" }}/>

                    <td>
                      {book.isbn || "-"}
                    </td>

                    <td>
                      {book.date_added}
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

                      <button className="delete-button" onClick={() => handleDelete(book.slug, getPlainText(book.title))}>
                        Delete
                      </button>

                      {!book.displayed && (
                      <button className="publish-button" onClick={() => handlePublish(book.slug, getPlainText(book.title))}>
                        Publish
                      </button> )}


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