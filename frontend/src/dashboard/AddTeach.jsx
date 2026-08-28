import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./display.css";

function AddTeachingResource() {
  const navigate = useNavigate();

  const [bookTitle, setBookTitle] = useState("");
  const [wordList, setWordList] = useState("");
  const [activities, setActivities] = useState("");
  const [questions, setQuestions] = useState("");
  const [supplies, setSupplies] = useState("");
  const [objectives, setObjectives] = useState("");
  const [procedures, setProcedures] = useState("");

  const [videos, setVideos] = useState([]);
  const [books, setBooks] = useState([]);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const addVideo = () => {
    setVideos((prev) => [
      ...prev,
      {
        video_title: "",
        video_link: "",
      },
    ]);
  };

  const updateVideo = (index, field, value) => {
    setVideos((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const removeVideo = (index) => {
    setVideos((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const addBook = () => {
    setBooks((prev) => [
      ...prev,
      {
        book_title: "",
        book_link: "",
      },
    ]);
  };

  const updateBook = (index, field, value) => {
    setBooks((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const removeBook = (index) => {
    setBooks((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    const data = {
      book_title: bookTitle,
      word_list: wordList,
      activities,
      questions,
      supplies,
      objectives,
      procedures,
      video_links: videos,
      book_links: books,
    };

    try {
      const response = await fetch(
        "/admin/newteachingresource",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to create teaching resource"
        );
      }

      navigate("/dashboard/display-teaching");
    } catch (error) {
      console.error(
        "Error creating teaching resource:",
        error
      );

      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-container">

        <h1>Add Teaching Resource</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Book Title</label>

            <input
              type="text"
              value={bookTitle}
              onChange={(e) =>
                setBookTitle(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Word List</label>

            <textarea
              value={wordList}
              onChange={(e) =>
                setWordList(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Activities</label>

            <textarea
              value={activities}
              onChange={(e) =>
                setActivities(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Questions</label>

            <textarea
              value={questions}
              onChange={(e) =>
                setQuestions(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Supplies</label>

            <textarea
              value={supplies}
              onChange={(e) =>
                setSupplies(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Objectives</label>

            <textarea
              value={objectives}
              onChange={(e) =>
                setObjectives(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Procedures</label>

            <textarea
              rows="10"
              value={procedures}
              onChange={(e) =>
                setProcedures(e.target.value)
              }
            />
          </div>

          <h2>Video Links</h2>

          {videos.map((video, index) => (
            <div
              key={index}
              className="editor-container-alt"
            >
              <input
                placeholder="Video title"
                value={video.video_title}
                onChange={(e) =>
                  updateVideo(
                    index,
                    "video_title",
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Video URL"
                value={video.video_link}
                onChange={(e) =>
                  updateVideo(
                    index,
                    "video_link",
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                onClick={() => removeVideo(index)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addVideo}
          >
            Add Video
          </button>

          <h2>Book Links</h2>

          {books.map((book, index) => (
            <div
              key={index}
              className="editor-container-alt"
            >
              <input
                placeholder="Book title"
                value={book.book_title}
                onChange={(e) =>
                  updateBook(
                    index,
                    "book_title",
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Book URL"
                value={book.book_link}
                onChange={(e) =>
                  updateBook(
                    index,
                    "book_link",
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                onClick={() => removeBook(index)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addBook}
          >
            Add Book
          </button>

          <div className="form-buttons">

            <button
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Creating..."
                : "Create Resource"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AddTeachingResource;