import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#1e293b",
        padding: "1rem",
        textAlign: "center",
        color: "white",
        position: "fixed",   // ✅ stays in place
        bottom: 0,           // ✅ lock to bottom
        left: 0,
        width: "100%",       // ✅ full width
        zIndex: 50           // ✅ stay above content
      }}
    >
      <p style={{ margin: 0 }}>
        © {new Date().getFullYear()} Fitness Tracker. All rights reserved.
      </p>
    </footer>
  );
}
