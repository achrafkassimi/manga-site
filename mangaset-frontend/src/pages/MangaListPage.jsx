// src/pages/MangaListPage.jsx - Liste de tous les manga avec filtre de statut en grille
import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Badge,
  Card,
  Form,
  InputGroup,
  Button,
  ButtonGroup,
  Pagination,
  Alert
} from 'react-bootstrap';
import { mangaService } from '../services/mangaService';
import MangaCard from '../components/manga/MangaCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const STATUS_FILTERS = [
  { key: 'all', label: 'Tous', icon: 'fa-globe', variant: 'secondary' },
  { key: 'ongoing', label: 'En cours', icon: 'fa-play-circle', variant: 'success' },
  { key: 'hiatus', label: 'En pause', icon: 'fa-pause-circle', variant: 'warning' },
  { key: 'completed', label: 'Termines', icon: 'fa-check-circle', variant: 'primary' }
];

const PAGE_SIZE = 24;

const MangaListPage = () => {
  const [allManga, setAllManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const collected = [];
        let nextPage = 1;
        let hasMore = true;

        while (hasMore && nextPage <= 20) {
          const response = await mangaService.getAllManga({
            page: nextPage,
            page_size: 100
          });
          const payload = response.data || {};
          const results = Array.isArray(payload)
            ? payload
            : payload.results || [];
          collected.push(...results);
          hasMore = Boolean(payload.next) && results.length > 0;
          nextPage += 1;
        }

        if (!cancelled) {
          setAllManga(collected);
        }
      } catch (err) {
        console.error('Failed to load manga list:', err);
        if (!cancelled) {
          setError('Impossible de charger la liste des manga.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  // Apply search first, so status counts reflect current query
  const searchedManga = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allManga;
    return allManga.filter((m) => {
      const title = (m.title || '').toLowerCase();
      const author = (m.author || '').toLowerCase();
      return title.includes(q) || author.includes(q);
    });
  }, [allManga, search]);

  const statusCounts = useMemo(() => {
    const counts = { all: searchedManga.length, ongoing: 0, hiatus: 0, completed: 0 };
    searchedManga.forEach((m) => {
      const s = (m.status || '').toLowerCase();
      if (counts[s] !== undefined) counts[s] += 1;
    });
    return counts;
  }, [searchedManga]);

  const filteredManga = useMemo(() => {
    const byStatus =
      statusFilter === 'all'
        ? searchedManga
        : searchedManga.filter(
            (m) => (m.status || '').toLowerCase() === statusFilter
          );

    return [...byStatus].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (
            (b.rating || b.average_rating || 0) -
            (a.rating || a.average_rating || 0)
          );
        case 'views':
          return (b.view_count || 0) - (a.view_count || 0);
        case 'chapters':
          return (b.total_chapters || 0) - (a.total_chapters || 0);
        case 'recent':
          return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
        case 'title':
        default:
          return (a.title || '').localeCompare(b.title || '');
      }
    });
  }, [searchedManga, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredManga.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredManga.slice(start, start + PAGE_SIZE);
  }, [filteredManga, page]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, statusFilter]);

  if (loading) {
    return (
      <Container className="py-5">
        <LoadingSpinner text="Chargement de tous les manga..." />
      </Container>
    );
  }

  return (
    <Container className="py-4 manga-list-page">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="display-6 mb-2">
          <i className="fas fa-book text-primary me-2"></i>
          Manga Liste
        </h1>
        <p className="text-muted mb-0">
          Decouvrez tous les <strong>{allManga.length}</strong> manga de notre bibliotheque
        </p>
      </div>

      {/* Toolbar */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="search"
                  placeholder="Rechercher par titre ou auteur..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-sort"></i>
                </InputGroup.Text>
                <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="title">Titre (A-Z)</option>
                  <option value="rating">Mieux notes</option>
                  <option value="views">Plus populaires</option>
                  <option value="chapters">Plus de chapitres</option>
                  <option value="recent">Derniere mise a jour</option>
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>

          {/* Status filter buttons (replaces the Groupes/Grille toggle) */}
          <div className="mt-3 d-flex flex-wrap justify-content-center">
            <ButtonGroup className="status-filter-group flex-wrap">
              {STATUS_FILTERS.map((f) => (
                <Button
                  key={f.key}
                  variant={
                    statusFilter === f.key ? f.variant : `outline-${f.variant}`
                  }
                  onClick={() => setStatusFilter(f.key)}
                  className="d-flex align-items-center"
                >
                  <i className={`fas ${f.icon} me-2`}></i>
                  <span>{f.label}</span>
                  {/* <Badge
                    bg={statusFilter === f.key ? 'light' : f.variant}
                    text={statusFilter === f.key ? 'dark' : 'light'}
                    pill
                    className="ms-2"
                  >
                    {statusCounts[f.key] || 0}
                  </Badge> */}
                </Button>
              ))}
            </ButtonGroup>
          </div>
          
        </Card.Body>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="danger" className="text-center">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Empty state */}
      {!error && filteredManga.length === 0 && (
        <Alert variant="info" className="text-center">
          <i className="fas fa-info-circle me-2"></i>
          Aucun manga ne correspond a vos criteres.
        </Alert>
      )}

      {/* Grid view with pagination */}
      {!error && filteredManga.length > 0 && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <small className="text-muted">
              Page {page} sur {totalPages} - {filteredManga.length} manga
            </small>
          </div>
          <Row>
            {paginated.map((manga) => (
              <Col key={manga.id} xl={3} lg={4} md={6} className="mb-4">
                <MangaCard manga={manga} />
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                />
                <Pagination.Prev
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (n) => n === 1 || n === totalPages || Math.abs(n - page) <= 2
                  )
                  .map((n, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && n - prev > 1;
                    return (
                      <React.Fragment key={n}>
                        {showEllipsis && <Pagination.Ellipsis disabled />}
                        <Pagination.Item active={n === page} onClick={() => setPage(n)}>
                          {n}
                        </Pagination.Item>
                      </React.Fragment>
                    );
                  })}
                <Pagination.Next
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                />
                <Pagination.Last
                  disabled={page === totalPages}
                  onClick={() => setPage(totalPages)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default MangaListPage;
