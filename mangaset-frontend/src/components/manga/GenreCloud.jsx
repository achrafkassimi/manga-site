// src/components/manga/GenreCloud.jsx - Mangafire-style compact genre pills
import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { mangaService } from '../../services/mangaService';

const GenreCloud = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mangaService.getGenres();
      const genreData = response.data?.results || response.data || [];
      setGenres(genreData);
    } catch (err) {
      console.error('Error fetching genres:', err);
      setError('Failed to load genres');
      setGenres([]);
    } finally {
      setLoading(false);
    }
  };

  const displayed = showAll ? genres : genres.slice(0, 18);

  if (loading) {
    return (
      <Container className="mf-section">
        <div className="mf-section-head">
          <h2>Genres</h2>
        </div>
        <div className="text-center py-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading genres...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mf-section">
        <div className="mf-section-head">
          <h2>Genres</h2>
        </div>
        <div className="text-center py-3 text-muted">
          <i className="fas fa-exclamation-triangle fa-2x mb-2 d-block text-warning"></i>
          <p className="mb-2">{error}</p>
          <Button variant="primary" size="sm" onClick={fetchGenres}>
            <i className="fas fa-redo me-1"></i> Retry
          </Button>
        </div>
      </Container>
    );
  }

  if (genres.length === 0) {
    return (
      <Container className="mf-section">
        <div className="mf-section-head">
          <h2>Genres</h2>
        </div>
        <div className="text-center py-3 text-muted">
          <i className="fas fa-folder-open fa-2x mb-2 d-block"></i>
          <p className="mb-0">No genres available</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mf-section">
      <div className="mf-section-head">
        <h2>Genres</h2>
        {genres.length > 18 && (
          <button
            className="mf-tab"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <><i className="fas fa-chevron-up me-1"></i> Show Less</>
            ) : (
              <><i className="fas fa-chevron-down me-1"></i> Show All ({genres.length})</>
            )}
          </button>
        )}
      </div>

      <div className="mf-genre-row">
        {displayed.map((genre) => (
          <Link
            key={genre.id}
            to={`/search?genre=${encodeURIComponent(genre.name.toLowerCase())}`}
            className="mf-genre-pill"
          >
            <i className="fas fa-hashtag" style={{ fontSize: '0.7rem', opacity: 0.6 }}></i>
            {genre.name}
            {genre.manga_count > 0 && (
              <span className="mf-genre-count">({genre.manga_count})</span>
            )}
          </Link>
        ))}
      </div>
    </Container>
  );
};

export default GenreCloud;
