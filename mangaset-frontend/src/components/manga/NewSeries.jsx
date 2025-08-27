// src/components/manga/NewSeries.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MangaCard from './MangaCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { mangaService } from '../../services/mangaService';

const NewSeries = () => {
  const [newManga, setNewManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewSeries();
  }, []);

  const fetchNewSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mangaService.getNewSeries();
      
      // Handle both paginated and non-paginated responses
      const mangaData = response.data.results || response.data || [];
      setNewManga(mangaData);
    } catch (error) {
      console.error('Error fetching new series:', error);
      setError('Failed to load new series');
      setNewManga([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchNewSeries();
  };

  if (loading) {
    return (
      <section className="new-series-section mb-5">
        <Container>
          <LoadingSpinner text="Loading new series..." />
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="new-series-section mb-5">
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
    <section className="new-series-section mb-5">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">
            <i className="fas fa-star text-success me-2"></i>
            New Series
            <Badge bg="success" className="ms-2 small animate-pulse">New</Badge>
          </h2>
          <Button as={Link} to="/new" variant="outline-success">
            View All <i className="fas fa-arrow-right ms-1"></i>
          </Button>
        </div>
        
        {newManga.length > 0 ? (
          <Row>
            {newManga.slice(0, 6).map(manga => (
              <Col key={manga.id} xl={2} lg={3} md={4} sm={6} className="mb-4">
                <div className="position-relative">
                  <MangaCard manga={manga} />
                  {/* New Badge Overlay */}
                  <Badge 
                    bg="success" 
                    className="position-absolute top-0 start-50 translate-middle-x mt-2"
                    style={{ zIndex: 10 }}
                  >
                    <i className="fas fa-sparkles me-1"></i>
                    NEW
                  </Badge>
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-plus-circle fa-3x text-muted mb-3"></i>
            <h4 className="text-muted">No new series available</h4>
            <p className="text-muted">Stay tuned for new manga releases!</p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default NewSeries;