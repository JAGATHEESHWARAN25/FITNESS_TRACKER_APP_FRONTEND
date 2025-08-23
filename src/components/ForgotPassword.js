import React, { useState } from "react";
import { requestPasswordReset } from "../utils/api";
import "./ForgotPassword.css"; // 👈 import the matching CSS

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(identifier);
      setStatus("✅ If the account exists, a reset email has been sent.");
    } catch (err) {
      setStatus("❌ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <h2 className="forgot-title">Forgot Password</h2>

        <form onSubmit={onSubmit} className="forgot-form">
          <label>Email or Username</label>
          <input
            type="text"
            className="forgot-input"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="your@email.com OR username"
            required
          />
          <button type="submit" className="forgot-button" disabled={loading}>
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>

        {status && <p className="forgot-status">{status}</p>}

        <p className="forgot-footer">
          Remembered your password?{" "}
          <a href="/login" className="forgot-link">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
