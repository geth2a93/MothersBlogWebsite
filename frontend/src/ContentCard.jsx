export default function ContentCard({
  title,
  image,
  preview,
  link,
  backgroundColor,
  type
}) {
  return (
    <div className="content-card" style={{ backgroundColor }}>

        <div className={`content-card-image-container ${ 
            type === "book" ? "book-image-container": "blog-image-container"
        }`} >

        {image ? (
          <img src={image} alt={title}  className={`content-card-image ${ 
            type === "book" ? "book-image": "blog-image"
         }`} />

        ) : (
          <div className="content-card-placeholder">
            No Image
          </div>
        )}
      </div>

      <div className="content-card-text">
        <h2>{title}</h2>
        <p>{preview}</p>

        <button
          className="content-card-button" onClick={() => (window.location.href = link)}
        >
          Read More
        </button>
      </div>

    </div>
  );
}