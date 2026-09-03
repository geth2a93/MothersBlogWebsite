import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./display.css";

function EditEmail() {
  const { email_id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");

  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getEmail = async () => {
      try {
        const response = await fetch(`/admin/editemail/${email_id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch email");
        }

        const data = await response.json();

        setSubject(data.subject || "");
        setMessage(data.message || "");

        if (data.date_to_send) {
          setDate(data.date_to_send.slice(0, 10));
        }

        setImages(
          (data.images || []).map((image) => ({
            id: image.id,
            image_url: image.image_url,
            existing: true,
          }))
        );
      } catch (error) {
        console.error("Error fetching email:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getEmail();
  }, [email_id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file: file,
      image_url: URL.createObjectURL(file),
      existing: false,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    const formData = new FormData();

    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("date", date);

    const imageData = images.map((image, index) => {
      if (image.file) {
        formData.append(`image_${index}`, image.file);
      }

      return {
        id: image.id || null,
        image_url: image.file ? "" : image.image_url,
      };
    });

    formData.append("images", JSON.stringify(imageData));

    try {
      const response = await fetch(`/admin/editemail/${email_id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update email");
      }

      navigate("/dashboard/displayemails");
    } catch (error) {
      console.error("Error updating email:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="editor-container">
        <h1>Loading Email...</h1>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <h1>Edit Email</h1>
        <div className="editor-container">

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <h2>Subject</h2>

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
              rows="12"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
            <h2>Add Images</h2>

            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>

          {images.length > 0 && (
            <div>
              <h3>Images</h3>

              {images.map((image, index) => (
                <div
                  className="email-image" 
                  key={image.id || `${image.image_url}-${index}`}
                >
                  <img
                    width="250"
                    src={image.image_url}
                    alt={`Email image ${index + 1}`}
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                  >
                    Remove
                  </button>
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
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditEmail;