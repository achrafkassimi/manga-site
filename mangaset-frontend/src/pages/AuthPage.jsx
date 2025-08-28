// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination
  const from = location.state?.from?.pathname || '/';

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(loginData.username, loginData.password);
      setSuccess('Connexion réussie ! Redirection...');
      setTimeout(() => navigate(from, { replace: true }), 1500);
    } catch (error) {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      // Simulate registration API call
      console.log('Registration attempt:', registerData);
      setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setActiveTab('login');
      // Reset register form
      setRegisterData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError('Échec de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-page py-5" style={{ minHeight: '80vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} md={8}>
            <div className="text-center mb-4">
              <i className="fas fa-book-open fa-3x text-primary mb-3"></i>
              <h2>Bienvenue sur MangaSet</h2>
              <p className="text-muted">
                Connectez-vous pour accéder à vos favoris et suivre votre progression de lecture
              </p>
            </div>

            <Card className="shadow">
              <Card.Header className="p-0">
                <Nav variant="tabs" className="border-bottom-0">
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'login'}
                      onClick={() => {
                        setActiveTab('login');
                        setError('');
                        setSuccess('');
                      }}
                      className="px-4 py-3"
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Connexion
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'register'}
                      onClick={() => {
                        setActiveTab('register');
                        setError('');
                        setSuccess('');
                      }}
                      className="px-4 py-3"
                    >
                      <i className="fas fa-user-plus me-2"></i>
                      Inscription
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>

              <Card.Body className="p-4">
                {error && (
                  <Alert variant="danger" className="mb-3">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert variant="success" className="mb-3">
                    <i className="fas fa-check-circle me-2"></i>
                    {success}
                  </Alert>
                )}

                {activeTab === 'login' ? (
                  <Form onSubmit={handleLoginSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-user me-2"></i>
                        Nom d'utilisateur
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={loginData.username}
                        onChange={handleLoginChange}
                        placeholder="Entrez votre nom d'utilisateur"
                        required
                        autoComplete="username"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-lock me-2"></i>
                        Mot de passe
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="Entrez votre mot de passe"
                        required
                        autoComplete="current-password"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Se souvenir de moi"
                        id="remember-me"
                      />
                    </Form.Group>

                    <div className="d-grid">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Connexion...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-sign-in-alt me-2"></i>
                            Se connecter
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="text-center mt-3">
                      <a href="#" className="text-muted text-decoration-none small">
                        Mot de passe oublié ?
                      </a>
                    </div>
                  </Form>
                ) : (
                  <Form onSubmit={handleRegisterSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-user me-2"></i>
                        Nom d'utilisateur
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={registerData.username}
                        onChange={handleRegisterChange}
                        placeholder="Choisissez un nom d'utilisateur"
                        required
                        autoComplete="username"
                        minLength="3"
                      />
                      <Form.Text className="text-muted">
                        Minimum 3 caractères
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-envelope me-2"></i>
                        Adresse email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        placeholder="Entrez votre email"
                        required
                        autoComplete="email"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-lock me-2"></i>
                        Mot de passe
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        placeholder="Créez un mot de passe"
                        required
                        autoComplete="new-password"
                        minLength="6"
                      />
                      <Form.Text className="text-muted">
                        Minimum 6 caractères
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-lock me-2"></i>
                        Confirmer le mot de passe
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        placeholder="Confirmez votre mot de passe"
                        required
                        autoComplete="new-password"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label={
                          <span>
                            J'accepte les{' '}
                            <a href="/terms" className="text-decoration-none">
                              conditions d'utilisation
                            </a>{' '}
                            et la{' '}
                            <a href="/privacy" className="text-decoration-none">
                              politique de confidentialité
                            </a>
                          </span>
                        }
                        id="accept-terms"
                        required
                      />
                    </Form.Group>

                    <div className="d-grid">
                      <Button
                        type="submit"
                        variant="success"
                        size="lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Inscription...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-user-plus me-2"></i>
                            S'inscrire
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                )}

                {/* Social Login Options */}
                <div className="mt-4">
                  <div className="text-center mb-3">
                    <span className="text-muted small">Ou continuer avec</span>
                  </div>
                  
                  <Row className="g-2">
                    <Col>
                      <Button variant="outline-danger" className="w-100" disabled>
                        <i className="fab fa-google me-2"></i>
                        Google
                      </Button>
                    </Col>
                    <Col>
                      <Button variant="outline-primary" className="w-100" disabled>
                        <i className="fab fa-facebook-f me-2"></i>
                        Facebook
                      </Button>
                    </Col>
                    <Col>
                      <Button variant="outline-dark" className="w-100" disabled>
                        <i className="fab fa-github me-2"></i>
                        GitHub
                      </Button>
                    </Col>
                  </Row>
                  
                  <div className="text-center mt-2">
                    <small className="text-muted">
                      <i className="fas fa-info-circle me-1"></i>
                      Connexions sociales bientôt disponibles
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Additional Info */}
            <div className="text-center mt-4">
              <small className="text-muted">
                En vous connectant, vous acceptez nos conditions d'utilisation et 
                vous confirmez avoir lu notre politique de confidentialité.
              </small>
            </div>

            {/* Features Preview */}
            <Row className="mt-5 text-center">
              <Col md={4} className="mb-3">
                <div className="feature-preview p-3">
                  <i className="fas fa-bookmark fa-2x text-primary mb-2"></i>
                  <h6>Favoris</h6>
                  <small className="text-muted">
                    Sauvegardez vos manga préférés
                  </small>
                </div>
              </Col>
              <Col md={4} className="mb-3">
                <div className="feature-preview p-3">
                  <i className="fas fa-history fa-2x text-success mb-2"></i>
                  <h6>Historique</h6>
                  <small className="text-muted">
                    Suivez votre progression de lecture
                  </small>
                </div>
              </Col>
              <Col md={4} className="mb-3">
                <div className="feature-preview p-3">
                  <i className="fas fa-bell fa-2x text-info mb-2"></i>
                  <h6>Notifications</h6>
                  <small className="text-muted">
                    Recevez les nouveaux chapitres
                  </small>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AuthPage;