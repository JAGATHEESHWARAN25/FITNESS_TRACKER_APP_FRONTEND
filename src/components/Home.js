import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  // LocalStorage values
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "";
  const role = localStorage.getItem("role") || "";

  // Only show first name
  const displayName = useMemo(() => {
    if (!username) return "";
    return username.split(/\s+/)[0];
  }, [username]);

  /* ========= Public Landing ========= */
  const PublicHero = () => (
    <section className="hero">
      <div className="hero-inner">
        <h1 className="hero-title">
          FitnessTracker — track, assign, improve.
        </h1>
        <p className="hero-sub">
          Simple workout logs for members. Powerful assignment tools for trainers and admins.
        </p>
        <div className="hero-cta">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </section>
  );

  /* ========= Trainer Dashboard ========= */
  const TrainerView = () => (
    <section className="dashboard dash-trainer">
      <header className="dash-header">
        <h2>Welcome back, Coach {displayName} 👋</h2>
        <p className="muted">
          Manage members, assign workouts and track progress.
        </p>
      </header>

      <div className="dash-cards">
        <article className="card-animated">
          <div className="card-icon">👥</div>
          <h3>My Members</h3>
          <p>View and manage the members assigned to you.</p>
          <div className="card-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/trainer/members")}
            >
              View Members
            </button>
          </div>
        </article>

        <article className="card-animated">
          <div className="card-icon">📝</div>
          <h3>Assign Workouts</h3>
          <p>Create personalized workout plans and assign them.</p>
          <div className="card-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/trainer/assign")}
            >
              Assign
            </button>
          </div>
        </article>
      </div>
    </section>
  );

  /* ========= Member Dashboard ========= */
  const MemberView = () => (
    <section className="dashboard dash-member">
      <header className="dash-header">
        <h2>Welcome back, {displayName} 💪</h2>
        <p className="muted">
          Check your assigned workouts and update your progress.
        </p>
      </header>

      <div className="dash-cards">
        <article className="card-animated">
          <div className="card-icon">🏋️</div>
          <h3>My Workouts</h3>
          <p>See today’s workouts and log completion.</p>
          <div className="card-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/member")}
            >
              View Workouts
            </button>
          </div>
        </article>
      </div>
    </section>
  );

  /* ========= Admin Dashboard ========= */
  const AdminView = () => (
    <section className="dashboard dash-admin">
      <header className="dash-header">
        <h2>Welcome Admin {displayName} 🛡️</h2>
        <p className="muted">Manage users and assignments.</p>
      </header>

      <div className="dash-cards">
        <article className="card-animated">
          <div className="card-icon">👤</div>
          <h3>All Users</h3>
          <p>View and manage registered users.</p>
          <div className="card-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/admin/users")}
            >
              Manage Users
            </button>
          </div>
        </article>

        <article className="card-animated">
          <div className="card-icon">🔗</div>
          <h3>Assign Trainers</h3>
          <p>Assign members to trainers.</p>
          <div className="card-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/admin/assign")}
            >
              Assign
            </button>
          </div>
        </article>
      </div>
    </section>
  );

  /* ========= What to Render ========= */
  if (!token || !role) return <PublicHero />;
  if (role === "TRAINER") return <TrainerView />;
  if (role === "MEMBER") return <MemberView />;
  if (role === "ADMIN") return <AdminView />;
  return <PublicHero />;
}
