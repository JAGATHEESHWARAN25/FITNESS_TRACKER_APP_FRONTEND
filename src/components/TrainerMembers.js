import React, { useEffect, useState } from "react";
import { fetchMyMembers } from "../utils/api";
import "./TrainerMember.css"; // import stylesheet

export default function TrainerMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMyMembers();
        setMembers(data || []);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load members");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="trainer-container">
      <h2 className="trainer-title">My Members</h2>

      {loading && <p className="trainer-message">Loading members...</p>}
      {error && <p className="trainer-error">{error}</p>}
      {!loading && !error && members.length === 0 && (
        <p className="no-members">No members assigned yet.</p>
      )}

      <ul className="member-list">
        {members.map((m) => (
          <li key={m.id} className="member-card">
            <b>{m.username}</b> <span className="member-id">(ID: {m.id})</span>
            <br />
            <span className="member-email">{m.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
