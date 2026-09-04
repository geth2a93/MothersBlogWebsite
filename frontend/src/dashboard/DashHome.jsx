import { useNavigate } from "react-router-dom";
import "./css/dash.css";

export default function AdminHome() {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Content",
            items: [
                
                {
                    icon: "✎",
                    title: "Blog Posts",
                    description: "Manage your posts.",
                    path: "/dashboard/blogs",
                },
                {
                    icon: "📚",
                    title: "Books",
                    description: "Manage your publications.",
                    path: "/dashboard/books",
                },

                {
                    icon: "📖",
                    title: "Teaching Resources",
                    description: "Manage teaching materials.",
                    path: "/dashboard/display-teaching",
                },
            ],
        },
        {
            title: "Resources",
            items: [
                {
                    icon: "👤",
                    title: "About Me",
                    description: "Manage your profile.",
                    path: "/dashboard/aboutme",
                },
                {
                    icon: "🔗",
                    title: "Web Resources",
                    description: "Change logo and banner.",
                    path: "/dashboard/websiteresources",
                },
                
            ],
        },
        {
            title: "Communication",
            items: [
                {
                    icon: "✉",
                    title: "Emails",
                    description: "View subscriber emails.",
                    path: "/dashboard/displayemails",
                },
            ],
        },
    ];

    return (
        <div className="dash-container">
            <div className="dash-content">
                {sections.map((section) => (
                    <section className="dash-section" key={section.title}>
                        <h2>{section.title}</h2>

                    <div className="dash-card"></div>
                        <div className="dash-buttons">
                            {section.items.map((item) => (
                                <button
                                    className="dash-button"
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                >
                                    <span className="dash-button-icon">
                                        {item.icon}
                                    </span>

                                    <span className="dash-button-content">
                                        <span className="dash-button-title">
                                            {item.title}
                                        </span>

                                        <span className="dash-button-description">
                                            {item.description}
                                        </span>
                                    </span>

                                    <span className="dash-button-arrow">
                                        →
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
