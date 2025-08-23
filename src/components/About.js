// src/components/About.js
import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      {/* Header Section */}
      <div className="about-header">
        <div className="about-tag">
          <span className="icon">ℹ️</span>
          About FitnessTracker
        </div>
        <h1 className="about-title">
          Transforming Lives Through
          <span className="highlight">Smart Fitness Tracking</span>
        </h1>
        <p className="about-description">
          Our comprehensive fitness platform empowers members, trainers, and
          organizations to achieve their health goals through intelligent
          tracking, personalized guidance, and data-driven insights.
        </p>
      </div>

      {/* Three Column Features */}
      <div className="about-grid">
        {/* Members */}
        <div className="about-card">
          <div className="icon-container">💪</div>
          <h3>For Members</h3>
          <p>
            Track workouts, monitor progress, and stay motivated with
            personalized fitness plans designed by certified trainers.
          </p>
        </div>

        {/* Trainers */}
        <div className="about-card">
          <div className="icon-container">⚡</div>
          <h3>For Trainers</h3>
          <p>
            Manage multiple clients, create custom workout plans, and track
            member progress with powerful coaching tools.
          </p>
        </div>

        {/* Organizations */}
        <div className="about-card">
          <div className="icon-container">🌍</div>
          <h3>For Organizations</h3>
          <p>
            Comprehensive admin tools to manage users, oversee operations, and
            maintain platform excellence at scale.
          </p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="about-cta">
        <h2>Ready to Start Your Journey?</h2>
        <p>
          Join thousands of fitness enthusiasts who trust FitnessTracker to
          help them achieve their health and wellness goals.
        </p>
        <div className="cta-buttons">
          <Link to="/register" className="cta-button primary">
            Get Started Free
          </Link>
          <Link to="/login" className="cta-button secondary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
