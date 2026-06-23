import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogRender from "./BlogRender";

export default function BlogPreview() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:5055/api/blog/${slug}`,
          {
            credentials: "include"
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load blog");
        }

        setPost(data);
      } catch (err) {
        console.error(err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

 const handlePublish = async () => {
  setPublishing(true);
 
  try {
    const res = await fetch(
      `http://localhost:5055/admin/newblogpostpreview/${slug}`,
      {
        method: "POST",
        credentials: "include"
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Publish failed");
      return;
    }

    localStorage.removeItem("blogDraft");

    alert("Published!");
    navigate("/admin");
  } catch (err) {
    console.error(err);
    alert("Publish failed");
  } finally {
    setPublishing(false);
  }
};

  if (loading) return <p>Loading preview...</p>;
  if (!post) return <p>Post not found</p>;
  console.log("slug:", slug);

  return (
    <div>
      <BlogRender post={post} />

      <div style={{ marginTop: 20 }}>
        <button onClick={() => navigate("/admin/blog-editor")}>
          Back To Editor
        </button>

        <button
          onClick={handlePublish}
          disabled={publishing}
          style={{ marginLeft: 10 }}
        >
          {publishing ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}