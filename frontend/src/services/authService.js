import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "/api",
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("auth-token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
const authService = {
  // Register user
  register: (userData) => {
    return api.post("/auth/register", userData);
  },

  // Login user
  login: (credentials) => {
    return api.post("/auth/login", credentials);
  },

  // Get current user
  getCurrentUser: () => {
    return api.get("/auth/me");
  },

  // Update user
  updateUser: (userId, userData) => {
    return api.put(`/users/${userId}`, userData);
  },

  // Upload profile photo
  uploadProfilePhoto: (userId, photoData) => {
    const formData = new FormData();
    formData.append("file", photoData);
    return api.put(`/users/${userId}/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default authService;
