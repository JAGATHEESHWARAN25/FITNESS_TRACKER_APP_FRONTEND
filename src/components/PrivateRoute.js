import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRole } from '../utils/auth';

export default function PrivateRoute({ children, role }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (role && getRole() !== role) return <Navigate to="/" replace />;
  return children;
}
