import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_BASE_URL || 'https://ipc-black.vercel.app').replace(/\/$/, '');

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const documentService = {
  getAgencyUsage: async (agencyId) => {
    const response = await api.get(`/agencies/${agencyId}/usage`);
    return response.data;
  },
};

export default documentService;
