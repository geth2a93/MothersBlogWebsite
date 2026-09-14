import { useNavigate } from "react-router-dom";
import "../css/NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <div className="not-found-content">

        <div className="not-found-number">404</div>

        <h1>This page is missing.</h1>

        <p>
          It may have moved, been removed, or never existed in the first place.
        </p>

        <button
          className="not-found-button"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>

      </div>
    </main>
  );
}

