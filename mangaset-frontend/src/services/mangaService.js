// // src/services/mangaService.js
// import api from './api';

// export const mangaService = {
//   // Get all manga with filters
//   getAllManga: (params = {}) => {
//     return api.get('/manga/', { params });
//   },

//   // Get manga by slug
//   getMangaBySlug: (slug) => {
//     return api.get(`/manga/${slug}/`);
//   },

//   // Get manga chapters
//   getMangaChapters: (slug) => {
//     return api.get(`/manga/${slug}/chapters/`);
//   },

//   // Get chapter details
//   getChapterDetails: (chapterId) => {
//     return api.get(`/chapters/${chapterId}/`);
//   },

//   // Special lists
//   getPopularManga: () => {
//     return api.get('/manga/lists/popular/');
//   },

//   getFeaturedManga: () => {
//     return api.get('/manga/lists/featured/');
//   },

//   getLatestUpdates: () => {
//     return api.get('/manga/lists/latest/');
//   },

//   getNewSeries: () => {
//     return api.get('/manga/lists/new/');
//   },

//   // Search
//   searchManga: (query, filters = {}) => {
//     return api.get('/search/', { 
//       params: { q: query, ...filters } 
//     });
//   },

//   // User actions
//   addToFavorites: (mangaId) => {
//     return api.post('/user/favorites/', { manga_id: mangaId });
//   },

//   removeFromFavorites: (favoriteId) => {
//     return api.delete(`/user/favorites/${favoriteId}/`);
//   },

//   getUserFavorites: () => {
//     return api.get('/user/favorites/');
//   },

//   getUserHistory: () => {
//     return api.get('/user/history/');
//   },

//   updateReadingProgress: (mangaId, chapterId, lastPage, progressPercentage) => {
//     return api.post('/user/reading-progress/', {
//       manga_id: mangaId,
//       chapter_id: chapterId,
//       last_page: lastPage,
//       progress_percentage: progressPercentage
//     });
//   }
// };

// src/services/mangaService.js - Version mock pour test
import api from './api';

// Données de test mockées
const mockMangaData = [
  {
    id: 1,
    title: "Attack on Titan",
    slug: "attack-on-titan",
    author: "Hajime Isayama",
    artist: "Hajime Isayama",
    description: "Humanity fights for survival against giant humanoid Titans behind three concentric walls.",
    status: "completed",
    cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400",
    rating: 9.2,
    total_chapters: 139,
    genres: [
      { id: 1, name: "Action", color_code: "#dc3545" },
      { id: 2, name: "Drama", color_code: "#6c757d" },
      { id: 3, name: "Fantasy", color_code: "#6f42c1" }
    ],
    latest_chapter: {
      id: 1,
      chapter_number: 139,
      title: "Final Chapter"
    },
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2024-01-15T12:00:00Z"
  },
  {
    id: 2,
    title: "One Piece",
    slug: "one-piece",
    author: "Eiichiro Oda",
    artist: "Eiichiro Oda",
    description: "Follow Monkey D. Luffy and his crew as they search for the legendary treasure known as One Piece.",
    status: "ongoing",
    cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400",
    rating: 9.5,
    total_chapters: 1100,
    genres: [
      { id: 1, name: "Action", color_code: "#dc3545" },
      { id: 4, name: "Adventure", color_code: "#28a745" },
      { id: 5, name: "Comedy", color_code: "#ffc107" }
    ],
    latest_chapter: {
      id: 2,
      chapter_number: 1100,
      title: "Latest Adventure"
    },
    created_at: "2023-02-01T00:00:00Z",
    updated_at: "2024-01-20T08:00:00Z"
  },
  {
    id: 3,
    title: "Naruto",
    slug: "naruto",
    author: "Masashi Kishimoto",
    artist: "Masashi Kishimoto",
    description: "The story of Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage.",
    status: "completed",
    cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400",
    rating: 8.8,
    total_chapters: 700,
    genres: [
      { id: 1, name: "Action", color_code: "#dc3545" },
      { id: 4, name: "Adventure", color_code: "#28a745" },
      { id: 6, name: "Martial Arts", color_code: "#e83e8c" }
    ],
    latest_chapter: {
      id: 3,
      chapter_number: 700,
      title: "Final Battle"
    },
    created_at: "2023-03-01T00:00:00Z",
    updated_at: "2024-01-10T15:30:00Z"
  },
  {
    id: 4,
    title: "Demon Slayer",
    slug: "demon-slayer",
    author: "Koyoharu Gotouge",
    artist: "Koyoharu Gotouge",
    description: "Tanjiro Kamado becomes a demon slayer to save his sister Nezuko who was turned into a demon.",
    status: "completed",
    cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400",
    rating: 8.9,
    total_chapters: 205,
    genres: [
      { id: 1, name: "Action", color_code: "#dc3545" },
      { id: 7, name: "Supernatural", color_code: "#6610f2" },
      { id: 8, name: "Historical", color_code: "#20c997" }
    ],
    latest_chapter: {
      id: 4,
      chapter_number: 205,
      title: "The End"
    },
    created_at: "2023-04-01T00:00:00Z",
    updated_at: "2024-01-05T10:15:00Z"
  },
  {
    id: 5,
    title: "My Hero Academia",
    slug: "my-hero-academia",
    author: "Kohei Horikoshi",
    artist: "Kohei Horikoshi",
    description: "In a world where most people have superpowers called Quirks, Izuku Midoriya dreams of becoming a hero despite being born without one.",
    status: "ongoing",
    cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400",
    rating: 8.7,
    total_chapters: 400,
    genres: [
      { id: 1, name: "Action", color_code: "#dc3545" },
      { id: 9, name: "School", color_code: "#0dcaf0" },
      { id: 10, name: "Superhero", color_code: "#198754" }
    ],
    latest_chapter: {
      id: 5,
      chapter_number: 400,
      title: "New Challenge"
    },
    created_at: "2023-05-01T00:00:00Z",
    updated_at: "2024-01-25T14:00:00Z"
  },
  {
    id: 6,
    title: "Jujutsu Kaisen",
    slug: "jujutsu-kaisen",
    author: "Gege Akutami",
    artist: "Gege Akutami",
    description: "Yuji Itadori joins a secret organization of Jujutsu Sorcerers to eliminate cursed spirits and find all fingers of Ryomen Sukuna.",
    status: "ongoing",
    cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400",
    rating: 9.0,
    total_chapters: 250,
    genres: [
      { id: 1, name: "Action", color_code: "#dc3545" },
      { id: 7, name: "Supernatural", color_code: "#6610f2" },
      { id: 9, name: "School", color_code: "#0dcaf0" }
    ],
    latest_chapter: {
      id: 6,
      chapter_number: 250,
      title: "Cursed Technique"
    },
    created_at: "2023-06-01T00:00:00Z",
    updated_at: "2024-01-22T16:45:00Z"
  }
];

const mockGenres = [
  { id: 1, name: "Action", color_code: "#dc3545", manga_count: 150 },
  { id: 2, name: "Drama", color_code: "#6c757d", manga_count: 89 },
  { id: 3, name: "Fantasy", color_code: "#6f42c1", manga_count: 120 },
  { id: 4, name: "Adventure", color_code: "#28a745", manga_count: 95 },
  { id: 5, name: "Comedy", color_code: "#ffc107", manga_count: 78 },
  { id: 6, name: "Martial Arts", color_code: "#e83e8c", manga_count: 45 },
  { id: 7, name: "Supernatural", color_code: "#6610f2", manga_count: 67 },
  { id: 8, name: "Historical", color_code: "#20c997", manga_count: 34 },
  { id: 9, name: "School", color_code: "#0dcaf0", manga_count: 56 },
  { id: 10, name: "Superhero", color_code: "#198754", manga_count: 23 },
  { id: 11, name: "Romance", color_code: "#e91e63", manga_count: 89 },
  { id: 12, name: "Horror", color_code: "#795548", manga_count: 42 },
  { id: 13, name: "Mystery", color_code: "#607d8b", manga_count: 38 },
  { id: 14, name: "Slice of Life", color_code: "#ff9800", manga_count: 71 },
  { id: 15, name: "Sports", color_code: "#4caf50", manga_count: 29 }
];

// Simulation d'une latence réseau
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mangaService = {
  // Get all manga with filters
  getAllManga: async (params = {}) => {
    await delay(800); // Simuler latence
    return {
      data: {
        results: mockMangaData,
        count: mockMangaData.length,
        next: null,
        previous: null
      }
    };
  },

  // Get manga by slug
  getMangaBySlug: async (slug) => {
    await delay(600);
    const manga = mockMangaData.find(m => m.slug === slug);
    if (!manga) throw new Error('Manga not found');
    return { data: manga };
  },

  // Get manga chapters
  getMangaChapters: async (slug) => {
    await delay(500);
    return {
      data: {
        results: [
          { id: 1, chapter_number: 1, title: "Chapter 1", page_count: 20, release_date: "2023-01-01T00:00:00Z" },
          { id: 2, chapter_number: 2, title: "Chapter 2", page_count: 18, release_date: "2023-01-08T00:00:00Z" },
          { id: 3, chapter_number: 3, title: "Chapter 3", page_count: 22, release_date: "2023-01-15T00:00:00Z" }
        ]
      }
    };
  },

  // Get chapter details
  getChapterDetails: async (chapterId) => {
    await delay(400);
    return {
      data: {
        id: chapterId,
        chapter_number: 1,
        title: "Test Chapter",
        images: [
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400",
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400",
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400"
        ],
        page_count: 3,
        is_published: true,
        release_date: "2023-01-01T00:00:00Z"
      }
    };
  },

  // Special lists
  getPopularManga: async () => {
    await delay(700);
    // Trier par rating décroissant
    const popular = [...mockMangaData].sort((a, b) => b.rating - a.rating);
    return { data: { results: popular } };
  },

  getFeaturedManga: async () => {
    await delay(900);
    // Prendre les manga avec rating > 8.5
    const featured = mockMangaData.filter(m => m.rating >= 8.8);
    return { data: { results: featured } };
  },

  getLatestUpdates: async () => {
    await delay(600);
    // Trier par date de mise à jour décroissante
    const latest = [...mockMangaData].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return { data: { results: latest } };
  },

  getNewSeries: async () => {
    await delay(650);
    // Trier par date de création décroissante
    const newSeries = [...mockMangaData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { data: { results: newSeries } };
  },

  // Search
  searchManga: async (query, filters = {}) => {
    await delay(800);
    let results = [...mockMangaData];
    
    // Filtrer par query
    if (query) {
      results = results.filter(manga => 
        manga.title.toLowerCase().includes(query.toLowerCase()) ||
        manga.author.toLowerCase().includes(query.toLowerCase()) ||
        manga.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filtrer par status
    if (filters.status) {
      results = results.filter(manga => manga.status === filters.status);
    }
    
    // Filtrer par genre
    if (filters.genre || filters.genres) {
      const genreFilter = filters.genre || filters.genres;
      results = results.filter(manga => 
        manga.genres.some(g => g.name.toLowerCase().includes(genreFilter.toLowerCase()))
      );
    }
    
    return {
      data: {
        results,
        count: results.length
      }
    };
  },

  // User actions
  addToFavorites: async (mangaId) => {
    await delay(300);
    console.log('Added to favorites:', mangaId);
    return { data: { success: true } };
  },

  removeFromFavorites: async (favoriteId) => {
    await delay(300);
    console.log('Removed from favorites:', favoriteId);
    return { data: { success: true } };
  },

  getUserFavorites: async () => {
    await delay(500);
    return {
      data: {
        results: mockMangaData.slice(0, 3).map(manga => ({
          id: manga.id,
          manga,
          added_at: "2024-01-01T00:00:00Z"
        }))
      }
    };
  },

  getUserHistory: async () => {
    await delay(600);
    return {
      data: {
        results: mockMangaData.slice(0, 4).map((manga, index) => ({
          id: index + 1,
          manga,
          chapter: {
            id: index + 1,
            chapter_number: index + 1,
            title: `Chapter ${index + 1}`
          },
          last_page: Math.floor(Math.random() * 20),
          progress_percentage: Math.floor(Math.random() * 100),
          last_read_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        }))
      }
    };
  },

  updateReadingProgress: async (mangaId, chapterId, lastPage, progressPercentage) => {
    await delay(200);
    console.log('Reading progress updated:', { mangaId, chapterId, lastPage, progressPercentage });
    return { data: { success: true } };
  }
};

// Mock pour l'API des genres
export const genresAPI = {
  getAll: async () => {
    await delay(400);
    return {
      data: {
        results: mockGenres
      }
    };
  }
};




