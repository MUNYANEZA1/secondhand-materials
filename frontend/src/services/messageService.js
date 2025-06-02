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

// Message services
const messageService = {
  // Get user conversations
  getConversations: () => {
    return api.get('/conversations');
  },
  
  // Get conversation by ID
  getConversation: (id) => {
    return api.get(`/conversations/${id}`);
  },
  
  // Create new conversation
  createConversation: (conversationData) => {
    return api.post('/conversations', conversationData);
  },
  
  // Get messages by conversation
  getMessagesByConversation: (conversationId) => {
    return api.get(`/messages/conversation/${conversationId}`);
  },
  
  // Send a message
  sendMessage: (messageData) => {
    return api.post('/messages', messageData);
  }
};

export default messageService;
