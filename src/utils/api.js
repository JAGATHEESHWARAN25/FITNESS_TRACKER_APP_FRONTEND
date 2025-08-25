// src/utils/api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://fitness-tracker-app-backend.onrender.com";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach JWT automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Standard error shape
function normalizeError(err) {
  if (err?.response?.data) {
    const data = err.response.data;
    return {
      message: typeof data === "string" ? data : data.message || "Request failed",
      errors: data.errors || undefined,
      status: err.response.status,
    };
  }
  return { message: err?.message || "Network error" };
}

// yyyy-MM-dd normalizer
function toYMD(input) {
  if (!input) return input;
  if (typeof input === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
    if (/^\d{2}-\d{2}-\d{4}$/.test(input)) {
      const [dd, mm, yyyy] = input.split("-");
      return `${yyyy}-${mm}-${dd}`;
    }
  }
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toISOString().slice(0, 10);
}

/* ================= Auth ================= */
export async function loginUser({ username, password }) {
  try {
    const res = await apiClient.post("/api/auth/login", { username, password });
    return res.data; // { token, id, username, role }
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function registerUser(data) {
  try {
    const res = await apiClient.post("/api/auth/register", data);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function me() {
  try {
    const res = await apiClient.get("/api/auth/me");
    return res.data; // { id, username, email, role, ... }
  } catch (err) {
    throw normalizeError(err);
  }
}

/* ============== Workouts (self) ============== */
export async function createWorkout(workoutData) {
  try {
    const payload = { ...workoutData, date: toYMD(workoutData?.date) };
    const res = await apiClient.post("/api/workouts", payload);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function fetchAllWorkouts() {
  try {
    const res = await apiClient.get("/api/workouts");
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function fetchWorkoutById(id) {
  try {
    const res = await apiClient.get(`/api/workouts/${id}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function updateWorkout(id, workoutData) {
  try {
    const payload = { ...workoutData, date: toYMD(workoutData?.date) };
    const res = await apiClient.put(`/api/workouts/${id}`, payload);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function deleteWorkout(id) {
  try {
    await apiClient.delete(`/api/workouts/${id}`);
  } catch (err) {
    throw normalizeError(err);
  }
}

/* ============== Assignments ============== */
export async function assignWorkout(trainerId, memberId, assignmentData) {
  try {
    const payload = {
      ...assignmentData,
      assignedDate: toYMD(assignmentData?.assignedDate),
      duration: assignmentData?.duration ? Number(assignmentData.duration) : 0,
      targetCalories: assignmentData?.targetCalories ? Number(assignmentData.targetCalories) : 0,
    };
    const res = await apiClient.post(
      `/api/assignments/assign/${trainerId}/to/${memberId}`,
      payload
    );
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function getTrainerAssignments(trainerId) {
  try {
    const res = await apiClient.get(`/api/assignments/trainer/${trainerId}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function getMemberAssignments(memberId) {
  try {
    const res = await apiClient.get(`/api/assignments/member/${memberId}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function updateProgress(assignmentId, completed, progressNotes) {
  try {
    const res = await apiClient.put(`/api/assignments/${assignmentId}/progress`, {
      completed,
      progressNotes,
    });
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

/* ============== Workout Templates ============== */
export async function fetchWorkoutTemplates() {
  try {
    const res = await apiClient.get("/api/workout-templates");
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function assignTemplateWorkout(trainerId, memberId, templateId) {
  try {
    const res = await apiClient.post(`/api/assignments/assign-template`, {
      trainerId,
      memberId,
      templateId,
    });
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

/* ============== Admin ============== */
export async function createWorkoutTemplate(template) {
  try {
    const res = await apiClient.post("/api/workout-templates", template);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function updateWorkoutTemplate(id, template) {
  try {
    const res = await apiClient.put(`/api/workout-templates/${id}`, template);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function deleteWorkoutTemplate(id) {
  try {
    await apiClient.delete(`/api/workout-templates/${id}`);
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function fetchUsers(role) {
  try {
    const url = role ? `/api/admin/users?role=${role}` : "/api/admin/users";
    const res = await apiClient.get(url);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function changeUserRole(userId, role) {
  try {
    const res = await apiClient.put(`/api/admin/users/${userId}/role?role=${role}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function toggleUserStatus(userId, active) {
  try {
    const res = await apiClient.put(`/api/admin/users/${userId}/status?active=${active}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function assignMemberToTrainer(trainerId, memberId) {
  try {
    const res = await apiClient.post(
      `/api/admin/assignments/assign?trainerId=${trainerId}&memberId=${memberId}`
    );
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function getTrainerMembers(trainerId) {
  try {
    const res = await apiClient.get(`/api/admin/assignments/trainer/${trainerId}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function fetchMyMembers() {
  try {
    const res = await apiClient.get("/api/assignments/trainer/me");
    return res.data.map((a) => a.member);
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function fetchAllMembers() {
  try {
    const res = await apiClient.get("/api/admin/users?role=MEMBER");
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

/* ============== Profile ============== */
export async function fetchMyProfile() {
  try {
    const res = await apiClient.get("/api/profile/me");
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function updateMyProfile(profile) {
  try {
    const res = await apiClient.put("/api/profile/me", profile);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}


export const requestPasswordReset = async (identifier) => {
  return apiClient.post('/api/auth/forgot-password', { identifier });
};

export const resetPassword = async (token, newPassword) => {
  return apiClient.post('/api/auth/reset-password', { token, newPassword });
};
export async function getNotifications(userId, token) {
  const res = await fetch(`/api/notifications/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function markNotificationRead(id, token) {
  await fetch(`/api/notifications/${id}/read`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` }
  });
}


export default apiClient;
