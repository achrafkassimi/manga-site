// src/pages/TestPage.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Nav } from 'react-bootstrap';

// Import des composants à tester
import FeaturedManga from '../components/manga/FeaturedManga';
import PopularToday from '../components/manga/PopularToday';
import LatestUpdates from '../components/manga/LatestUpdates';
import NewSeries from '../components/manga/NewSeries';
import GenreCloud from '../components/manga/GenreCloud';
import MangaCard from '../components/manga/MangaCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TestPage = () => {
  const [activeComponent, setActiveComponent] = useState('all');

  // Données de test pour MangaCard
  const testManga = {
    id: 1,
    title: "Test Manga Series",
    slug: "test-manga-series",
    author: "Test Author",
    artist: "Test Artist",
    description: "This is a test manga description to demonstrate the MangaCard component. It should show how the component handles longer descriptions and truncates them properly.",
    status: "ongoing",
    cover_image: "https://via.placeholder.com/300x400/007bff/ffffff?text=Test+Manga",
    rating: 8.5,
    total_chapters: 25,
    genres: [
      { id: 1, name: "Action", color_code: "#dc3545" },
      { id: 2, name: "Adventure", color_code: "#28a745" },
      { id: 3, name: "Comedy", color_code: "#ffc107" }
    ],
    latest_chapter: {
      id: 1,
      chapter_number: 25,
      title: "Latest Chapter"
    },
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T12:00:00Z"
  };

  const components = [
    { key: 'all', label: 'All Components', icon: 'fas fa-th' },
    { key: 'featured', label: 'Featured Manga', icon: 'fas fa-star' },
    { key: 'popular', label: 'Popular Today', icon: 'fas fa-fire' },
    { key: 'latest', label: 'Latest Updates', icon: 'fas fa-clock' },
    { key: 'new', label: 'New Series', icon: 'fas fa-plus' },
    { key: 'genres', label: 'Genre Cloud', icon: 'fas fa-tags' },
    { key: 'card', label: 'Manga Card', icon: 'fas fa-id-card' },
    { key: 'loading', label: 'Loading States', icon: 'fas fa-spinner' },
  ];

  const renderComponent = () => {
    switch (activeComponent) {
      case 'featured':
        return <FeaturedManga />;
      case 'popular':
        return <PopularToday />;
      case 'latest':
        return <LatestUpdates />;
      case 'new':
        return <NewSeries />;
      case 'genres':
        return <GenreCloud />;
      case 'card':
        return (
          <Container>
            <Row>
              <Col md={6} lg={4} className="mb-4">
                <MangaCard manga={testManga} />
              </Col>
              <Col md={6} lg={4} className="mb-4">
                <MangaCard 
                  manga={{
                    ...testManga,
                    id: 2,
                    title: "Another Test Manga",
                    status: "completed",
                    rating: 9.2,
                    cover_image: "https://via.placeholder.com/300x400/28a745/ffffff?text=Completed"
                  }} 
                />
              </Col>
              <Col md={6} lg={4} className="mb-4">
                <MangaCard 
                  manga={{
                    ...testManga,
                    id: 3,
                    title: "Third Test Manga",
                    status: "hiatus",
                    rating: 7.8,
                    cover_image: "https://via.placeholder.com/300x400/ffc107/000000?text=Hiatus"
                  }} 
                />
              </Col>
            </Row>
          </Container>
        );
      case 'loading':
        return (
          <Container>
            <Row>
              <Col md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <h5>Small Loading</h5>
                    <LoadingSpinner size="sm" text="Loading..." />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <h5>Medium Loading</h5>
                    <LoadingSpinner size="md" text="Processing..." />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <h5>Large Loading</h5>
                    <LoadingSpinner size="lg" text="Please wait..." />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        );
      case 'all':
      default:
        return (
          <>
            <FeaturedManga />
            <PopularToday />
            <LatestUpdates />
            <NewSeries />
            <GenreCloud />
          </>
        );
    }
  };

  return (
    <div className="test-page">
      {/* Header */}
      <div className="bg-primary text-white py-4 mb-4">
        <Container>
          <h1 className="display-6 mb-0">
            <i className="fas fa-flask me-3"></i>
            Component Testing Page
          </h1>
          <p className="lead mb-0">Test and preview all Task 3.6 components</p>
        </Container>
      </div>

      <Container>
        <Row>
          {/* Sidebar Navigation */}
          <Col lg={3} className="mb-4">
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Components
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column">
                  {components.map(component => (
                    <Nav.Link
                      key={component.key}
                      active={activeComponent === component.key}
                      onClick={() => setActiveComponent(component.key)}
                      className="text-start rounded-0 border-bottom"
                      style={{ cursor: 'pointer' }}
                    >
                      <i className={`${component.icon} me-2`}></i>
                      {component.label}
                    </Nav.Link>
                  ))}
                </Nav>
              </Card.Body>
            </Card>

            {/* Info Card */}
            <Card className="mt-3">
              <Card.Header>
                <h6 className="mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Info
                </h6>
              </Card.Header>
              <Card.Body>
                <p className="small mb-2">
                  <strong>Current:</strong> {components.find(c => c.key === activeComponent)?.label}
                </p>
                <p className="small mb-2">
                  <strong>Status:</strong> <span className="text-success">Ready for Testing</span>
                </p>
                <p className="small mb-0">
                  <strong>Components:</strong> {components.length - 1} items
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col lg={9}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className={`${components.find(c => c.key === activeComponent)?.icon} me-2`}></i>
                  {components.find(c => c.key === activeComponent)?.label}
                </h5>
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    <i className="fas fa-redo me-1"></i>
                    Refresh
                  </Button>
                </div>
              </Card.Header>
            </Card>

            {/* Component Preview */}
            <div className="mt-3">
              {renderComponent()}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Debug Info */}
      <div className="bg-light py-4 mt-5">
        <Container>
          <Row>
            <Col>
              <h6>Debug Information:</h6>
              <ul className="list-unstyled small text-muted">
                <li><strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'Not configured'}</li>
                <li><strong>Site Name:</strong> {import.meta.env.VITE_SITE_NAME || 'Not configured'}</li>
                <li><strong>Environment:</strong> {import.meta.env.MODE}</li>
                <li><strong>Current Component:</strong> {activeComponent}</li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default TestPage;