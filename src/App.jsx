import axios from 'axios';

// === BU KISIM ÇOK ÖNEMLİ ===
// Eğer bilgisayarında (localhost) çalışıyorsan, adres boş olsun (proxy devreye girsin).
// Eğer canlı sitedeysen (Vercel vb.), istekler direkt Railway'e gitsin.
const BASE_URL = window.location.hostname === "localhost" 
  ? "" 
  : "web-production-fe7c.up.railway.app"; 

const API = axios.create({
  baseURL: BASE_URL, 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - CSRF Token ekleme
API.interceptors.request.use(
  (config) => {
    // Tarayıcı cookie'lerinden csrftoken'ı bul
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 hatasında (oturum düşerse) login'e at
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Sadece login sayfasında değilsek yönlendir (döngüye girmesin)
      if (window.location.pathname !== '/login') {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;