// src/components/manga/PopularToday.jsx - Mangafire-style "Most Viewed" — vertical poster cards + rank badge
import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { mangaService } from '../../services/mangaService';
import LoadingSpinner from '../common/LoadingSpinner';

const PopularToday = () => {
  const [popularManga, setPopularManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('day');

  useEffect(() => {
    fetchPopularManga();
  }, []);

  const fetchPopularManga = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mangaService.getPopularManga();
      const mangaData = response.data?.results || response.data || [];
      setPopularManga(mangaData);
    } catch (err) {
      console.error('Error fetching popular manga:', err);
      setError('Failed to load popular manga');
      setPopularManga([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-cover.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl =
      import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
    return imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
  };

  // Period filter currently shows same list (backend can add time-bucketed endpoints later)
  const items = popularManga.slice(0, 7);

  if (loading) {
    return (
      <Container className="mf-section">
        <LoadingSpinner text="Loading most viewed..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mf-section">
        <div className="text-center py-4 text-muted">
          <i className="fas fa-exclamation-triangle fa-2x mb-2 d-block"></i>
          <p className="mb-3">{error}</p>
          <Button variant="primary" size="sm" onClick={fetchPopularManga}>
            <i className="fas fa-redo me-1"></i> Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mf-section">
      <div className="mf-section-head">
        <h2>Most Viewed</h2>
        <div className="mf-tabs">
          <button className={`mf-tab ${period === 'day' ? 'active' : ''}`} onClick={() => setPeriod('day')}>Day</button>
          <button className={`mf-tab ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>Week</button>
          <button className={`mf-tab ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>Month</button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-4 text-muted">
          <i className="fas fa-search fa-2x mb-2 d-block"></i>
          <p className="mb-0">No popular manga available</p>
        </div>
      ) : (
        <div className="mf-mv-row">
          {items.map((manga, idx) => {
            const rank = idx + 1;
            return (
              <Link to={`/manga/${manga.slug}`} className="mf-mv-card" key={manga.id}>
                <div className="mf-mv-poster">
                  <span className={`mf-rank-badge ${rank <= 3 ? 'top3' : ''}`}>{rank}</span>
                  <img
                    src={getImageUrl(manga.cover_image)}
                    alt={manga.title}
                    onError={(e) => { e.target.src = '/placeholder-cover.jpg'; }}
                  />
                </div>
                <div className="mf-mv-title" title={manga.title}>
                  {manga.title || 'Unknown Title'}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default PopularToday;
