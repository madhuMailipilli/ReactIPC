import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, ""),
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Ensure that cookies are sent with every request
    config.withCredentials = true;

    // Let browser set Content-Type for FormData automatically
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const apiService = {
  

  // Expose the axios instance for direct use if needed (e.g. by agencyService)
  get: (...args) => api.get(...args),
  post: (...args) => api.post(...args),
  put: (...args) => api.put(...args),
  delete: (...args) => api.delete(...args),
  patch: (...args) => api.patch(...args),
};
//demo/
export default apiService;
