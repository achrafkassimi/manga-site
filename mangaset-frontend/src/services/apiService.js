const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getAuthHeaders() {
        const token = localStorage.getItem('access_token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            // Handle token refresh
            if (response.status === 401) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    // Retry original request
                    config.headers = {
                        ...config.headers,
                        ...this.getAuthHeaders(),
                    };
                    const retryResponse = await fetch(url, config);
                    return this.handleResponse(retryResponse);
                }
                // Redirect to login if refresh fails
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return null;
            }

            return this.handleResponse(response);
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async handleResponse(response) {
        if (response.ok) {
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            return await response.text();
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
    }

    async refreshToken() {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) return false;

        try {
            const response = await fetch(`${this.baseURL}/auth/token/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }
        return false;
    }

    // Authentication methods
    async register(userData) {
        return this.request('/auth/register/', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials) {
        const response = await this.request('/auth/login/', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        
        if (response.tokens) {
            localStorage.setItem('access_token', response.tokens.access);
            localStorage.setItem('refresh_token', response.tokens.refresh);
        }
        
        return response;
    }

    async getProfile() {
        return this.request('/auth/profile/');
    }

    // Manga methods
    async getMangaList(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/v1/manga/?${queryString}`);
    }

    async getMangaDetail(slug) {
        return this.request(`/v1/manga/${slug}/`);
    }

    async getPopularManga() {
        return this.request('/v1/manga/lists/popular/');
    }

    async getFeaturedManga() {
        return this.request('/v1/manga/lists/featured/');
    }

    async getLatestUpdates() {
        return this.request('/v1/manga/lists/latest/');
    }

    async getNewSeries() {
        return this.request('/v1/manga/lists/new/');
    }

    async searchManga(query) {
        return this.request(`/v1/search/?q=${encodeURIComponent(query)}`);
    }

    // User methods
    async getFavorites() {
        return this.request('/v1/user/favorites/');
    }

    async addToFavorites(mangaId) {
        return this.request('/v1/user/favorites/', {
            method: 'POST',
            body: JSON.stringify({ manga_id: mangaId }),
        });
    }

    async removeFromFavorites(favoriteId) {
        return this.request(`/v1/user/favorites/${favoriteId}/`, {
            method: 'DELETE',
        });
    }

    async getReadingHistory() {
        return this.request('/v1/user/history/');
    }

    async updateReadingProgress(mangaId, chapterId, lastPage) {
        return this.request('/v1/user/reading-progress/', {
            method: 'POST',
            body: JSON.stringify({
                manga_id: mangaId,
                chapter_id: chapterId,
                last_page: lastPage,
            }),
        });
    }
}

export default new ApiService();