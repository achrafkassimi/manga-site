// src/components/manga/LatestUpdates.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { mangaService } from '../../services/mangaService';
import LoadingSpinner from '../common/LoadingSpinner';

const LatestUpdates = () => {
  const [latestManga, setLatestManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLatestUpdates();
  }, []);

  const fetchLatestUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mangaService.getLatestUpdates();
      
      // Handle both paginated and non-paginated responses
      const mangaData = response.data.results || response.data || [];
      setLatestManga(mangaData);
    } catch (error) {
      console.error('Error fetching latest updates:', error);
      setError('Failed to load latest updates');
      setLatestManga([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMilliseconds = now - date;
      
      if (isNaN(diffInMilliseconds)) return 'Unknown';
      
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      const diffInWeeks = Math.floor(diffInDays / 7);
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInDays < 7) return `${diffInDays}d ago`;
      if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-cover.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
    return imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
  };

  const handleRetry = () => {
    fetchLatestUpdates();
  };

  if (loading) {
    return (
      <section className="latest-updates-section mb-5">
        <Container>
          <LoadingSpinner text="Loading latest updates..." />
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="latest-updates-section mb-5">
        <Container>
          <div className="text-center py-5">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h4 className="text-muted">{error}</h4>
            <Button variant="primary" onClick={handleRetry}>
              <i className="fas fa-redo me-2"></i>
              Try Again
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="latest-updates-section mb-5">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">
            <i className="fas fa-clock text-info me-2"></i>
            Latest Updates
          </h2>
          <Button as={Link} to="/latest" variant="outline-primary">
            View All <i className="fas fa-arrow-right ms-1"></i>
          </Button>
        </div>
        
        {latestManga.length > 0 ? (
          <Row>
            {latestManga.slice(0, 6).map(manga => (
              <Col key={manga.id} lg={4} md={6} className="mb-3">
                <Card className="h-100 latest-update-card">
                  <Row className="g-0 h-100">
                    <Col xs={4}>
                      <Card.Img
                        src={getImageUrl(manga.cover_image)}
                        alt={manga.title || 'Manga cover'}
                        className="h-100 w-100"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/placeholder-cover.jpg';
                        }}
                      />
                    </Col>
                    <Col xs={8}>
                      <Card.Body className="py-2 px-3 d-flex flex-column h-100">
                        <Card.Title className="h6 mb-1">
                          <Link 
                            to={`/manga/${manga.slug}`} 
                            className="text-decoration-none text-dark"
                            title={manga.title}
                          >
                            <span className="text-truncate d-block">
                              {manga.title || 'Unknown Title'}
                            </span>
                          </Link>
                        </Card.Title>
                        
                        <Card.Text className="text-muted small mb-1">
                          by {manga.author || 'Unknown Author'}
                        </Card.Text>
                        
                        <div className="mt-auto">
                          {manga.latest_chapter && (
                            <div className="d-flex justify-content-between align-items-center">
                              <Badge bg="primary" className="small">
                                Ch. {manga.latest_chapter.chapter_number}
                              </Badge>
                              <small className="text-muted">
                                {formatTimeAgo(manga.updated_at)}
                              </small>
                            </div>
                          )}
                          
                          {!manga.latest_chapter && (
                            <div className="d-flex justify-content-between align-items-center">
                              <Badge bg="secondary" className="small">
                                New Series
                              </Badge>
                              <small className="text-muted">
                                {formatTimeAgo(manga.created_at)}
                              </small>
                            </div>
                          )}
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
            <h4 className="text-muted">No recent updates</h4>
            <p className="text-muted">Check back later for new chapters!</p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default LatestUpdates;