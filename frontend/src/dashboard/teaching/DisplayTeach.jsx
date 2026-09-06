import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/display.css";

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

  const handleDelete = async (slug) => {
    if (!window.confirm(`Are you sure you want to delete "${slug}"?`)) {
      return;
    }

    try {

      const response = await fetch(
        `/admin/deleteresource/${slug}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete resource");
      }

      setResources((prev) =>
        prev.filter((resource) => resource.slug !== slug)
      );
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert(error.message);
    }
  };

  return (
    <div className="display-list-container">
      

      <div className="display-list-card">

      <div className="display-list-header">
      <h1>Teaching Resources</h1>

      <div>
        <button onClick={() =>navigate( `/dashboard/add-teaching`)}
         className="add-button"> + Add Resource  </button>
      </div>
      
      </div>


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
                <tr key={resource.slug}>
                  <td className="display-title" dangerouslySetInnerHTML={{ __html: resource.title || "" }}/>

                   <td className="display-actions">
                    <button className="edit-button"
                      onClick={() =>
                        navigate(
                          `/dashboard/edit-teaching/${resource.slug}`
                          )
                      }
                    >
                      Edit
                    </button>

                    <button className="delete-button"
                      onClick={() =>
                        handleDelete(resource.slug)
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