// src/components/auth/UserDashboard.jsx - Complete User Dashboard
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
  ProgressBar,
  Spinner,
  Tab,
  Tabs
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      // Mock dashboard data - replace with real API calls
      const mockData = {
        stats: {
          totalRead: 1234,
          chaptersRead: 5673,
          hoursReading: 245,
          currentStreak: 15,
          longestStreak: 45,
          averageRating: 4.2
        },
        continueReading: [
          {
            id: 1,
            title: 'One Piece',
            cover: 'https://via.placeholder.com/60x80/007bff/ffffff?text=OP',
            lastChapter: 1090,
            progress: 85,
            lastRead: '2024-12-20T10:30:00Z',
            slug: 'one-piece'
          },
          {
            id: 2,
            title: 'Naruto',
            cover: 'https://via.placeholder.com/60x80/28a745/ffffff?text=N',
            lastChapter: 650,
            progress: 92,
            lastRead: '2024-12-19T15:20:00Z',
            slug: 'naruto'
          },
          {
            id: 3,
            title: 'Attack on Titan',
            cover: 'https://via.placeholder.com/60x80/dc3545/ffffff?text=AOT',
            lastChapter: 139,
            progress: 100,
            lastRead: '2024-12-18T20:45:00Z',
            slug: 'attack-on-titan'
          }
        ],
        recentlyFavorited: [
          {
            id: 4,
            title: 'Demon Slayer',
            cover: 'https://via.placeholder.com/60x80/6f42c1/ffffff?text=DS',
            rating: 4.8,
            genres: ['Action', 'Supernatural'],
            addedAt: '2024-12-20T08:15:00Z',
            slug: 'demon-slayer'
          },
          {
            id: 5,
            title: 'My Hero Academia',
            cover: 'https://via.placeholder.com/60x80/fd7e14/ffffff?text=MHA',
            rating: 4.5,
            genres: ['Action', 'School', 'Superhero'],
            addedAt: '2024-12-19T12:30:00Z',
            slug: 'my-hero-academia'
          }
        ],
        readingActivity: [
          { date: '2024-12-14', chapters: 5 },
          { date: '2024-12-15', chapters: 8 },
          { date: '2024-12-16', chapters: 3 },
          { date: '2024-12-17', chapters: 12 },
          { date: '2024-12-18', chapters: 7 },
          { date: '2024-12-19', chapters: 10 },
          { date: '2024-12-20', chapters: 6 }
        ],
        genreDistribution: [
          { genre: 'Action', count: 45, color: '#dc3545' },
          { genre: 'Romance', count: 23, color: '#e91e63' },
          { genre: 'Comedy', count: 18, color: '#ffc107' },
          { genre: 'Drama', count: 15, color: '#17a2b8' },
          { genre: 'Fantasy', count: 12, color: '#6f42c1' }
        ],
        achievements: [
          {
            id: 1,
            name: 'Premier pas',
            description: 'Lire votre premier manga',
            icon: 'fas fa-baby',
            color: 'success',
            unlocked: true,
            unlockedAt: '2024-01-15T10:00:00Z'
          },
          {
            id: 2,
            name: 'Lecteur assidu',
            description: 'Lire 100 chapitres',
            icon: 'fas fa-book-reader',
            color: 'primary',
            unlocked: true,
            unlockedAt: '2024-03-20T14:30:00Z'
          },
          {
            id: 3,
            name: 'Critique',
            description: 'Noter 50 manga',
            icon: 'fas fa-star',
            color: 'warning',
            unlocked: true,
            unlockedAt: '2024-05-10T09:15:00Z'
          },
          {
            id: 4,
            name: 'Marathon',
            description: 'Lire 24h d\'affilée',
            icon: 'fas fa-running',
            color: 'danger',
            unlocked: false,
            progress: 75
          }
        ]
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format time ago
  const timeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays} jours`;
  };

  // Chart configurations
  const readingActivityChart = {
    labels: dashboardData?.readingActivity.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    }) || [],
    datasets: [{
      label: 'Chapitres lus',
      data: dashboardData?.readingActivity.map(item => item.chapters) || [],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const genreChart = {
    labels: dashboardData?.genreDistribution.map(item => item.genre) || [],
    datasets: [{
      data: dashboardData?.genreDistribution.map(item => item.count) || [],
      backgroundColor: dashboardData?.genreDistribution.map(item => item.color) || [],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5 text-center">
        <i className="fas fa-lock fa-3x text-muted mb-3"></i>
        <h3>Accès restreint</h3>
        <p className="text-muted">Connectez-vous pour accéder à votre tableau de bord</p>
        <Button as={Link} to="/login" variant="primary">
          Se connecter
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Welcome Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          <i className="fas fa-tachometer-alt me-2 text-primary"></i>
          Bonjour, {user?.username}!
        </h2>
        <p className="text-muted">
          Voici votre activité de lecture récente
        </p>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        {/* Overview Tab */}
        <Tab eventKey="overview" title={<><i className="fas fa-home me-2"></i>Aperçu</>}>
          {/* Stats Cards */}
          <Row className="mb-4">
            <Col xl={3} md={6} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="text-primary mb-2">
                    <i className="fas fa-book fa-2x"></i>
                  </div>
                  <h3 className="fw-bold mb-1">{dashboardData?.stats.totalRead}</h3>
                  <p className="text-muted mb-0">Manga lus</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} md={6} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="text-success mb-2">
                    <i className="fas fa-list fa-2x"></i>
                  </div>
                  <h3 className="fw-bold mb-1">{dashboardData?.stats.chaptersRead}</h3>
                  <p className="text-muted mb-0">Chapitres lus</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} md={6} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="text-warning mb-2">
                    <i className="fas fa-clock fa-2x"></i>
                  </div>
                  <h3 className="fw-bold mb-1">{dashboardData?.stats.hoursReading}h</h3>
                  <p className="text-muted mb-0">Temps de lecture</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} md={6} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="text-danger mb-2">
                    <i className="fas fa-fire fa-2x"></i>
                  </div>
                  <h3 className="fw-bold mb-1">{dashboardData?.stats.currentStreak}</h3>
                  <p className="text-muted mb-0">Jours consécutifs</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Continue Reading */}
            <Col lg={6} className="mb-4">
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-bookmark me-2"></i>
                    Continuer la lecture
                  </h5>
                  <Button variant="outline-primary" size="sm" as={Link} to="/history">
                    Voir tout
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  <ListGroup variant="flush">
                    {dashboardData?.continueReading.map((manga) => (
                      <ListGroup.Item 
                        key={manga.id}
                        as={Link}
                        to={`/manga/${manga.slug}/chapter/${manga.lastChapter}`}
                        className="d-flex align-items-center text-decoration-none"
                      >
                        <img
                          src={manga.cover}
                          alt={manga.title}
                          className="rounded me-3"
                          style={{ width: '50px', height: '65px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-bold">{manga.title}</div>
                          <small className="text-muted">
                            Chapitre {manga.lastChapter} • {timeAgo(manga.lastRead)}
                          </small>
                          <div className="mt-1">
                            <ProgressBar 
                              now={manga.progress} 
                              size="sm" 
                              style={{ height: '4px' }}
                            />
                          </div>
                        </div>
                        <div className="text-end">
                          <Badge bg="primary">{manga.progress}%</Badge>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            {/* Recently Favorited */}
            <Col lg={6} className="mb-4">
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-heart me-2"></i>
                    Favoris récents
                  </h5>
                  <Button variant="outline-danger" size="sm" as={Link} to="/favorites">
                    Voir tout
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  <ListGroup variant="flush">
                    {dashboardData?.recentlyFavorited.map((manga) => (
                      <ListGroup.Item 
                        key={manga.id}
                        as={Link}
                        to={`/manga/${manga.slug}`}
                        className="d-flex align-items-center text-decoration-none"
                      >
                        <img
                          src={manga.cover}
                          alt={manga.title}
                          className="rounded me-3"
                          style={{ width: '50px', height: '65px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-bold">{manga.title}</div>
                          <div className="d-flex align-items-center mb-1">
                            <div className="text-warning me-2">
                              {'★'.repeat(Math.floor(manga.rating))}
                            </div>
                            <small className="text-muted">{manga.rating}/5</small>
                          </div>
                          <div>
                            {manga.genres.map((genre, index) => (
                              <Badge key={index} bg="secondary" className="me-1 small">
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <small className="text-muted">
                          {timeAgo(manga.addedAt)}
                        </small>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Statistics Tab */}
        <Tab eventKey="stats" title={<><i className="fas fa-chart-line me-2"></i>Statistiques</>}>
          <Row>
            {/* Reading Activity Chart */}
            <Col lg={8} className="mb-4">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Activité de lecture (7 derniers jours)</h5>
                </Card.Header>
                <Card.Body>
                  <div style={{ height: '300px' }}>
                    <Line data={readingActivityChart} options={chartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Genre Distribution */}
            <Col lg={4} className="mb-4">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Genres préférés</h5>
                </Card.Header>
                <Card.Body>
                  <div style={{ height: '300px' }}>
                    <Doughnut data={genreChart} options={chartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Detailed Stats */}
          <Row>
            <Col lg={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Statistiques détaillées</h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Note moyenne donnée:</span>
                      <strong>{dashboardData?.stats.averageRating}/5 ⭐</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Plus longue série:</span>
                      <strong>{dashboardData?.stats.longestStreak} jours</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Série actuelle:</span>
                      <strong>{dashboardData?.stats.currentStreak} jours</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Temps moyen par jour:</span>
                      <strong>2.4h</strong>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Top genres</h5>
                </Card.Header>
                <Card.Body>
                  {dashboardData?.genreDistribution.map((genre, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <div
                        className="rounded me-2"
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: genre.color
                        }}
                      ></div>
                      <div className="flex-grow-1">{genre.genre}</div>
                      <strong>{genre.count}</strong>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Achievements Tab */}
        <Tab eventKey="achievements" title={<><i className="fas fa-medal me-2"></i>Succès</>}>
          <Row>
            {dashboardData?.achievements.map((achievement) => (
              <Col lg={6} key={achievement.id} className="mb-3">
                <Card className={`h-100 ${achievement.unlocked ? 'border-success' : 'border-secondary'}`}>
                  <Card.Body className="d-flex align-items-center">
                    <div className={`rounded-circle p-3 me-3 bg-${achievement.color} ${achievement.unlocked ? '' : 'opacity-50'}`}>
                      <i className={`${achievement.icon} fa-2x text-white`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{achievement.name}</h6>
                      <p className="text-muted small mb-2">{achievement.description}</p>
                      {achievement.unlocked ? (
                        <Badge bg="success">
                          <i className="fas fa-check me-1"></i>
                          Débloqué {timeAgo(achievement.unlockedAt)}
                        </Badge>
                      ) : (
                        <div>
                          <div className="d-flex justify-content-between mb-1">
                            <small className="text-muted">Progression:</small>
                            <small className="text-muted">{achievement.progress}%</small>
                          </div>
                          <ProgressBar now={achievement.progress} size="sm" />
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserDashboard;