import React, { useEffect, useState, useCallback } from 'react';
import { fetchAllWorkouts } from '../utils/api';
import './WorkoutList.css';

export default function WorkoutList({ refreshTrigger }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllWorkouts();
      setWorkouts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error fetching workouts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, refreshTrigger]); 
  // refreshTrigger lets parent re-fetch after adding/updating workouts

  if (loading) {
    return (
      <div data-testid="workout-list-loader" className="workout-loader">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="workout-list-error" className="workout-error">
        {error}
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div data-testid="workout-list-empty" className="workout-empty">
        No workouts found
      </div>
    );
  }

  return (
    <table className="workout-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Duration</th>
          <th>Calories Burned</th>
          <th>Date</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {workouts.map((w) => (
          <tr key={w.id}>
            <td>{w.type}</td>
            <td>{w.duration}</td>
            <td>{w.caloriesBurned}</td>
            <td>
              {w.date
                ? new Date(w.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'N/A'}
            </td>
            <td>{w.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
