import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./display.css";

function DisplayTeachingResources() {
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getResources = async () => {
      try {
        const response = await fetch("/admin/displayallteachingresources", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch teaching resources");
        }

        const data = await response.json();

        setResources(data.resources || []);
      } catch (error) {
        console.error("Error fetching teaching resources:", error);
      }
    };

    getResources();
  }, []);

  const handleDelete = async (title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const slug = title.replace(/\s+/g, "-");

      const response = await fetch(
        `/admin/deleteresource/${slug}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete resource");
      }

      setResources((prev) =>
        prev.filter((resource) => resource.title !== title)
      );
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert(error.message);
    }
  };

  return (
    <div className="display-list-container">
      <h1>Teaching Resources</h1>

      <div className="display-list-card">
        <div className="display-table-wrapper">
          <table className="display-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {resources.map((resource) => (
                <tr key={resource.title}>
                  <td>{resource.title}</td>

                  <td>
                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/edit-teaching/${resource.title.replace(
                            /\s+/g,
                            "-"
                          )}`
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(resource.title)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DisplayTeachingResources;