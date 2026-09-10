import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  InstagramEmbed,
  FacebookEmbed,
  YouTubeEmbed,
  XEmbed
} from "react-social-media-embed";

import "../css/Content.css";

export default function VideoFull() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = video?.title || "Video";
  }, []);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const response = await fetch(`/api/videos/${id}`);

        if (!response.ok) {
          throw new Error("Failed to load video");
        }

        const data = await response.json();

        setVideo(data);
      } catch (err) {
        console.error("Error fetching video:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getVideo();
  }, [id]);

  const renderVideo = () => {
    if (!video?.video_url) {
      return null;
    }

    switch (video.video_url_type) {
      case "youtube":
        return (
          <YouTubeEmbed
            url={video.video_url}
            width="100%"
          />
        );

      case "instagram":
        return (
          <InstagramEmbed
            url={video.video_url}
            width="100%"
          />
        );

      case "facebook":
        return (
          <FacebookEmbed
            url={video.video_url}
            width="100%"
          />
        );



      default:
        return (
          <p>
            Unsupported video platform.
          </p>
        );
    }
  };

  if (loading) {
    return (
      <div className="content-page">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-page">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="content-page">
        <p>Video not found.</p>
      </div>
    );
  }

  return (
    <div className="content-page">

      {video.title && (
        <h1
          className="content-title"
          dangerouslySetInnerHTML={{
            __html: video.title,
          }}
        />
      )}

      {video.content && (
        <div
          className="content-text"
          dangerouslySetInnerHTML={{
            __html: video.content,
          }}
        />
      )}

      <div className="video-full-container">
        {renderVideo()}
      </div>

    </div>
  );
}
