// src/pages/MangaDetailsPage.jsx - Version basique pour test
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Card, ListGroup, Breadcrumb, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { mangaService } from '../services/mangaService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MangaDetailsPage = () => {
  const { slug } = useParams();
  console.log('Slug:', slug); // Pour déboguer
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    fetchMangaDetails();
  }, [slug]);

  // Fonction pour construire l'URL complète de l'image
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-cover.jpg';
    
    // Si l'image commence déjà par http, la retourner telle quelle
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Sinon, construire l'URL avec votre base URL API
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseUrl}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
  };

  const fetchMangaDetails = async () => {
    try {
      setLoading(true);
      const [mangaResponse, chaptersResponse] = await Promise.all([
        mangaService.getMangaBySlug(slug),
        mangaService.getMangaChapters(slug)
      ]);
      
      setManga(mangaResponse.data);
      setChapters(chaptersResponse.data.results || chaptersResponse.data);
    } catch (error) {
      console.error('Error fetching manga details:', error);
      toast.error('Impossible de charger les détails du manga');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      toast.warn('Connectez-vous pour ajouter aux favoris');
      navigate('/auth');
      return;
    }

    setFavoriteLoading(true);
    try {
      await mangaService.addToFavorites(manga.id);
      toast.success('Ajouté aux favoris !');
      
      // Update manga data to reflect favorite status
      setManga(prev => ({ ...prev, is_favorited: true }));
    } catch (error) {
      toast.error('Erreur lors de l\'ajout aux favoris');
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

  if (loading) {
    return (
      <Container className="mt-5">
        <LoadingSpinner text="Chargement des détails du manga..." />
      </Container>
    );
  }

  if (!manga) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
          <h4>Manga introuvable</h4>
          <p>Le manga demandé n'existe pas ou a été supprimé.</p>
          <Button as={Link} to="/" variant="primary">
            <i className="fas fa-home me-2"></i>
            Retour à l'accueil
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="manga-details-page">
      {/* Breadcrumb */}
      <Container className="mt-3">
        <Breadcrumb>
          <Breadcrumb.Item as={Link} to="/">
            <i className="fas fa-home me-1"></i>
            Accueil
          </Breadcrumb.Item>
          <Breadcrumb.Item as={Link} to="/browse">
            Parcourir
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{manga.title}</Breadcrumb.Item>
        </Breadcrumb>
      </Container>

      <Container className="mb-5">
        <Row>
          {/* Left Column - Cover Image & Actions */}
          <Col lg={3} md={4} className="mb-4">
            <Card className="shadow">
              <Card.Img
                variant="top"
                src={getImageUrl(manga.cover_image)}
                alt={manga.title}
                style={{ height: '400px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = '/placeholder-cover.jpg';
                }}
              />
              <Card.Body className="text-center">
                <Button
                  variant={manga.is_favorited ? 'danger' : 'outline-danger'}
                  size="lg"
                  className="w-100 mb-2"
                  onClick={handleAddToFavorites}
                  disabled={favoriteLoading}
                >
                  {favoriteLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Chargement...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-heart me-2"></i>
                      {manga.is_favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    </>
                  )}
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
                    Commencer à lire
                  </Button>
                )}
              </Card.Body>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-3">
              <Card.Header>
                <h6 className="mb-0">
                  <i className="fas fa-chart-bar me-2"></i>
                  Statistiques
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-2">
                  <small className="text-muted">Vues :</small>
                  <br />
                  <strong>{manga.view_count?.toLocaleString() || 0}</strong>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Chapitres :</small>
                  <br />
                  <strong>{manga.total_chapters}</strong>
                </div>
                {manga.rating > 0 && (
                  <div>
                    <small className="text-muted">Note :</small>
                    <br />
                    <div className="d-flex align-items-center">
                      <i className="fas fa-star text-warning me-1"></i>
                      <strong>{manga.rating}/10</strong>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Details */}
          <Col lg={9} md={8}>
            {/* Title and Basic Info */}
            <div className="mb-4">
              <h1 className="display-6 mb-2">{manga.title}</h1>
              <p className="text-muted fs-5 mb-3">par {manga.author}</p>
              
              <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                <Badge bg={getStatusBadgeVariant(manga.status)} className="fs-6">
                  {manga.status?.toUpperCase()}
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
                  {manga.view_count?.toLocaleString() || 0} vues
                </span>
              </div>

              {/* Genres */}
              <div className="mb-3">
                {manga.genres?.map(genre => (
                  <Badge
                    key={genre.id}
                    as={Link}
                    to={`/search?genre=${genre.name.toLowerCase()}`}
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
                <h4>
                  <i className="fas fa-align-left me-2"></i>
                  Synopsis
                </h4>
              </Card.Header>
              <Card.Body>
                <p className="fs-6 lh-base">{manga.description || 'Aucune description disponible.'}</p>
              </Card.Body>
            </Card>

            {/* Reading Progress (for authenticated users) */}
            {isAuthenticated && manga.reading_progress && (
              <Card className="mb-4">
                <Card.Body>
                  <h5>
                    <i className="fas fa-bookmark me-2"></i>
                    Votre progression
                  </h5>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>
                      Dernier chapitre lu : {manga.reading_progress.last_chapter}
                    </span>
                    <Button
                      as={Link}
                      to={`/read/${slug}/${manga.reading_progress.last_chapter}`}
                      variant="outline-primary"
                      size="sm"
                    >
                      <i className="fas fa-play me-1"></i>
                      Continuer la lecture
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Chapters List */}
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Chapitres
                </h4>
                <span className="text-muted">{chapters.length} chapitre{chapters.length > 1 ? 's' : ''}</span>
              </Card.Header>
              
              {chapters.length > 0 ? (
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <ListGroup variant="flush">
                    {chapters.map((chapter, index) => (
                      <ListGroup.Item
                        key={chapter.id}
                        className="d-flex justify-content-between align-items-center py-3"
                      >
                        <div>
                          <Link
                            to={`/read/${slug}/${chapter.id}`}
                            className="text-decoration-none fw-semibold"
                          >
                            <i className="fas fa-play me-2 text-primary"></i>
                            Chapitre {chapter.chapter_number}
                            {chapter.title && ` : ${chapter.title}`}
                          </Link>
                          <div className="text-muted small mt-1">
                            <i className="fas fa-calendar me-1"></i>
                            {new Date(chapter.release_date).toLocaleDateString('fr-FR')}
                            {chapter.page_count > 0 && (
                              <>
                                {' • '}
                                <i className="fas fa-images me-1"></i>
                                {chapter.page_count} pages
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-muted small">
                          <i className="fas fa-eye me-1"></i>
                          {chapter.view_count?.toLocaleString() || 0}
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              ) : (
                <Card.Body className="text-center py-5">
                  <i className="fas fa-book fa-2x text-muted mb-3"></i>
                  <h5 className="text-muted">Aucun chapitre disponible</h5>
                  <p className="text-muted">Les chapitres seront ajoutés bientôt.</p>
                </Card.Body>
              )}
            </Card>

            {/* Related Manga (Mock) */}
            <Card className="mt-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-thumbs-up me-2"></i>
                  Manga similaires
                </h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted">
                  <i className="fas fa-info-circle me-2"></i>
                  Les recommandations seront bientôt disponibles !
                </p>
                <Button variant="outline-primary" size="sm" disabled>
                  <i className="fas fa-magic me-1"></i>
                  Voir les recommandations
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MangaDetailsPage;