import React, { useEffect, useState } from "react";
import { getMemberAssignments, updateProgress } from "../utils/api";
import "./MemberDashboard.css";

export default function MemberDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username") || "Member";

  useEffect(() => {
    if (!userId) return;

    getMemberAssignments(userId)
      .then((res) => {
        setAssignments(res);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch assignments");
        setLoading(false);
      });
  }, [userId]);

  const handleSave = async (id, completed, progressNotes) => {
    try {
      await updateProgress(id, completed, progressNotes);
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, completed, progressNotes } : a
        )
      );
      setSuccessId(id);
      setTimeout(() => setSuccessId(null), 2000);
    } catch {
      alert("Failed to update progress");
    }
  };

  // ✅ Date formatter: matches WorkoutList.js
  const formatDate = (rawDate) => {
    if (!rawDate) return "N/A";

    // Handle yyyyMMdd like 20250820 → Aug 20, 2025
    if (/^\d{8}$/.test(rawDate)) {
      const year = rawDate.slice(0, 4);
      const month = rawDate.slice(4, 6);
      const day = rawDate.slice(6, 8);
      return new Date(`${year}-${month}-${day}`).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }

    // Otherwise assume it's a valid date string
    const parsed = new Date(rawDate);
    return !isNaN(parsed)
      ? parsed.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : rawDate;
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="member-dashboard">
      {/* Header */}
      <div className="member-header">
        <h2>👋 Welcome, {username}!</h2>
        <p>
          <span className="highlight">
            Here are your assigned workouts and progress tracking.
          </span>
        </p>
      </div>

      {/* Workout Assignments Table */}
      <div className="table-wrapper">
        <table className="assignments-table">
          <thead>
            <tr>
              <th>Workout Type</th>
              <th>Date</th>
              <th>Duration</th>
              <th>Completed</th>
              <th>Progress Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.id}>
                <td>{a.workoutType || a.workoutName}</td>
                <td>{formatDate(a.date || a.assignedDate)}</td>
                <td>{a.duration} min</td>
                <td className="center">
                  <input
                    type="checkbox"
                    checked={a.completed || false}
                    onChange={(e) =>
                      setAssignments((prev) =>
                        prev.map((x) =>
                          x.id === a.id
                            ? { ...x, completed: e.target.checked }
                            : x
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="note-input"
                    value={a.progressNotes || ""}
                    onChange={(e) =>
                      setAssignments((prev) =>
                        prev.map((x) =>
                          x.id === a.id
                            ? { ...x, progressNotes: e.target.value }
                            : x
                        )
                      )
                    }
                  />
                </td>
                <td className="center">
                  <button
                    onClick={() =>
                      handleSave(a.id, a.completed, a.progressNotes)
                    }
                    className="save-btn"
                  >
                    Save
                  </button>
                  {successId === a.id && (
                    <span className="saved-msg">✅ Saved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
