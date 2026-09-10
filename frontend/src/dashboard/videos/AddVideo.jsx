import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/editor.css";
import RichTextEditor, { RichTextToolbar } from "../blogs/RichTextEditor";

const defaultVideo = {
  id: null,
  title: "",
  content: "",
  media: {
    type: "youtube",
    url: "",
  },
};

function NewVideo() {
  const navigate = useNavigate();

  const [video, setVideo] = useState(defaultVideo);
  const [activeEditor, setActiveEditor] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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
      const res = await fetch("/admin/addvideo/", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add video");
      }

      navigate("/dashboard/video");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editor-container">
      <h1>New Video</h1>

      <RichTextToolbar activeEditor={activeEditor} />

      <form onSubmit={handleSubmit}>

        {/* Title */}
        <label htmlFor="video-title">Title</label>

        <RichTextEditor
          className="title-rich"
          value={video.title}
          onChange={handleTitleChange}
          onFocus={(editor) => setActiveEditor(editor)}
        />

        {/* Content */}
        <label htmlFor="video-content">Content</label>

        <RichTextEditor
          className="text-area-rich"
          value={video.content}
          onChange={handleContentChange}
          onFocus={(editor) => setActiveEditor(editor)}
        />

        {/* Video Type */}
        <label htmlFor="video-type">Video Platform</label>

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
        <label htmlFor="video-url">Video URL</label>

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
            {saving ? "Saving..." : "Add Video"}
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

export default NewVideo;