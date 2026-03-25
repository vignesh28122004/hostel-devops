import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================
// REQUEST INTERCEPTOR
// ============================

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // ❌ DO NOT send token for auth APIs
  if (!config.url?.includes("/api/auth") && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ============================
// RESPONSE INTERCEPTOR
// ============================

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post(
          "http://localhost:8083/api/auth/refresh", // ✅ FIXED PORT + PATH
          { refreshToken }
        );

        const newToken = res.data.token;

        localStorage.setItem("token", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);

      } catch (err) {
        // logout if refresh fails
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// ============================
// TYPES
// ============================

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  roomNumber: string;
  hostelBlock: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ComplaintData {
  category: string;
  description: string;
  imageUrl?: string;
}

// ============================
// AUTH APIs (🔥 FIXED PATH)
// ============================

export const authService = {

  register: (data: RegisterData) =>
    api.post("/api/auth/register", data), // ✅ FIXED

  login: (data: LoginData) =>
    api.post("/api/auth/login", data), // ✅ FIXED

  adminLogin: (data: LoginData) =>
    api.post("/api/auth/login", data), // ✅ SAME

};

// ============================
// COMPLAINT APIs
// ============================

export const complaintService = {

  create: (data: ComplaintData) =>
    api.post("/api/complaints", data), // ✅ FIXED

  getStudentComplaints: (studentId: string) =>
    api.get(`/api/complaints/student/${studentId}`), // ✅ FIXED

  getAll: () =>
    api.get("/api/complaints"), // ✅ FIXED

  updateStatus: (id: string, status: string) =>
    api.put(`/api/complaints/${id}?status=${status}`), // ✅ FIXED

  updateRemark: (id: string, remark: string) =>
    api.put(`/api/complaints/${id}/remark?remark=${remark}`), // ✅ FIXED

};

export default api;