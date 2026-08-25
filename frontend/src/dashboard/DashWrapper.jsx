import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./dashwrap.css";

export default function DashboardLayout() {
    const navigate = useNavigate();

    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await fetch("/auth/check", {
                    credentials: "include"
                });

                if (response.ok) {
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            } catch (err) {
                console.error(err);
                setAuthenticated(false);
            }
        };

        checkAuthentication();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch("/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            if (response.ok) {
                navigate("/login");
            } else {
                console.error("Logout failed");
            }
        } catch (err) {
            console.error("Logout error:", err);
        }
    };


    if (authenticated === null) {
        return null;
    }

    
    if (!authenticated) {
        return (
            <div className="dashboard-login-required">
                <h1>Login Required</h1>
                <p>
                    You must be logged in to access the dashboard.
                </p>

                <button onClick={() => navigate("/login")}>
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">

            <nav className="dashboard-nav">
                <button
                    className="dashboard-home-button"
                    onClick={() => navigate("/dashboard")}>
                    Home 
                </button>
                

                <button
                    className="dashboard-logout-button"
                    onClick={handleLogout} >
                    Logout
                </button>
            </nav>

            <main className="dashboard-content">
                <Outlet />
            </main>

        </div>
    );
}