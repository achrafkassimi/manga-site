# Liste complète des routes — MangaSet

> Source: `mangaset-frontend/src/App.jsx`
> Dernière mise à jour : 2026-05-30

---

## 🌐 Pages publiques (tous les visiteurs)

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | Accueil (style mangafire — Top Trending, Most Viewed, Recently Updated, New Release, Genres) |
| `/manga-list` | `MangaListPage` | Liste de tous les manga avec filtre de statut |
| `/manga/:slug` | `MangaDetailsPage` | Détails d'un manga (synopsis, chapitres, commentaires) |
| `/read/:slug/:chapterId` | `ReaderPage` | Lecteur de chapitre |

---

## 🔍 Recherche & Browse (tous les visiteurs)

| Route | Composant |
|-------|-----------|
| `/search` | `SearchPage` |
| `/browse` | `SearchPage` |
| `/popular` | `SearchPage` |
| `/latest` | `SearchPage` |
| `/new` | `SearchPage` |
| `/completed` | `SearchPage` |
| `/ongoing` | `SearchPage` |
| `/genre/:genre` | `SearchPage` |
| `/genres` | `SearchPage` |

---

## 🔐 Authentification (visiteurs anonymes)

| Route | Composant |
|-------|-----------|
| `/login` | `LoginForm` |
| `/register` | `RegisterForm` |
| `/forgot-password` | `ForgotPasswordPage` |
| `/reset-password` | `ResetPasswordPage` |

---

## 👤 Compte utilisateur (`ProtectedRoute`)

| Route | Composant | Lien dans le menu user |
|-------|-----------|------------------------|
| `/profile` | `UserProfilePage` | **Profile** |
| `/profile/:tab?` | `UserProfilePage` | (tabs internes du profil) |
| `/profile/notifications` | `UserProfilePage` | **Notification** |
| `/dashboard` | `UserProfilePage` | (alias) |
| `/favorites` | `UserProfilePage` | **Bookmark** |
| `/history` | `UserProfilePage` | **Continue Reading** |
| `/settings` | `UserProfilePage` | **Settings** |
| `/reading-list` | `UserProfilePage` | — |

---

## 🛡 Admin (`is_staff` / `is_superuser`, wrappé par `AdminRoute`)

| Route | Composant | Lien dans le menu user |
|-------|-----------|------------------------|
| `/admin/dashboard` | `AdminDashboardPage` | **Admin Dashboard** |
| `/monitoring` | `MonitoringDashboard` | **Monitoring** |

---

## 📄 Pages statiques

| Route | Composant |
|-------|-----------|
| `/about` | `StaticPage` (page="about") |
| `/contact` | `StaticPage` (page="contact") |
| `/faq` | `StaticPage` (page="faq") |
| `/privacy` | `StaticPage` (page="privacy") |
| `/terms` | `StaticPage` (page="terms") |

---

## 🧪 Développement / Utility

| Route | Composant |
|-------|-----------|
| `/test` | `TestPage` |
| `/loading` | `LoadingPage` |
| `*` | `NotFoundPage` (404 — fallback) |

---

## 🔗 Liens dans le User Dropdown (mode connecté)

```
👤 Profile              → /profile
🕐 Continue Reading     → /history
🔖 Bookmark             → /favorites
🔔 Notification         → /profile/notifications
⚙  Settings             → /settings
─────────────────────── (divider, admin only)
📊 Admin Dashboard      → /admin/dashboard
📈 Monitoring           → /monitoring
───────────────────────
↪ Logout                → handleLogout()
```

---

## 🔗 Liens du Footer

### Quick Links
- Browse Manga → `/browse`
- Popular → `/popular`
- Latest → `/latest`
- Genres → `/genres`

### Account
- Login → `/login`
- Register → `/register`
- Profile → `/profile`
- Favorites → `/favorites`

### Support
- Help Center
- Contact Us → `/contact`
- Bug Report
- FAQ → `/faq`

### Legal
- About Us → `/about`
- Privacy Policy → `/privacy`
- Terms of Service → `/terms`

### Resources (admin only — `is_staff` ou `is_superuser`)
- Test Components → `/test`
- API Documentation
- GitHub Repository
- Site Statistics → `/stats`

### Newsletter "Stay Updated!" (visiteurs anonymes uniquement)
- Formulaire d'inscription newsletter masqué pour utilisateurs connectés

---

## 🔝 Liens dans le Navbar Header

### Desktop (toujours visibles)
- 📖 **MangaSet** (logo) → `/`
- 📚 **Manga Liste** → `/manga-list`
- **Browse ▼** dropdown:
  - Populaires → `/popular`
  - Dernieres MAJ → `/latest`
  - Nouvelles Series → `/new`
  - Terminees → `/completed`
  - Recherche Avancee → `/search`
- **Genres ▼** mega-menu (3 colonnes, 41 genres):
  - Action, Adventure, Avant Garde, Boys Love, Comedy, Demons, Drama, Ecchi, Fantasy, Girls Love, Gourmet, Harem, Horror, Isekai, Iyashikei, Josei, Kids, Magic, Mahou Shoujo, Martial Arts, Mecha, Military, Music, Mystery, Parody, Psychological, Reverse Harem, Romance, School, Sci-Fi, Seinen, Shoujo, Shounen, Slice of Life, Space, Sports, Super Power, Supernatural, Suspense, Thriller, Vampire
  - Chacun route vers `/search?genre=<name_lowercase>`

### Desktop Right Controls (visibles selon état)
- 🔔 **Notification** dropdown (connectés uniquement)
- 🌙/☀ **Theme toggle** (Changer de thème)
- 🇫🇷 **Language selector** (FR / EN / ES / JA)
- 👤 **User dropdown** (connectés) OU **Connexion** button (anonymes)

### Mobile (`d-lg-none`)
- 🔍 Search button (mobile search modal)
- 🌙/☀ Theme toggle (icon only)
- 🔔 Notifications (connectés uniquement)
- ☰ Burger menu (ouvre le Modal mobile)

---

## 🧱 Architecture des wrappers

```
<Router>
  <ThemeProvider>
    <AuthProvider>
      <ErrorBoundary>
        <ScrollToTop />
        <NavigationBar />
        <main>
          <Routes>
            { ... routes publiques ... }
            <ProtectedRoute>{ ... routes user ... }</ProtectedRoute>
            <AdminRoute>{ ... routes admin ... }</AdminRoute>
          </Routes>
        </main>
        <Footer />
        <ToastContainer />
      </ErrorBoundary>
    </AuthProvider>
  </ThemeProvider>
</Router>
```

---

## 📊 Récapitulatif

| Catégorie | Nombre de routes |
|-----------|------------------|
| Pages publiques principales | 4 |
| Routes Search/Browse (alias) | 9 |
| Authentification | 4 |
| User profile (protected) | 8 |
| Admin | 2 |
| Pages statiques | 5 |
| Utility / Dev | 3 |
| **Total** | **35 routes** |
