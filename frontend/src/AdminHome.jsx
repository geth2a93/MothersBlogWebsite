import { useNavigate } from "react-router-dom";
import "./admin.css"
export default function AdminHome() {
    const navigate = useNavigate();

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>

            <p>Website administration tools.</p>

            <div className="admin-card">
            <button onClick={() => navigate("/admin/aboutme")} >
                Edit About Me
            </button>

            <button onClick={() => navigate("/admin/websiteresources")} >
                Edit Web Resources
            </button>

            <button onClick={() => navigate("/admin/blog-editor")} >
                Add Blog
            </button>

            <button onClick={() => navigate("/admin/blogs")} >
                Manage Existing Posts
            </button>
            
            </div>
        </div>
    );
}