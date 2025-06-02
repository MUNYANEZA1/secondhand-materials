import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api'
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Item services
const itemService = {
  // Get all items
  getItems: (params) => {
    return api.get("/items", { params });
  },

  // Get single item
  getItem: (id) => {
    return api.get(`/items/${id}`);
  },

  // Create new item
  createItem: (itemData) => {
    return api.post("/items", itemData);
  },

  // Update item
  updateItem: (id, itemData) => {
    return api.put(`/items/${id}`, itemData);
  },

  // Delete item
  deleteItem: (id) => {
    return api.delete(`/items/${id}`);
  },

  // Update item status
  updateItemStatus: (id, status) => {
    return api.put(`/items/${id}/status`, { status });
  },

  // Upload item photos
  uploadItemPhotos: (id, photoFiles) => {
    const formData = new FormData();
    for (let i = 0; i < photoFiles.length; i++) {
      formData.append("photos", photoFiles[i]); // Change 'files' to 'photos' to match backend
    }
    return api.put(`/items/${id}/photos`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Get items by user
  getItemsByUser: (userId) => {
    return api.get(`/items/user/${userId}`);
  },

  // Get items by category
  getItemsByCategory: (category) => {
    return api.get(`/items/category/${category}`);
  },

  // Search items
  searchItems: (params) => {
    return api.get("/items/search", { params });
  },
};

export default itemService;
