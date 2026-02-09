import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_BASE_URL || 'https://ipc-black.vercel.app').replace(/\/$/, '');

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

// Automatically attach Authorization header from localStorage token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Only set Content-Type for non-FormData requests
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiService = {
  // Admin Dashboard
  dashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Agent Dashboard
  agentDashboard: async () => {
    const response = await api.get('/agent/dashboard');
    return response.data;
  },
  
  // Expose the axios instance for direct use if needed (e.g. by agencyService)
  get: (...args) => api.get(...args),
  post: (...args) => api.post(...args),
  put: (...args) => api.put(...args),
  delete: (...args) => api.delete(...args),
  patch: (...args) => api.patch(...args)
};

export default apiService;
