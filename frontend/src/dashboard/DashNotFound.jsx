import { useNavigate } from "react-router-dom";

export default function DashNotFound() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                minHeight: "400px",
                padding: "40px"
            }}
        >
            <h1
                style={{
                    fontSize: "48px",
                    marginBottom: "10px"
                }}
            >
                Page Not Found
            </h1>

            <p
                style={{
                    fontSize: "18px",
                    marginBottom: "25px",
                    color: "#666"
                }}
            >
                The dashboard page you're looking for doesn't exist.
            </p>

            <button
                onClick={() => navigate("/dashboard")}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                    border: "none",
                    borderRadius: "5px"
                }}
            >
                Return to Dashboard
            </button>
        </div>
    );
}