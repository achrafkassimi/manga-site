// src/pages/MonitoringDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Row, Col, Card, Table, Badge, Spinner,
  Alert, Button, ButtonGroup, Nav, Tab,
} from 'react-bootstrap';
import api from '../services/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => (n ?? 0).toLocaleString();

const pct = (val, total) =>
  total > 0 ? Math.round((val / total) * 100) : 0;

const fmtSeconds = (s) => {
  if (!s) return '0s';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};

const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
};

const SEVERITY_VARIANT = {
  info: 'info',
  warning: 'warning',
  error: 'danger',
  critical: 'dark',
};

const DEVICE_ICON = {
  mobile: 'fas fa-mobile-alt',
  tablet: 'fas fa-tablet-alt',
  desktop: 'fas fa-desktop',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, variant = 'primary' }) {
  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body className="d-flex align-items-center gap-3">
        <div
          className={`rounded-3 p-3 bg-${variant} bg-opacity-10 text-${variant}`}
          style={{ fontSize: '1.5rem', minWidth: 56, textAlign: 'center' }}
        >
          <i className={icon}></i>
        </div>
        <div>
          <div className="text-muted small">{label}</div>
          <div className="fw-bold fs-4">{fmt(value)}</div>
          {sub && <div className="text-muted" style={{ fontSize: '0.78rem' }}>{sub}</div>}
        </div>
      </Card.Body>
    </Card>
  );
}

function MiniBar({ label, count, total, colorClass = 'bg-primary' }) {
  const width = pct(count, total);
  return (
    <div className="mb-2">
      <div className="d-flex justify-content-between small mb-1">
        <span>{label}</span>
        <span className="text-muted">{fmt(count)} ({width}%)</span>
      </div>
      <div className="progress" style={{ height: 8 }}>
        <div
          className={`progress-bar ${colorClass}`}
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
}

function DailyChart({ data }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => d.visits), 1);

  return (
    <div className="d-flex align-items-end gap-1" style={{ height: 80 }}>
      {data.map((d) => (
        <div
          key={d.date}
          className="flex-fill d-flex flex-column align-items-center"
          title={`${d.date}: ${d.visits} visits`}
        >
          <div
            className="w-100 rounded-top bg-primary bg-opacity-75"
            style={{ height: `${(d.visits / max) * 70}px`, minHeight: 2 }}
          ></div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MonitoringDashboard() {
  const [data, setData] = useState(null);
  const [visits, setVisits] = useState([]);
  const [activity, setActivity] = useState([]);
  const [topContent, setTopContent] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [severityFilter, setSeverityFilter] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dashRes, visitsRes, actRes, topRes, usrRes] = await Promise.all([
        api.get('/monitoring/dashboard/'),
        api.get('/monitoring/visits/?days=7'),
        api.get('/monitoring/activity/?days=7'),
        api.get('/monitoring/top-content/'),
        api.get('/monitoring/users/'),
      ]);
      setData(dashRes.data);
      setVisits(visitsRes.data.results ?? []);
      setActivity(actRes.data.results ?? []);
      setTopContent(topRes.data);
      setUserStats(usrRes.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError('Failed to load analytics data. Is the backend running?');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const loadActivity = useCallback(async () => {
    try {
      const res = await api.get(
        `/monitoring/activity/?days=7${severityFilter ? `&severity=${severityFilter}` : ''}`
      );
      setActivity(res.data.results ?? []);
    } catch (_) {}
  }, [severityFilter]);

  useEffect(() => { if (!loading) loadActivity(); }, [severityFilter, loadActivity, loading]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading analytics…</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
        <Button variant="outline-primary" onClick={loadDashboard}>
          <i className="fas fa-redo me-2"></i>Retry
        </Button>
      </Container>
    );
  }

  const { summary, device_breakdown = [], country_breakdown = [], top_manga = [], daily_visits = [] } = data ?? {};
  const totalDevices = device_breakdown.reduce((s, d) => s + d.count, 0);
  const totalCountries = country_breakdown.reduce((s, c) => s + c.count, 0);

  return (
    <Container fluid className="py-4 px-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">
            <i className="fas fa-chart-line text-primary me-2"></i>
            Monitoring Dashboard
          </h2>
          <small className="text-muted">Last 30 days — admin view</small>
        </div>
        <Button variant="outline-secondary" size="sm" onClick={loadDashboard}>
          <i className="fas fa-sync-alt me-1"></i>Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={3}>
          <StatCard icon="fas fa-eye" label="Page Visits" value={summary?.total_visits}
            sub={`${fmt(summary?.unique_visitors)} unique IPs`} variant="primary" />
        </Col>
        <Col xs={6} md={3}>
          <StatCard icon="fas fa-users" label="Registered Users" value={summary?.total_users}
            sub={`+${fmt(summary?.new_users_this_period)} this period`} variant="success" />
        </Col>
        <Col xs={6} md={3}>
          <StatCard icon="fas fa-book-open" label="Chapter Reads" value={summary?.chapter_reads}
            sub={`Avg ${fmtSeconds(summary?.avg_reading_time_seconds)} per read`} variant="warning" />
        </Col>
        <Col xs={6} md={3}>
          <StatCard icon="fas fa-book" label="Content" value={summary?.total_manga}
            sub={`${fmt(summary?.total_chapters)} chapters`} variant="info" />
        </Col>
      </Row>

      {/* Tabs */}
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item><Nav.Link eventKey="overview">Overview</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="visits">Visits</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="content">Top Content</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="users">Users</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="activity">Activity Log</Nav.Link></Nav.Item>
        </Nav>

        <Tab.Content>
          {/* ── Overview ── */}
          <Tab.Pane eventKey="overview">
            <Row className="g-3">
              {/* Daily chart */}
              <Col md={8}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header className="bg-white border-0 fw-semibold">
                    Daily Visits — Last 14 Days
                  </Card.Header>
                  <Card.Body>
                    <DailyChart data={daily_visits} />
                    <div className="d-flex justify-content-between mt-1 text-muted small">
                      <span>{daily_visits[0]?.date}</span>
                      <span>{daily_visits[daily_visits.length - 1]?.date}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Device breakdown */}
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header className="bg-white border-0 fw-semibold">
                    Device Types
                  </Card.Header>
                  <Card.Body>
                    {device_breakdown.map((d) => (
                      <MiniBar
                        key={d.device_type}
                        label={
                          <>
                            <i className={`${DEVICE_ICON[d.device_type] ?? 'fas fa-question'} me-1`}></i>
                            {d.device_type}
                          </>
                        }
                        count={d.count}
                        total={totalDevices}
                      />
                    ))}
                    {device_breakdown.length === 0 && (
                      <p className="text-muted small">No data yet.</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Country breakdown */}
              <Col md={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0 fw-semibold">
                    Top Countries
                  </Card.Header>
                  <Card.Body>
                    {country_breakdown.map((c) => (
                      <MiniBar
                        key={c.country_code}
                        label={`${c.country_name || c.country_code || 'Unknown'}`}
                        count={c.count}
                        total={totalCountries}
                        colorClass="bg-success"
                      />
                    ))}
                    {country_breakdown.length === 0 && (
                      <p className="text-muted small">No geo data yet. Country codes are filled once IP lookup runs.</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Top manga quick view */}
              <Col md={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0 fw-semibold">
                    Most Read Manga (30d)
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table size="sm" className="mb-0">
                      <tbody>
                        {top_manga.slice(0, 8).map((m, i) => (
                          <tr key={i}>
                            <td className="ps-3 text-muted">{i + 1}</td>
                            <td>{m['chapter__manga__title'] ?? m.title}</td>
                            <td className="pe-3 text-end text-muted">{fmt(m.reads)} reads</td>
                          </tr>
                        ))}
                        {top_manga.length === 0 && (
                          <tr><td colSpan={3} className="ps-3 text-muted">No data yet.</td></tr>
                        )}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* ── Visits ── */}
          <Tab.Pane eventKey="visits">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 fw-semibold">
                Recent Site Visits — Last 7 Days ({fmt(visits.length)} shown)
              </Card.Header>
              <div style={{ overflowX: 'auto' }}>
                <Table hover size="sm" className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Time</th>
                      <th>Path</th>
                      <th>IP</th>
                      <th>Device</th>
                      <th>Country</th>
                      <th>User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map((v) => (
                      <tr key={v.id}>
                        <td className="text-muted small">{fmtDate(v.created_at)}</td>
                        <td className="font-monospace small">{v.path}</td>
                        <td className="text-muted small">{v.ip_address}</td>
                        <td>
                          <i className={`${DEVICE_ICON[v.device_type] ?? 'fas fa-question'} me-1 text-secondary`}></i>
                          <span className="small">{v.device_type}</span>
                        </td>
                        <td className="text-muted small">{v.country_code || '—'}</td>
                        <td className="small">{v['user__username'] || <span className="text-muted">anon</span>}</td>
                      </tr>
                    ))}
                    {visits.length === 0 && (
                      <tr><td colSpan={6} className="text-center text-muted py-3">No visits recorded yet.</td></tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Tab.Pane>

          {/* ── Top Content ── */}
          <Tab.Pane eventKey="content">
            <Row className="g-3">
              <Col md={7}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0 fw-semibold">
                    Top Manga by All-Time Views
                  </Card.Header>
                  <div style={{ overflowX: 'auto' }}>
                    <Table hover size="sm" className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th><th>Title</th><th>Status</th><th>Views</th><th>Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(topContent?.top_manga ?? []).map((m, i) => (
                          <tr key={m.id}>
                            <td className="text-muted">{i + 1}</td>
                            <td>{m.title}</td>
                            <td><Badge bg="secondary">{m.status}</Badge></td>
                            <td>{fmt(m.view_count)}</td>
                            <td>{m.average_rating?.toFixed(1) ?? '—'}</td>
                          </tr>
                        ))}
                        {!topContent?.top_manga?.length && (
                          <tr><td colSpan={5} className="text-center text-muted py-3">No data.</td></tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card>
              </Col>
              <Col md={5}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0 fw-semibold">
                    Top Chapters by Views
                  </Card.Header>
                  <div style={{ overflowX: 'auto' }}>
                    <Table hover size="sm" className="mb-0">
                      <thead className="table-light">
                        <tr><th>#</th><th>Chapter</th><th>Views</th></tr>
                      </thead>
                      <tbody>
                        {(topContent?.top_chapters ?? []).map((c, i) => (
                          <tr key={c.id}>
                            <td className="text-muted">{i + 1}</td>
                            <td>
                              <div className="small fw-semibold">{c['manga__title']}</div>
                              <div className="text-muted small">Ch. {c.chapter_number} — {c.title}</div>
                            </td>
                            <td>{fmt(c.view_count)}</td>
                          </tr>
                        ))}
                        {!topContent?.top_chapters?.length && (
                          <tr><td colSpan={3} className="text-center text-muted py-3">No data.</td></tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* ── Users ── */}
          <Tab.Pane eventKey="users">
            <Row className="g-3">
              <Col xs={4}>
                <StatCard icon="fas fa-users" label="Total Users" value={userStats?.total_users} variant="primary" />
              </Col>
              <Col xs={4}>
                <StatCard icon="fas fa-user-check" label="Active Users" value={userStats?.active_users} variant="success" />
              </Col>
              <Col xs={4}>
                <StatCard icon="fas fa-user-shield" label="Staff Users" value={userStats?.staff_users} variant="warning" />
              </Col>

              <Col md={8}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0 fw-semibold">
                    Daily Signups — Last 30 Days
                  </Card.Header>
                  <Card.Body>
                    <DailyChart data={(userStats?.daily_signups_30d ?? []).map((d) => ({ date: d.date, visits: d.signups }))} />
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0 fw-semibold">
                    Most Active Readers
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table size="sm" className="mb-0">
                      <tbody>
                        {(userStats?.most_active_readers ?? []).map((r, i) => (
                          <tr key={i}>
                            <td className="ps-3 text-muted">{i + 1}</td>
                            <td>{r['user__username']}</td>
                            <td className="pe-3 text-end text-muted">{fmt(r.reads)}</td>
                          </tr>
                        ))}
                        {!userStats?.most_active_readers?.length && (
                          <tr><td colSpan={3} className="ps-3 text-muted py-2">No reader data yet.</td></tr>
                        )}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* ── Activity Log ── */}
          <Tab.Pane eventKey="activity">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
                <span className="fw-semibold">Activity Log — Last 7 Days</span>
                <ButtonGroup size="sm">
                  {['', 'info', 'warning', 'error', 'critical'].map((s) => (
                    <Button
                      key={s}
                      variant={severityFilter === s ? 'primary' : 'outline-secondary'}
                      onClick={() => setSeverityFilter(s)}
                    >
                      {s || 'All'}
                    </Button>
                  ))}
                </ButtonGroup>
              </Card.Header>
              <div style={{ overflowX: 'auto' }}>
                <Table hover size="sm" className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Time</th><th>Severity</th><th>Action</th><th>Description</th><th>User</th><th>IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.map((a) => (
                      <tr key={a.id}>
                        <td className="text-muted small">{fmtDate(a.created_at)}</td>
                        <td>
                          <Badge bg={SEVERITY_VARIANT[a.severity] ?? 'secondary'}>
                            {a.severity}
                          </Badge>
                        </td>
                        <td className="small font-monospace">{a.action_type}</td>
                        <td className="small">{a.description}</td>
                        <td className="small">{a['user__username'] || <span className="text-muted">system</span>}</td>
                        <td className="text-muted small">{a.ip_address || '—'}</td>
                      </tr>
                    ))}
                    {activity.length === 0 && (
                      <tr><td colSpan={6} className="text-center text-muted py-3">No activity logged yet.</td></tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}
