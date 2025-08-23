import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";
import { saveAuth } from "../utils/auth";
import "./LoginForm.css";

export default function LoginForm() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 new
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(credentials);
      const normalizedRole = data.role?.toUpperCase().trim();
      saveAuth(data.token, normalizedRole, data.username, data.id);

      switch (normalizedRole) {
        case "ADMIN": navigate("/", { replace: true }); break;
        case "TRAINER": navigate("/", { replace: true }); break;
        case "MEMBER": navigate("/", { replace: true }); break;
        default: navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="login-input"
            type="text"
            placeholder="Username or Email"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            required
          />

          <div className="password-wrapper">
            <input
              className="login-input"
              type={showPassword ? "text" : "password"} // 👈 toggle
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"} {/* can replace with icon lib */}
            </span>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="redirect-text" style={{ color: "black" }}>
          <span className="redirect-link" onClick={() => navigate("/forgot-password")}>
              Forget Password?{" "}
          </span>
        </p>
        <p className="redirect-text" style={{ color: "black" }}>
          Don’t have an account?{" "}
          <span className="redirect-link" onClick={() => navigate("/register")}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
