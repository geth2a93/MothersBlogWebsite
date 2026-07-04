import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminEditBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const response = await fetch("http://localhost:5055/admin/displayallblogs", {
        credentials: "include",
      });

      const data = await response.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (slug) => {
    const confirmed = window.confirm(
      `Delete "${slug}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/deleteblog/${slug}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setBlogs((prev) =>
        prev.filter((blog) => blog.slug !== slug)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog");
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-section-header">
        <h2>Blog Posts</h2>

        <button
          className="admin-btn"
          onClick={() => navigate("/admin/blog-editor")}
        >
          + Add Blog Post
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>No blog posts found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Created</th>
              <th>Status</th>
              <th>Slug</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>{blog.title}</td>

                <td>
                  {new Date(
                    blog.date_created
                  ).toLocaleDateString()}
                </td>

                <td>
                  {blog.published
                    ? "Published"
                    : "Draft"}
                </td>

                <td>{blog.slug}</td>

                <td>
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/blog-editor/${blog.slug}`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(blog.slug)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}