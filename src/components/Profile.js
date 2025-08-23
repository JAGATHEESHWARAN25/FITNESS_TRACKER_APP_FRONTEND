import React, { useEffect, useState } from "react";
import { fetchMyProfile, updateMyProfile } from "../utils/api";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMyProfile();
        setProfile(data);
        setForm({ fullName: data.fullName || "", phone: data.phone || "" });
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    try {
      const updated = await updateMyProfile(form);
      setProfile(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  }

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="profile-page">
      <h2>👤 My Profile</h2>
      <div className="profile-card">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>

        {editing ? (
          <>
            <div>
              <label>Full Name: </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
            <div>
              <label>Phone: </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <button onClick={handleSave}>💾 Save</button>
            <button onClick={() => setEditing(false)}>❌ Cancel</button>
          </>
        ) : (
          <>
            <p><strong>Full Name:</strong> {profile.fullName || "-"}</p>
            <p><strong>Phone:</strong> {profile.phone || "-"}</p>
            <button onClick={() => setEditing(true)}>✏️ Edit</button>
          </>
        )}
      </div>
    </div>
  );
}
