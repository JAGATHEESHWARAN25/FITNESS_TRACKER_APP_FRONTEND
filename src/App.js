// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import WorkoutList from "./components/WorkoutList";
import WorkoutForm from "./components/AddWorkoutForm";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import MemberDashboard from "./components/MemberDashboard";
import Profile from "./components/Profile";
import TrainerMembers from "./components/TrainerMembers";
import TrainerAssign from "./components/TrainerAssign";
import AdminUsers from "./components/AdminUsers";
import AdminAssign from "./components/AdminAssign";
import Home from "./components/Home";
import About from "./components/About";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import TrainerChat from "./components/TrainerChat";   // ✅ new
import MemberChat from "./components/MemberChat";     // ✅ new

import "./App.css";
import { isAuthenticated, getRole } from "./utils/auth";

// Wrapper for protected + role-based routes
function RoleRoute({ children, allowedRoles }) {
  const token = isAuthenticated();
  const role = getRole();
  console.log("RoleRoute check:", { token, role, allowedRoles });

  if (!token) return <Navigate to="/login" />;
  if (!allowedRoles.map(r => r.toUpperCase().trim()).includes(role))
    return <Navigate to="/" />;

  return children;
}

function App() {
  const [workoutKey, setWorkoutKey] = useState(0);

  function handleWorkoutAdded() {
    setWorkoutKey((k) => k + 1);
  }

  return (
    <Router>
      <div className="bg-slate-50 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Workouts (any authenticated) */}
            <Route
              path="/workouts"
              element={
                isAuthenticated() ? (
                  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                      <WorkoutForm onWorkoutAdded={handleWorkoutAdded} />
                      <WorkoutList key={workoutKey} />
                    </div>
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Trainer Routes */}
            <Route
              path="/trainer/members"
              element={
                <RoleRoute allowedRoles={["TRAINER"]}>
                  <TrainerMembers />
                </RoleRoute>
              }
            />
            <Route
              path="/trainer/assign"
              element={
                <RoleRoute allowedRoles={["TRAINER"]}>
                  <TrainerAssign />
                </RoleRoute>
              }
            />
            <Route
              path="/trainer/chat"
              element={
                <RoleRoute allowedRoles={["TRAINER"]}>
                  <TrainerChat />
                </RoleRoute>
              }
            />

            {/* Member Routes */}
            <Route
              path="/member"
              element={
                <RoleRoute allowedRoles={["MEMBER"]}>
                  <MemberDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/member/profile"
              element={
                <RoleRoute allowedRoles={["MEMBER"]}>
                  <Profile />
                </RoleRoute>
              }
            />
            <Route
              path="/member/chat"
              element={
                <RoleRoute allowedRoles={["MEMBER"]}>
                  <MemberChat />
                </RoleRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <AdminUsers />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/assign"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <AdminAssign />
                </RoleRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
