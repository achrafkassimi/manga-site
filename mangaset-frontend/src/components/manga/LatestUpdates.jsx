// src/components/manga/LatestUpdates.jsx - Mangafire-style Recently Updated grid
import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { mangaService } from '../../services/mangaService';
import LoadingSpinner from '../common/LoadingSpinner';

const LANG_DEFAULT = 'EN';

const LatestUpdates = () => {
  const [latestManga, setLatestManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    fetchLatestUpdates();
  }, []);

  const fetchLatestUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mangaService.getLatestUpdates();
      const mangaData = response.data?.results || response.data || [];
      setLatestManga(mangaData);
    } catch (err) {
      console.error('Error fetching latest updates:', err);
      setError('Failed to load latest updates');
      setLatestManga([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const diff = Date.now() - date.getTime();
      if (Number.isNaN(diff)) return '';
      const min = Math.floor(diff / 60000);
      const hr = Math.floor(min / 60);
      const day = Math.floor(hr / 24);
      if (min < 1) return 'Just now';
      if (min < 60) return `${min} minutes ago`;
      if (hr < 24) return `${hr} hour${hr > 1 ? 's' : ''} ago`;
      if (day < 30) return `${day} day${day > 1 ? 's' : ''} ago`;
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-cover.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl =
      import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
    return imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
  };

  const getChapterList = (manga) => {
    if (manga.recent_chapters && Array.isArray(manga.recent_chapters) && manga.recent_chapters.length > 0) {
      return manga.recent_chapters.slice(0, 3);
    }
    if (manga.latest_chapter) {
      const c = manga.latest_chapter;
      return [{
        id: c.id,
        chapter_number: c.chapter_number,
        language: c.language || LANG_DEFAULT,
        updated_at: c.updated_at || manga.updated_at
      }];
    }
    return [];
  };

  const getType = (manga) => {
    const t = (manga.type || 'manga').toLowerCase();
    if (t === 'manhua') return 'Manhua';
    if (t === 'manhwa') return 'Manhwa';
    if (t === 'novel') return 'Novel';
    return 'Manga';
  };

  const filtered = latestManga.filter((m) => {
    if (tab === 'all') return true;
    return (m.type || 'manga').toLowerCase() === tab;
  });

  if (loading) {
    return (
      <Container className="mf-section">
        <LoadingSpinner text="Loading latest updates..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mf-section">
        <div className="text-center py-4 text-muted">
          <i className="fas fa-exclamation-triangle fa-2x mb-2 d-block"></i>
          <p className="mb-3">{error}</p>
          <Button variant="primary" size="sm" onClick={fetchLatestUpdates}>
            <i className="fas fa-redo me-1"></i> Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mf-section">
      <div className="mf-section-head">
        <h2>Recently Updated</h2>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="mf-tabs">
            <button className={`mf-tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All</button>
            <button className={`mf-tab ${tab === 'manga' ? 'active' : ''}`} onClick={() => setTab('manga')}>Manga</button>
            <button className={`mf-tab ${tab === 'manhua' ? 'active' : ''}`} onClick={() => setTab('manhua')}>Manhua</button>
            <button className={`mf-tab ${tab === 'manhwa' ? 'active' : ''}`} onClick={() => setTab('manhwa')}>Manhwa</button>
          </div>
          {/* <Link to="/latest" className="mf-btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
            View All <i className="fas fa-arrow-right"></i>
          </Link> */}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-4 text-muted">
          <i className="fas fa-calendar-times fa-2x mb-2 d-block"></i>
          <p className="mb-0">No recent updates</p>
        </div>
      ) : (
        <div className="mf-updated-grid">
          {filtered.slice(0, 12).map((manga) => {
            const chapters = getChapterList(manga);
            return (
              <div className="mf-updated-card" key={manga.id}>
                <Link to={`/manga/${manga.slug}`} className="mf-updated-poster">
                  <img
                    src={getImageUrl(manga.cover_image)}
                    alt={manga.title}
                    onError={(e) => { e.target.src = '/placeholder-cover.jpg'; }}
                  />
                </Link>
                <div className="mf-updated-body">
                  <span className="mf-updated-type">{getType(manga)}</span>
                  <Link to={`/manga/${manga.slug}`} className="mf-updated-title" title={manga.title}>
                    {manga.title || 'Unknown Title'}
                  </Link>
                  {chapters.length > 0 ? (
                    <ul className="mf-chap-list">
                      {chapters.map((c, idx) => (
                        <li key={c.id || idx}>
                          <Link to={`/read/${manga.slug}/${c.id || c.chapter_number}`}>
                            <span>
                              <span className="mf-chap-num">Chap {c.chapter_number}</span>
                              <span className="mf-lang-flag">{(c.language || LANG_DEFAULT).toUpperCase()}</span>
                            </span>
                            <span>{formatTimeAgo(c.updated_at || manga.updated_at)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <small className="text-muted">No chapter yet</small>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default LatestUpdates;
