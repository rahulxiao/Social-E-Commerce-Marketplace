import axios from 'axios';

// Axios instance targeting our Next.js API routes by default
const api = axios.create({
  baseURL: '/',
  timeout: 20000,
});

// Inject Authorization header from localStorage token for client-side requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;


