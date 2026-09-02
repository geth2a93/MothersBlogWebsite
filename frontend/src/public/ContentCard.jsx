import { useState, useEffect, useRef } from "react";
import {
  InstagramEmbed,
  FacebookEmbed,
  YouTubeEmbed
} from "react-social-media-embed";

export default function ContentCard({
  title,
  title_media,
  url_content_type,
  preview,
  link,
  backgroundColor,
  type,
  date,
  tags,
  slug,
}) {

const renderMedia = () => {
  if (!title_media) return null;

  switch (url_content_type) { 
    case "image":
      return (
        <img
          src={title_media}
          alt={title}
          onLoad={() => setMediaLoaded(true)}
          className={`content-card-image ${
            type === "book" ? "book-image" : "blog-image"} ${
             mediaLoaded ? "loaded" : ""}
          }`}
        />
      );

    case "instagram":
      setTimeout(() => setMediaLoaded(true), 600);
      return (
        <div
        onLoad={() => setMediaLoaded(true)} 
        style={{ display: "flex", justifyContent: "center" }}>
          <InstagramEmbed url={title_media} width={350}  height = {400}/>
        </div>
      );

    case "youtube":
      setTimeout(() => setMediaLoaded(true), 600);
      return (
        <div
        onLoad={() => setMediaLoaded(true)} 
        style={{ display: "flex", justifyContent: "center" }}>
          <YouTubeEmbed url={title_media} width={450} height = {300}/>
        </div>
      );

    case "facebook":
      return (
        <div
        onLoad={() => setMediaLoaded(true)}
        style={{ display: "flex", justifyContent: "center" }}>
          <FacebookEmbed url={title_media} width={500} />
        </div>
      );

    default:
      return null;
    }
  };

  const [mediaLoaded, setMediaLoaded] = useState(false);
  const imgRef = useRef(null);

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const hasMedia = Boolean(title_media);
  const hasText = Boolean(preview && preview.trim().length > 0);
  const showMediaOnly = hasMedia && !hasText;

  useEffect(() => {
   setMediaLoaded(false);
  }, [title_media, url_content_type]);

  return (
    <div className="content-card" style={{ backgroundColor }}>
      {title_media && (
        <div
          className= "content-card-image-container">
            {renderMedia()}
        </div>
      )}

      <div className="content-card-text">
        <h1 className="content-card-title"> <a href={link}>{title}</a> </h1>

        {date && (
          <p className="blog-card-date">
            {new Date(date).toLocaleDateString()}
          </p>
        )}

        {hasText && (
          <>
            <p >{truncateText(preview, 250)}</p>

            {!showMediaOnly && (
              <button
                className="content-card-button"
                onClick={() => (window.location.href = link)} >
                Read More
              </button>
            )}
          </>
        )}

        {tags?.length > 0 && (
          <div className="tag-container">
            {tags.slice(0, 10).map((tag, i) => (
              <span key={i} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}