import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api'
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Admin services
const adminService = {
  // Get dashboard stats
  getDashboardStats: () => {
    return api.get('/admin/dashboard');
  },
  
  // Get pending items
  getPendingItems: () => {
    return api.get('/admin/items/pending');
  },
  
  // Approve item
  approveItem: (id) => {
    return api.put(`/admin/items/${id}/approve`);
  },
  
  // Reject item
  rejectItem: (id) => {
    return api.put(`/admin/items/${id}/reject`);
  }
};

export default adminService;
