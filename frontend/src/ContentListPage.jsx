import { useEffect, useState, useParams } from "react";
import ContentCard from "./ContentCard.jsx";
import { contentConfig } from "./contentConfig";
import "./Styles.css"


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
        : data?.[config.itemKey]  ?? data;;

      if (!rawItems) {
        console.error("No items found:", data);
        return;
      }

      setItems(rawItems.map(config.mapItem));

      setHasNext(data.has_next ?? false);
    });
}, [page, type, genre]);

  return (
    <div className="content-page">

      <h1 className="content-title">
        {config.title}
      </h1>

      <div className="content-list">

        {items.map((item, index) => (
          <ContentCard
            key={item.id}
            title={item.title}
            image={item.image}
            preview={item.preview}
            link={item.link}
            type = {type}
            backgroundColor={index % 2 === 0 ? "#FFFFFF" : "#fff8f2"}

            date={item.date}
            tags={item.tags}
          />
        ))}

      </div>
      

      {type === "blog" && (
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
      )} 
    </div>
  )}
