import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create a configured Axios instance
const api = axios.create({
  // Read API base URL from Vite environment config
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 15000 // 15s request timeout
});

// Request Interceptor: Attach authentication token to outgoing headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle systemic error responses globally (401 unauthorized & server network errors)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 1. Session expiration or invalid credentials (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('crm-token');
      // Prevent loop redirect if user is already on the login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }

    // 2. Rate limiting (429 Too Many Requests)
    if (error.response && error.response.status === 429) {
      toast.error(error.response.data?.message || 'Too many requests. Please wait a moment before trying again.', {
        id: 'rate-limit-error',
        duration: 5000
      });
    }

    // 3. Server offline or generic network request failures
    if (!error.response) {
      toast.error('Cannot connect to server. Check your connection.', {
        id: 'network-error', // Prevents flooding multiple notifications on parallel fetches
        duration: 4000
      });
    }

    return Promise.reject(error);
  }
);

export default api;
