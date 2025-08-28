// src/pages/UserProfilePage.jsx - Profil utilisateur complet
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {  Container, Row, Col, Card, Nav, Tab, Button, Form, Badge, ProgressBar, Modal, Alert, ListGroup, Image } from 'react-bootstrap';
import { useAuth } from '/src/context/AuthContext';
import { mangaService } from '/src/services/mangaService';
import MangaCard from '/src/components/manga/MangaCard';
import LoadingSpinner from '/src/components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const UserProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  // Déterminer l'onglet actif basé sur l'URL
  const getInitialTab = () => {
    const path = location.pathname;
    if (path.includes('favorites')) return 'favorites';
    if (path.includes('history')) return 'history';
    if (path.includes('settings')) return 'settings';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [favorites, setFavorites] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: '',
    preferences: {
      theme: 'auto',
      language: 'fr',
      notifications: {
        newChapters: true,
        favorites: true,
        email: false
      },
      reading: {
        autoBookmark: true,
        readingMode: 'single',
        backgroundColor: 'white'
      }
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [favoritesResponse, historyResponse] = await Promise.all([
        mangaService.getUserFavorites(),
        mangaService.getUserHistory()
      ]);

      const favData = favoritesResponse.data.results || favoritesResponse.data || [];
      const histData = historyResponse.data.results || historyResponse.data || [];

      setFavorites(favData);
      setReadingHistory(histData);
      
      // Calculate user statistics
      const stats = {
        totalFavorites: favData.length,
        totalRead: histData.length,
        chaptersRead: histData.reduce((total, item) => 
          total + Math.floor((item.progress_percentage || 0) / 100), 0),
        averageRating: 8.5, // Mock data
        readingStreak: 15, // Mock data
        totalReadingTime: 150 // Mock data en heures
      };
      setUserStats(stats);

      // Set profile data
      setProfileData({
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || 'Passionné de manga 📚',
        avatar: user?.avatar || '',
        preferences: {
          theme: localStorage.getItem('theme') || 'auto',
          language: localStorage.getItem('language') || 'fr',
          notifications: {
            newChapters: true,
            favorites: true,
            email: false
          },
          reading: {
            autoBookmark: true,
            readingMode: 'single',
            backgroundColor: 'white'
          }
        }
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Erreur lors du chargement des données utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await mangaService.removeFromFavorites(favoriteId);
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      toast.success('Supprimé des favoris');
      
      // Update stats
      setUserStats(prev => ({
        ...prev,
        totalFavorites: prev.totalFavorites - 1
      }));
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update localStorage for preferences
      localStorage.setItem('theme', profileData.preferences.theme);
      localStorage.setItem('language', profileData.preferences.language);
      
      // Apply theme change immediately
      document.documentElement.setAttribute('data-bs-theme', 
        profileData.preferences.theme === 'auto' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : profileData.preferences.theme
      );
      
      toast.success('Profil mis à jour avec succès');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (child.includes('.')) {
        const [subParent, subChild] = child.split('.');
        setProfileData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [subParent]: {
              ...prev[parent][subParent],
              [subChild]: value
            }
          }
        }));
      } else {
        setProfileData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

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

  if (!isAuthenticated) {
    return (
      <Container className="mt-5 text-center">
        <div className="py-5">
          <i className="fas fa-lock fa-3x text-muted mb-3"></i>
          <h2>Accès restreint</h2>
          <p className="text-muted mb-4">Vous devez être connecté pour accéder à votre profil</p>
          <Button href="/auth" variant="primary" size="lg">
            <i className="fas fa-sign-in-alt me-2"></i>
            Se connecter
          </Button>
        </div>
      </Container>
    );
  }

  if (loading) {
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
                  src={profileData.avatar || `https://ui-avatars.com/api/?name=${profileData.username}&background=ffffff&color=007bff&size=128`}
                  alt="Avatar"
                  roundedCircle
                  style={{ width: '100px', height: '100px', border: '4px solid rgba(255,255,255,0.3)' }}
                />
                {isEditing && (
                  <Button
                    variant="light"
                    size="sm"
                    className="position-absolute bottom-0 end-0 rounded-circle"
                    style={{ width: '32px', height: '32px', padding: '0' }}
                  >
                    <i className="fas fa-camera"></i>
                  </Button>
                )}
              </div>
            </Col>
            <Col md={6}>
              <h2 className="mb-1">{profileData.username}</h2>
              <p className="mb-2 opacity-75">{profileData.email}</p>
              <p className="mb-3">{profileData.bio}</p>
              
              {/* Quick Stats */}
              <Row className="text-center">
                <Col>
                  <div>
                    <strong>{userStats.totalFavorites}</strong>
                    <br />
                    <small className="opacity-75">Favoris</small>
                  </div>
                </Col>
                <Col>
                  <div>
                    <strong>{userStats.chaptersRead}</strong>
                    <br />
                    <small className="opacity-75">Chapitres lus</small>
                  </div>
                </Col>
                <Col>
                  <div>
                    <strong>{userStats.readingStreak}</strong>
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
                onClick={() => setShowDeleteModal(true)}
              >
                <i className="fas fa-cog me-1"></i>
                Paramètres
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
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
                  <Nav.Link eventKey="settings">
                    <i className="fas fa-cog me-2"></i>
                    Paramètres
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
                    <Col lg={8} className="mb-4">
                      <h5 className="mb-3">
                        <i className="fas fa-chart-bar me-2"></i>
                        Statistiques de lecture
                      </h5>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Card className="text-center h-100">
                            <Card.Body>
                              <i className="fas fa-heart fa-2x text-danger mb-2"></i>
                              <h3 className="mb-1">{userStats.totalFavorites}</h3>
                              <small className="text-muted">Manga favoris</small>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Card className="text-center h-100">
                            <Card.Body>
                              <i className="fas fa-book-open fa-2x text-primary mb-2"></i>
                              <h3 className="mb-1">{userStats.totalRead}</h3>
                              <small className="text-muted">Manga en cours</small>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Card className="text-center h-100">
                            <Card.Body>
                              <i className="fas fa-fire fa-2x text-warning mb-2"></i>
                              <h3 className="mb-1">{userStats.readingStreak}</h3>
                              <small className="text-muted">Série de lecture</small>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Card className="text-center h-100">
                            <Card.Body>
                              <i className="fas fa-clock fa-2x text-info mb-2"></i>
                              <h3 className="mb-1">{userStats.totalReadingTime}h</h3>
                              <small className="text-muted">Temps de lecture</small>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Col>

                    {/* Recent Activity */}
                    <Col lg={4}>
                      <h5 className="mb-3">
                        <i className="fas fa-clock me-2"></i>
                        Activité récente
                      </h5>
                      <Card>
                        <ListGroup variant="flush">
                          {readingHistory.slice(0, 5).map((item, index) => (
                            <ListGroup.Item key={index} className="px-3 py-2">
                              <div className="d-flex align-items-center">
                                <img
                                  src={item.manga?.cover_image || '/placeholder-cover.jpg'}
                                  alt={item.manga?.title}
                                  style={{ width: '40px', height: '50px', objectFit: 'cover' }}
                                  className="rounded me-3"
                                />
                                <div className="flex-grow-1">
                                  <div className="fw-semibold small">
                                    {item.manga?.title}
                                  </div>
                                  <div className="text-muted small">
                                    Ch. {item.chapter?.chapter_number} • {formatTimeAgo(item.last_read_at)}
                                  </div>
                                  <ProgressBar
                                    now={getReadingProgress(item)}
                                    size="sm"
                                    className="mt-1"
                                    style={{ height: '4px' }}
                                  />
                                </div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card>
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
                                src={item.manga?.cover_image || '/placeholder-cover.jpg'}
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
                                  as="a"
                                  href={`/manga/${item.manga?.slug}`}
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
                        <Button variant="outline-danger" size="sm" disabled>
                          <i className="fas fa-trash me-1"></i>
                          Supprimer sélection
                        </Button>
                      </div>
                      <Row>
                        {favorites.map(favorite => (
                          <Col key={favorite.id} lg={3} md={4} sm={6} className="mb-4">
                            <div className="position-relative">
                              <MangaCard 
                                manga={favorite.manga} 
                                showFavoriteButton={false}
                              />
                              <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0 m-2"
                                onClick={() => handleRemoveFavorite(favorite.id)}
                                style={{ zIndex: 10 }}
                              >
                                <i className="fas fa-times"></i>
                              </Button>
                              <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white p-2 m-3 rounded">
                                <small>
                                  Ajouté le {new Date(favorite.added_at).toLocaleDateString('fr-FR')}
                                </small>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </>
                  ) : (
                    <div className="text-center py-5">
                      <i className="fas fa-heart fa-3x text-muted mb-3"></i>
                      <h4 className="text-muted">Aucun favori pour le moment</h4>
                      <p className="text-muted">Découvrez de nouveaux manga et ajoutez-les à vos favoris !</p>
                      <Button href="/" variant="primary">
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
                        <Button variant="outline-secondary" size="sm" disabled>
                          <i className="fas fa-download me-1"></i>
                          Exporter
                        </Button>
                      </div>
                      
                      {readingHistory.map(item => (
                        <Card key={item.id} className="mb-3">
                          <Card.Body>
                            <Row className="align-items-center">
                              <Col md={2}>
                                <img
                                  src={item.manga?.cover_image || '/placeholder-cover.jpg'}
                                  alt={item.manga?.title}
                                  className="img-fluid rounded"
                                  style={{ height: '80px', objectFit: 'cover' }}
                                />
                              </Col>
                              <Col md={6}>
                                <Card.Title className="h5 mb-1">
                                  <a 
                                    href={`/manga/${item.manga?.slug}`}
                                    className="text-decoration-none"
                                  >
                                    {item.manga?.title}
                                  </a>
                                </Card.Title>
                                <p className="text-muted mb-1">par {item.manga?.author}</p>
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
                                  label={`${getReadingProgress(item)}%`}
                                />
                              </Col>
                              <Col md={2} className="text-end">
                                <Button
                                  as="a"
                                  href={`/manga/${item.manga?.slug}`}
                                  variant="outline-primary"
                                  size="sm"
                                  className="mb-1 w-100"
                                >
                                  Continuer
                                </Button>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  className="w-100"
                                  disabled
                                >
                                  <i className="fas fa-times"></i>
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
                      <p className="text-muted">Commencez à lire des manga pour construire votre historique !</p>
                      <Button href="/" variant="primary">
                        <i className="fas fa-play me-2"></i>
                        Commencer à lire
                      </Button>
                    </div>
                  )}
                </Tab.Pane>

                {/* Settings Tab */}
                <Tab.Pane eventKey="settings">
                  <Form onSubmit={handleProfileUpdate}>
                    <Row>
                      <Col lg={8}>
                        <h5 className="mb-3">
                          <i className="fas fa-user me-2"></i>
                          Informations personnelles
                        </h5>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Nom d'utilisateur</Form.Label>
                          <Form.Control
                            type="text"
                            value={profileData.username}
                            onChange={(e) => handleProfileChange('username', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>Biographie</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={profileData.bio}
                            onChange={(e) => handleProfileChange('bio', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Parlez-nous de vous..."
                          />
                        </Form.Group>

                        <h5 className="mb-3">
                          <i className="fas fa-palette me-2"></i>
                          Préférences d'affichage
                        </h5>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Thème</Form.Label>
                              <Form.Select
                                value={profileData.preferences.theme}
                                onChange={(e) => handleProfileChange('preferences.theme', e.target.value)}
                                disabled={!isEditing}
                              >
                                <option value="auto">Automatique</option>
                                <option value="light">Clair</option>
                                <option value="dark">Sombre</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Langue</Form.Label>
                              <Form.Select
                                value={profileData.preferences.language}
                                onChange={(e) => handleProfileChange('preferences.language', e.target.value)}
                                disabled={!isEditing}
                              >
                                <option value="fr">Français</option>
                                <option value="en">English</option>
                                <option value="ar">العربية</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <h5 className="mb-3">
                          <i className="fas fa-bell me-2"></i>
                          Notifications
                        </h5>

                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            label="Nouveaux chapitres de mes favoris"
                            checked={profileData.preferences.notifications.favorites}
                            onChange={(e) => handleProfileChange('preferences.notifications.favorites', e.target.checked)}
                            disabled={!isEditing}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            label="Nouvelles sorties manga"
                            checked={profileData.preferences.notifications.newChapters}
                            onChange={(e) => handleProfileChange('preferences.notifications.newChapters', e.target.checked)}
                            disabled={!isEditing}
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Check
                            type="checkbox"
                            label="Notifications par email"
                            checked={profileData.preferences.notifications.email}
                            onChange={(e) => handleProfileChange('preferences.notifications.email', e.target.checked)}
                            disabled={!isEditing}
                          />
                        </Form.Group>

                        {isEditing && (
                          <div className="d-flex gap-2">
                            <Button
                              type="submit"
                              variant="primary"
                              disabled={profileLoading}
                            >
                              {profileLoading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2"></span>
                                  Enregistrement...
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
                      </Col>

                      <Col lg={4}>
                        <h5 className="mb-3">
                          <i className="fas fa-shield-alt me-2"></i>
                          Sécurité du compte
                        </h5>
                        
                        <Card className="mb-3">
                          <Card.Body>
                            <h6>Sessions actives</h6>
                            <p className="text-muted small">
                              Gérez vos appareils connectés
                            </p>
                            <Button variant="outline-info" size="sm" disabled>
                              <i className="fas fa-mobile-alt me-1"></i>
                              Voir les sessions
                            </Button>
                          </Card.Body>
                        </Card>

                        <Card className="border-danger">
                          <Card.Body>
                            <h6 className="text-danger">Zone de danger</h6>
                            <p className="text-muted small">
                              Actions irréversibles sur votre compte
                            </p>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => setShowDeleteModal(true)}
                            >
                              <i className="fas fa-trash me-1"></i>
                              Supprimer le compte
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Form>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Tab.Container>
      </Container>

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