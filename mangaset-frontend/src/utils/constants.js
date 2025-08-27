// src/utils/constants.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
export const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'MangaSet';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const MANGA_STATUS = {
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  HIATUS: 'hiatus',
  CANCELLED: 'cancelled'
};

export const READER_SETTINGS = {
  FIT_WIDTH: 'width',
  FIT_HEIGHT: 'height',
  ORIGINAL: 'original'
};