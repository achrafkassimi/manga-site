// src/components/manga/GenreCloud.jsx
import React, { useState, useEffect } from 'react';
import { Container, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';

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
      const response = await api.get('/genres/');
      
      // Handle both paginated and non-paginated responses
      const genreData = response.data.results || response.data || [];
      setGenres(genreData);
    } catch (error) {
      console.error('Error fetching genres:', error);
      setError('Failed to load genres');
      setGenres([]);
    } finally {
      setLoading(false);
    }
  };

  const getGenreSize = () => {
    // Return random sizes for visual variety
    const sizes = ['0.875rem', '1rem', '1.125rem', '0.75rem'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  const getGenreColor = (genre) => {
    // Use genre color if available, otherwise use default colors
    if (genre.color_code) {
      return genre.color_code;
    }
    
    // Default color palette
    const colors = [
      '#007bff', '#28a745', '#dc3545', '#ffc107',
      '#17a2b8', '#6610f2', '#e83e8c', '#fd7e14',
      '#20c997', '#6f42c1', '#198754', '#0dcaf0'
    ];
    
    return colors[genre.id % colors.length] || '#007bff';
  };

  const handleRetry = () => {
    fetchGenres();
  };

  const displayedGenres = showAll ? genres : genres.slice(0, 12);

  if (loading) {
    return (
      <section className="genre-cloud-section mb-5">
        <Container>
          <h2 className="section-title mb-4">
            <i className="fas fa-tags text-primary me-2"></i>
            Browse by Genre
          </h2>
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading genres...</span>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="genre-cloud-section mb-5">
        <Container>
          <h2 className="section-title mb-4">
            <i className="fas fa-tags text-primary me-2"></i>
            Browse by Genre
          </h2>
          <div className="text-center py-3">
            <i className="fas fa-exclamation-triangle fa-2x text-warning mb-2"></i>
            <p className="text-muted">{error}</p>
            <Button variant="outline-primary" size="sm" onClick={handleRetry}>
              <i className="fas fa-redo me-1"></i>
              Retry
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  if (genres.length === 0) {
    return (
      <section className="genre-cloud-section mb-5">
        <Container>
          <h2 className="section-title mb-4">
            <i className="fas fa-tags text-primary me-2"></i>
            Browse by Genre
          </h2>
          <div className="text-center py-3">
            <i className="fas fa-folder-open fa-2x text-muted mb-2"></i>
            <p className="text-muted">No genres available at the moment.</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="genre-cloud-section mb-5">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">
            <i className="fas fa-tags text-primary me-2"></i>
            Browse by Genre
          </h2>
          {genres.length > 12 && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  <i className="fas fa-chevron-up me-1"></i>
                  Show Less
                </>
              ) : (
                <>
                  <i className="fas fa-chevron-down me-1"></i>
                  Show All ({genres.length})
                </>
              )}
            </Button>
          )}
        </div>
        
        <div className="genre-cloud text-center">
          {displayedGenres.map((genre, index) => (
            <Badge
              key={genre.id}
              as={Link}
              to={`/search?genre=${encodeURIComponent(genre.name.toLowerCase())}`}
              className="genre-tag me-2 mb-2 text-decoration-none position-relative"
              style={{
                fontSize: getGenreSize(),
                backgroundColor: getGenreColor(genre),
                padding: '0.5rem 1rem',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                cursor: 'pointer',
                border: 'none',
                animationDelay: `${index * 0.1}s`
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {genre.name}
              {genre.manga_count && (
                <span className="ms-1 small opacity-75">
                  ({genre.manga_count})
                </span>
              )}
            </Badge>
          ))}
        </div>
        
        {/* Popular Genres Quick Access */}
        {genres.length > 6 && (
          <div className="mt-4 pt-3 border-top">
            <h6 className="text-muted mb-3">
              <i className="fas fa-fire text-warning me-1"></i>
              Popular Genres
            </h6>
            <div className="d-flex flex-wrap justify-content-center">
              {genres
                .filter(genre => ['Action', 'Romance', 'Comedy', 'Drama', 'Fantasy', 'Adventure'].includes(genre.name))
                .slice(0, 6)
                .map(genre => (
                  <Badge
                    key={`popular-${genre.id}`}
                    as={Link}
                    to={`/search?genre=${encodeURIComponent(genre.name.toLowerCase())}`}
                    bg="outline-dark"
                    className="me-2 mb-2 text-decoration-none border"
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <i className="fas fa-hashtag me-1" style={{ fontSize: '0.7rem' }}></i>
                    {genre.name}
                  </Badge>
                ))
              }
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default GenreCloud;