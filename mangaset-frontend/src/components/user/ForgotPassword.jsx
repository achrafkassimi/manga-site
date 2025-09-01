// src/components/auth/ForgotPassword.jsx - FORGOT PASSWORD COMPONENT
import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner 
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password/`, {
        email: email
      });

      setSubmitted(true);
      toast.success('Password reset instructions sent to your email');
      
      // In development mode, show the reset token
      if (response.data.reset_token) {
        console.log('Development reset token:', response.data.reset_token);
        toast.info('Check console for development reset token');
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send reset email';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Container className="py-5">
        <div className="forgot-password-container">
          <Card className="shadow border-0">
            <Card.Body className="p-5 text-center">
              <div className="mb-4">
                <i className="fas fa-check-circle fa-4x text-success mb-3"></i>
                <h2>Check Your Email</h2>
                <p className="text-muted">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
              </div>
              
              <div className="mb-4">
                <p className="text-muted">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>
              
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                  }}
                >
                  Try Different Email
                </Button>
                <Link to="/login" className="btn btn-primary">
                  Back to Login
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="forgot-password-container">
        <Card className="shadow border-0">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <div className="mb-3">
                <i className="fas fa-key fa-3x text-primary"></i>
              </div>
              <h2 className="fw-bold mb-2">Forgot Password?</h2>
              <p className="text-muted">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-envelope me-2"></i>
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoFocus
                />
              </Form.Group>

              <div className="d-grid gap-2 mb-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading || !email.trim()}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Sending Instructions...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>
                      Send Reset Instructions
                    </>
                  )}
                </Button>
              </div>
            </Form>

            <div className="text-center">
              <Link to="/login" className="text-decoration-none">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Login
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>

      <style jsx>{`
        .forgot-password-container {
          max-width: 450px;
          margin: 0 auto;
        }
        
        .card {
          border-radius: 1rem;
        }
        
        .form-control {
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          border: 2px solid #e9ecef;
        }
        
        .form-control:focus {
          border-color: var(--bs-primary);
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }
        
        .btn {
          border-radius: 0.5rem;
          font-weight: 500;
        }
      `}</style>
    </Container>
  );
};

export default ForgotPassword;