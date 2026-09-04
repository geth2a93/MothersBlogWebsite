import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../editor.css"
function AddEmail() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImages = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const formData = new FormData();

    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("date", date);

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await fetch("/admin/newemail", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create email");
      }

      navigate("/dashboard/displayemails");
    } catch (error) {
      console.error("Error creating email:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-container">
      <h1>Add Email</h1>
        <div className="editor-card">

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <h2> Subject</h2>

            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <h2>Message</h2>

            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={12}
              required
            />
          </div>

          <div className="form-group">
            <h2>Date to Send</h2>

            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <h2 htmlFor="images">
              Images
            </h2>

            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
            />
          </div>

          {images.length > 0 && (
            <div className="selected-images">
              <p>Selected Images:</p>

              {images.map((image, index) => (
                <div key={index}>
                  {image.name}
                </div>
              ))}
            </div>
          )}

          <div className="form-buttons">
            <button
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Email"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddEmail;