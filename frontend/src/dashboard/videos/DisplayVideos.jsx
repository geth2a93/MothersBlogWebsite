import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/display.css";

function DisplayVideos() {
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getResources = async () => {
      try {
        const response = await fetch("/admin/displayallvideos", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch video resources");
        }

        const data = await response.json();

        setResources(data.resources || []);
      } catch (error) {
        console.error("Error fetching videos resources:", error);
      }
    };

    getResources();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete "${id}"?`)) {
      return;
    }

    try {

      const response = await fetch(
        `/admin/deletevideo/${id}`,
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
        prev.filter((resource) => resource.id !== id)
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
      <h1>Videos</h1>

      <div>
        <button onClick={() =>navigate( `/dashboard/newvideo`)}
         className="add-button"> + Add Video  </button>
      </div>
      
      </div>


        <div className="display-table-wrapper">
          <table className="display-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id}>
                  <td className="display-title" dangerouslySetInnerHTML={{ __html: resource.title || "" }}/>

                   <td className="display-actions">
                    <button className="edit-button"
                      onClick={() =>
                        navigate(
                          `/dashboard/video-edit/${resource.id}`
                          )
                      }
                    >
                      Edit
                    </button>

                    <button className="delete-button"
                      onClick={() =>
                        handleDelete(resource.id)
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

export default DisplayVideos;