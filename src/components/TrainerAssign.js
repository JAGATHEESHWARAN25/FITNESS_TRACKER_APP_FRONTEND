import React, { useEffect, useState } from "react";
import {
  fetchWorkoutTemplates,
  assignTemplateWorkout,
  getTrainerAssignments,
  fetchMyMembers,
} from "../utils/api";
import "./TrainerAssign.css";

export default function TrainerAssignments() {
  const [templates, setTemplates] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const trainerId = localStorage.getItem("userId");

  useEffect(() => {
    async function load() {
      try {
        const [tpl, asg, mem] = await Promise.all([
          fetchWorkoutTemplates(),
          getTrainerAssignments(trainerId),
          fetchMyMembers(),
        ]);
        setTemplates(tpl || []);
        setAssignments(asg || []);
        setMembers(mem || []);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    if (trainerId) load();
  }, [trainerId]);

  async function handleAssign(e) {
    e.preventDefault();
    if (!selectedTemplateId || !selectedMemberId) {
      setMessage("⚠️ Please select a template and a member");
      return;
    }
    try {
      await assignTemplateWorkout(
        trainerId,
        Number(selectedMemberId),
        Number(selectedTemplateId)
      );
      setMessage("✅ Template assigned successfully");
      setSelectedTemplateId("");
      setSelectedMemberId("");
      const asg = await getTrainerAssignments(trainerId);
      setAssignments(asg || []);
    } catch (err) {
      console.error(err);
      setMessage(`❌ Failed: ${err.message || "Unable to assign"}`);
    }
  }

  return (
    <div className="trainer-container">
      <h2 className="trainer-title">Assign Workouts</h2>

      {/* Assignment Form */}
      <form className="assign-form" onSubmit={handleAssign}>
        <div>
          <label>Select Member</label>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
          >
            <option value="">-- choose --</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} — {m.username}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Select Template</label>
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
          >
            <option value="">-- choose --</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.defaultDuration ?? t.duration} min)
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="assign-btn">Assign</button>
      </form>

      {message && (
        <p className={`trainer-message ${message.startsWith("✅") ? "success" : "error"}`}>
          {message}
        </p>
      )}

      {/* Assigned Workouts */}
      <div className="assignments-section">
        <h3>Your Assigned Workouts</h3>
        {loading ? (
          <p>Loading...</p>
        ) : assignments.length === 0 ? (
          <p className="no-members">No workouts assigned yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Workout</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Calories</th>
                  <th>Completed</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.member?.id} — {a.member?.username}</td>
                    <td>{a.workoutName}</td>
                    <td>{a.assignedDate}</td>
                    <td>{a.duration}</td>
                    <td>{a.targetCalories ?? "-"}</td>
                    <td>{a.completed ? "✅" : "❌"}</td>
                    <td>{a.progressNotes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
