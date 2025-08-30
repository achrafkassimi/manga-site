// src/components/auth/LoginForm.jsx - Complete Login Form
import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Button, 
  Card, 
  Alert, 
  InputGroup,
  Spinner,
  Row,
  Col
} from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        remember_me: formData.rememberMe
      });

      if (result.success) {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider) => {
    try {
      // Redirect to social auth endpoint
      window.location.href = `/api/auth/social/${provider}`;
    } catch (error) {
      console.error('Social login error:', error);
    }
  };

  // Demo login (for testing)
  const handleDemoLogin = async () => {
    setFormData({
      email: 'demo@mangaset.com',
      password: 'demo123',
      rememberMe: false
    });
    
    // Auto-submit after a brief delay
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 500);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="login-form-container">
      <Card className="shadow-lg border-0">
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <div className="mb-3">
              <i className="fas fa-book-open fa-3x text-primary"></i>
            </div>
            <h2 className="fw-bold mb-2">Connexion</h2>
            <p className="text-muted">Connectez-vous à votre compte MangaSet</p>
          </div>

          {/* Social Login Options */}
          <div className="mb-4">
            <Row>
              <Col xs={6}>
                <Button
                  variant="outline-danger"
                  className="w-100 mb-2"
                  onClick={() => handleSocialLogin('google')}
                >
                  <i className="fab fa-google me-2"></i>
                  Google
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  variant="outline-primary"
                  className="w-100 mb-2"
                  onClick={() => handleSocialLogin('discord')}
                >
                  <i className="fab fa-discord me-2"></i>
                  Discord
                </Button>
              </Col>
            </Row>
            
            <div className="text-center my-3">
              <span className="text-muted">ou</span>
            </div>
          </div>

          {/* Login Form */}
          <Form onSubmit={handleSubmit}>
            {/* Email Field */}
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-envelope me-2"></i>
                Email
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  disabled={isSubmitting}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            {/* Password Field */}
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-lock me-2"></i>
                Mot de passe
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  disabled={isSubmitting}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            {/* Remember Me & Forgot Password */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Form.Check
                type="checkbox"
                name="rememberMe"
                label="Se souvenir de moi"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Link 
                to="/forgot-password" 
                className="text-decoration-none text-primary"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="d-grid gap-2 mb-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
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
          </Form>

          {/* Demo Login Button */}
          <div className="d-grid gap-2 mb-4">
            <Button
              variant="outline-success"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
            >
              <i className="fas fa-play me-2"></i>
              Connexion démo
            </Button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-muted">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-decoration-none fw-bold">
                Créer un compte
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Custom Styles */}
      <style jsx>{`
        .login-form-container {
          max-width: 450px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .card {
          border-radius: 1rem;
          transition: all 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
        
        .form-control {
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          border: 2px solid #e9ecef;
          transition: all 0.3s ease;
        }
        
        .form-control:focus {
          border-color: var(--bs-primary);
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }
        
        .btn {
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          transform: translateY(-2px);
        }
        
        .input-group .btn {
          border-radius: 0 0.5rem 0.5rem 0;
        }
        
        .form-check-input:checked {
          background-color: var(--bs-primary);
          border-color: var(--bs-primary);
        }
        
        @media (max-width: 576px) {
          .login-form-container {
            padding: 1rem 0.5rem;
          }
          
          .card-body {
            padding: 2rem 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;