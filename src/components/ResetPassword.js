import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../utils/api";
import "./ResetPassword.css"; // 👈 Import CSS

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ResetPassword() {
  const q = useQuery();
  const token = q.get("token") || "";
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (pw1 !== pw2) {
      setMsg("❌ Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, pw1);
      setMsg("✅ Password reset successful. Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg("❌ Invalid or expired link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-container">
        <h2 className="reset-title">Reset Password</h2>

        <form onSubmit={onSubmit} className="reset-form">
          <label>New Password</label>
          <input
            type="password"
            className="reset-input"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            className="reset-input"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            required
          />

          <button type="submit" className="reset-button" disabled={loading || !token}>
            {loading ? "Saving…" : "Reset Password"}
          </button>
        </form>

        {msg && <p className="reset-status">{msg}</p>}
        {!token && <p className="reset-warning">⚠️ Missing token. Open the link from your email.</p>}

        <p className="reset-footer">
          Back to <a href="/login" className="reset-link">Login</a>
        </p>
      </div>
    </div>
  );
}
