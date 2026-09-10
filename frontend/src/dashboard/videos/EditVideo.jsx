import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/editor.css";
import RichTextEditor, { RichTextToolbar } from "./books/RichTextEditor";

const defaultVideo = {
  id: null,
  title: "",
  content: "",
  media: {
    type: "youtube",
    url: "",
  },
};

function EditVideo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(defaultVideo);
  const [activeEditor, setActiveEditor] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const res = await fetch(`/admin/editvideo/${id}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load video");
        }

        setVideo({
          id: id,
          title: data.title || "",
          content: data.content || "",
          media: {
            type: data.video_url_type || "youtube",
            url: data.video_url || "",
          },
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [id]);

  const handleTitleChange = (value) => {
    setVideo((prev) => ({
      ...prev,
      title: value,
    }));
  };

  const handleContentChange = (value) => {
    setVideo((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleMediaTypeChange = (e) => {
    setVideo((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        type: e.target.value,
      },
    }));
  };

  const handleMediaUrlChange = (e) => {
    setVideo((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        url: e.target.value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    const formData = new FormData();

    formData.append("video_title", video.title);
    formData.append("content", video.content);
    formData.append("url_type", video.media.type);
    formData.append("url", video.media.url);

    try {
      const res = await fetch(`/admin/editvideo/${id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update video");
      }

      navigate("/dashboard/video");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="editor-container">Loading...</div>;
  }

  return (
    <div className="editor-container">
      <h1>Edit Video</h1>

      <RichTextToolbar activeEditor={activeEditor} />

      <form onSubmit={handleSubmit}>

        {/* Title */}
        <label>Title</label>

        <RichTextEditor
          className="title-rich"
          value={video.title}
          onChange={handleTitleChange}
          onFocus={(editor) => setActiveEditor(editor)}
        />

        {/* Content */}
        <label>Content</label>

        <RichTextEditor
          className="text-area-rich"
          value={video.content}
          onChange={handleContentChange}
          onFocus={(editor) => setActiveEditor(editor)}
        />

        {/* Video Platform */}
        <label htmlFor="video-type">
          Video Platform
        </label>

        <select
          id="video-type"
          value={video.media.type}
          onChange={handleMediaTypeChange}
        >
          <option value="youtube">YouTube</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="tiktok">TikTok</option>
        </select>

        {/* Video URL */}
        <label htmlFor="video-url">
          Video URL
        </label>

        <input
          id="video-url"
          type="url"
          placeholder="Paste link here"
          value={video.media.url}
          onChange={handleMediaUrlChange}
        />

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <div className="editor-actions">
          <button
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard/video")}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}

export default EditVideo;