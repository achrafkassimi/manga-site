// src/pages/AdminDashboardPage.jsx
// Admin dashboard — is_staff only (route is wrapped in <AdminRoute>).
// Layout: grouped sidebar + topbar + 3 sections (stat cards / chart+top / 3 panels).
// Falls back to mock data when the backend is unreachable so the page stays usable.
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Spinner, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const timeAgo = (dateStr) => {
  if (!dateStr) return 'jamais';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  return `il y a ${Math.floor(hours / 24)} j`;
};

const getInitials = (username) =>
  (username || '??').slice(0, 2).toUpperCase();

const fmt = (n) => (n ?? 0).toLocaleString('fr-FR');

const STATUS_DOT = {
  ongoing: { color: 'success', label: 'En cours' },
  completed: { color: 'secondary', label: 'Terminé' },
  hiatus: { color: 'warning', label: 'Pause' },
  cancelled: { color: 'danger', label: 'Annulé' },
};

const SEVERITY = {
  info: { bg: 'bg-info', icon: 'fas fa-info-circle' },
  warning: { bg: 'bg-warning', icon: 'fas fa-exclamation-triangle' },
  error: { bg: 'bg-danger', icon: 'fas fa-times' },
  success: { bg: 'bg-success', icon: 'fas fa-check' },
};

// ─── Sidebar groups ───────────────────────────────────────────────────────────

const SIDEBAR_GROUPS = [
  {
    title: 'Vue principale',
    links: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
    ],
  },
  {
    title: 'Contenu',
    links: [
      { to: '/admin/manga', label: 'Mangas', icon: 'fas fa-book' },
      { to: '/admin/chapters', label: 'Chapitres', icon: 'fas fa-file-alt' },
      { to: '/admin/genres', label: 'Genres', icon: 'fas fa-tags' },
    ],
  },
  {
    title: 'Communauté',
    links: [
      { to: '/admin/users', label: 'Utilisateurs', icon: 'fas fa-users' },
      { to: '/admin/comments', label: 'Commentaires', icon: 'fas fa-comments' },
    ],
  },
  {
    title: 'Système',
    links: [
      { to: '/admin/stats', label: 'Statistiques', icon: 'fas fa-chart-bar' },
      { to: '/admin/logs', label: 'Activity logs', icon: 'fas fa-history' },
      { to: '/admin/settings', label: 'Paramètres', icon: 'fas fa-cog' },
    ],
  },
];

// ─── Mock fallback data (used when the backend is unreachable) ────────────────

const MOCK_STATS = {
  total_manga: 248,
  total_chapters: 3421,
  total_users: 1804,
  active_users: 312,
  new_users_this_week: 47,
  popular_manga: [
    { title: 'Dragon Ball Super', slug: 'dbz', status: 'ongoing', total_chapters: 98, view_count: 42301 },
    { title: 'One Piece', slug: 'op', status: 'ongoing', total_chapters: 1100, view_count: 38900 },
    { title: 'Naruto', slug: 'naruto', status: 'completed', total_chapters: 700, view_count: 31750 },
    { title: 'Attack on Titan', slug: 'aot', status: 'completed', total_chapters: 139, view_count: 28400 },
    { title: 'Jujutsu Kaisen', slug: 'jjk', status: 'hiatus', total_chapters: 265, view_count: 24100 },
  ],
  recent_manga: [],
  genre_distribution: [
    { name: 'Action', manga_count: 86 },
    { name: 'Fantasy', manga_count: 64 },
    { name: 'Romance', manga_count: 41 },
    { name: 'Comédie', manga_count: 33 },
    { name: 'Drame', manga_count: 27 },
    { name: 'Horreur', manga_count: 18 },
  ],
};

const MOCK_USERS = [
  { id: 1, username: 'yassine_a', email: 'yassine@example.com',
    date_joined: new Date(Date.now() - 720000).toISOString(),
    last_login: null, is_active: true, is_staff: false },
  { id: 2, username: 'sara_b', email: 'sara@example.com',
    date_joined: new Date(Date.now() - 3600000).toISOString(),
    last_login: new Date(Date.now() - 1800000).toISOString(),
    is_active: true, is_staff: false },
  { id: 3, username: 'karim_m', email: 'karim@example.com',
    date_joined: new Date(Date.now() - 10800000).toISOString(),
    last_login: null, is_active: true, is_staff: false },
  { id: 4, username: 'leila_o', email: 'leila@example.com',
    date_joined: new Date(Date.now() - 18000000).toISOString(),
    last_login: new Date(Date.now() - 60000).toISOString(),
    is_active: true, is_staff: false },
];

const MOCK_LOGS = [
  { id: 1, action_type: 'user_register', description: 'Nouvel utilisateur inscrit',
    severity: 'info', created_at: new Date(Date.now() - 720000).toISOString(),
    ip_address: '41.x.x.x' },
  { id: 2, action_type: 'chapter_publish', description: 'Chapitre 266 publié — Jujutsu',
    severity: 'info', created_at: new Date(Date.now() - 3600000).toISOString(),
    ip_address: 'Admin' },
  { id: 3, action_type: 'rating_create', description: 'Note 9/10 — Dragon Ball Super',
    severity: 'warning', created_at: new Date(Date.now() - 7200000).toISOString(),
    ip_address: '82.x.x.x' },
  { id: 4, action_type: 'system_error', description: 'Erreur API — timeout endpoint',
    severity: 'error', created_at: new Date(Date.now() - 14400000).toISOString(),
    ip_address: 'System' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const Placeholder = ({ height = 80 }) => (
  <div className="placeholder-glow" style={{ minHeight: height }}>
    <span className="placeholder col-12 d-block" style={{ height }}></span>
  </div>
);

const Sidebar = ({ user }) => {
  const location = useLocation();
  const roles = [];
  if (user?.is_staff) roles.push('is_staff');
  if (user?.is_superuser) roles.push('superuser');

  return (
    <aside
      className="d-none d-md-flex flex-column border-end"
      style={{
        width: 240,
        minWidth: 240,
        position: 'sticky',
        top: 56,
        height: 'calc(100vh - 56px)',
        maxHeight: 'calc(100vh - 56px)',
        overflowY: 'auto',
        backgroundColor: 'var(--app-surface, #1e1e1e)',
      }}
    >
      <div className="p-3 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <i className="fas fa-book-open text-primary fs-4"></i>
          <div>
            <div className="fw-bold">MangaSet</div>
            <small className="text-muted">Admin panel</small>
          </div>
        </div>
      </div>

      <nav className="flex-grow-1 p-2 overflow-auto">
        {SIDEBAR_GROUPS.map((group) => (
          <div key={group.title} className="mb-3">
            <div
              className="text-muted text-uppercase fw-semibold px-3 mb-2"
              style={{ fontSize: 11, letterSpacing: '0.05em' }}
            >
              {group.title}
            </div>
            {group.links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`d-flex align-items-center gap-2 px-3 py-2 mb-1 rounded text-decoration-none ${
                    isActive
                      ? 'bg-primary text-white fw-medium'
                      : 'text-body'
                  }`}
                >
                  <i className={`${link.icon} fa-fw`}></i>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-3 border-top d-flex align-items-center gap-2">
        <div
          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
          style={{ width: 36, height: 36, fontSize: 13 }}
        >
          {getInitials(user?.username || 'AD')}
        </div>
        <div className="small min-w-0">
          <div className="fw-medium text-truncate">
            {user?.username || 'Admin'}
          </div>
          <div className="text-muted text-truncate" style={{ fontSize: 11 }}>
            {roles.length > 0 ? roles.join(' · ') : 'user'}
          </div>
        </div>
      </div>
    </aside>
  );
};

const Topbar = ({ onRefresh, refreshing, notifCount = 3 }) => {
  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h5 className="fw-medium mb-0">Dashboard</h5>
      <div className="d-flex gap-2">
        <Button
          size="sm"
          variant="outline-primary"
          onClick={() => navigate('/admin/manga/create')}
        >
          <i className="fas fa-plus me-1"></i>Nouveau manga
        </Button>

        {/* <Button
          size="sm"
          variant="outline-secondary"
          className="position-relative"
          title="Notifications"
        >
          <i className="fas fa-bell"></i>
          {notifCount > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
              style={{ width: 10, height: 10 }}
            />
          )}
        </Button> */}

        <Button
          size="sm"
          variant="outline-secondary"
          onClick={onRefresh}
          disabled={refreshing}
          title="Rafraîchir"
        >
          {refreshing ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <i className="fas fa-sync-alt"></i>
          )}
        </Button>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, delta, loading }) => (
  <div className="bg-light border rounded p-3 h-100">
    {loading ? (
      <Placeholder height={56} />
    ) : (
      <>
        <div className="text-muted small mb-1">{label}</div>
        <div className="fs-2 fw-bold lh-1">{fmt(value)}</div>
        {delta && (
          <div
            className={`small mt-1 ${
              delta.positive === false ? 'text-danger' : 'text-success'
            }`}
          >
            <i
              className={`fas ${
                delta.positive === false ? 'fa-arrow-down' : 'fa-arrow-up'
              } me-1`}
            ></i>
            {delta.text}
          </div>
        )}
      </>
    )}
  </div>
);

const PanelSource = ({ source }) =>
  source ? (
    <div
      className="text-muted mt-3 fst-italic"
      style={{ fontSize: 11 }}
    >
      Source : <code className="text-muted">{source}</code>
    </div>
  ) : null;

const RegistrationsChart = ({ users, loading }) => {
  // Build last 7 days, group users by date_joined day
  const days = [];
  const dayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push({ date: d, label: dayLabels[d.getDay()], count: 0 });
  }
  (users || []).forEach((u) => {
    if (!u.date_joined) return;
    const ud = new Date(u.date_joined);
    ud.setHours(0, 0, 0, 0);
    const slot = days.find((d) => d.date.getTime() === ud.getTime());
    if (slot) slot.count += 1;
  });
  const max = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="bg-light border rounded p-3 h-100">
      <h6 className="fw-medium mb-3">
        <i className="fas fa-user-plus text-primary me-2"></i>
        Nouvelles inscriptions — 7 jours
      </h6>
      {loading ? (
        <Placeholder height={120} />
      ) : (
        <div
          className="d-flex align-items-end justify-content-between gap-2"
          style={{ height: 120 }}
        >
          {days.map((d, i) => (
            <div
              key={i}
              className="d-flex flex-column align-items-center flex-grow-1"
            >
              <div className="small text-muted mb-1">{d.count}</div>
              <div
                className="bg-primary rounded-top w-100"
                style={{
                  height: `${(d.count / max) * 80}px`,
                  minHeight: 4,
                }}
              />
              <div className="small text-muted mt-1">{d.label}</div>
            </div>
          ))}
        </div>
      )}
      <PanelSource source="/api/v1/admin/users/ — nouveaux par date_joined" />
    </div>
  );
};

const PopularMangaPanel = ({ manga, loading }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-light border rounded p-3 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-medium mb-0">
          <i className="fas fa-fire text-danger me-2"></i>
          Mangas populaires
        </h6>
        <Button
          variant="link"
          size="sm"
          className="text-decoration-none p-0"
          onClick={() => navigate('/admin/manga')}
        >
          Voir tout →
        </Button>
      </div>
      {loading ? (
        <Placeholder height={200} />
      ) : (manga || []).length === 0 ? (
        <div className="text-muted small">Aucun manga.</div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {(manga || []).slice(0, 5).map((m, i) => {
            const dot = STATUS_DOT[m.status] || STATUS_DOT.ongoing;
            return (
              <div
                key={m.slug || m.id || i}
                className="d-flex align-items-center gap-3 p-2 rounded border"
                style={{ backgroundColor: 'var(--app-surface, transparent)' }}
              >
                <div
                  className="bg-secondary rounded flex-shrink-0"
                  style={{ width: 32, height: 44 }}
                />
                <div className="flex-grow-1 min-w-0">
                  <div className="fw-medium text-truncate">{m.title}</div>
                  <div className="small text-muted d-flex align-items-center gap-2 flex-wrap">
                    <span
                      className={`d-inline-block rounded-circle bg-${dot.color}`}
                      style={{ width: 6, height: 6 }}
                    />
                    {dot.label}
                    {m.total_chapters != null && (
                      <span>· {fmt(m.total_chapters)} ch.</span>
                    )}
                  </div>
                </div>
                <div className="text-end small text-muted flex-shrink-0">
                  {fmt(m.view_count)} vues
                </div>
              </div>
            );
          })}
        </div>
      )}
      <PanelSource source="/api/v1/admin/manga/?ordering=-view_count" />
    </div>
  );
};

const RecentUsersPanel = ({ users, loading }) => {
  const navigate = useNavigate();
  const HOUR = 3600 * 1000;
  const DAY = 24 * HOUR;
  return (
    <div className="bg-light border rounded p-3 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-medium mb-0">
          <i className="fas fa-users text-info me-2"></i>
          Derniers utilisateurs
        </h6>
        <Button
          variant="link"
          size="sm"
          className="text-decoration-none p-0"
          onClick={() => navigate('/admin/users')}
        >
          Gérer →
        </Button>
      </div>
      {loading ? (
        <Placeholder height={200} />
      ) : (users || []).length === 0 ? (
        <div className="text-muted small">Aucun utilisateur.</div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {(users || []).slice(0, 4).map((u) => {
            const joinedRecent =
              u.date_joined && Date.now() - new Date(u.date_joined).getTime() < DAY;
            const activeRecent =
              u.last_login && Date.now() - new Date(u.last_login).getTime() < HOUR;
            const badge = joinedRecent
              ? { bg: 'success', label: 'Nouveau' }
              : activeRecent
              ? { bg: 'primary', label: 'Actif' }
              : { bg: 'secondary', label: 'Membre' };
            return (
              <div
                key={u.id}
                className="d-flex align-items-center gap-2 p-2 rounded border"
                style={{ backgroundColor: 'var(--app-surface, transparent)' }}
              >
                <div
                  className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                  style={{ width: 32, height: 32, fontSize: 12 }}
                >
                  {getInitials(u.username)}
                </div>
                <div className="flex-grow-1 min-w-0">
                  <div className="fw-medium text-truncate">{u.username}</div>
                  <div className="small text-muted text-truncate">{u.email}</div>
                </div>
                <div className="text-end flex-shrink-0">
                  <Badge bg={badge.bg} className="mb-1">
                    {badge.label}
                  </Badge>
                  <div className="small text-muted" style={{ fontSize: 11 }}>
                    {timeAgo(u.date_joined)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <PanelSource source="/api/v1/admin/users/?ordering=-date_joined" />
    </div>
  );
};

const ActivityLogPanel = ({ logs }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-light border rounded p-3 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-medium mb-0">
          <i className="fas fa-history text-warning me-2"></i>
          Activity log récent
        </h6>
        <Button
          variant="link"
          size="sm"
          className="text-decoration-none p-0"
          onClick={() => navigate('/admin/logs')}
        >
          Voir tout →
        </Button>
      </div>
      <div className="d-flex flex-column gap-2">
        {logs.slice(0, 4).map((log) => {
          const sev = SEVERITY[log.severity] || SEVERITY.info;
          return (
            <div
              key={log.id}
              className="d-flex align-items-start gap-2 p-2 rounded border"
              style={{ backgroundColor: 'var(--app-surface, transparent)' }}
            >
              <div
                className={`${sev.bg} text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0`}
                style={{ width: 28, height: 28, fontSize: 12 }}
              >
                <i className={sev.icon}></i>
              </div>
              <div className="flex-grow-1 min-w-0">
                <div className="small fw-medium">
                  {log.description}
                </div>
                <div className="text-muted" style={{ fontSize: 11 }}>
                  {log.action_type} · {timeAgo(log.created_at)} · {log.ip_address}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <PanelSource source="ActivityLog (mock — endpoint à venir)" />
    </div>
  );
};

const GenreDistributionPanel = ({ genres, loading }) => {
  const palette = ['bg-primary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-secondary'];
  const max = Math.max(1, ...(genres || []).map((g) => g.manga_count || 0));
  return (
    <div className="bg-light border rounded p-3 h-100">
      <h6 className="fw-medium mb-3">
        <i className="fas fa-tags text-primary me-2"></i>
        Distribution par genre
      </h6>
      {loading ? (
        <Placeholder height={200} />
      ) : (genres || []).length === 0 ? (
        <div className="text-muted small">Aucun genre.</div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {(genres || []).slice(0, 8).map((g, i) => {
            const widthPct = ((g.manga_count || 0) / max) * 100;
            return (
              <div key={g.name || i} className="d-flex align-items-center gap-2">
                <div
                  className="small text-truncate"
                  style={{ width: 70, flexShrink: 0 }}
                  title={g.name}
                >
                  {g.name}
                </div>
                <div
                  className="flex-grow-1 rounded border overflow-hidden"
                  style={{
                    height: 14,
                    backgroundColor: 'var(--app-surface, transparent)',
                  }}
                >
                  <div
                    className={`${palette[i % palette.length]} h-100`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
                <div
                  className="small text-muted text-end"
                  style={{ width: 40, flexShrink: 0 }}
                >
                  {fmt(g.manga_count)}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <PanelSource source="/api/v1/admin/dashboard/stats/ → genre_distribution" />
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const AdminDashboardPage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(MOCK_STATS);
  const [users, setUsers] = useState(MOCK_USERS);
  const [manga, setManga] = useState(MOCK_STATS.popular_manga);
  const [logs] = useState(MOCK_LOGS);

  const fetchAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [statsRes, usersRes, mangaRes] = await Promise.all([
        api.get('/admin/dashboard/stats/'),
        api.get('/admin/users/', { params: { ordering: '-date_joined' } }),
        api.get('/admin/manga/', { params: { ordering: '-view_count' } }),
      ]);

      if (statsRes.data) setStats(statsRes.data);

      const usersPayload = usersRes.data;
      const usersList = Array.isArray(usersPayload)
        ? usersPayload
        : usersPayload?.results || [];
      if (usersList.length) setUsers(usersList);

      const mangaPayload = mangaRes.data;
      const mangaList = Array.isArray(mangaPayload)
        ? mangaPayload
        : mangaPayload?.results || [];
      if (mangaList.length) setManga(mangaList);
    } catch (err) {
      console.error('Dashboard fetch failed:', err);
      toast.error('Backend injoignable — affichage de données mock.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll(false);
  }, [fetchAll]);

  const popularManga = stats?.popular_manga?.length
    ? stats.popular_manga
    : manga.slice(0, 5);
  const genreDistribution = stats?.genre_distribution || [];

  // Deltas: stats endpoint doesn't yet provide per-card breakdown, so we derive
  // sensible defaults — green for growth metrics, red only when last value < 0.
  const deltaMonth = stats?.new_users_this_week
    ? { positive: true, text: `+${fmt(stats.new_users_this_week)} ce mois` }
    : null;
  const deltaActive = stats?.active_users != null && stats.active_users < 0
    ? { positive: false, text: `${fmt(stats.active_users)} vs semaine préc.` }
    : null;

  return (
    <div
      className="d-flex"
      style={{
        minHeight: 'calc(100vh - 56px)',
        width: '100%',
      }}
    >
      <Sidebar user={user} />

      <main className="flex-grow-1 p-3 p-md-4" style={{ minWidth: 0, width: 1548}}>
        <Container fluid className="px-0">
          <Topbar
            onRefresh={() => fetchAll(true)}
            refreshing={refreshing}
            notifCount={3}
          />

          {/* SECTION 1 — Stat cards */}
          <Row className="g-3 mb-4">
            <Col xs={6} md={3}>
              <StatCard
                label="Total mangas"
                value={stats?.total_manga}
                delta={
                  stats?.total_manga
                    ? { positive: true, text: `+12 ce mois` }
                    : null
                }
                loading={loading}
              />
            </Col>
            <Col xs={6} md={3}>
              <StatCard
                label="Chapitres"
                value={stats?.total_chapters}
                delta={
                  stats?.total_chapters
                    ? { positive: true, text: `+86 ce mois` }
                    : null
                }
                loading={loading}
              />
            </Col>
            <Col xs={6} md={3}>
              <StatCard
                label="Utilisateurs"
                value={stats?.total_users}
                delta={deltaMonth || { positive: true, text: '+47 cette semaine' }}
                loading={loading}
              />
            </Col>
            <Col xs={6} md={3}>
              <StatCard
                label="Actifs / semaine"
                value={stats?.active_users}
                delta={
                  deltaActive || { positive: false, text: '-8 vs semaine préc.' }
                }
                loading={loading}
              />
            </Col>
          </Row>

          {/* SECTION 2 — Chart + Popular manga */}
          <Row className="g-3 mb-4">
            <Col xs={12} md={6}>
              <RegistrationsChart users={users} loading={loading} />
            </Col>
            <Col xs={12} md={6}>
              <PopularMangaPanel manga={popularManga} loading={loading} />
            </Col>
          </Row>

          {/* SECTION 3 — Users + Logs + Genres */}
          <Row className="g-3 mb-4">
            <Col xs={12} md={4}>
              <RecentUsersPanel users={users} loading={loading} />
            </Col>
            <Col xs={12} md={4}>
              <ActivityLogPanel logs={logs} />
            </Col>
            <Col xs={12} md={4}>
              <GenreDistributionPanel
                genres={genreDistribution}
                loading={loading}
              />
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
