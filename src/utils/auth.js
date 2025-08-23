// src/utils/auth.js

// Save authentication info in localStorage
export function saveAuth(token, role, username, userId) {
  if (token) localStorage.setItem("token", token);
  if (role) localStorage.setItem("role", role.toUpperCase().trim());
  if (username) localStorage.setItem("username", username);
  if (userId) localStorage.setItem("userId", userId);
}

// Clear authentication info
export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
}

// Check if user is logged in
export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

// Get normalized role
export function getRole() {
  return localStorage.getItem("role")?.toUpperCase().trim() || "";
}

// Get username
export function getUsername() {
  return localStorage.getItem("username") || "";
}

// Get userId
export function getUserId() {
  return localStorage.getItem("userId") || null;
}
