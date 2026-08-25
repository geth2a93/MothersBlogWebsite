import { useNavigate } from "react-router-dom";
import "./dash.css";

export default function AdminHome() {
    const navigate = useNavigate();

    return (
        <div className="dash-container">
            <h1>Admin Dashboard</h1>

            <p>Website administration tools.</p>

            <div className="dash-card">

                <details>
                    <summary>General</summary>

                    <div className="dash-buttons">
                        <button onClick={() => navigate("/dashboard/aboutme")}>
                            Edit About Me
                        </button>

                        <button onClick={() => navigate("/dashboard/websiteresources")}>
                            Edit Web Resources
                        </button>

                        <button onClick={() => navigate("/dashboard/displayteaching")}>
                            Edit Teaching Resources
                        </button>

                         <button onClick={() => navigate("/dashboard/displayemail")}>
                            Emails
                        </button>
                    </div>
                </details>

                <details>
                    <summary>Blogs</summary>

                    <div className="dash-buttons">
                        <button onClick={() => navigate("/dashboard/add-blog")}>
                            Add Blog
                        </button>

                        <button onClick={() => navigate("/dashboard/blogs")}>
                            Manage Blog Posts
                        </button>
                    </div>
                </details>

                <details>
                    <summary>Books</summary>

                    <div className="dash-buttons">
                        <button onClick={() => navigate("/dashboard/newbook")}>
                            Add A Book
                        </button>

                        <button onClick={() => navigate("/dashboard/books")}>
                            Manage Books
                        </button>
                    </div>
                </details>

            </div>
        </div>
    );
}
