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


const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength
    ? text.substring(0, maxLength) + "..."
    : text;
};
const [imageLoaded, setImageLoaded] = useState(false);
const imgRef = useRef(null);
useEffect(() => {
    if (imgRef.current?.complete) {
        setImageLoaded(true);
    }
}, [image]);

  return (
    <div className="content-card" style={{ backgroundColor }}>

        <div className={`content-card-image-container ${ 
            type === "book" ? "book-image-container": "blog-image-container"
        }`} >

        {image ? (
          <img  ref={imgRef} src={image} alt={title} 
          onLoad={() => setImageLoaded(true)} 
          className={`content-card-image ${ type === "book" ? "book-image": "blog-image" } 
          ${imageLoaded ? "loaded" : ""}`}
          />

        ) : (
          <div className="content-card-placeholder">
            No Image
          </div>
        )}
      </div>

      <div className="content-card-text">
        <h1>{title}</h1>
        {date && (
          <p className="blog-card-date"> {new Date(date).toLocaleDateString()} </p>
        )}
        <p>{truncateText(preview,500)}</p>

        <button
          className="content-card-button" onClick={() => (window.location.href = link)}>
          Read More
        </button>

        {tags?.length > 0 && (
            <div className="tag-container">
             {tags.map((tag, i) => (
               <span key={i} className="tag-pill"> {tag}  </span> 
               ))}
              
            </div> )}
      </div>

    </div>
  );
}