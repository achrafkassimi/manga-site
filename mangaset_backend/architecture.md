# MangaSet — Architecture du système

```mermaid
flowchart TB
    subgraph Client["🌐 Client (navigateur)"]
        Browser["Navigateur<br/>(Chrome/Firefox/Safari)"]
    end

    subgraph Frontend["📦 mangaset-frontend (Vite + React 19, port 3000)"]
        direction TB
        Pages["📄 Pages (16)<br/>HomePage · SearchPage · MangaDetailsPage<br/>ReaderPage · AuthPage · ForgotPasswordPage<br/>ResetPasswordPage · MonitoringDashboard<br/>AdminDashboardPage · NotFoundPage..."]
        Components["🧩 Components<br/>common/ · manga/ · user/"]
        Context["🔄 Context<br/>AuthContext (JWT)<br/>ThemeContext (dark/light)"]
        Services["🔌 Services<br/>api.js (axios + interceptors)<br/>apiService.js · mangaService.js"]
        Router["🧭 React Router v7<br/>ProtectedRoute · AdminRoute"]
    end

    subgraph Vite["⚙️ Vite dev server"]
        Proxy["Proxy /api → :8000"]
    end

    subgraph Backend["🐍 mangaset_backend (Django 5.2 + DRF, port 8000)"]
        direction TB

        subgraph Middleware["Middleware stack"]
            CORS["corsheaders"]
            Security["SecurityMiddleware"]
            RateLimit["RateLimitMiddleware<br/>(100 req/min/IP)"]
            SiteVisit["SiteVisitMiddleware<br/>(tracking)"]
        end

        subgraph URLs["URL routing"]
            URLRoot["mangaset_backend/urls.py"]
            URLAccounts["accounts/urls.py<br/>/api/v1/auth/*"]
            URLApi["api/urls.py<br/>/api/v1/* (manga, user, admin)"]
            URLMonitoring["monitoring/urls.py<br/>/api/v1/monitoring/*"]
            URLSwagger["drf-spectacular<br/>/api/docs/ · /api/schema/"]
        end

        subgraph Apps["Django apps (4 métier + 1 config)"]
            AccountsApp["📁 accounts/<br/>JWT auth · profil<br/>reset password"]
            ApiApp["📁 api/<br/>views · admin_views<br/>analytics_views · serializers<br/>middleware"]
            MangaApp["📁 manga/<br/>21 modèles décomposés<br/>signals · managers · utils"]
            MonitoringApp["📁 monitoring/<br/>(stub — vide)"]
        end

        subgraph DRF["DRF layer"]
            Auth["SimpleJWT<br/>Access 60min · Refresh 7j"]
            Serializers["Serializers<br/>(MangaListSer · UserSer · CommentSer...)"]
            Permissions["Permissions<br/>IsAuthenticated · IsAdminUser"]
            Pagination["PageNumberPagination<br/>(20/page)"]
        end
    end

    subgraph Storage["💾 Storage layer"]
        SQLite[("SQLite<br/>db.sqlite3<br/>(dev)")]
        PostgreSQL[("PostgreSQL<br/>(prod — configuré commenté)")]
        MediaFiles["📁 media/<br/>avatars/ · manga/covers/<br/>chapter pages JSON URLs"]
        Cache[("LocMemCache<br/>locmem (dev)<br/>Redis (prod planifié)")]
    end

    subgraph External["🌍 External (planifié, non actif)"]
        SMTP["SMTP Email<br/>(reset password)<br/>commenté"]
        MangaDex["MangaDex API<br/>(import futur)"]
        OAuth["OAuth providers<br/>Google · Discord"]
    end

    Browser -->|HTTP/HTTPS| Frontend
    Pages --> Components
    Pages --> Router
    Components --> Context
    Components --> Services
    Services -->|axios + Bearer JWT| Vite
    Vite -->|Proxy| Middleware

    CORS --> Security --> RateLimit --> SiteVisit
    SiteVisit --> URLRoot
    URLRoot --> URLAccounts
    URLRoot --> URLApi
    URLRoot --> URLMonitoring
    URLRoot --> URLSwagger

    URLAccounts --> AccountsApp
    URLApi --> ApiApp
    URLMonitoring --> MonitoringApp

    AccountsApp --> Auth
    ApiApp --> Serializers
    ApiApp --> Permissions
    ApiApp --> Pagination

    AccountsApp --> MangaApp
    ApiApp --> MangaApp

    MangaApp -->|Django ORM| SQLite
    MangaApp -.->|prod| PostgreSQL
    MangaApp --> Cache
    MangaApp --> MediaFiles

    AccountsApp -.->|reset password| SMTP
    AccountsApp -.->|login social| OAuth
    ApiApp -.->|sync external| MangaDex

    classDef done fill:#28a745,color:#fff,stroke:#1e7e34
    classDef partial fill:#ffc107,color:#000,stroke:#d39e00
    classDef notImplemented fill:#dc3545,color:#fff,stroke:#bd2130
    classDef external fill:#6c757d,color:#fff,stroke:#5a6268

    class Pages,Components,Context,Router,AccountsApp,ApiApp,MangaApp,Auth,Serializers,Permissions,Pagination,CORS,Security,SQLite,Cache,MediaFiles done
    class Services,RateLimit,SiteVisit,URLSwagger partial
    class MonitoringApp,PostgreSQL,SMTP,MangaDex,OAuth notImplemented
```

## Flux principaux du système

### Flux 1 — Authentification JWT

```
[Browser] LoginForm
    → POST /api/v1/auth/login/ {username, password}
    → CustomTokenObtainPairView (accounts)
    → Validation User + génération SimpleJWT
    ← Response {access (60min), refresh (7j), user}
    → Stockage localStorage (⚠️ XSS risk)
    → AuthContext.setUser()
```

### Flux 2 — Lecture d'un manga

```
[Browser] /manga/:slug
    → GET /api/v1/manga/<slug>/
    → MangaDetailView (api/views.py)
    → Manga.objects.prefetch_related('genres', 'chapters')
    → MangaDetailSerializer (avec is_favorited + reading_progress)
    ← Response (manga + chapters + user context)
    → React render MangaDetailsPage + CommentSection
    → GET /api/v1/manga/<slug>/comments/ (parallèle)
```

### Flux 3 — Ajout favori (authentifié)

```
[Browser] click ❤️
    → POST /api/v1/user/favorites/ {manga_id}
    → IsAuthenticated check via JWT
    → UserFavoritesView.perform_create() → save(user=request.user)
    → signals.py: post_save → Manga.favorite_count += 1
    ← Response (favorite created)
```

### Flux 4 — Dashboard admin

```
[Browser] /admin/dashboard
    → AdminRoute check (user.is_staff)
    → Promise.all([
        GET /api/v1/admin/dashboard/stats/,
        GET /api/v1/admin/users/,
        GET /api/v1/admin/manga/
      ])
    → IsAdminUser permission check
    → Aggregations Django ORM
    ← Stats + listes
    → Render sidebar + 3 sections (cards / chart+top / 3 panels)
```

---

## Stack technique récapitulative

| Couche | Technologie | Version |
|--------|-------------|---------|
| Frontend Framework | React | 19.1.1 |
| Build tool | Vite | 7.1.2 |
| UI Library | Bootstrap + react-bootstrap | 5.3.8 / 2.10.10 |
| HTTP Client | axios | 1.11.0 |
| Routing | react-router-dom | 7.8.2 |
| Charts | Chart.js + react-chartjs-2 | 4.5 / 5.3 |
| Notifications UI | react-toastify | 11.0.5 |
| Backend Framework | Django | 5.2 |
| REST | Django REST Framework | 3.x |
| Auth | djangorestframework-simplejwt | — |
| CORS | django-cors-headers | — |
| Filters | django-filter | — |
| API Docs | drf-spectacular | 0.27+ |
| Config | python-decouple | importé non utilisé |
| Database (dev) | SQLite | bundled |
| Database (prod, planifié) | PostgreSQL | config commentée |
| Cache (dev) | LocMemCache | bundled |
| Cache (prod, planifié) | Redis | config commentée |
| Tests backend | pytest + pytest-django | 8 / 4.8 |
| Tests frontend | Vitest + Testing Library | dernière |
