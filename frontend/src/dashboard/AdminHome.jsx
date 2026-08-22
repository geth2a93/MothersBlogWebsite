import { useNavigate } from "react-router-dom";
import "./admin.css"
export default function AdminHome() {
    const navigate = useNavigate();

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>

            <p>Website administration tools.</p>

            <div className="admin-card">
            <button onClick={() => navigate("/dashboard/aboutme")} >
                Edit About Me
            </button>

            <button onClick={() => navigate("/dashboard/websiteresources")} >
                Edit Web Resources
            </button>

            <button onClick={() => navigate("/dashboard/add-blog")} >
                Add Blog
            </button>

            <button onClick={() => navigate("/dashboard/blogs")} >
                Manage Existing Posts
            </button>
            
            <button onClick={() => navigate("/dashboard/books")} >
                Edit Books
            </button>

            <button onClick={() => navigate("/dashboard/newbook")} >
                Add A Book
            </button>
            </div>
        </div>
    );
}