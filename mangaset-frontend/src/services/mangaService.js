// src/services/mangaService.js
import api from './api';

// Backend returns `average_rating`; components expect `rating`.
// This normalizer keeps components unchanged.
const normalizeManga = (manga) => {
  if (!manga || typeof manga !== 'object') return manga;
  return {
    ...manga,
    rating: manga.average_rating ?? manga.rating ?? 0,
  };
};

// Handle both paginated { results: [...] } and plain array responses.
const normalizeListResponse = (response) => {
  const data = response.data;
  if (data && data.results) {
    return {
      ...response,
      data: { ...data, results: data.results.map(normalizeManga) },
    };
  }
  if (Array.isArray(data)) {
    return { ...response, data: data.map(normalizeManga) };
  }
  return response;
};

const normalizeSingleResponse = (response) => ({
  ...response,
  data: normalizeManga(response.data),
});

export const mangaService = {
  // ── Manga ──────────────────────────────────────────────────────────────
  getAllManga: (params = {}) =>
    api.get('/manga/', { params }).then(normalizeListResponse),

  getMangaBySlug: (slug) =>
    api.get(`/manga/${slug}/`).then(normalizeSingleResponse),

  getMangaChapters: (slug) =>
    api.get(`/manga/${slug}/chapters/`),

  getChapterDetails: (chapterId) =>
    api.get(`/chapters/${chapterId}/`),

  // ── Special lists ───────────────────────────────────────────────────────
  getPopularManga: () =>
    api.get('/manga/lists/popular/').then(normalizeListResponse),

  getFeaturedManga: () =>
    api.get('/manga/lists/featured/').then(normalizeListResponse),

  getLatestUpdates: () =>
    api.get('/manga/lists/latest/').then(normalizeListResponse),

  getNewSeries: () =>
    api.get('/manga/lists/new/').then(normalizeListResponse),

  // ── Search ──────────────────────────────────────────────────────────────
  searchManga: (query, filters = {}) =>
    api.get('/search/', { params: { q: query, ...filters } }).then(normalizeListResponse),

  // ── Genres ──────────────────────────────────────────────────────────────
  getGenres: () =>
    api.get('/genres/'),

  // ── User actions (require authentication) ───────────────────────────────
  addToFavorites: (mangaId) =>
    api.post('/user/favorites/', { manga_id: mangaId }),

  removeFromFavorites: (favoriteId) =>
    api.delete(`/user/favorites/${favoriteId}/`),

  getUserFavorites: () =>
    api.get('/user/favorites/').then(normalizeListResponse),

  getUserHistory: () =>
    api.get('/user/history/'),

  updateReadingProgress: (mangaId, chapterId, lastPage, progressPercentage) =>
    api.post('/user/reading-progress/', {
      manga_id: mangaId,
      chapter_id: chapterId,
      last_page: lastPage,
      progress_percentage: progressPercentage,
    }),
};

// Kept for backward compatibility (GenreCloud uses this import)
export const genresAPI = {
  getAll: () => api.get('/genres/'),
};
