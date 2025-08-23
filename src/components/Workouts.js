import React, { useState } from "react";
import AddWorkoutForm from "./AddWorkoutForm";
import WorkoutList from "./WorkoutList";

export default function Workouts() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWorkoutAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Workouts</h2>
      <AddWorkoutForm onWorkoutAdded={handleWorkoutAdded} />
      <div style={{ marginTop: "2rem" }}>
        <WorkoutList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
