import React, { useEffect, useState } from "react"; 
import {
  fetchWorkoutTemplates,
  createWorkoutTemplate,
  deleteWorkoutTemplate,
  updateWorkoutTemplate,
} from "../utils/api";
import "./AdminAssign.css";

export default function AdminAssign() {
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [targetCalories, setTargetCalories] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);

  async function loadTemplates() {
    try {
      const data = await fetchWorkoutTemplates();
      setTemplates(data);
    } catch {
      setMessage("❌ Failed to load templates");
    }
  }

  useEffect(() => {
    loadTemplates();
  }, []);

  async function handleCreateOrUpdate(e) {
    e.preventDefault();
    if (!name || !description) {
      setMessage("⚠️ Name and description required");
      return;
    }

    const templateData = {
      name,
      category,
      description,
      defaultDuration: duration ? Number(duration) : 1,
      estimatedCalories: targetCalories ? Number(targetCalories) : 0,
      difficulty,
    };

    try {
      if (editId) {
        await updateWorkoutTemplate(editId, templateData);
        setMessage("✅ Template updated");
      } else {
        await createWorkoutTemplate(templateData);
        setMessage("✅ Template created");
      }
      resetForm();
      loadTemplates();
    } catch {
      setMessage("❌ Failed to save template");
    }
  }

  function resetForm() {
    setEditId(null);
    setName("");
    setCategory("General");
    setDescription("");
    setDuration("");
    setTargetCalories("");
    setDifficulty("EASY");
  }

  async function handleDelete(id) {
    try {
      await deleteWorkoutTemplate(id);
      setMessage("✅ Template deleted");
      loadTemplates();
    } catch {
      setMessage("❌ Failed to delete template");
    }
  }

  function handleEdit(tpl) {
    setEditId(tpl.id);
    setName(tpl.name);
    setCategory(tpl.category);
    setDescription(tpl.description);
    setDuration(tpl.defaultDuration);
    setTargetCalories(tpl.estimatedCalories);
    setDifficulty(tpl.difficulty);
  }

  return (
    <div className="assign-container">
      <h2 className="assign-title">📝 Workout Template Management</h2>
      {message && <p className="assign-message">{message}</p>}

      {/* Create/Update form */}
      <form className="assign-form" onSubmit={handleCreateOrUpdate}>
        <input
          type="text"
          placeholder="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="General">General</option>
          <option value="Strength">Strength</option>
          <option value="Cardio">Cardio</option>
          <option value="Flexibility">Flexibility</option>
        </select>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <input
          type="number"
          placeholder="Target Calories"
          value={targetCalories}
          onChange={(e) => setTargetCalories(e.target.value)}
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <div className="form-actions">
          <button type="submit" className="primary-btn">
            {editId ? "Update Template" : "Create Template"}
          </button>
          {editId && (
            <button type="button" className="secondary-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List templates */}
      <h3 className="template-heading">Existing Templates</h3>
      <div className="table-wrapper">
        <table className="assign-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Calories</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((tpl) => (
              <tr key={tpl.id}>
                <td>{tpl.name}</td>
                <td>{tpl.category}</td>
                <td>{tpl.description}</td>
                <td>{tpl.defaultDuration}</td>
                <td>{tpl.estimatedCalories}</td>
                <td>{tpl.difficulty}</td>
                <td>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(tpl)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(tpl.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td colSpan={7} className="no-templates">
                  No templates yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
