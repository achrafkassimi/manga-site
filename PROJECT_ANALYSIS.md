# MangaSet Project Analysis

> Generated: 2026-04-05

## Project Overview

Full-stack manga reading platform built with:
- **Frontend**: React 18 + Vite + React Bootstrap
- **Backend**: Django 5.2 + Django REST Framework + JWT auth
- **Database**: SQLite (dev) → PostgreSQL (planned)
- **Auth**: `djangorestframework-simplejwt` with refresh token rotation

---

## Architecture

```
manga-site/
├── mangaset-frontend/       # React + Vite
│   ├── src/
│   │   ├── pages/           # Route-level pages
│   │   ├── components/      # Reusable UI components
│   │   └── services/        # API service layer
├── mangaset_backend/        # Django
│   ├── manga/               # Core data models
│   ├── api/                 # REST endpoints
│   ├── accounts/            # Auth (JWT)
│   └── mangaset_backend/    # Django settings + URLs
├── venv/                    # Python virtual environment
└── start.bat                # Launch both servers
```

---

## What Exists and Works

### Backend Models
| Model | Location | Purpose |
|-------|----------|---------|
| `Manga` | `manga/models/manga.py` | Core manga entity with slug, status, view_count |
| `Chapter` | `manga/models/chapter.py` | Chapters with pages, view_count |
| `Genre` | `manga/models/genre.py` | Genre with color_code |
| `Tag` | `manga/models/tag.py` | Tags for filtering |
| `MangaRating` | `manga/models/manga_rating.py` | User ratings (1-10) |
| `Comment` | `manga/models/comment.py` | Threaded comments |
| `UserFavorite` | `manga/models/user_favorite.py` | Favorites list |
| `ReadingHistory` | `manga/models/reading_history.py` | Reading progress tracking |
| `UserProfile` | `manga/models/user_profile.py` | Extended user profile + avatar |
| `ChapterView` | `manga/models/analytics.py` | Chapter view tracking (IP, device, country) |
| `ActivityLog` | `manga/models/admin_models.py` | System activity log with severity |
| `SiteSettings` | `manga/models/admin_models.py` | Key-value site configuration |
| `Notification` | `manga/models/notification.py` | User notifications |

### Backend API Endpoints (`/api/v1/`)
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `manga/` | GET | No | List all manga (paginated, filterable) |
| `manga/<slug>/` | GET | No | Manga detail |
| `manga/<slug>/chapters/` | GET | No | Chapters for a manga |
| `manga/lists/popular/` | GET | No | Top manga by view count |
| `manga/lists/featured/` | GET | No | High-rated manga |
| `manga/lists/latest/` | GET | No | Recently updated |
| `manga/lists/new/` | GET | No | New series |
| `chapters/<id>/` | GET | No | Chapter detail with pages |
| `genres/` | GET | No | All genres |
| `search/` | GET | No | Full-text search |
| `user/favorites/` | GET/POST | Yes | User favorites |
| `user/favorites/<id>/` | DELETE | Yes | Remove favorite |
| `user/history/` | GET | Yes | Reading history |
| `user/reading-progress/` | POST | Yes | Update progress |
| `admin/manga/` | GET/POST | Admin | Admin manga management |
| `admin/users/` | GET | Admin | Admin user list |

### Auth Endpoints (`/api/v1/auth/`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `login/` | POST | JWT login → access + refresh tokens |
| `register/` | POST | User registration |
| `token/refresh/` | POST | Refresh access token |
| `logout/` | POST | Blacklist refresh token |
| `profile/` | GET/PUT | Get/update user profile |
| `change-password/` | POST | Change password |
| `health/` | GET | Health check |

### Frontend Pages
| Page | Route | Status |
|------|-------|--------|
| `HomePage` | `/` | Working |
| `SearchPage` | `/search` | Working |
| `MangaDetailsPage` | `/manga/:slug` | Working |
| `ReaderPage` | `/reader/:id` | Working |
| `AuthPage` | `/login` | Working |
| `NotFoundPage` | `*` | Working |

### Infrastructure
- `RateLimitMiddleware`: 100 req/min per IP via Django cache
- `ErrorHandlingMiddleware`: Centralized JSON error responses
- Pillow cover image generation in sample data command
- CORS configured for localhost:5173 and localhost:3000

---

## What is Missing or Incomplete

### Critical Gaps

#### 1. User Profile Page (Frontend)
- No `/profile` route or `UserProfilePage` component
- `UserProfile` model exists in backend, `profile/` endpoint exists
- **Fix needed**: Create `UserProfilePage.jsx` with avatar upload, reading history, favorites

#### 2. Comment System (Frontend)
- `Comment` model and signals exist in backend
- No comment component or API endpoint exposed
- **Fix needed**: `CommentSection.jsx`, backend comment endpoints

#### 3. Notification System (Frontend + partial backend)
- `Notification` model exists
- No API endpoint to fetch/mark notifications as read
- No frontend notification bell/dropdown
- **Fix needed**: Notification API + `NotificationDropdown.jsx`

#### 4. Manga Rating (Frontend)
- `MangaRating` model exists, `average_rating` computed
- No rating UI component (stars widget)
- **Fix needed**: `StarRating.jsx` + POST to rating endpoint

#### 5. Chapter Reader Improvements
- `ReaderPage.jsx` exists but may lack:
  - Keyboard navigation (←/→ arrows)
  - Reading mode toggle (single page / double page / scroll)
  - Progress auto-save to backend

#### 6. Admin Dashboard (Frontend)
- `admin_views.py` exists with basic CRUD
- No React admin panel
- **Fix needed**: Admin-only route + `AdminDashboard.jsx`

#### 7. Monitoring / Analytics Dashboard
- `ChapterView` tracks chapter reads with IP, device, country
- `ActivityLog` tracks system events
- No analytics API endpoint aggregating the data
- No frontend monitoring dashboard
- **Fix needed**: Analytics API + `MonitoringDashboard.jsx`

#### 8. SEO System
- No `<Helmet>` or meta tag management on any page
- No sitemap generation
- No `robots.txt` served
- **Fix needed**: `react-helmet-async` + sitemap Django view

#### 9. Password Reset Flow
- `ForgotPasswordPage.jsx` and `ResetPasswordPage.jsx` exist
- Email backend is commented out in settings
- Backend reset views unclear if implemented
- **Fix needed**: Configure email backend + test full flow

#### 10. Geolocation / Visitor Location
- `ChapterView.country_code` field exists
- No IP→location resolution implemented
- **Fix needed**: Integration with free IP API (ip-api.com)

### Minor Gaps
- No loading skeleton components (only spinner)
- No dark mode
- No PWA manifest
- No `Error Boundary` component in React
- `TestPage.jsx` should be removed before production
- `.env` file not committed — VITE_API_URL not documented
- `venv/` folder committed to git (should be in `.gitignore`)
- `__pycache__` committed to git (should be in `.gitignore`)

---

## Data Flow: Frontend → Backend

```
React Component
  → mangaService.js (service layer)
    → api.js (axios instance + interceptors)
      → Django REST Framework
        → Model QuerySet
          → Serializer
            → JSON Response
              → normalizeManga() (field mapping)
                → Component state
```

Key normalization: `average_rating` (backend) → `rating` (frontend components)

---

## Sample Data

Run to populate test data:
```bash
cd mangaset_backend
python manage.py load_sample_data        # Add 12 manga, 12 genres, 5 users
python manage.py load_sample_data --clear  # Clear all and reload
```

Test users (password: `password123`):
- `tanaka_reader`, `sakura_fan`, `manga_master`, `otaku_prime`, `new_reader`
- Admin: `admin` (created separately via `createsuperuser`)

---

## Running the Project

```bash
# From project root — starts both servers
start.bat

# Or manually:
# Backend
cd mangaset_backend
python manage.py runserver

# Frontend
cd mangaset-frontend
npm run dev
```

URLs:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/v1/
- Django Admin: http://localhost:8000/admin/

---

## Tech Debt

1. `api/views.py` — original code is entirely commented out; active code lives there but needs cleanup
2. `api.js` — first ~200 lines are commented-out legacy code; should be cleaned
3. Double `SIMPLE_JWT` config block in `settings.py` (lines 203–209 and 250–266)
4. `venv/` and `__pycache__/` tracked in git — add `.gitignore`
5. Hardcoded `SECRET_KEY` in `settings.py` — move to `.env`
