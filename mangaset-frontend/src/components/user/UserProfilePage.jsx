// src/pages/UserProfilePage.jsx - Merged Complete User Profile
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Nav,
  Tab,
  Button,
  Form,
  Badge,
  ProgressBar,
  Modal,
  Alert,
  ListGroup,
  Image,
  Spinner
} from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UserProfilePage = () => {
  const { user, isAuthenticated, updateProfile, changePassword, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active tab from URL
  const getInitialTab = () => {
    const path = location.pathname;
    if (path.includes('favorites')) return 'favorites';
    if (path.includes('history')) return 'history';
    if (path.includes('settings')) return 'settings';
    if (path.includes('preferences')) return 'preferences';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [favorites, setFavorites] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal states
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});

  // Profile form data
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: null
  });
  
  // Password change data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Preferences data
  const [preferences, setPreferences] = useState({
    readingMode: 'single',
    theme: 'auto',
    language: 'fr',
    notifications: {
      newChapters: true,
      favorites: true,
      recommendations: false,
      email: false
    },
    reading: {
      autoBookmark: true,
      backgroundColor: 'white'
    }
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      initializeProfileData();
      fetchUserData();
    }
  }, [isAuthenticated, user]);

  // Initialize profile data
  const initializeProfileData = () => {
    setProfileData({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || 'Passionné de manga',
      avatar: user?.avatar || null
    });
    
    setPreferences({
      readingMode: user?.preferences?.readingMode || 'single',
      theme: localStorage.getItem('theme') || 'auto',
      language: localStorage.getItem('language') || 'fr',
      notifications: {
        newChapters: user?.preferences?.notifications?.newChapters ?? true,
        favorites: user?.preferences?.notifications?.favorites ?? true,
        recommendations: user?.preferences?.notifications?.recommendations ?? false,
        email: user?.preferences?.notifications?.email ?? false
      },
      reading: {
        autoBookmark: user?.preferences?.reading?.autoBookmark ?? true,
        backgroundColor: user?.preferences?.reading?.backgroundColor || 'white'
      }
    });
  };

  // Fetch user data
  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with real API calls
      const mockFavorites = [
        {
          id: 1,
          manga: {
            id: 1,
            title: 'One Piece',
            slug: 'one-piece',
            cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400',
            author: 'Eiichiro Oda',
            rating: 9.2,
            status: 'ongoing'
          },
          added_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          manga: {
            id: 2,
            title: 'Naruto',
            slug: 'naruto',
            cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400',
            author: 'Masashi Kishimoto',
            rating: 8.9,
            status: 'completed'
          },
          added_at: '2024-02-10T14:20:00Z'
        }
      ];

      const mockHistory = [
        {
          id: 1,
          manga: {
            id: 1,
            title: 'One Piece',
            slug: 'one-piece',
            cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400',
            author: 'Eiichiro Oda'
          },
          chapter: {
            id: 1090,
            chapter_number: 1090,
            title: 'Adventure Continues'
          },
          last_page: 15,
          progress_percentage: 85,
          last_read_at: '2024-12-20T10:30:00Z'
        },
        {
          id: 2,
          manga: {
            id: 2,
            title: 'Naruto',
            slug: 'naruto',
            cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400',
            author: 'Masashi Kishimoto'
          },
          chapter: {
            id: 650,
            chapter_number: 650,
            title: 'Final Battle'
          },
          last_page: 20,
          progress_percentage: 100,
          last_read_at: '2024-12-19T15:20:00Z'
        }
      ];

      setFavorites(mockFavorites);
      setReadingHistory(mockHistory);

      // Calculate statistics
      const stats = {
        totalFavorites: mockFavorites.length,
        totalRead: mockHistory.length,
        chaptersRead: mockHistory.reduce((total, item) => 
          total + Math.floor((item.progress_percentage || 0) / 100), 0),
        favoriteCount: mockFavorites.length,
        readingTime: '2,450 heures',
        joinDate: '2023-01-15',
        averageRating: 4.2,
        streakDays: 45,
        readingStreak: 15,
        totalReadingTime: 150,
        badges: [
          { name: 'Premier pas', description: 'Premier manga lu', icon: 'fas fa-baby' },
          { name: 'Lecteur assidu', description: '100 chapitres lus', icon: 'fas fa-book-reader' },
          { name: 'Critique', description: '50 notes données', icon: 'fas fa-star' }
        ]
      };

      setUserStats(stats);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Erreur lors du chargement des données utilisateur');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (child.includes('.')) {
        const [subParent, subChild] = child.split('.');
        if (parent === 'preferences') {
          setPreferences(prev => ({
            ...prev,
            [subParent]: {
              ...prev[subParent],
              [subChild]: value
            }
          }));
        }
      } else {
        if (parent === 'preferences') {
          setPreferences(prev => ({
            ...prev,
            [child]: value
          }));
        } else if (parent === 'password') {
          setPasswordData(prev => ({
            ...prev,
            [child]: value
          }));
        }
      }
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('L\'image ne peut pas dépasser 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validation functions
  const validateProfile = () => {
    const newErrors = {};
    
    if (!profileData.username || profileData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }
    
    if (!profileData.email || !/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Mot de passe actuel requis';
    }
    
    if (!passwordData.newPassword || passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Le nouveau mot de passe doit contenir au moins 8 caractères';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handlers
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) return;
    
    setIsSubmitting(true);
    try {
      const result = await updateProfile({
        ...profileData,
        preferences
      });
      
      if (result.success) {
        // Update localStorage for preferences
        localStorage.setItem('theme', preferences.theme);
        localStorage.setItem('language', preferences.language);
        
        // Apply theme change immediately
        document.documentElement.setAttribute('data-bs-theme', 
          preferences.theme === 'auto' 
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : preferences.theme
        );
        
        toast.success('Profil mis à jour avec succès');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    
    setIsSubmitting(true);
    try {
      const result = await changePassword(passwordData);
      
      if (result.success) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordModal(false);
        toast.success('Mot de passe modifié avec succès');
      }
    } catch (error) {
      toast.error('Erreur lors du changement de mot de passe');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle favorite removal
  const handleRemoveFavorite = async (favoriteId) => {
    try {
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      setUserStats(prev => ({
        ...prev,
        totalFavorites: prev.totalFavorites - 1,
        favoriteCount: prev.favoriteCount - 1
      }));
      toast.success('Supprimé des favoris');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Utility functions
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Inconnu';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'À l\'instant';
      if (diffInHours < 24) return `Il y a ${diffInHours}h`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `Il y a ${diffInDays}j`;
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      return 'Date inconnue';
    }
  };

  const getReadingProgress = (item) => {
    return Math.round(item.progress_percentage || 0);
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <Container className="mt-5 text-center">
        <div className="py-5">
          <i className="fas fa-lock fa-3x text-muted mb-3"></i>
          <h2>Accès restreint</h2>
          <p className="text-muted mb-4">Vous devez être connecté pour accéder à votre profil</p>
          <Button onClick={() => navigate('/login')} variant="primary" size="lg">
            <i className="fas fa-sign-in-alt me-2"></i>
            Se connecter
          </Button>
        </div>
      </Container>
    );
  }

  if (authLoading || loading) {
    return (
      <Container className="mt-5">
        <LoadingSpinner text="Chargement du profil..." />
      </Container>
    );
  }

  return (
    <div className="user-profile-page">
      {/* Profile Header */}
      <div className="profile-header bg-primary text-white py-4 mb-4">
        <Container>
          <Row className="align-items-center">
            <Col md={3} className="text-center">
              <div className="profile-avatar-container position-relative d-inline-block">
                <Image
                  src={profileData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.username)}&background=ffffff&color=007bff&size=128`}
                  alt="Avatar"
                  roundedCircle
                  style={{ width: '120px', height: '120px', border: '4px solid rgba(255,255,255,0.3)', objectFit: 'cover' }}
                />
                {isEditing && (
                  <>
                    <Button
                      variant="light"
                      size="sm"
                      className="position-absolute bottom-0 end-0 rounded-circle"
                      style={{ width: '35px', height: '35px' }}
                      onClick={() => document.getElementById('avatar-input').click()}
                    >
                      <i className="fas fa-camera"></i>
                    </Button>
                    <input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleAvatarChange}
                    />
                  </>
                )}
              </div>
            </Col>
            <Col md={6}>
              <h2 className="mb-1 fw-bold">{profileData.username}</h2>
              <p className="mb-2 opacity-75">{profileData.email}</p>
              <p className="mb-3">{profileData.bio}</p>
              
              {/* Quick Stats */}
              <Row className="text-center">
                <Col xs={4}>
                  <div>
                    <strong className="fs-4">{userStats.totalFavorites || 0}</strong>
                    <br />
                    <small className="opacity-75">Favoris</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div>
                    <strong className="fs-4">{userStats.chaptersRead || 0}</strong>
                    <br />
                    <small className="opacity-75">Chapitres lus</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div>
                    <strong className="fs-4">{userStats.streakDays || 0}</strong>
                    <br />
                    <small className="opacity-75">Jours d'affilée</small>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col md={3} className="text-end">
              <Button
                variant={isEditing ? 'light' : 'outline-light'}
                onClick={() => setIsEditing(!isEditing)}
                className="mb-2"
              >
                <i className={`fas fa-${isEditing ? 'times' : 'edit'} me-2`}></i>
                {isEditing ? 'Annuler' : 'Modifier'}
              </Button>
              <br />
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => setShowPasswordModal(true)}
              >
                <i className="fas fa-lock me-1"></i>
                Mot de passe
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row>
          {/* Sidebar with Quick Stats */}
          <Col lg={4} className="mb-4">
            {/* Statistics Card */}
            {userStats.badges && (
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="fas fa-chart-line me-2"></i>
                    Statistiques détaillées
                  </h6>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Membre depuis</span>
                      <strong>{new Date(userStats.joinDate).toLocaleDateString('fr-FR')}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Temps de lecture</span>
                      <strong>{userStats.readingTime}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Note moyenne</span>
                      <strong>{userStats.averageRating}/5 ⭐</strong>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            )}

            {/* Badges */}
            {userStats.badges && (
              <Card>
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="fas fa-medal me-2"></i>
                    Badges ({userStats.badges.length})
                  </h6>
                </Card.Header>
                <Card.Body>
                  {userStats.badges.map((badge, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <div className="bg-primary rounded-circle p-2 me-3">
                        <i className={`${badge.icon} text-white`}></i>
                      </div>
                      <div>
                        <div className="fw-bold small">{badge.name}</div>
                        <small className="text-muted">{badge.description}</small>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Main Content */}
          <Col lg={8}>
            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
              <Card>
                <Card.Header>
                  <Nav variant="tabs" className="border-0">
                    <Nav.Item>
                      <Nav.Link eventKey="overview">
                        <i className="fas fa-chart-pie me-2"></i>
                        Vue d'ensemble
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="favorites">
                        <i className="fas fa-heart me-2"></i>
                        Favoris ({favorites.length})
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="history">
                        <i className="fas fa-history me-2"></i>
                        Historique ({readingHistory.length})
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="preferences">
                        <i className="fas fa-cog me-2"></i>
                        Préférences
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="account">
                        <i className="fas fa-shield-alt me-2"></i>
                        Compte
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>

                <Card.Body>
                  <Tab.Content>
                    {/* Overview Tab */}
                    <Tab.Pane eventKey="overview">
                      <Row>
                        {/* Statistics Cards */}
                        <Col lg={12} className="mb-4">
                          <h5 className="mb-3">
                            <i className="fas fa-chart-bar me-2"></i>
                            Statistiques de lecture
                          </h5>
                          <Row>
                            <Col md={3} className="mb-3">
                              <Card className="text-center h-100 border-0 shadow-sm">
                                <Card.Body>
                                  <i className="fas fa-heart fa-2x text-danger mb-2"></i>
                                  <h3 className="mb-1">{userStats.totalFavorites}</h3>
                                  <small className="text-muted">Manga favoris</small>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={3} className="mb-3">
                              <Card className="text-center h-100 border-0 shadow-sm">
                                <Card.Body>
                                  <i className="fas fa-book-open fa-2x text-primary mb-2"></i>
                                  <h3 className="mb-1">{userStats.totalRead}</h3>
                                  <small className="text-muted">En cours de lecture</small>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={3} className="mb-3">
                              <Card className="text-center h-100 border-0 shadow-sm">
                                <Card.Body>
                                  <i className="fas fa-fire fa-2x text-warning mb-2"></i>
                                  <h3 className="mb-1">{userStats.readingStreak}</h3>
                                  <small className="text-muted">Série de lecture</small>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={3} className="mb-3">
                              <Card className="text-center h-100 border-0 shadow-sm">
                                <Card.Body>
                                  <i className="fas fa-clock fa-2x text-info mb-2"></i>
                                  <h3 className="mb-1">{userStats.totalReadingTime}h</h3>
                                  <small className="text-muted">Temps de lecture</small>
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* Continue Reading */}
                      <div className="mb-4">
                        <h5 className="mb-3">
                          <i className="fas fa-play me-2"></i>
                          Continuer la lecture
                        </h5>
                        <Row>
                          {readingHistory.slice(0, 4).map((item, index) => (
                            <Col key={index} lg={3} md={6} className="mb-3">
                              <Card className="h-100">
                                <div className="position-relative">
                                  <Card.Img
                                    variant="top"
                                    src={item.manga?.cover_image}
                                    alt={item.manga?.title}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                  />
                                  <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white p-2">
                                    <ProgressBar
                                      now={getReadingProgress(item)}
                                      size="sm"
                                      className="mb-1"
                                    />
                                    <small>
                                      Chapitre {item.chapter?.chapter_number} • {getReadingProgress(item)}%
                                    </small>
                                  </div>
                                </div>
                                <Card.Body className="p-2">
                                  <Card.Title className="h6 mb-1">{item.manga?.title}</Card.Title>
                                  <div className="d-grid">
                                    <Button
                                      onClick={() => navigate(`/manga/${item.manga?.slug}`)}
                                      variant="primary"
                                      size="sm"
                                    >
                                      Continuer
                                    </Button>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </Tab.Pane>

                    {/* Favorites Tab */}
                    <Tab.Pane eventKey="favorites">
                      {favorites.length > 0 ? (
                        <>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Mes manga favoris</h5>
                            <Badge bg="primary" pill>{favorites.length}</Badge>
                          </div>
                          <Row>
                            {favorites.map(favorite => (
                              <Col key={favorite.id} lg={4} md={6} className="mb-4">
                                <Card className="h-100">
                                  <div className="position-relative">
                                    <Card.Img
                                      variant="top"
                                      src={favorite.manga.cover_image}
                                      alt={favorite.manga.title}
                                      style={{ height: '250px', objectFit: 'cover' }}
                                    />
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      className="position-absolute top-0 end-0 m-2"
                                      onClick={() => handleRemoveFavorite(favorite.id)}
                                      title="Supprimer des favoris"
                                    >
                                      <i className="fas fa-heart"></i>
                                    </Button>
                                    <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white p-2">
                                      <small>
                                        Ajouté le {new Date(favorite.added_at).toLocaleDateString('fr-FR')}
                                      </small>
                                    </div>
                                  </div>
                                  <Card.Body>
                                    <Card.Title className="h6">{favorite.manga.title}</Card.Title>
                                    <Card.Text className="small text-muted">
                                      par {favorite.manga.author}
                                    </Card.Text>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <Badge bg={favorite.manga.status === 'ongoing' ? 'success' : 'primary'}>
                                        {favorite.manga.status === 'ongoing' ? 'En cours' : 'Terminé'}
                                      </Badge>
                                      <div className="text-warning">
                                        ⭐ {favorite.manga.rating}
                                      </div>
                                    </div>
                                    <Button
                                      onClick={() => navigate(`/manga/${favorite.manga.slug}`)}
                                      variant="outline-primary"
                                      size="sm"
                                      className="w-100 mt-2"
                                    >
                                      Voir détails
                                    </Button>
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        </>
                      ) : (
                        <div className="text-center py-5">
                          <i className="fas fa-heart fa-3x text-muted mb-3"></i>
                          <h4 className="text-muted">Aucun favori pour le moment</h4>
                          <p className="text-muted">Découvrez de nouveaux manga et ajoutez-les à vos favoris</p>
                          <Button onClick={() => navigate('/')} variant="primary">
                            <i className="fas fa-compass me-2"></i>
                            Explorer les manga
                          </Button>
                        </div>
                      )}
                    </Tab.Pane>

                    {/* History Tab */}
                    <Tab.Pane eventKey="history">
                      {readingHistory.length > 0 ? (
                        <>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Historique de lecture</h5>
                            <Badge bg="info" pill>{readingHistory.length}</Badge>
                          </div>
                          
                          {readingHistory.map(item => (
                            <Card key={item.id} className="mb-3">
                              <Card.Body>
                                <Row className="align-items-center">
                                  <Col md={2}>
                                    <img
                                      src={item.manga?.cover_image}
                                      alt={item.manga?.title}
                                      className="img-fluid rounded"
                                      style={{ height: '80px', objectFit: 'cover' }}
                                    />
                                  </Col>
                                  <Col md={6}>
                                    <Card.Title className="h6 mb-1">
                                      <button
                                        onClick={() => navigate(`/manga/${item.manga?.slug}`)}
                                        className="btn btn-link p-0 text-decoration-none text-start"
                                      >
                                        {item.manga?.title}
                                      </button>
                                    </Card.Title>
                                    <p className="text-muted mb-1 small">par {item.manga?.author}</p>
                                    <small className="text-muted">
                                      Dernière lecture: {formatTimeAgo(item.last_read_at)}
                                    </small>
                                  </Col>
                                  <Col md={2} className="text-center">
                                    <div className="fw-bold">
                                      Ch. {item.chapter?.chapter_number || 'N/A'}
                                    </div>
                                    <small className="text-muted">
                                      Page {item.last_page || 0}
                                    </small>
                                    <ProgressBar
                                      now={getReadingProgress(item)}
                                      size="sm"
                                      className="mt-1"
                                      style={{ height: '4px' }}
                                    />
                                  </Col>
                                  <Col md={2} className="text-end">
                                    <Button
                                      onClick={() => navigate(`/manga/${item.manga?.slug}`)}
                                      variant="outline-primary"
                                      size="sm"
                                      className="mb-1 w-100"
                                    >
                                      Continuer
                                    </Button>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          ))}
                        </>
                      ) : (
                        <div className="text-center py-5">
                          <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
                          <h4 className="text-muted">Aucun historique de lecture</h4>
                          <p className="text-muted">Commencez à lire des manga pour construire votre historique</p>
                          <Button onClick={() => navigate('/')} variant="primary">
                            <i className="fas fa-play me-2"></i>
                            Commencer à lire
                          </Button>
                        </div>
                      )}
                    </Tab.Pane>

                    {/* Preferences Tab */}
                    <Tab.Pane eventKey="preferences">
                      <Form onSubmit={handleProfileUpdate}>
                        <h5 className="mb-3">
                          <i className="fas fa-palette me-2"></i>
                          Préférences d'affichage
                        </h5>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Mode de lecture</Form.Label>
                              <Form.Select
                                value={preferences.readingMode}
                                onChange={(e) => handleInputChange('preferences.readingMode', e.target.value)}
                                disabled={!isEditing}
                              >
                                <option value="single">Page simple</option>
                                <option value="double">Double page</option>
                                <option value="webtoon">Webtoon</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Thème</Form.Label>
                              <Form.Select
                                value={preferences.theme}
                                onChange={(e) => handleInputChange('preferences.theme', e.target.value)}
                                disabled={!isEditing}
                              >
                                <option value="auto">Automatique</option>
                                <option value="light">Clair</option>
                                <option value="dark">Sombre</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-4">
                          <Form.Label>Langue</Form.Label>
                          <Form.Select
                            value={preferences.language}
                            onChange={(e) => handleInputChange('preferences.language', e.target.value)}
                            disabled={!isEditing}
                          >
                            <option value="fr">🇫🇷 Français</option>
                            <option value="en">🇺🇸 English</option>
                            <option value="es">🇪🇸 Español</option>
                            <option value="ja">🇯🇵 日本語</option>
                          </Form.Select>
                        </Form.Group>

                        <h5 className="mb-3">
                          <i className="fas fa-bell me-2"></i>
                          Notifications
                        </h5>

                        <div className="border rounded p-3 mb-4">
                          <Form.Check
                            type="switch"
                            label="Nouveaux chapitres de mes favoris"
                            checked={preferences.notifications.favorites}
                            onChange={(e) => handleInputChange('preferences.notifications.favorites', e.target.checked)}
                            disabled={!isEditing}
                            className="mb-2"
                          />
                          <Form.Check
                            type="switch"
                            label="Nouvelles sorties manga"
                            checked={preferences.notifications.newChapters}
                            onChange={(e) => handleInputChange('preferences.notifications.newChapters', e.target.checked)}
                            disabled={!isEditing}
                            className="mb-2"
                          />
                          <Form.Check
                            type="switch"
                            label="Recommandations"
                            checked={preferences.notifications.recommendations}
                            onChange={(e) => handleInputChange('preferences.notifications.recommendations', e.target.checked)}
                            disabled={!isEditing}
                            className="mb-2"
                          />
                          <Form.Check
                            type="switch"
                            label="Notifications par email"
                            checked={preferences.notifications.email}
                            onChange={(e) => handleInputChange('preferences.notifications.email', e.target.checked)}
                            disabled={!isEditing}
                          />
                        </div>

                        <h5 className="mb-3">
                          <i className="fas fa-book-open me-2"></i>
                          Préférences de lecture
                        </h5>

                        <div className="border rounded p-3 mb-4">
                          <Form.Check
                            type="switch"
                            label="Marque-page automatique"
                            checked={preferences.reading.autoBookmark}
                            onChange={(e) => handleInputChange('preferences.reading.autoBookmark', e.target.checked)}
                            disabled={!isEditing}
                            className="mb-2"
                          />
                          <Form.Group className="mb-2">
                            <Form.Label className="small">Couleur de fond de lecture</Form.Label>
                            <Form.Select
                              value={preferences.reading.backgroundColor}
                              onChange={(e) => handleInputChange('preferences.reading.backgroundColor', e.target.value)}
                              disabled={!isEditing}
                              size="sm"
                            >
                              <option value="white">Blanc</option>
                              <option value="black">Noir</option>
                              <option value="sepia">Sépia</option>
                            </Form.Select>
                          </Form.Group>
                        </div>

                        {isEditing && (
                          <div className="d-flex gap-2">
                            <Button
                              type="submit"
                              variant="primary"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Spinner size="sm" className="me-2" />
                                  Enregistrement...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-save me-2"></i>
                                  Sauvegarder les préférences
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline-secondary"
                              onClick={() => setIsEditing(false)}
                            >
                              Annuler
                            </Button>
                          </div>
                        )}
                      </Form>
                    </Tab.Pane>

                    {/* Account Tab */}
                    <Tab.Pane eventKey="account">
                      <Row>
                        <Col lg={8}>
                          <h5 className="mb-3">
                            <i className="fas fa-user me-2"></i>
                            Informations personnelles
                          </h5>
                          
                          <Form onSubmit={handleProfileUpdate}>
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Nom d'utilisateur</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={profileData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    isInvalid={!!errors.username}
                                    disabled={!isEditing || isSubmitting}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.username}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Email</Form.Label>
                                  <Form.Control
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    isInvalid={!!errors.email}
                                    disabled={!isEditing || isSubmitting}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                            </Row>

                            <Form.Group className="mb-4">
                              <Form.Label>Biographie</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                value={profileData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                disabled={!isEditing || isSubmitting}
                                placeholder="Parlez-nous de vous..."
                              />
                              <Form.Text className="text-muted">
                                {profileData.bio.length}/200 caractères
                              </Form.Text>
                            </Form.Group>

                            {isEditing && (
                              <div className="d-flex gap-2 mb-4">
                                <Button
                                  type="submit"
                                  variant="primary"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? (
                                    <>
                                      <Spinner size="sm" className="me-2" />
                                      Mise à jour...
                                    </>
                                  ) : (
                                    <>
                                      <i className="fas fa-save me-2"></i>
                                      Sauvegarder
                                    </>
                                  )}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline-secondary"
                                  onClick={() => setIsEditing(false)}
                                >
                                  Annuler
                                </Button>
                              </div>
                            )}
                          </Form>
                        </Col>

                        <Col lg={4}>
                          <h5 className="mb-3">
                            <i className="fas fa-shield-alt me-2"></i>
                            Sécurité du compte
                          </h5>
                          
                          <Alert variant="info" className="mb-3">
                            <i className="fas fa-info-circle me-2"></i>
                            Votre compte est sécurisé. Dernière connexion: {new Date().toLocaleDateString('fr-FR')}
                          </Alert>
                          
                          <div className="d-grid gap-2 mb-3">
                            <Button
                              variant="warning"
                              onClick={() => setShowPasswordModal(true)}
                            >
                              <i className="fas fa-key me-2"></i>
                              Changer le mot de passe
                            </Button>
                            
                            <Button variant="outline-info" disabled>
                              <i className="fas fa-download me-2"></i>
                              Exporter mes données
                            </Button>
                          </div>

                          <Alert variant="danger">
                            <h6>Zone de danger</h6>
                            <p className="mb-2 small">
                              La suppression de votre compte est irréversible et effacera toutes vos données.
                            </p>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => setShowDeleteModal(true)}
                            >
                              <i className="fas fa-trash me-2"></i>
                              Supprimer mon compte
                            </Button>
                          </Alert>
                        </Col>
                      </Row>
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Col>
        </Row>
      </Container>

      {/* Password Change Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-lock me-2"></i>
            Changer le mot de passe
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe actuel</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handleInputChange('password.currentPassword', e.target.value)}
                isInvalid={!!errors.currentPassword}
                placeholder="Votre mot de passe actuel"
              />
              <Form.Control.Feedback type="invalid">
                {errors.currentPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nouveau mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handleInputChange('password.newPassword', e.target.value)}
                isInvalid={!!errors.newPassword}
                placeholder="Nouveau mot de passe"
              />
              <Form.Control.Feedback type="invalid">
                {errors.newPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handleInputChange('password.confirmPassword', e.target.value)}
                isInvalid={!!errors.confirmPassword}
                placeholder="Confirmez le nouveau mot de passe"
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowPasswordModal(false);
              setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              });
              setErrors({});
            }}
          >
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handlePasswordSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="me-2" />
                Modification...
              </>
            ) : (
              <>
                <i className="fas fa-key me-2"></i>
                Changer le mot de passe
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Supprimer le compte
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <strong>Attention !</strong> Cette action est irréversible.
          </Alert>
          <p>
            La suppression de votre compte entraînera la perte définitive de :
          </p>
          <ul>
            <li>Tous vos manga favoris</li>
            <li>Votre historique de lecture</li>
            <li>Vos préférences et paramètres</li>
            <li>Vos statistiques de lecture</li>
          </ul>
          <p>
            <strong>Êtes-vous sûr de vouloir continuer ?</strong>
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="danger"
            onClick={() => {
              toast.error('Fonctionnalité pas encore implémentée');
              setShowDeleteModal(false);
            }}
          >
            <i className="fas fa-trash me-2"></i>
            Supprimer définitivement
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserProfilePage;