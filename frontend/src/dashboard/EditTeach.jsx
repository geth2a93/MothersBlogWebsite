import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./display.css";

function EditTeachingResource() {
  const { slug } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  

  useEffect(() => {
    const getResource = async () => {
      try {
        const response = await fetch(
          `/admin/editteachingresource/${slug}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch teaching resource"
          );
        }

        const data = await response.json();

        setBookTitle(data.title || "");
        setWordList(data.word_list || "");
        setActivities(data.activities || "");
        setQuestions(data.questions || "");
        setSupplies(data.supplies || "");
        setObjectives(data.objectives || "");
        setProcedures(data.procedures || "");

        setVideos(data.video_links || []);
        setBooks(data.book_links || []);

      } catch (error) {
        console.error(
          "Error fetching teaching resource:",
          error
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getResource();
  }, [slug]);

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
      slug: slug,
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
        `/admin/editteachingresource/${slug}`,
        {
          method: "PUT",
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
          result.error ||
            "Failed to update teaching resource"
        );
      }

      navigate("/dashboard/display-teaching");

    } catch (error) {
      console.error(
        "Error updating teaching resource:",
        error
      );

      setError(error.message);

    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <h1>Loading Teaching Resource...</h1>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="editor-container">

        <h1>Edit Teaching Resource</h1>

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
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default EditTeachingResource;