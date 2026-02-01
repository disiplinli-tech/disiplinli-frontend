import axios from 'axios';

// Backend URL
const BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:8000" 
  : "https://web-production-fe7c.up.railway.app";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - Her istekte Token ekle
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 hatasında login'e yönlendir
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Login sayfasında değilsek yönlendir
      if (window.location.pathname !== '/login') {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;