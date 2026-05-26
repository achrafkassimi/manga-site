# MangaSet — Plan de Correction & Évolution

> Document généré à partir de l'audit complet réalisé le **2026-05-23**.
> Source : analyses parallèles (sécurité, backend Python, frontend React, exploration codebase).
> **Statut** : à utiliser comme feuille de route. Cocher les items au fur et à mesure.

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Architecture actuelle](#2-architecture-actuelle)
3. [Tâches déjà réalisées](#3-tâches-déjà-réalisées)
4. [P0 — Bloquants production (faire AVANT tout déploiement)](#4-p0--bloquants-production)
5. [P1 — Bugs / dette technique (court terme)](#5-p1--bugs--dette-technique)
6. [P2 — Améliorations (moyen terme)](#6-p2--améliorations)
7. [P3 — Évolutions / nouvelles features (long terme)](#7-p3--évolutions--nouvelles-features)
8. [Score global & verdict](#8-score-global--verdict)

---

## 1. Vue d'ensemble

| Domaine | Score | Justification |
|---------|-------|---------------|
| Architecture backend | 8/10 | 19 modèles bien décomposés, API REST cohérente |
| Implémentation backend | 6/10 | Fonctionnel mais ~520 lignes mortes + 3 endpoints mock |
| Architecture frontend | 6.5/10 | Bonne séparation pages/components mais 3 services auth concurrents |
| Implémentation frontend | 5/10 | Lecteur mocké (feature core), tests quasi inexistants |
| Sécurité | 3/10 | 5 critiques + 6 hauts → bloquant pour prod |
| Tests | 2/10 | Backend ~20 % / Frontend < 1 % — objectif 80 % loin |
| Accessibilité | 4/10 | Bootstrap aide mais `alt`/`aria`/keyboard nav manquants |
| Performance | 5/10 | Bons mixins ORM mais N+1, pas de code splitting, race conditions |
| **Prêt production** | **2/10** | **Non** — sécurité + lecteur manga sont bloquants |

---

## 2. Architecture actuelle

### Backend `mangaset_backend/` (5 apps)

| App | Rôle | État |
|-----|------|------|
| `mangaset_backend/` | Config principale (settings, urls, wsgi/asgi) | ✅ |
| `accounts/` | Auth JWT, profil, reset password | ✅ (3 endpoints mock à supprimer) |
| `api/` | Endpoints REST manga/users/admin | ✅ (~520 lignes commentées) |
| `manga/` | 19 modèles décomposés en `models/*.py` | ✅ |
| `monitoring/` | Analytics admin | ⚠️ Doublon avec `api/analytics_views.py` |

### Frontend `mangaset-frontend/src/`

```
pages/          → 16 pages (4 statiques inline dans App.jsx)
components/
  common/       → 8 (Layout, NavigationBar, Footer, AdminRoute, ProtectedRoute,
                       ErrorBoundary, ScrollToTop, LoadingSpinner)
  manga/        → 9 (CommentSection, MangaCard, MangaDetails, MangaReader,
                       FeaturedManga, GenreCloud, LatestUpdates, NewSeries, PopularToday)
  user/         → 7 (LoginForm, RegisterForm, UserProfilePage, UserDashboard,
                       ForgotPassword, ResetPassword, DemoLoginHelper)
context/        → AuthContext, ThemeContext
services/       → api.js, apiService.js, mangaService.js, authService.js
                  ⚠️ 3 implémentations d'auth concurrentes — à consolider
styles/         → theme.css, custom.css, ReaderPage.css
test/           → setup.js + 1 seul test (AuthContext)
```

---

## 3. Tâches déjà réalisées

| # | Feature | Backend | Frontend | État |
|---|---------|---------|----------|------|
| 1 | Inscription / Login / Logout / Refresh JWT | ✅ | ✅ | ✅ |
| 2 | Reset password (token 24 h) | ✅ | ✅ | ✅ |
| 3 | Profil utilisateur (avatar, bio, langue) | ✅ | ✅ | ✅ |
| 4 | Change password | ✅ | ✅ | ✅ |
| 5 | Listes manga (featured/popular/latest/new) | ✅ | ✅ | ✅ |
| 6 | Détail manga + chapitres | ✅ | ✅ | ✅ |
| 7 | **Lecteur de manga** | ✅ | ❌ Mocké (picsum) | ⚠️ **CORE CASSÉ** |
| 8 | Recherche + filtres | ✅ | ✅ | ✅ |
| 9 | Favoris (add/remove/list) | ✅ | ✅ | ✅ |
| 10 | Historique de lecture + progress | ✅ | ⚠️ Partiel | ⚠️ |
| 11 | Commentaires (CRUD, replies, votes, spoiler) | ✅ | ⚠️ `is_spoiler` non envoyé | ⚠️ |
| 12 | Notifications | ✅ | ✅ (pas de polling) | ✅ |
| 13 | Admin dashboard | ✅ | ✅ (mock fallback) | ✅ |
| 14 | Analytics monitoring | ✅ | ✅ | ✅ |
| 15 | Notes / ratings manga | ✅ Modèle | ❌ UI absente | ❌ |
| 16 | Recommandations | ❌ | ❌ Placeholder | ❌ |

---

## 4. P0 — Bloquants production

> **Aucun déploiement public tant que ces items ne sont pas tous cochés.**

### 4.1 Sécurité — Critiques (OWASP)

- [ ] **A02 — Externaliser `SECRET_KEY`**
  - Fichier : `mangaset_backend/mangaset_backend/settings.py:26`
  - Action : `from decouple import config` puis `SECRET_KEY = config('DJANGO_SECRET_KEY')`
  - Faire tourner `python manage.py generate_secret_key`, mettre dans `.env` (déjà gitignoré)
  - **Invalider tous les tokens existants** (changement de clé)
- [ ] **A05 — Désactiver CORS wildcard + credentials**
  - Fichier : `mangaset_backend/mangaset_backend/settings.py:189-190`
  - Remplacer `CORS_ALLOW_ALL_ORIGINS = True` par `CORS_ALLOWED_ORIGINS = ["https://mangaset.com"]`
- [ ] **A07 — Supprimer l'exposition du token de reset**
  - Fichier : `mangaset_backend/accounts/views.py:294-297`
  - Supprimer entièrement le bloc `if settings.DEBUG` qui renvoie le token en clair
  - Utiliser `EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'` en local
- [ ] **A07 — Rate limiting dédié login/register**
  - Installer `django-axes`
  - Config : `AXES_FAILURE_LIMIT = 5`, `AXES_COOLOFF_TIME = timedelta(minutes=30)`
- [ ] **A05 — Définir `ALLOWED_HOSTS`**
  - Fichier : `mangaset_backend/mangaset_backend/settings.py:31`
  - `ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=lambda v: v.split(','))`

### 4.2 Sécurité — Hauts

- [ ] **Valider IP via `django-ipware`** (X-Forwarded-For spoofable actuellement) — `api/middleware.py:34`
- [ ] **Migrer JWT vers cookies httpOnly** (élimine le risque XSS-exfil) — `AuthContext.jsx:38`
- [ ] **Protéger Swagger** : `permission_classes=[IsAdminUser]` sur `/api/docs/` — `mangaset_backend/urls.py:51-52`
- [ ] **Valider magic bytes uploads avatars** via Pillow — `accounts/views.py:477`
- [ ] **Désactiver `sourcemap` en production** — `vite.config.js:22`

### 4.3 Feature core cassée

- [ ] **Implémenter le vrai lecteur manga**
  - Fichier : `mangaset-frontend/src/pages/ReaderPage.jsx`
  - Actuel : images générées via `picsum.photos`
  - Cible : récupération des pages réelles via `mangaService.getChapterDetails(chapterId)`, tracking progression via `apiService.updateReadingProgress(...)`

### 4.4 Hygiène repo Git

- [ ] **`.gitignore`** : ✅ corrigé en session précédente
- [ ] **Détracker `venv/`** : `git rm -r --cached venv`
- [ ] **Détracker `db.sqlite3`** : sauvegarder d'abord
- [ ] **Détracker `mangaset-frontend/.env`** : vérifier qu'il ne contient pas de vrai secret
- [ ] **Détracker `__pycache__` + `*.pyc`** (~2117 fichiers)
- [ ] **Détracker `media/`** (uploads users)
- [ ] **Commit** : `chore: untrack venv, db, .env, pycache, media`

---

## 5. P1 — Bugs / dette technique

### 5.1 Backend

- [ ] **Race conditions `view_count`** : utiliser `F('view_count') + 1` au lieu de `instance.view_count += 1; .save()`
  - `api/views.py:582,636`
  - `manga/models/analytics.py:51,54`
- [ ] **Bug champ `birth_date` vs `date_of_birth`** : modèle dit `date_of_birth`, serializer dit `birth_date` — `accounts/serializers.py:30`
- [ ] **`BLACKLIST_AFTER_ROTATION` sans app `token_blacklist`** : ajouter `'rest_framework_simplejwt.token_blacklist'` à `INSTALLED_APPS` — `settings.py:268`
- [ ] **`SIMPLE_JWT` défini 2 fois** : le 2ᵉ écrase le 1ᵉʳ — `settings.py:216 et 265`
- [ ] **Supprimer 520 lignes de code mort** dans `api/views.py:1-523`
- [ ] **`update_profile_view` orpheline** (non routée) — `accounts/views.py:495`
- [ ] **Fusionner `monitoring/` et `api/analytics_views.py`** (doublon)
- [ ] **N+1 dans `MangaListSerializer.get_latest_chapter`** : ajouter `.prefetch_related('chapters')` sur le queryset
- [ ] **14 requêtes pour graphe journalier** dans `analytics_views.py:89` → remplacer par un seul `GROUP BY DATE()`
- [ ] **Rate limit avec Redis** au lieu de `locmem` (perd l'état entre workers)
- [ ] **Index composite** sur `(manga_id, is_published, chapter_number)` pour `Chapter`

### 5.2 Frontend

- [ ] **`throw { ... }` → `throw new Error()`** — `AuthContext.jsx:283`
- [ ] **`process.env.REACT_APP_*` dans Vite** (toujours undefined) — `services/authService.js:4` → supprimer le fichier (legacy)
- [ ] **Routes `/profile`, `/dashboard` non protégées** (doublons avant version protégée) — `App.jsx:86-88`
- [ ] **`ProtectedRoute` redirige vers `/auth` (route inexistante)** — `ProtectedRoute.jsx:7` → rediriger vers `/login`
- [ ] **Double instance axios avec refresh concurrent** — fusionner `AuthContext.jsx` + `api.js` en un seul flow
- [ ] **`window.location.href='/login'` casse la SPA** — utiliser `navigate('/login')` — `AuthContext.jsx:91`, `api.js:250`
- [ ] **useEffect deps manquantes** (4 occurrences à grep `// eslint-disable-next-line react-hooks/exhaustive-deps`)
- [ ] **`class="center"` au lieu de `className`** — `ReaderPage.jsx:77`
- [ ] **Supprimer 800 lignes mortes dans `UserProfilePage.jsx`** + 200 lignes dans `api.js`
- [ ] **`key={index}` dans 7 listes dynamiques** : utiliser un id stable
- [ ] **`lucide-react` orpheline** dans `package.json:19` → désinstaller
- [ ] **`is_spoiler` non envoyé** par `CommentSection.jsx` lors du `postComment`

### 5.3 Tests

- [ ] **Tests pytest** : étendre couverture (commentaires, notifications, admin endpoints)
- [ ] **Tests Vitest** : ajouter tests pour `mangaService`, `apiService`, `MangaCard`, `CommentSection`
- [ ] **Cible** : 80 % de couverture sur les chemins critiques

---

## 6. P2 — Améliorations

### 6.1 Sécurité — Moyens

- [ ] **`DEBUG = config('DEBUG', default=False, cast=bool)`**
- [ ] **`SESSION_COOKIE_SECURE = True`** + `CSRF_COOKIE_SECURE = True` en prod
- [ ] **Endpoint `/health/` épuré** : retourner uniquement `{"status": "ok"}` (ne pas exposer la carte des routes) — `accounts/views.py:453-466`
- [ ] **Anti-énumération comptes** au register : message générique — `accounts/serializers.py:118`
- [ ] **Restreindre avatars à JPEG/PNG** (retirer GIF, polyglottes possibles) — `settings.py:214`
- [ ] **HSTS** : `SECURE_HSTS_SECONDS = 31536000` en prod

### 6.2 UX & UI

- [ ] **Page Notes / Ratings** : modèle `MangaRating` existe, UI absente
- [ ] **Skeleton loaders** : utiliser `react-loading-skeleton` déjà installée (sinon désinstaller)
- [ ] **Accessibilité** : ajouter `alt` à toutes les images, `aria-label` aux boutons icônes, tester navigation clavier
- [ ] **Identité visuelle** : palette custom au-delà de Bootstrap par défaut

### 6.3 Performance

- [ ] **`React.lazy`** sur `/admin/*` et `/read/*` (Chart.js + reader pèsent lourd)
- [ ] **Lazy loading images** : `<img loading="lazy" />` sur covers
- [ ] **React Query / SWR** : éliminer le re-fetch à chaque mount
- [ ] **`useMemo` / `useCallback`** dans `NavigationBar` (re-renders fréquents)

### 6.4 Docs & process

- [ ] **README.md** : instructions de setup, lancement, tests
- [ ] **CONTRIBUTING.md** : conventions de code, branches
- [ ] **`.env.example`** : variables d'environnement requises
- [ ] **Migration vers PostgreSQL** : config présente mais commentée — `settings.py:100-109`
- [ ] **Redis cache** : config présente mais commentée — `settings.py:232-237`

---

## 7. P3 — Évolutions / nouvelles features

- [ ] **PWA** + lecture offline (service worker)
- [ ] **Recommandations** : collaborative filtering basique (genres préférés + mangas similaires)
- [ ] **Login social** : Google / Discord (boutons déjà présents dans `LoginForm.jsx`)
- [ ] **Système d'abonnement premium** (champ `is_premium` existe déjà)
- [ ] **Import depuis MangaDex API** (champs `external_id`, `external_source` prêts)
- [ ] **Notifications push** WebPush + Service Worker
- [ ] **Notifications temps réel** : WebSocket / SSE (au lieu du polling)
- [ ] **Application mobile** React Native (API réutilisable)
- [ ] **Docker + docker-compose** pour onboarding rapide
- [ ] **CI/CD** GitHub Actions : tests, lint, build
- [ ] **Documentation API enrichie** via Swagger (déjà activé)
- [ ] **Internationalisation** : déjà 4 langues dans la NavigationBar (fr/en/es/ja), il manque les traductions

---

## 8. Score global & verdict

> Projet **riche fonctionnellement** (19 modèles, 30+ endpoints, dashboard admin complet, dark/light + responsive),
> mais **non livrable en l'état** à cause de la sécurité config et du lecteur manga mocké.

### Ordre de priorité d'attaque suggéré

1. **Section 4.4** (hygiène Git) — 10 min, élimine fuite de la DB et secrets potentiels du repo
2. **Section 4.1** (sécurité critique) — 2 h, débloque tout déploiement
3. **Section 4.3** (lecteur manga réel) — 1 jour, débloque la valeur produit
4. **Section 5.1 & 5.2** (bugs & dette) — 1-2 jours, stabilise
5. **Section 5.3** (tests) — 2-3 jours, sécurise les évolutions
6. **Section 6** (améliorations) — 1 semaine
7. **Section 7** (évolutions) — backlog continu

---

_Ce plan est vivant : mettez à jour les cases au fur et à mesure. À chaque PR, référencez l'item ici (`Fixes : section 4.1 — A05 CORS`)._
