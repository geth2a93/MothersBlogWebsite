import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/display.css";

export default function AdminEditBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/admin/displayallblogs", {
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

  const handlePublish = async (slug) => {
  const confirmed = window.confirm(
    "Publish this blog post now?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `/admin/publishblog/${slug}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Publish failed");
    }

    setBlogs((prev) =>
      prev.map((blog) =>
        blog.slug === slug
           ? {
              ...blog,
              date_created: data.blog_date,
              published: data.published,
            }
          : blog
      )
    );
  } catch (err) {
    console.error(err);
    alert("Failed to publish blog");
  }
};

  const handleDelete = async (slug) => {
    const confirmed = window.confirm(
      `Delete "${slug}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/admin/deleteblog/${slug}`,
        {
          method: "DELETE",
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
    <div className="display-list-container">
      <h1>All Blog Posts</h1>

      <div>
        <button onClick={() =>navigate( `/dashboard/add-blog`)}> Add Blog  </button>
      </div>

      <div className="display-list-card">
        {loading ? (
          <p className="display-list-message">Loading...</p>
        ) : blogs.length === 0 ? (
          <p className="display-list-message">
            No blog posts found.
          </p>
        ) : (
          <div className="display-table-wrapper">
            <table className="display-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Publish Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td className="display-title">
                      {blog.title}
                    </td>

                    <td>
                      {blog.date_created}
                    </td>

                    <td>
                      <span
                        className={
                          blog.published
                            ? "display-status published"
                            : "display-status draft"
                        }
                      >
                        {blog.published
                          ? "Published"
                          : "Draft"}
                      </span>
                    </td>

                    <td className="display-actions">
                      <button
                        className="edit-button"
                        onClick={() =>
                          navigate(
                            `/dashboard/blog-edit/${blog.slug}`
                          )
                        }
                      >
                        Edit
                      </button>
                      

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(blog.slug)
                        }
                      >
                        Delete
                      </button>

                        {!blog.published && (
                          <button className="publish-button" onClick={() => handlePublish(blog.slug)}>
                            Publish
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}