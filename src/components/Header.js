// src/components/Header.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getRole, isAuthenticated, getUsername } from "../utils/auth";
import NotificationBell from "./NotificationBell"; 
import "./Header.css";

export default function Header() {
  const role = getRole();
  const auth = isAuthenticated();
  const username = getUsername();
  const navigate = useNavigate();

  function logout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <header className="header">
      <nav className="header-nav">
        <h1 className="header-logo">Fitness Tracker</h1>

        <div className="header-links">
          <Link className="header-link" to="/">Home</Link>
          <Link className="header-link" to="/about">About</Link>

          {auth ? (
            <>
              {/* Trainer */}
              {role === "TRAINER" && (
                <>
                  <Link className="header-link" to="/trainer/members">Members</Link>
                  <Link className="header-link" to="/trainer/assign">Assign Workouts</Link>
                  <Link className="header-link" to="/workouts">Workouts</Link>
                  <Link className="header-link" to="/trainer/chat">💬 Chat</Link>
                </>
              )}

              {/* Member */}
              {role === "MEMBER" && (
                <>
                  <Link className="header-link" to="/member">Dashboard</Link>
                  <Link className="header-link" to="/workouts">Workouts</Link>
                  <Link className="header-link" to="/member/profile">Profile</Link>
                  <Link className="header-link" to="/member/chat">💬 Chat</Link>
                </>
              )}

              {/* Admin */}
              {role === "ADMIN" && (
                <>
                  <Link className="header-link" to="/admin/users">Users</Link>
                  <Link className="header-link" to="/admin/assign">Assignments</Link>
                </>
              )}

              {/* Notification + user info */}
              <NotificationBell />
              <span className="header-username">Hello, {username}</span>
              <button className="logout-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="header-link" to="/login">Login</Link>
              <Link className="header-link" to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
