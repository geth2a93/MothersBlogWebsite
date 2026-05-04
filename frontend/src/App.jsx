import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);

useEffect(() => {
  fetch("http://localhost:5055/api")
    .then(res => res.json())
    .then(data => {
      setPosts(Array.isArray(data) ? data : [data]);
    })
    .catch(err => console.error(err));
}, []);

  return (
    <div className="container">
      <h1>Blog Posts</h1>

      {posts.map((post, index) => (
        <div className="card" key={index}>
          <h2>{post.title}</h2>

          <p className="date">
            {new Date(post.date_created).toLocaleString()}
          </p>

          <div className="tags">
            {post.tags?.map((tag, i) => (
              <span className="tag" key={i}>
                #{tag}
              </span>
            ))}
          </div>

          <p className="content">{post.content}</p>
          <p className="buylinks"> {post.links_url}</p>
        </div>
      ))}
    </div>
  );
}

export default App;