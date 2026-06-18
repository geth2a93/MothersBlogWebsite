import { useNavigate } from "react-router-dom";

export default function AdminHome() {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: "600px", margin: "auto" }}>
            <h1>Admin Dashboard</h1>

            <p>Website administration tools.</p>

            <button onClick={() => navigate("/admin/aboutme")} >
                Edit About Me
            </button>

            <button onClick={() => navigate("/admin/websiteresources")} >
                Edit Web Resources
            </button>

            <button onClick={() => navigate("/admin/blog-editor")} >
                Edit Blog
            </button>
        </div>
    );
}