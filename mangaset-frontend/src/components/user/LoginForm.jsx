// src/components/auth/LoginForm.jsx - FIXED COMPLETE LOGIN FORM
import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Button, 
  Card, 
  Alert, 
  InputGroup,
  Spinner,
  Row,
  Col,
  Container
} from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const LoginForm = () => {
  // State management
  const [formData, setFormData] = useState({
    username: '', // Changed from email to username to match backend
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Auth context and navigation
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
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Username validation (can be email or username)
    if (!formData.username.trim()) {
      newErrors.username = 'Username or email is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');
    
    try {
      // Attempt login
      const result = await login({
        username: formData.username.trim(),
        password: formData.password,
        remember_me: formData.rememberMe
      });

      // Check if login was successful
      if (result && result.success !== false) {
        toast.success('Login successful! Welcome back!');
        
        // Navigate to intended destination
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        throw new Error(result?.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error types
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message.includes('Invalid credentials')) {
        errorMessage = 'Invalid username or password. Please check your credentials.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else if (error.message.includes('429')) {
        errorMessage = 'Too many login attempts. Please wait a moment and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setGeneralError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle demo login for testing
  const handleDemoLogin = async () => {
    setFormData({
      username: 'demo@mangaset.com',
      password: 'demo123456',
      rememberMe: false
    });
    
    // Clear any existing errors
    setErrors({});
    setGeneralError('');
    
    // Auto-submit after setting data
    setTimeout(async () => {
      try {
        setIsSubmitting(true);
        const result = await login({
          username: 'demo@mangaset.com',
          password: 'demo123456',
          remember_me: false
        });
        
        if (result && result.success !== false) {
          toast.success('Demo login successful!');
          navigate('/', { replace: true });
        }
      } catch (error) {
        setGeneralError('Demo login failed. Please try manual login.');
        toast.error('Demo login failed');
      } finally {
        setIsSubmitting(false);
      }
    }, 500);
  };

  // Social login handlers (placeholder for future implementation)
  const handleSocialLogin = async (provider) => {
    try {
      toast.info(`${provider} login coming soon!`);
      // TODO: Implement social login
      // window.location.href = `/api/auth/social/${provider}/`;
    } catch (error) {
      console.error('Social login error:', error);
      toast.error(`${provider} login failed`);
    }
  };

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Checking authentication...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="login-form-container">
        <Card className="shadow-lg border-0">
          <Card.Body className="p-5">
            {/* Header Section */}
            <div className="text-center mb-4">
              <div className="mb-3">
                <i className="fas fa-book-open fa-3x text-primary"></i>
              </div>
              <h2 className="fw-bold mb-2">Welcome Back!</h2>
              <p className="text-muted">Sign in to your MangaSet account</p>
            </div>

            {/* General Error Alert */}
            {generalError && (
              <Alert variant="danger" dismissible onClose={() => setGeneralError('')}>
                <i className="fas fa-exclamation-triangle me-2"></i>
                {generalError}
              </Alert>
            )}

            {/* Social Login Section (Optional) */}
            {/* <div className="mb-4">
              <Row className="g-2">
                <Col xs={6}>
                  <Button
                    variant="outline-danger"
                    className="w-100"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isSubmitting}
                  >
                    <i className="fab fa-google me-2"></i>
                    Google
                  </Button>
                </Col>
                <Col xs={6}>
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => handleSocialLogin('discord')}
                    disabled={isSubmitting}
                  >
                    <i className="fab fa-discord me-2"></i>
                    Discord
                  </Button>
                </Col>
              </Row>
              
              <div className="text-center my-3">
                <span className="text-muted small">or sign in with your account</span>
              </div>
            </div> */}

            {/* Login Form */}
            <Form onSubmit={handleSubmit} noValidate>
              {/* Username/Email Field */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-user me-2"></i>
                  Username or Email
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter your username or email"
                    value={formData.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                    disabled={isSubmitting}
                    autoComplete="username"
                    autoFocus
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              {/* Password Field */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-lock me-2"></i>
                  Password
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    type="button"
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
                  label="Remember me"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <Link 
                  to="/forgot-password" 
                  className="text-decoration-none text-primary small"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <div className="d-grid gap-2 mb-3">
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Sign In
                    </>
                  )}
                </Button>
              </div>
            </Form>

            {/* Demo Login Button */}
            {/* <div className="d-grid gap-2 mb-4">
              <Button
                variant="outline-success"
                onClick={handleDemoLogin}
                disabled={isSubmitting}
              >
                <i className="fas fa-play me-2"></i>
                Try Demo Login
              </Button>
            </div> */}

            {/* Register Link */}
            <div className="text-center">
              <p className="text-muted mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-decoration-none fw-bold text-primary">
                  Create one now
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .login-form-container {
          max-width: 450px;
          margin: 0 auto;
        }
        
        .card {
          border-radius: 1rem;
          transition: all 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
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
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-1px);
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
            margin: 1rem;
          }
          
          .card-body {
            padding: 2rem 1.5rem !important;
          }
        }
      `}</style>
    </Container>
  );
};

export default LoginForm;