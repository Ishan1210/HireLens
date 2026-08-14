import axios from 'axios';

// Reads the backend URL from an env var so it's easy to point at a deployed
// backend later without touching code (Vite exposes vars prefixed VITE_).
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Runs before every outgoing request. If a token is stored, attach it as
// the Authorization header automatically - so individual components never
// have to remember to do this themselves.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hirelens_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend ever responds 401 (expired/invalid token), clear the
// stale token so the app doesn't keep sending a dead credential.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hirelens_token');
    }
    return Promise.reject(error);
  }
);

export default api;
