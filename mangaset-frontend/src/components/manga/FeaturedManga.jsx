// src/components/manga/FeaturedManga.jsx - Mangafire-style Top Trending (3 cards per page)
import React, { useState, useEffect, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { mangaService } from '../../services/mangaService';
import LoadingSpinner from '../common/LoadingSpinner';

const CARDS_PER_PAGE = 3;

const FeaturedManga = () => {
  const [featuredManga, setFeaturedManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchFeaturedManga();
  }, []);

  const fetchFeaturedManga = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mangaService.getFeaturedManga();
      const mangaData = response.data?.results || response.data || [];
      setFeaturedManga(mangaData);
    } catch (err) {
      console.error('Error fetching featured manga:', err);
      setError('Failed to load featured manga');
      setFeaturedManga([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-hero.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl =
      import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
    return imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
  };

  const totalPages = Math.max(1, Math.ceil(featuredManga.length / CARDS_PER_PAGE));

  const goPrev = useCallback(() => setPage((p) => (p - 1 + totalPages) % totalPages), [totalPages]);
  const goNext = useCallback(() => setPage((p) => (p + 1) % totalPages), [totalPages]);

  const getStatusLabel = (status) => {
    const s = (status || 'ongoing').toLowerCase();
    if (s === 'completed') return 'Completed';
    if (s === 'hiatus') return 'On Hiatus';
    if (s === 'cancelled') return 'Cancelled';
    return 'Releasing';
  };

  if (loading) {
    return (
      <Container className="my-4">
        <div style={{ minHeight: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner text="Loading featured manga..." />
        </div>
      </Container>
    );
  }

  if (error || featuredManga.length === 0) {
    return (
      <Container className="my-4">
        <div className="text-center text-muted py-4">
          <i className="fas fa-star fa-2x mb-3 d-block"></i>
          <p className="mb-0">{error || 'No featured manga available'}</p>
        </div>
      </Container>
    );
  }

  const start = page * CARDS_PER_PAGE;
  const visible = featuredManga.slice(start, start + CARDS_PER_PAGE);

  return (
    <Container className="my-4 mf-section">
      <div className="mf-trending-wrap">
        <div className="mf-trending-row">
          {visible.map((manga) => (
            <div
              key={manga.id}
              className="mf-trending-card"
              style={{ '--mf-trending-bg': `url(${getImageUrl(manga.cover_image)})` }}
            >
              <div className="mf-tc-info">
                <span className="mf-tc-status">{getStatusLabel(manga.status)}</span>

                <Link to={`/manga/${manga.slug}`} className="mf-tc-title" title={manga.title}>
                  {manga.title || 'Unknown Title'}
                </Link>

                <p className="mf-tc-desc">
                  {manga.description || 'No description available.'}
                </p>

                {manga.total_chapters > 0 && (
                  <div className="mf-tc-chap">
                    Chap {manga.total_chapters}
                    {manga.total_volumes > 0 && <> - Vol {manga.total_volumes}</>}
                  </div>
                )}

                {manga.genres && manga.genres.length > 0 && (
                  <div className="mf-tc-genres">
                    {manga.genres.slice(0, 3).map((g, idx) => (
                      <React.Fragment key={g.id}>
                        {idx > 0 && <span style={{ opacity: 0.4 }}>·</span>}
                        <Link to={`/search?genre=${encodeURIComponent(g.name.toLowerCase())}`}>
                          {g.name}
                        </Link>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>

              <Link to={`/manga/${manga.slug}`} className="mf-tc-poster">
                <img
                  src={getImageUrl(manga.cover_image)}
                  alt={manga.title}
                  onError={(e) => { e.target.style.opacity = '0.4'; }}
                />
              </Link>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <>
            <button
              type="button"
              className="mf-trending-nav prev"
              onClick={goPrev}
              aria-label="Previous"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              type="button"
              className="mf-trending-nav next"
              onClick={goNext}
              aria-label="Next"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </>
        )}
      </div>
    </Container>
  );
};

export default FeaturedManga;
