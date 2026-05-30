// src/components/manga/NewSeries.jsx - Mangafire-style "New Release" horizontal swiper
import React, { useState, useEffect, useRef } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { mangaService } from '../../services/mangaService';
import LoadingSpinner from '../common/LoadingSpinner';

const NewSeries = () => {
  const [newManga, setNewManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowRef = useRef(null);

  useEffect(() => {
    fetchNewSeries();
  }, []);

  const fetchNewSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mangaService.getNewSeries();
      const mangaData = response.data?.results || response.data || [];
      setNewManga(mangaData);
    } catch (err) {
      console.error('Error fetching new series:', err);
      setError('Failed to load new series');
      setNewManga([]);
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

  const scroll = (delta) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <Container className="mf-section">
        <LoadingSpinner text="Loading new series..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mf-section">
        <div className="text-center py-4 text-muted">
          <i className="fas fa-exclamation-triangle fa-2x mb-2 d-block"></i>
          <p className="mb-3">{error}</p>
          <Button variant="primary" size="sm" onClick={fetchNewSeries}>
            <i className="fas fa-redo me-1"></i> Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mf-section">
      <div className="mf-section-head">
        <h2>New Release</h2>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="mf-trending-arrow"
            style={{ width: 32, height: 32, background: 'var(--mf-tag-bg)', color: 'var(--bs-body-color)' }}
            onClick={() => scroll(-400)}
            aria-label="Scroll left"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            type="button"
            className="mf-trending-arrow"
            style={{ width: 32, height: 32, background: 'var(--mf-tag-bg)', color: 'var(--bs-body-color)' }}
            onClick={() => scroll(400)}
            aria-label="Scroll right"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
          <Link to="/new" className="mf-btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
            View All <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>

      {newManga.length === 0 ? (
        <div className="text-center py-4 text-muted">
          <i className="fas fa-plus-circle fa-2x mb-2 d-block"></i>
          <p className="mb-0">No new series available</p>
        </div>
      ) : (
        <div className="mf-small-row" ref={rowRef}>
          {newManga.slice(0, 20).map((manga) => (
            <Link to={`/manga/${manga.slug}`} className="mf-small-card" key={manga.id}>
              <div className="mf-small-poster">
                <img
                  src={getImageUrl(manga.cover_image)}
                  alt={manga.title}
                  onError={(e) => { e.target.src = '/placeholder-cover.jpg'; }}
                />
              </div>
              <div className="mf-small-title" title={manga.title}>
                {manga.title || 'Unknown Title'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
};

export default NewSeries;
