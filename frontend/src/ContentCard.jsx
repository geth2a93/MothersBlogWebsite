import { useState, useEffect, useRef } from "react";

export default function ContentCard({
  title,
  image,
  preview,
  link,
  backgroundColor,
  type,
  date,
  tags
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const hasImage = Boolean(image);
  const hasText = Boolean(preview && preview.trim().length > 0);
  const showImageOnly = hasImage && !hasText;

  useEffect(() => {
    if (imgRef.current?.complete) {
      setImageLoaded(true);
    }
  }, [image]);

  return (
    <div className="content-card" style={{ backgroundColor }}>
      {hasImage && (
        <div
          className={`content-card-image-container ${
            type === "book" ? "book-image-container" : "blog-image-container"
          }`}
        >
          <img
            ref={imgRef} src={image} alt={title}
            onLoad={() => setImageLoaded(true)}
            className={`content-card-image ${
              type === "book" ? "book-image" : "blog-image"
            } ${imageLoaded ? "loaded" : ""}`}
          />
        </div>
      )}

      <div className="content-card-text">
        <h1 className="content-card-title"> <a href={link}>{title}</a></h1>

        {date && (
          <p className="blog-card-date">
            {new Date(date).toLocaleDateString()}
          </p>
        )}

        {hasText && (
          <>
            <p>{truncateText(preview, 250)}</p>

            {!showImageOnly && (
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