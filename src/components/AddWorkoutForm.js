import React, { useState } from "react";
import { createWorkout } from "../utils/api";
import "./AddWorkoutForm.css";

export default function AddWorkoutForm({ onWorkoutAdded }) {
  const [form, setForm] = useState({
    type: "",
    duration: "",
    caloriesBurned: "",
    date: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.type.trim()) {
      newErrors.type = "Type must not be empty";
    }
    if (!form.duration || Number(form.duration) <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }
    if (form.caloriesBurned === "" || Number(form.caloriesBurned) < 0) {
      newErrors.caloriesBurned =
        "Calories burned must be greater than or equal to 0";
    }
    if (!form.date) {
      newErrors.date = "Date must not be null";
    } else {
      const selectedDate = new Date(form.date);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (selectedDate > now) {
        newErrors.date = "Date must not be a future date";
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await createWorkout(form);
      setSuccessMessage("Workout added successfully ✅");

      setForm({
        type: "",
        duration: "",
        caloriesBurned: "",
        date: "",
        notes: "",
      });

      if (onWorkoutAdded) onWorkoutAdded();
    } catch (err) {
      setFormError(err.message || "Something went wrong");
      if (err.errors) {
        setErrors(err.errors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-workout-form">
      <h3>Add New Workout</h3>

      {formError && (
        <div data-testid="form-error" className="form-error">
          {formError}
        </div>
      )}

      {successMessage && (
        <div className="form-success">{successMessage}</div>
      )}

      <div className="form-group">
        <label>
          Type
          <input
            data-testid="type-input"
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="e.g. Running, Yoga"
            required
          />
        </label>
        {errors.type && <div className="input-error">{errors.type}</div>}
      </div>

      <div className="form-group">
        <label>
          Duration (minutes)
          <input
            type="number"
            min="1"
            data-testid="duration-input"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="Enter duration"
            required
          />
        </label>
        {errors.duration && (
          <div className="input-error">{errors.duration}</div>
        )}
      </div>

      <div className="form-group">
        <label>
          Calories Burned
          <input
            type="number"
            min="0"
            data-testid="caloriesBurned-input"
            name="caloriesBurned"
            value={form.caloriesBurned}
            onChange={handleChange}
            placeholder="Enter calories"
            required
          />
        </label>
        {errors.caloriesBurned && (
          <div className="input-error">{errors.caloriesBurned}</div>
        )}
      </div>

      <div className="form-group">
        <label>
          Date
          <input
            type="date"
            data-testid="date-input"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </label>
        {errors.date && <div className="input-error">{errors.date}</div>}
      </div>

      <div className="form-group">
        <label>
          Notes
          <input
            data-testid="notes-input"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Optional notes"
          />
        </label>
      </div>

      <button type="submit" data-testid="add-button" className="add-button">
        Add Workout
      </button>
    </form>
  );
}
