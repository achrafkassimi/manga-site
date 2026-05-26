// src/services/apiService.js
// Clean, working API service module.
// Exposes the 5 critical methods (getMangaList, getPopularManga,
// getFeaturedManga, getLatestUpdates, searchManga) plus auth + user methods.
// Thin layer above mangaService.js — no duplicated HTTP logic.

import api from './api';
import { mangaService } from './mangaService';

const apiService = {
  // ── Manga listing & search (the 5 critical methods) ───────────────────────
  getMangaList: (params = {}) => mangaService.getAllManga(params),
  getPopularManga: () => mangaService.getPopularManga(),
  getFeaturedManga: () => mangaService.getFeaturedManga(),
  getLatestUpdates: () => mangaService.getLatestUpdates(),
  searchManga: (query, filters = {}) => mangaService.searchManga(query, filters),

  // ── Extra manga endpoints ─────────────────────────────────────────────────
  getNewSeries: () => mangaService.getNewSeries(),
  getMangaBySlug: (slug) => mangaService.getMangaBySlug(slug),
  getMangaChapters: (slug) => mangaService.getMangaChapters(slug),
  getChapterDetails: (chapterId) => mangaService.getChapterDetails(chapterId),
  getGenres: () => mangaService.getGenres(),

  // ── Authentication ────────────────────────────────────────────────────────
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),

  // ── User actions ──────────────────────────────────────────────────────────
  getFavorites: () => mangaService.getUserFavorites(),
  addToFavorites: (mangaId) => mangaService.addToFavorites(mangaId),
  removeFromFavorites: (favoriteId) => mangaService.removeFromFavorites(favoriteId),
  getReadingHistory: () => mangaService.getUserHistory(),
  updateReadingProgress: (mangaId, chapterId, lastPage, progressPercentage) =>
    mangaService.updateReadingProgress(mangaId, chapterId, lastPage, progressPercentage),

  // ── Notifications ─────────────────────────────────────────────────────────
  getNotifications: () => api.get('/auth/notifications/'),
  markNotificationRead: (id) => api.patch(`/auth/notifications/${id}/`, { is_read: true }),
  markAllNotificationsRead: () => api.post('/auth/notifications/mark-all-read/'),

  // ── Comments ──────────────────────────────────────────────────────────────
  getMangaComments: (mangaSlug) => api.get(`/manga/${mangaSlug}/comments/`),
  postComment: (mangaSlug, content, parentId = null) =>
    api.post(`/manga/${mangaSlug}/comments/`, { content, parent: parentId }),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}/`),
  likeComment: (commentId) => api.post(`/comments/${commentId}/like/`),
  dislikeComment: (commentId) => api.post(`/comments/${commentId}/dislike/`),
};

export default apiService;
