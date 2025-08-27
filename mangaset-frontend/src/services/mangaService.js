// src/services/mangaService.js
import api from './api';

export const mangaService = {
  // Get all manga with filters
  getAllManga: (params = {}) => {
    return api.get('/manga/', { params });
  },

  // Get manga by slug
  getMangaBySlug: (slug) => {
    return api.get(`/manga/${slug}/`);
  },

  // Get manga chapters
  getMangaChapters: (slug) => {
    return api.get(`/manga/${slug}/chapters/`);
  },

  // Get chapter details
  getChapterDetails: (chapterId) => {
    return api.get(`/chapters/${chapterId}/`);
  },

  // Special lists
  getPopularManga: () => {
    return api.get('/manga/lists/popular/');
  },

  getFeaturedManga: () => {
    return api.get('/manga/lists/featured/');
  },

  getLatestUpdates: () => {
    return api.get('/manga/lists/latest/');
  },

  getNewSeries: () => {
    return api.get('/manga/lists/new/');
  },

  // Search
  searchManga: (query, filters = {}) => {
    return api.get('/search/', { 
      params: { q: query, ...filters } 
    });
  },

  // User actions
  addToFavorites: (mangaId) => {
    return api.post('/user/favorites/', { manga_id: mangaId });
  },

  removeFromFavorites: (favoriteId) => {
    return api.delete(`/user/favorites/${favoriteId}/`);
  },

  getUserFavorites: () => {
    return api.get('/user/favorites/');
  },

  getUserHistory: () => {
    return api.get('/user/history/');
  },

  updateReadingProgress: (mangaId, chapterId, lastPage, progressPercentage) => {
    return api.post('/user/reading-progress/', {
      manga_id: mangaId,
      chapter_id: chapterId,
      last_page: lastPage,
      progress_percentage: progressPercentage
    });
  }
};