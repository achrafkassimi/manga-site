// src/components/auth/RegisterForm.jsx - Complete Registration Form
// // src/components/auth/RegisterForm.jsx
// const RegisterForm = ({ onSuccess }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (formData.username.length < 3) {
//       newErrors.username = 'Username must be at least 3 characters long';
//     }
    
//     if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
    
//     if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters long';
//     }
    
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }
    
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
    
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setLoading(true);
//     setErrors({});

//     try {
//       const result = await authAPI.register({
//         username: formData.username,
//         email: formData.email,
//         password: formData.password
//       });
      
//       if (onSuccess) onSuccess(result);
//     } catch (err) {
//       setErrors({ general: err.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
    
//     // Clear specific field error when user types
//     if (errors[e.target.name]) {
//       setErrors({
//         ...errors,
//         [e.target.name]: ''
//       });
//     }
//   };

//   return (
//     <Form onSubmit={handleSubmit}>
//       {errors.general && <Alert variant="danger">{errors.general}</Alert>}
      
//       <Form.Group className="mb-3">
//         <Form.Label>Username</Form.Label>
//         <Form.Control
//           type="text"
//           name="username"
//           value={formData.username}
//           onChange={handleChange}
//           required
//           disabled={loading}
//           isInvalid={!!errors.username}
//         />
//         <Form.Control.Feedback type="invalid">
//           {errors.username}
//         </Form.Control.Feedback>
//       </Form.Group>

//       <Form.Group className="mb-3">
//         <Form.Label>Email</Form.Label>
//         <Form.Control
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//           disabled={loading}
//           isInvalid={!!errors.email}
//         />
//         <Form.Control.Feedback type="invalid">
//           {errors.email}
//         </Form.Control.Feedback>
//       </Form.Group>

//       <Form.Group className="mb-3">
//         <Form.Label>Password</Form.Label>
//         <Form.Control
//           type="password"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//           disabled={loading}
//           isInvalid={!!errors.password}
//         />
//         <Form.Control.Feedback type="invalid">
//           {errors.password}
//         </Form.Control.Feedback>
//       </Form.Group>

//       <Form.Group className="mb-3">
//         <Form.Label>Confirm Password</Form.Label>
//         <Form.Control
//           type="password"
//           name="confirmPassword"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           required
//           disabled={loading}
//           isInvalid={!!errors.confirmPassword}
//         />
//         <Form.Control.Feedback type="invalid">
//           {errors.confirmPassword}
//         </Form.Control.Feedback>
//       </Form.Group>

//       <Button
//         type="submit"
//         variant="primary"
//         disabled={loading}
//         className="w-100"
//       >
//         {loading ? (
//           <>
//             <span className="spinner-border spinner-border-sm me-2"></span>
//             Creating Account...
//           </>
//         ) : (
//           'Create Account'
//         )}
//       </Button>
//     </Form>
//   );
// };
// export default RegisterForm;















import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.password_confirm) {
      newErrors.password_confirm = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    try {
      await register(formData);
      toast.success('Registration successful! Welcome to MangaSet!');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
      if (error.details) {
        setErrors(error.details);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <Card className="shadow border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <i className="fas fa-user-plus fa-3x text-primary"></i>
                </div>
                <h2 className="fw-bold mb-2">Create Account</h2>
                <p className="text-muted">Join MangaSet today</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        placeholder="John"
                        value={formData.first_name}
                        onChange={handleChange}
                        disabled={loading}
                        isInvalid={!!errors.first_name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.first_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        placeholder="Doe"
                        value={formData.last_name}
                        onChange={handleChange}
                        disabled={loading}
                        isInvalid={!!errors.last_name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.last_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Username *</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    isInvalid={!!errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="password_confirm"
                    placeholder="Confirm your password"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    isInvalid={!!errors.password_confirm}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password_confirm}
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </Button>
                </div>
              </Form>

              <div className="text-center">
                <p className="text-muted mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none fw-bold text-primary">
                    Sign in here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;