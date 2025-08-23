import React, { useEffect, useState } from "react"; 
import { fetchUsers, changeUserRole, toggleUserStatus, assignMemberToTrainer } from "../utils/api";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  // assignment form state
  const [memberId, setMemberId] = useState("");
  const [trainerId, setTrainerId] = useState("");

  async function loadUsers() {
    try {
      const data = await fetchUsers(); // all users
      setUsers(data);
    } catch (err) {
      setMessage("❌ Failed to load users");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleRoleChange(id, role) {
    try {
      await changeUserRole(id, role);
      setMessage("✅ Role updated");
      loadUsers();
    } catch {
      setMessage("❌ Failed to update role");
    }
  }

  async function handleStatusChange(id, active) {
    try {
      await toggleUserStatus(id, active);
      setMessage("✅ Status updated");
      loadUsers();
    } catch {
      setMessage("❌ Failed to update status");
    }
  }

  async function handleAssign() {
    if (!memberId || !trainerId) {
      setMessage("⚠️ Select both Member and Trainer");
      return;
    }
    try {
      await assignMemberToTrainer(trainerId, memberId);
      setMessage("✅ Member assigned to trainer");
      setMemberId("");
      setTrainerId("");
    } catch {
      setMessage("❌ Failed to assign member");
    }
  }

  const members = users.filter((u) => u.role === "MEMBER");
  const trainers = users.filter((u) => u.role === "TRAINER");

  return (
    <div className="admin-container">
      <h2 className="admin-title">👤 User Management</h2>
      {message && <p className="admin-message">{message}</p>}

      {/* Users table */}
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  >
                    <option value="MEMBER">MEMBER</option>
                    <option value="TRAINER">TRAINER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>{u.active ? "✅ Active" : "❌ Inactive"}</td>
                <td>
                  <button
                    className="action-btn"
                    onClick={() => handleStatusChange(u.id, !u.active)}
                  >
                    {u.active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="no-users">
                  No users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assignment Section */}
      <section className="assign-section">
        <h3>Assign Member → Trainer</h3>
        <div className="assign-form">
          <select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
            <option value="">Select Member</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.username} (#{m.id})
              </option>
            ))}
          </select>

          <select value={trainerId} onChange={(e) => setTrainerId(e.target.value)}>
            <option value="">Select Trainer</option>
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.username} (#{t.id})
              </option>
            ))}
          </select>

          <button className="assign-btn" onClick={handleAssign}>
            Assign
          </button>
        </div>
      </section>
    </div>
  );
}
