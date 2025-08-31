// // src/services/api.js - Service API de base
// import axios from 'axios';
// import { genresAPI } from './mangaService';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000, // 10 secondes timeout
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     // Log des requêtes en mode développement
//     if (import.meta.env.MODE === 'development') {
//       console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
//     }
    
//     return config;
//   },
//   (error) => {
//     console.error('❌ API Request Error:', error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor to handle token refresh and errors
// api.interceptors.response.use(
//   (response) => {
//     // Log des réponses en mode développement
//     if (import.meta.env.MODE === 'development') {
//       console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
//     }
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
    
//     // Log des erreurs
//     console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'}`);
    
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (refreshToken) {
//           const response = await axios.post(`${API_BASE_URL}/../auth/refresh/`, {
//             refresh: refreshToken
//           });
          
//           const newToken = response.data.access;
//           localStorage.setItem('accessToken', newToken);
          
//           return api(originalRequest);
//         }
//       } catch (refreshError) {
//         console.error('Token refresh failed:', refreshError);
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         window.location.href = '/login';
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// // Override pour les tests - utilise les données mockées pour les genres
// const originalGet = api.get;
// api.get = function(url, config) {
//   // Intercepter les appels aux genres pour utiliser les données mockées
//   if (url === '/genres/' || url.includes('/genres/')) {
//     return genresAPI.getAll();
//   }
  
//   // Pour les autres appels, utiliser l'API normale (ou mock si pas de backend)
//   return originalGet.call(this, url, config).catch(error => {
//     // Si l'API backend n'est pas disponible, utiliser des données mockées
//     if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
//       console.warn('⚠️  Backend not available, using mock data');
      
//       // Retourner des données mockées selon l'endpoint
//       if (url.includes('/manga/')) {
//         return { data: { results: [] } };
//       }
      
//       return { data: [] };
//     }
    
//     throw error;
//   });
// };

// export default api;


// src/services/api.js - Service API
const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('access_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (response.status === 401) {
      // Token expired, try refresh
      await this.refreshToken();
      // Retry original request
      return this.request(endpoint, options);
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async login(credentials) {
    const response = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    this.token = response.access;
    
    return response;
  }

  async register(userData) {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Manga endpoints
  async getMangaList(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/manga/?${queryString}`);
  }

  async getMangaDetail(slug) {
    return this.request(`/manga/${slug}/`);
  }

  async getPopularManga() {
    return this.request('/manga/lists/popular/');
  }

  async getFeaturedManga() {
    return this.request('/manga/lists/featured/');
  }

  // User features
  async getUserFavorites() {
    return this.request('/user/favorites/');
  }

  async addToFavorites(mangaId) {
    return this.request('/user/favorites/', {
      method: 'POST',
      body: JSON.stringify({ manga_id: mangaId }),
    });
  }
}

export default new ApiService();
