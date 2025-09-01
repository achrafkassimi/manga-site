// src/components/auth/ResetPassword.jsx - RESET PASSWORD COMPONENT
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner,
  InputGroup 
} from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    new_password: '',
    new_password_confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState('');
  
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      toast.error('Invalid reset link');
      navigate('/forgot-password');
    } else {
      setToken(resetToken);
    }
  }, [searchParams, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear errors when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.new_password) {
      newErrors.new_password = 'Password is required';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters long';
    }
    
    if (!formData.new_password_confirm) {
      newErrors.new_password_confirm = 'Please confirm your password';
    } else if (formData.new_password !== formData.new_password_confirm) {
      newErrors.new_password_confirm = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password/`, {
        token: token,
        new_password: formData.new_password,
        new_password_confirm: formData.new_password_confirm
      });

      toast.success('Password reset successful! You can now login with your new password.');
      navigate('/login');
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Password reset failed';
      toast.error(errorMessage);
      
      if (error.response?.data?.details) {
        setErrors(error.response.data.details);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="reset-password-container">
        <Card className="shadow border-0">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <div className="mb-3">
                <i className="fas fa-lock fa-3x text-primary"></i>
              </div>
              <h2 className="fw-bold mb-2">Reset Password</h2>
              <p className="text-muted">Enter your new password below</p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-key me-2"></i>
                  New Password
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="new_password"
                    placeholder="Enter new password"
                    value={formData.new_password}
                    onChange={handleChange}
                    isInvalid={!!errors.new_password}
                    disabled={loading}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    {errors.new_password}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-check me-2"></i>
                  Confirm New Password
                </Form.Label>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="new_password_confirm"
                  placeholder="Confirm new password"
                  value={formData.new_password_confirm}
                  onChange={handleChange}
                  isInvalid={!!errors.new_password_confirm}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.new_password_confirm}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid gap-2 mb-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check me-2"></i>
                      Reset Password
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
        .reset-password-container {
          max-width: 450px;
          margin: 0 auto;
        }
      `}</style>
    </Container>
  );
};

export default ResetPassword;