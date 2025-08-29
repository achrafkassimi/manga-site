// src/pages/MangaDetailsPage.jsx - Complete Implementation
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Breadcrumb,
  Tab,
  Tabs,
  ListGroup,
  Dropdown,
  Modal,
  Form,
  Alert,
  Spinner,
  ProgressBar,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MangaDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // State Management
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [relatedManga, setRelatedManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [readingProgress, setReadingProgress] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [chaptersPage, setChaptersPage] = useState(1);
  const [chaptersPerPage] = useState(20);
  const [chaptersSortBy, setChaptersSortBy] = useState('asc');
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch manga data
  useEffect(() => {
    fetchMangaDetails();
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [slug, isAuthenticated]);

  // Mock data - replace with real API calls
  const fetchMangaDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock manga data
      const mockManga = {
        id: 1,
        title: 'One Piece',
        alternativeTitles: ['ワンピース', 'One Piece'],
        author: 'Eiichiro Oda',
        artist: 'Eiichiro Oda',
        status: 'ongoing',
        description: `One Piece follows the adventures of Monkey D. Luffy, a young pirate whose body gained the properties of rubber after unintentionally eating a Devil Fruit. With his crew of pirates, named the Straw Hat Pirates, Luffy explores the Grand Line in search of the world's ultimate treasure known as "One Piece" in order to become the next Pirate King.

The series focuses on Luffy and his crew as they sail from island to island in pursuit of their dreams, each having a different goal but all sharing the dream of finding the One Piece. Along the way, they encounter other pirates, bounty hunters, revolutionary agents, and various other friends and foes.`,
        cover_image: 'https://via.placeholder.com/300x400/007bff/ffffff?text=One+Piece',
        banner_image: 'https://via.placeholder.com/1200x400/007bff/ffffff?text=One+Piece+Banner',
        rating: 9.2,
        total_ratings: 12543,
        view_count: 2456789,
        favorites_count: 89432,
        total_chapters: 1090,
        publication_year: 1997,
        genres: [
          { id: 1, name: 'Action', color: '#dc3545' },
          { id: 2, name: 'Adventure', color: '#28a745' },
          { id: 3, name: 'Comedy', color: '#ffc107' },
          { id: 4, name: 'Drama', color: '#17a2b8' },
          { id: 5, name: 'Shounen', color: '#6f42c1' }
        ],
        created_at: '2023-01-01',
        updated_at: '2024-12-20',
        slug: 'one-piece'
      };
      
      // Mock chapters data
      const mockChapters = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        chapter_number: i + 1,
        title: `Chapter ${i + 1}: Adventure Continues`,
        release_date: new Date(2024, 11, 20 - i).toISOString(),
        page_count: Math.floor(Math.random() * 20) + 15,
        view_count: Math.floor(Math.random() * 10000) + 1000,
        is_published: true
      }));
      
      // Mock related manga
      const mockRelated = [
        {
          id: 2,
          title: 'Naruto',
          cover_image: 'https://via.placeholder.com/150x200/28a745/ffffff?text=Naruto',
          rating: 8.9,
          slug: 'naruto'
        },
        {
          id: 3,
          title: 'Dragon Ball',
          cover_image: 'https://via.placeholder.com/150x200/ffc107/000000?text=Dragon+Ball',
          rating: 9.0,
          slug: 'dragon-ball'
        },
        {
          id: 4,
          title: 'Attack on Titan',
          cover_image: 'https://via.placeholder.com/150x200/dc3545/ffffff?text=AOT',
          rating: 9.1,
          slug: 'attack-on-titan'
        }
      ];
      
      setManga(mockManga);
      setChapters(mockChapters);
      setRelatedManga(mockRelated);
    } catch (error) {
      setError('Failed to load manga details');
      console.error('Error fetching manga details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    if (!isAuthenticated) return;
    
    try {
      // Mock user data - replace with real API calls
      setIsFavorited(Math.random() > 0.5);
      setUserRating(Math.floor(Math.random() * 5) + 1);
      setReadingProgress({
        last_chapter: 15,
        last_page: 8,
        progress_percentage: Math.floor(Math.random() * 100)
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Handle favorite toggle
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      navigate('/login');
      return;
    }
    
    try {
      // API call would go here
      setIsFavorited(!isFavorited);
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  // Handle rating submission
  const handleRatingSubmit = async (rating) => {
    if (!isAuthenticated) {
      toast.error('Please login to rate manga');
      return;
    }
    
    try {
      setUserRating(rating);
      setShowRatingModal(false);
      toast.success('Rating submitted successfully');
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  // Handle share functionality
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `Check out ${manga.title} on MangaSet!`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      copy: url
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    
    setShowShareModal(false);
  };

  // Get sorted chapters
  const getSortedChapters = () => {
    const sorted = [...chapters].sort((a, b) => {
      if (chaptersSortBy === 'asc') {
        return a.chapter_number - b.chapter_number;
      } else {
        return b.chapter_number - a.chapter_number;
      }
    });
    
    const startIndex = (chaptersPage - 1) * chaptersPerPage;
    return sorted.slice(startIndex, startIndex + chaptersPerPage);
  };

  // Calculate total pages
  const totalPages = Math.ceil(chapters.length / chaptersPerPage);

  // Generate star rating display
  const renderStars = (rating, size = 'sm', interactive = false, onRate = null) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= fullStars;
      const isHalf = i === fullStars + 1 && hasHalfStar;
      
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${isFilled ? 'text-warning' : 'text-muted'} ${size === 'lg' ? 'fa-lg' : ''}`}
          style={{ 
            cursor: interactive ? 'pointer' : 'default',
            opacity: isHalf ? 0.5 : 1 
          }}
          onClick={interactive && onRate ? () => onRate(i) : undefined}
        />
      );
    }
    
    return stars;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format number
  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;
  if (!manga) return <Alert variant="warning" className="m-4">Manga not found</Alert>;

  return (
    <div className="manga-details-page">
      {/* SEO Meta Tags */}
      <div style={{ display: 'none' }}>
        <title>{manga.title} - Read Online | MangaSet</title>
        <meta name="description" content={manga.description.substring(0, 160)} />
        <meta property="og:title" content={`${manga.title} - MangaSet`} />
        <meta property="og:description" content={manga.description.substring(0, 160)} />
        <meta property="og:image" content={manga.cover_image} />
        <meta property="og:type" content="article" />
      </div>

      {/* Breadcrumb Navigation */}
      <Container className="mt-3">
        <Breadcrumb>
          <Breadcrumb.Item as={Link} to="/">
            <i className="fas fa-home me-1"></i>
            Accueil
          </Breadcrumb.Item>
          <Breadcrumb.Item as={Link} to="/manga">
            Manga
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{manga.title}</Breadcrumb.Item>
        </Breadcrumb>
      </Container>

      {/* Hero Banner Section */}
      <div 
        className="hero-banner position-relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${manga.banner_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={3} className="text-center text-md-start">
              <img
                src={manga.cover_image}
                alt={manga.title}
                className="img-fluid rounded shadow-lg"
                style={{ maxHeight: '350px', width: 'auto' }}
              />
            </Col>
            <Col md={9}>
              <div className="text-white">
                <h1 className="display-4 fw-bold mb-2">{manga.title}</h1>
                
                {/* Alternative Titles */}
                {manga.alternativeTitles && manga.alternativeTitles.length > 0 && (
                  <p className="text-light mb-3">
                    <small>
                      <strong>Autres titres:</strong> {manga.alternativeTitles.join(', ')}
                    </small>
                  </p>
                )}
                
                {/* Author & Artist */}
                <p className="mb-3">
                  <span className="me-4">
                    <i className="fas fa-pen me-2"></i>
                    <strong>Auteur:</strong> {manga.author}
                  </span>
                  {manga.artist !== manga.author && (
                    <span>
                      <i className="fas fa-brush me-2"></i>
                      <strong>Artiste:</strong> {manga.artist}
                    </span>
                  )}
                </p>
                
                {/* Rating & Stats */}
                <div className="mb-3">
                  <span className="me-4">
                    {renderStars(manga.rating, 'lg')}
                    <span className="ms-2 fs-5 fw-bold">{manga.rating}/5</span>
                    <small className="text-light ms-1">({formatNumber(manga.total_ratings)} votes)</small>
                  </span>
                </div>
                
                {/* Status & Stats */}
                <div className="mb-4">
                  <Badge 
                    bg={manga.status === 'ongoing' ? 'success' : 'primary'} 
                    className="me-3 fs-6"
                  >
                    <i className={`fas ${manga.status === 'ongoing' ? 'fa-play-circle' : 'fa-check-circle'} me-1`}></i>
                    {manga.status === 'ongoing' ? 'En cours' : 'Terminé'}
                  </Badge>
                  <span className="text-light me-4">
                    <i className="fas fa-book me-1"></i>
                    {formatNumber(manga.total_chapters)} chapitres
                  </span>
                  <span className="text-light me-4">
                    <i className="fas fa-eye me-1"></i>
                    {formatNumber(manga.view_count)} vues
                  </span>
                  <span className="text-light">
                    <i className="fas fa-heart me-1"></i>
                    {formatNumber(manga.favorites_count)} favoris
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="d-flex flex-wrap gap-3">
                  <Button 
                    variant="primary" 
                    size="lg"
                    as={Link}
                    to={`/manga/${manga.slug}/chapter/1`}
                  >
                    <i className="fas fa-book-open me-2"></i>
                    Commencer la lecture
                  </Button>
                  
                  {readingProgress && (
                    <Button 
                      variant="success" 
                      size="lg"
                      as={Link}
                      to={`/manga/${manga.slug}/chapter/${readingProgress.last_chapter}`}
                    >
                      <i className="fas fa-bookmark me-2"></i>
                      Continuer (Ch. {readingProgress.last_chapter})
                    </Button>
                  )}
                  
                  <Button
                    variant={isFavorited ? 'danger' : 'outline-light'}
                    size="lg"
                    onClick={handleToggleFavorite}
                  >
                    <i className={`fas fa-heart me-2`}></i>
                    {isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </Button>
                  
                  <Button
                    variant="outline-light"
                    size="lg"
                    onClick={() => setShowRatingModal(true)}
                  >
                    <i className="fas fa-star me-2"></i>
                    {userRating ? 'Modifier la note' : 'Noter'}
                  </Button>
                  
                  <Button
                    variant="outline-light"
                    size="lg"
                    onClick={() => setShowShareModal(true)}
                  >
                    <i className="fas fa-share-alt me-2"></i>
                    Partager
                  </Button>
                </div>
                
                {/* Reading Progress */}
                {readingProgress && (
                  <div className="mt-3">
                    <small className="text-light">Progression de lecture:</small>
                    <ProgressBar 
                      now={readingProgress.progress_percentage} 
                      label={`${readingProgress.progress_percentage}%`}
                      className="mt-1"
                      style={{ height: '8px' }}
                    />
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-4">
        <Row>
          <Col lg={8}>
            {/* Content Tabs */}
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              {/* Overview Tab */}
              <Tab eventKey="overview" title={<><i className="fas fa-info-circle me-2"></i>Aperçu</>}>
                <Card>
                  <Card.Body>
                    <h5>Synopsis</h5>
                    <p className="text-muted" style={{ lineHeight: '1.6', textAlign: 'justify' }}>
                      {manga.description}
                    </p>
                    
                    {/* Genres */}
                    <h6 className="mt-4">Genres</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {manga.genres.map((genre) => (
                        <Badge
                          key={genre.id}
                          as={Link}
                          to={`/search?genre=${genre.name.toLowerCase()}`}
                          style={{ backgroundColor: genre.color }}
                          className="text-decoration-none fs-6 px-3 py-2"
                        >
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Additional Info */}
                    <Row className="mt-4">
                      <Col md={6}>
                        <h6>Informations</h6>
                        <ListGroup variant="flush">
                          <ListGroup.Item className="d-flex justify-content-between px-0">
                            <strong>Année de publication:</strong>
                            <span>{manga.publication_year}</span>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex justify-content-between px-0">
                            <strong>Statut:</strong>
                            <Badge bg={manga.status === 'ongoing' ? 'success' : 'primary'}>
                              {manga.status === 'ongoing' ? 'En cours' : 'Terminé'}
                            </Badge>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex justify-content-between px-0">
                            <strong>Dernière mise à jour:</strong>
                            <span>{formatDate(manga.updated_at)}</span>
                          </ListGroup.Item>
                        </ListGroup>
                      </Col>
                      <Col md={6}>
                        <h6>Statistiques</h6>
                        <ListGroup variant="flush">
                          <ListGroup.Item className="d-flex justify-content-between px-0">
                            <strong>Note moyenne:</strong>
                            <span>{manga.rating}/5 ({formatNumber(manga.total_ratings)} votes)</span>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex justify-content-between px-0">
                            <strong>Vues totales:</strong>
                            <span>{formatNumber(manga.view_count)}</span>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex justify-content-between px-0">
                            <strong>Dans les favoris:</strong>
                            <span>{formatNumber(manga.favorites_count)}</span>
                          </ListGroup.Item>
                        </ListGroup>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Tab>
              
              {/* Chapters Tab */}
              <Tab 
                eventKey="chapters" 
                title={<><i className="fas fa-list me-2"></i>Chapitres ({chapters.length})</>}
              >
                <Card>
                  <Card.Header>
                    <Row className="align-items-center">
                      <Col>
                        <h5 className="mb-0">
                          <i className="fas fa-book me-2"></i>
                          Liste des chapitres
                        </h5>
                      </Col>
                      <Col xs="auto">
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            <i className="fas fa-sort me-1"></i>
                            Tri: {chaptersSortBy === 'asc' ? 'Croissant' : 'Décroissant'}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setChaptersSortBy('asc')}>
                              <i className="fas fa-sort-numeric-up me-2"></i>
                              Du plus ancien au plus récent
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setChaptersSortBy('desc')}>
                              <i className="fas fa-sort-numeric-down me-2"></i>
                              Du plus récent au plus ancien
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <ListGroup variant="flush">
                      {getSortedChapters().map((chapter) => (
                        <ListGroup.Item 
                          key={chapter.id}
                          className="d-flex justify-content-between align-items-center py-3 chapter-item"
                          style={{ cursor: 'pointer' }}
                          as={Link}
                          to={`/manga/${manga.slug}/chapter/${chapter.chapter_number}`}
                        >
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <i className="fas fa-book text-primary"></i>
                            </div>
                            <div>
                              <div className="fw-bold">
                                Chapitre {chapter.chapter_number}
                                {chapter.title && chapter.title !== `Chapter ${chapter.chapter_number}` && (
                                  <span className="fw-normal">: {chapter.title}</span>
                                )}
                              </div>
                              <small className="text-muted">
                                <i className="fas fa-calendar me-1"></i>
                                {formatDate(chapter.release_date)}
                                <span className="mx-2">•</span>
                                <i className="fas fa-file-alt me-1"></i>
                                {chapter.page_count} pages
                                <span className="mx-2">•</span>
                                <i className="fas fa-eye me-1"></i>
                                {formatNumber(chapter.view_count)} vues
                              </small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            {readingProgress && chapter.chapter_number <= readingProgress.last_chapter && (
                              <Badge bg="success" className="me-2">
                                <i className="fas fa-check me-1"></i>
                                Lu
                              </Badge>
                            )}
                            <i className="fas fa-chevron-right text-muted"></i>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-center align-items-center p-3 border-top">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          disabled={chaptersPage === 1}
                          onClick={() => setChaptersPage(chaptersPage - 1)}
                          className="me-2"
                        >
                          <i className="fas fa-chevron-left"></i>
                        </Button>
                        <span className="mx-3">
                          Page {chaptersPage} sur {totalPages}
                        </span>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          disabled={chaptersPage === totalPages}
                          onClick={() => setChaptersPage(chaptersPage + 1)}
                          className="ms-2"
                        >
                          <i className="fas fa-chevron-right"></i>
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Col>
          
          {/* Sidebar */}
          <Col lg={4}>
            {/* Related Manga */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-heart me-2"></i>
                  Manga similaires
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {relatedManga.map((related) => (
                    <Col key={related.id} xs={6} className="mb-3">
                      <Link 
                        to={`/manga/${related.slug}`}
                        className="text-decoration-none"
                      >
                        <div className="text-center">
                          <img
                            src={related.cover_image}
                            alt={related.title}
                            className="img-fluid rounded mb-2"
                            style={{ height: '120px', objectFit: 'cover' }}
                          />
                          <div className="small fw-bold text-dark">{related.title}</div>
                          <div className="small text-muted">
                            {renderStars(related.rating)}
                            <span className="ms-1">{related.rating}</span>
                          </div>
                        </div>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
            
            {/* Quick Stats */}
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-chart-bar me-2"></i>
                  Statistiques rapides
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>
                    <i className="fas fa-star text-warning me-2"></i>
                    Note moyenne
                  </span>
                  <strong>{manga.rating}/5</strong>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>
                    <i className="fas fa-users text-info me-2"></i>
                    Votes totaux
                  </span>
                  <strong>{formatNumber(manga.total_ratings)}</strong>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>
                    <i className="fas fa-eye text-success me-2"></i>
                    Vues totales
                  </span>
                  <strong>{formatNumber(manga.view_count)}</strong>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    <i className="fas fa-heart text-danger me-2"></i>
                    Favoris
                  </span>
                  <strong>{formatNumber(manga.favorites_count)}</strong>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Share Modal */}
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-share-alt me-2"></i>
            Partager {manga.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              onClick={() => handleShare('twitter')}
              className="d-flex align-items-center justify-content-center"
            >
              <i className="fab fa-twitter me-2"></i>
              Partager sur Twitter
            </Button>
            <Button 
              variant="primary" 
              onClick={() => handleShare('facebook')}
              className="d-flex align-items-center justify-content-center"
            >
              <i className="fab fa-facebook me-2"></i>
              Partager sur Facebook
            </Button>
            <Button 
              variant="warning" 
              onClick={() => handleShare('reddit')}
              className="d-flex align-items-center justify-content-center"
            >
              <i className="fab fa-reddit me-2"></i>
              Partager sur Reddit
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleShare('copy')}
              className="d-flex align-items-center justify-content-center"
            >
              <i className="fas fa-copy me-2"></i>
              Copier le lien
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Rating Modal */}
      <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-star me-2"></i>
            Noter {manga.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Donnez votre avis sur ce manga:</p>
          <div className="mb-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <i
                key={rating}
                className={`fas fa-star fa-2x mx-1 ${rating <= userRating ? 'text-warning' : 'text-muted'}`}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  // Highlight stars on hover
                  const stars = e.target.parentElement.children;
                  for (let i = 0; i < stars.length; i++) {
                    stars[i].className = i < rating 
                      ? 'fas fa-star fa-2x mx-1 text-warning' 
                      : 'fas fa-star fa-2x mx-1 text-muted';
                  }
                }}
                onClick={() => handleRatingSubmit(rating)}
              />
            ))}
          </div>
          <div className="text-muted">
            {userRating > 0 ? `Votre note: ${userRating}/5` : 'Cliquez sur les étoiles pour noter'}
          </div>
        </Modal.Body>
      </Modal>

      {/* Custom Styles */}
      <style jsx>{`
        .hero-banner {
          background-attachment: fixed;
        }
        
        .chapter-item {
          transition: all 0.3s ease;
          text-decoration: none;
          color: inherit;
        }
        
        .chapter-item:hover {
          background-color: var(--bs-primary);
          color: white;
          transform: translateX(5px);
        }
        
        .chapter-item:hover .text-muted {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        
        .chapter-item:hover .text-primary {
          color: white !important;
        }
        
        .badge {
          transition: all 0.3s ease;
        }
        
        .badge:hover {
          transform: scale(1.05);
        }
        
        .card {
          transition: all 0.3s ease;
        }
        
        .card:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        .btn {
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .hero-banner {
            background-attachment: scroll;
            min-height: 300px;
          }
          
          .display-4 {
            font-size: 2rem;
          }
        }
        
        .manga-details-page img {
          transition: all 0.3s ease;
        }
        
        .manga-details-page img:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default MangaDetailsPage;