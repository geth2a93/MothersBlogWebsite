import { useEffect, useState } from "react";
import ContentCard from "./ContentCard.jsx";
import { contentConfig } from "./contentConfig";
import "./Styles.css"

export default function ContentListPage({ type }) {
  const config = contentConfig[type];

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

useEffect(() => {
  fetch(`${config.endpoint}?page=${page}`)
    .then(res => res.json())
    .then(data => {
      console.log("API RESPONSE:", data);
      console.log("BLOG RAW DATA:", data.posts);
      console.log("FIRST POST:", data.posts?.[0]);

      const rawItems = Array.isArray(data)
        ? data
        : data?.[config.itemKey];

      if (!rawItems) {
        console.error("No items found. Check API shape:", data);
        return;
      }

      setItems(rawItems.map(config.mapItem));

      setHasNext(data.has_next ?? false);
    })
    .catch(console.error);
}, [page, type]);

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
            backgroundColor={index % 2 === 0 ? "#FFFFFF" : "#E6FBFF"}
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
  );
}