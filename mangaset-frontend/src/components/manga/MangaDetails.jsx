// src/pages/MangaDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Card, ListGroup, Breadcrumb } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { mangaService } from '../services/mangaService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MangaDetailsPage = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    fetchMangaDetails();
  }, [slug]);

  const fetchMangaDetails = async () => {
    try {
      const [mangaResponse, chaptersResponse] = await Promise.all([
        mangaService.getMangaBySlug(slug),
        mangaService.getMangaChapters(slug)
      ]);
      
      setManga(mangaResponse.data);
      setChapters(chaptersResponse.data.results || chaptersResponse.data);
    } catch (error) {
      console.error('Error fetching manga details:', error);
      toast.error('Failed to load manga details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      toast.warn('Please login to add favorites');
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (manga.is_favorited) {
        // Remove from favorites (you'll need to implement this)
        toast.success('Removed from favorites');
      } else {
        await mangaService.addToFavorites(manga.id);
        toast.success('Added to favorites!');
      }
      
      // Refresh manga data to update favorite status
      const response = await mangaService.getMangaBySlug(slug);
      setManga(response.data);
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'ongoing': return 'success';
      case 'completed': return 'primary';
      case 'hiatus': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) return <LoadingSpinner text="Loading manga details..." />;

  if (!manga) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <h2>Manga not found</h2>
          <Button as={Link} to="/" variant="primary">
            Go Home
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item as={Link} to="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to="/browse">Browse</Breadcrumb.Item>
        <Breadcrumb.Item active>{manga.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        {/* Left Column - Cover Image */}
        <Col lg={3} md={4} className="mb-4">
          <Card>
            <Card.Img
              variant="top"
              src={manga.cover_image || '/placeholder-cover.jpg'}
              alt={manga.title}
              style={{ height: '400px', objectFit: 'cover' }}
            />
            <Card.Body className="text-center">
              <Button
                variant={manga.is_favorited ? 'danger' : 'outline-danger'}
                size="lg"
                className="w-100 mb-2"
                onClick={handleAddToFavorites}
                disabled={favoriteLoading}
              >
                <i className={`fas fa-heart me-2`}></i>
                {manga.is_favorited ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              
              {chapters.length > 0 && (
                <Button
                  as={Link}
                  to={`/read/${slug}/${chapters[0].id}`}
                  variant="primary"
                  size="lg"
                  className="w-100"
                >
                  <i className="fas fa-book-open me-2"></i>
                  Start Reading
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Details */}
        <Col lg={9} md={8}>
          {/* Title and Basic Info */}
          <div className="mb-4">
            <h1 className="display-6 mb-2">{manga.title}</h1>
            <p className="text-muted fs-5 mb-3">by {manga.author}</p>
            
            <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
              <Badge bg={getStatusBadgeVariant(manga.status)} className="fs-6">
                {manga.status}
              </Badge>
              
              {manga.rating > 0 && (
                <div className="d-flex align-items-center">
                  <i className="fas fa-star text-warning me-1"></i>
                  <span className="fw-bold">{manga.rating}</span>
                  <span className="text-muted ms-1">/10</span>
                </div>
              )}
              
              <span className="text-muted">
                <i className="fas fa-eye me-1"></i>
                {manga.view_count?.toLocaleString()} views
              </span>
              
              <span className="text-muted">
                <i className="fas fa-list me-1"></i>
                {manga.total_chapters} chapters
              </span>
            </div>

            {/* Genres */}
            <div className="mb-3">
              {manga.genres?.map(genre => (
                <Badge
                  key={genre.id}
                  as={Link}
                  to={`/genre/${genre.name.toLowerCase()}`}
                  bg="light"
                  text="dark"
                  className="me-2 mb-1 text-decoration-none"
                  style={{ fontSize: '0.875rem' }}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <Card className="mb-4">
            <Card.Header>
              <h4>Synopsis</h4>
            </Card.Header>
            <Card.Body>
              <p className="fs-6 lh-base">{manga.description}</p>
            </Card.Body>
          </Card>

          {/* Reading Progress (for authenticated users) */}
          {isAuthenticated && manga.reading_progress && (
            <Card className="mb-4">
              <Card.Body>
                <h5>Your Reading Progress</h5>
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    Last read: Chapter {manga.reading_progress.last_chapter}
                  </span>
                  <Button
                    as={Link}
                    to={`/read/${slug}/${manga.reading_progress.last_chapter}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    Continue Reading
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Chapters List */}
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Chapters</h4>
              <span className="text-muted">{chapters.length} chapters</span>
            </Card.Header>
            <ListGroup variant="flush" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {chapters.map((chapter, index) => (
                <ListGroup.Item
                  key={chapter.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <Link
                      to={`/read/${slug}/${chapter.id}`}
                      className="text-decoration-none fw-semibold"
                    >
                      Chapter {chapter.chapter_number}
                      {chapter.title && `: ${chapter.title}`}
                    </Link>
                    <div className="text-muted small">
                      {new Date(chapter.release_date).toLocaleDateString()}
                      {chapter.page_count > 0 && ` • ${chapter.page_count} pages`}
                    </div>
                  </div>
                  
                  <div className="text-muted small">
                    <i className="fas fa-eye me-1"></i>
                    {chapter.view_count?.toLocaleString() || 0}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MangaDetailsPage;