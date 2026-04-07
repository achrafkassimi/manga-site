# MangaSet

A full-stack manga reading platform built with React + Django REST Framework.

## Quick Start

```bash
# From the project root — starts both servers
start.bat
```

| Service | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:5173 |
| Backend API | http://localhost:8000/api/v1/ |
| Django Admin | http://localhost:8000/admin/ |

### Manual start

```bash
# Backend
cd mangaset_backend
..\venv\Scripts\activate
python manage.py runserver

# Frontend (separate terminal)
cd mangaset-frontend
npm run dev
```

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Bootstrap, Axios |
| Backend | Django 5.2, Django REST Framework |
| Auth | djangorestframework-simplejwt (JWT + refresh rotation) |
| Database | SQLite (dev) / PostgreSQL (production) |
| Images | Pillow |

## Load Sample Data

```bash
cd mangaset_backend
python manage.py load_sample_data          # 12 manga, 12 genres, 5 users
python manage.py load_sample_data --clear  # wipe and reload
```

Test accounts (password: `password123`):
`tanaka_reader`, `sakura_fan`, `manga_master`, `otaku_prime`, `new_reader`

## Monitoring Dashboard

Admin-only dashboard at `/monitoring` — shows:
- Page visit counts and unique visitor stats
- Daily visit chart (14 days)
- Device type breakdown (mobile / tablet / desktop)
- Country breakdown (requires IP geolocation — see Future Features)
- Top manga and chapters by views
- User signup trends
- Full activity log with severity filtering

The dashboard calls these backend endpoints (all require admin token):

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/analytics/dashboard/` | 30-day summary + charts |
| `GET /api/v1/analytics/visits/` | Recent page visits |
| `GET /api/v1/analytics/activity/` | Activity log |
| `GET /api/v1/analytics/top-content/` | Top manga / chapters |
| `GET /api/v1/analytics/users/` | User stats |

## Project Structure

```
manga-site/
├── start.bat                          # Launch script
├── PROJECT_ANALYSIS.md                # Full project analysis
├── mangaset-frontend/
│   └── src/
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── SearchPage.jsx
│       │   ├── MangaDetailsPage.jsx
│       │   ├── ReaderPage.jsx
│       │   └── MonitoringDashboard.jsx
│       ├── services/
│       │   ├── api.js                 # Axios instance + interceptors
│       │   └── mangaService.js        # All manga API calls
│       └── App.jsx                    # Routes
└── mangaset_backend/
    ├── manga/
    │   └── models/
    │       ├── manga.py
    │       ├── chapter.py
    │       ├── analytics.py           # ChapterView, SiteVisit
    │       └── admin_models.py        # ActivityLog, SiteSettings
    ├── api/
    │   ├── views.py                   # Main API views
    │   ├── analytics_views.py         # Monitoring endpoints
    │   ├── middleware.py              # Rate limit + visit tracking
    │   └── urls.py
    └── accounts/                      # JWT auth
```

---

## Future Features Roadmap

### High Priority

#### 1. Comment System
- Backend: expose `Comment` model via REST endpoints (CRUD + threading)
- Frontend: `CommentSection.jsx` component on manga detail page
- Moderation: flag/delete via admin panel

#### 2. Star Rating Widget
- Frontend: `StarRating.jsx` — interactive 1–10 star selector
- Backend: POST to rating endpoint, update `average_rating` aggregate
- Display: show rating distribution chart on manga detail

#### 3. Notifications
- Backend: `GET /api/v1/notifications/` + `POST .../mark-read/`
- Frontend: bell icon in NavigationBar with unread badge, notification dropdown
- Triggers: new chapter of favorited manga, comment replies

#### 4. User Profile Page
- Display avatar, bio, reading history, favorites list
- Avatar upload (backend already supports it via `UserProfile.avatar`)
- Reading stats (chapters read, time spent, genres)

#### 5. Chapter Reader Improvements
- Keyboard navigation (← / → arrows)
- Reading mode toggle: scroll / single page / double page
- Auto-save reading progress to backend on page change
- Zoom controls

### Medium Priority

#### 6. SEO System
- Install `react-helmet-async` — add `<Helmet>` to every page with dynamic title/description/og tags
- Django: sitemap view at `/sitemap.xml` using `django.contrib.sitemaps`
- `robots.txt` served as a static file
- Structured data (JSON-LD) for manga pages (schema.org/Book)

#### 7. IP Geolocation for Analytics
- Call free API (ip-api.com) from backend when a `SiteVisit` is created
- Background task (Django Q or Celery) to fill `country_code`, `country_name`, `city`
- Display live country map in monitoring dashboard

#### 8. Admin Panel (React)
- Protected `/admin-panel` route (staff only, separate from Django admin)
- Manga CRUD: create, edit, delete manga and chapters
- User management: view users, ban, change role
- Bulk actions: publish/unpublish, delete

#### 9. Email / Password Reset
- Configure `EMAIL_BACKEND` in settings (SMTP or SendGrid)
- Test `ForgotPasswordPage` + `ResetPasswordPage` end-to-end
- Welcome email on registration

#### 10. Dark Mode
- CSS variables for theme tokens
- Toggle stored in localStorage
- Respect `prefers-color-scheme` on first visit

#### 11. Multi-language Support (i18n)
- Install `react-i18next` for frontend translations
- Language files: `locales/fr.json`, `locales/en.json`, `locales/ar.json` (RTL support)
- Language toggle already wired in NavigationBar — just needs the translation keys
- Backend: serve manga title/description in multiple languages via separate model fields or django-modeltranslation
- Auto-detect browser language on first visit, save preference to localStorage

### Low Priority / Future

#### 11. Reading Lists / Collections
- User-created lists (e.g. "Reading", "Plan to Read", "Completed")
- Share lists publicly

#### 12. PWA Support
- `manifest.json` + service worker
- Offline reading cache for recently opened chapters
- Add to home screen prompt

#### 13. Recommendations Engine
- "Similar manga" sidebar based on shared genres/tags
- "You might also like" on homepage based on reading history

#### 14. Redis Caching
- Replace `DummyCache` with Redis for rate limiting and popular manga caching
- Cache `popular/`, `featured/`, `latest/` endpoints (5-minute TTL)

#### 15. Search Improvements
- Elasticsearch or PostgreSQL full-text search for better relevance
- Autocomplete suggestions in search bar
- Saved searches

#### 16. Production Deployment
- Switch to PostgreSQL (`settings.py` config is already commented in)
- Move `SECRET_KEY` to `.env` file
- Add `ALLOWED_HOSTS` + `DEBUG=False`
- Serve static files with WhiteNoise or nginx
- Docker Compose setup for the full stack

---

## Environment Variables

Create `mangaset_backend/.env`:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=mangaset_db
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
EMAIL_HOST_USER=you@example.com
EMAIL_HOST_PASSWORD=yourpassword
```

Create `mangaset-frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## Known Issues / Tech Debt

- `venv/` and `__pycache__/` are committed — add `.gitignore`
- Double `SIMPLE_JWT` config block in `settings.py` (lines 203 and 250)
- `api/views.py` has large commented-out legacy code block
- `TestPage.jsx` should be removed before production
- `SECRET_KEY` hardcoded in `settings.py` — move to `.env`
