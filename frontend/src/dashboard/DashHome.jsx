import { useNavigate } from "react-router-dom";
import "./dash.css";

export default function AdminHome() {
    const navigate = useNavigate();

    return (
        <div className="dash-container">
            <h1>Admin Dashboard</h1>

            <p>Website administration tools.</p>

            <div className="dash-card">
                    <div className="dash-buttons">
                        <button onClick={() => navigate("/dashboard/blogs")}>
                            Manage Blog Posts
                        </button>
                        <button onClick={() => navigate("/dashboard/displayemails")}>
                            Manage Emails
                        </button>
                        <button onClick={() => navigate("/dashboard/books")}>
                            Manage Books
                        </button>
                        <button onClick={() => navigate("/dashboard/display-teaching")}>
                            Manage Teaching Resources
                        </button>
                    </div>


                <details>
                    <summary className="dash-card-text">General</summary>

                    <div className="dash-buttons">
                        <button onClick={() => navigate("/dashboard/aboutme")}>
                            Edit About Me
                        </button>

                        <button onClick={() => navigate("/dashboard/websiteresources")}>
                            Edit Web Resources
                        </button>

                    </div>
                </details>
            </div>
        </div>
    );
}
