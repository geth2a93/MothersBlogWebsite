import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5055/auth/login", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                },
            body: JSON.stringify({
            username,
            password
        })
    });
        const text = await response.text();
        console.log("RAW RESPONSE:", text);

        let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error("Backend did not return JSON");
            }

            console.log("PARSED DATA:", data);

            if (response.ok) {
                setMessage(data.message || "Login successful");
                navigate("/adminhome"); 
                setError("");

            } else {
                setError(data.error || "Login failed");
                setMessage("");
            }

        } catch (err) {
            console.error(err);
            setError("Server error or backend unreachable");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto" }}>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            {message && (
                <p style={{ color: "green" }}>
                    {message}
                </p>
            )}

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}
        </div>
    );
}