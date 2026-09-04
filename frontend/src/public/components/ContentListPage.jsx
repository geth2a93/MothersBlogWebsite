import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContentCard from "./ContentCard.jsx";
import { contentConfig } from "./contentConfig.js";



export default function ContentListPage({ type, genre }) {
  
  const config = contentConfig[type];

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

useEffect(() => {
  const endpoint =
    typeof config.endpoint === "function"
      ? config.endpoint(genre)
      : config.endpoint;

  const url = config.paginate
    ? `${endpoint}?page=${page}`
    : endpoint;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const rawItems = Array.isArray(data)
        ? data
        : data?.data  ?? [];

      if (!rawItems) {
        console.error("No items found:", data);
        return;
      }

      setItems(rawItems.map(config.mapItem));

      setHasNext(data.has_next ?? false);
    });
}, [page, type, genre]);


const itemsToRender = [...items];

  return (
    <div className="content-page">

      <h1 className="content-title">
        {config.title}
      </h1>

      <div className="content-list">

        {itemsToRender.map((item, index) => (
          <ContentCard
            key={item.id}
            title={item.title}
            image={item.image}
            title_media={item.title_media}
            url_content_type={item.url_content_type}
            genre_name = {item.genre_name}
            
            preview={type === "blog" ? item.preview_short : item.preview}
            link={item.link}
            type = {type}
            backgroundColor={index % 2 === 0 ? "#FFFFFF" : "#fff8f2"}

            date={item.date}
            tags={item.tags}
          />
        ))}

      </div>
      


      <div className="pagination">
        
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>Page {page}</span>

        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!hasNext}
        >
          Next
        </button>

      </div>
 
    </div>
  )}
