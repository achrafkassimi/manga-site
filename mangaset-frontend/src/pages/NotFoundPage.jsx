// src/pages/NotFoundPage.jsx
import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-page py-5" style={{ minHeight: '70vh' }}>
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={6}>
            <div className="error-content">
              <div className="error-code mb-4">
                <h1 className="display-1 fw-bold text-primary">404</h1>
              </div>
              
              <div className="error-message mb-4">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h2 className="mb-3">Page introuvable</h2>
                <p className="text-muted lead">
                  Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                </p>
              </div>

              <div className="error-actions">
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Retour
                  </Button>
                  
                  <Button 
                    variant="outline-primary" 
                    size="lg"
                    href="/"
                  >
                    <i className="fas fa-home me-2"></i>
                    Accueil
                  </Button>
                  
                  <Button 
                    variant="outline-secondary" 
                    size="lg"
                    href="/search"
                  >
                    <i className="fas fa-search me-2"></i>
                    Rechercher
                  </Button>
                </div>
              </div>

              <div className="helpful-links mt-5">
                <h5>Vous cherchez peut-être :</h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="quick-link p-3 border rounded">
                      <i className="fas fa-fire text-danger me-2"></i>
                      <a href="/popular" className="text-decoration-none fw-semibold">
                        Manga populaires
                      </a>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="quick-link p-3 border rounded">
                      <i className="fas fa-clock text-info me-2"></i>
                      <a href="/latest" className="text-decoration-none fw-semibold">
                        Dernières mises à jour
                      </a>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="quick-link p-3 border rounded">
                      <i className="fas fa-star text-success me-2"></i>
                      <a href="/new" className="text-decoration-none fw-semibold">
                        Nouvelles séries
                      </a>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="quick-link p-3 border rounded">
                      <i className="fas fa-tags text-warning me-2"></i>
                      <a href="/genres" className="text-decoration-none fw-semibold">
                        Parcourir par genre
                      </a>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFoundPage;