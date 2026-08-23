import axios from 'axios';

// Automatically detect production deployment vs local dev
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('vercel.app')) {
      return 'https://arogya-connect-api.onrender.com/api';
    }
    if (host.includes('netlify.app') || host.includes('netlify.com')) {
      return 'https://arogya-connect-api.onrender.com/api';
    }
  }
  return '/api';
};

const baseURL = getBaseURL();

const api = axios.create({ 
  baseURL,
  timeout: 30000 // 30s timeout to allow Render free instance to spin up
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aarogya_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aarogya_token');
      localStorage.removeItem('aarogya_member');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
