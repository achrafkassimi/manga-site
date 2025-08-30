// // src/components/user/RegisterForm.jsx
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// const RegisterForm = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (formData.password !== formData.confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await axios.post('http://localhost:8000/api/auth/register/', {
//         username: formData.username,
//         email: formData.email,
//         password: formData.password
//       });
      
//       toast.success('Registration successful! Please login.');
//       // Redirect to login page or auto-login
//     } catch (error) {
//       toast.error('Registration failed. Please try again.');
//       console.error('Registration error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6 col-lg-4">
//           <div className="card shadow">
//             <div className="card-body">
//               <h3 className="card-title text-center mb-4">Register</h3>
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="username" className="form-label">Username</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="username"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="email" className="form-label">Email</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="password" className="form-label">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   className="btn btn-primary w-100"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Registering...' : 'Register'}
//                 </button>
//               </form>
//               <div className="text-center mt-3">
//                 <p>Already have an account? <Link to="/login">Login</Link></p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterForm;





// src/components/auth/RegisterForm.jsx - Complete Registration Form
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
  ProgressBar,
  Modal
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Calculate password strength
  useEffect(() => {
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

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

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 25;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Number or special character check
    if (/[\d\W]/.test(password)) strength += 25;
    
    return strength;
  };

  // Get password strength info
  const getPasswordStrengthInfo = () => {
    if (passwordStrength < 25) {
      return { color: 'danger', text: 'Très faible' };
    } else if (passwordStrength < 50) {
      return { color: 'warning', text: 'Faible' };
    } else if (passwordStrength < 75) {
      return { color: 'info', text: 'Moyen' };
    } else {
      return { color: 'success', text: 'Fort' };
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (passwordStrength < 50) {
      newErrors.password = 'Le mot de passe est trop faible';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Vous devez accepter les conditions d\'utilisation';
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
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        setShowSuccessModal(true);
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle social registration
  const handleSocialRegister = async (provider) => {
    try {
      // Redirect to social auth endpoint
      window.location.href = `/api/auth/social/${provider}`;
    } catch (error) {
      console.error('Social registration error:', error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const strengthInfo = getPasswordStrengthInfo();

  return (
    <div className="register-form-container">
      <Card className="shadow-lg border-0">
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <div className="mb-3">
              <i className="fas fa-user-plus fa-3x text-primary"></i>
            </div>
            <h2 className="fw-bold mb-2">Créer un compte</h2>
            <p className="text-muted">Rejoignez la communauté MangaSet</p>
          </div>

          {/* Social Registration Options */}
          <div className="mb-4">
            <Row>
              <Col xs={6}>
                <Button
                  variant="outline-danger"
                  className="w-100 mb-2"
                  onClick={() => handleSocialRegister('google')}
                >
                  <i className="fab fa-google me-2"></i>
                  Google
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  variant="outline-primary"
                  className="w-100 mb-2"
                  onClick={() => handleSocialRegister('discord')}
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

          {/* Registration Form */}
          <Form onSubmit={handleSubmit}>
            {/* Username Field */}
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-user me-2"></i>
                Nom d'utilisateur
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Votre nom d'utilisateur"
                  value={formData.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                  disabled={isSubmitting}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </InputGroup>
              <Form.Text className="text-muted">
                3+ caractères, lettres, chiffres et _ uniquement
              </Form.Text>
            </Form.Group>

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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="text-muted">Force du mot de passe:</small>
                    <small className={`text-${strengthInfo.color}`}>
                      {strengthInfo.text}
                    </small>
                  </div>
                  <ProgressBar 
                    variant={strengthInfo.color}
                    now={passwordStrength}
                    style={{ height: '4px' }}
                  />
                  <div className="mt-1">
                    <small className="text-muted">
                      Utilisez 8+ caractères avec majuscules, minuscules et chiffres/symboles
                    </small>
                  </div>
                </div>
              )}
            </Form.Group>

            {/* Confirm Password Field */}
            <Form.Group className="mb-4">
              <Form.Label>
                <i className="fas fa-lock me-2"></i>
                Confirmer le mot de passe
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirmez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                  disabled={isSubmitting}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            {/* Terms Agreement */}
            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                isInvalid={!!errors.agreeToTerms}
                disabled={isSubmitting}
                label={
                  <span>
                    J'accepte les{' '}
                    <Link to="/terms" target="_blank" className="text-decoration-none">
                      conditions d'utilisation
                    </Link>
                    {' '}et la{' '}
                    <Link to="/privacy" target="_blank" className="text-decoration-none">
                      politique de confidentialité
                    </Link>
                  </span>
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.agreeToTerms}
              </Form.Control.Feedback>
            </Form.Group>

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
                    Création du compte...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus me-2"></i>
                    Créer mon compte
                  </>
                )}
              </Button>
            </div>
          </Form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-muted">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-decoration-none fw-bold">
                Se connecter
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Success Modal */}
      <Modal 
        show={showSuccessModal} 
        onHide={() => setShowSuccessModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Body className="text-center p-4">
          <div className="mb-3">
            <i className="fas fa-check-circle fa-4x text-success"></i>
          </div>
          <h4 className="mb-3">Compte créé avec succès!</h4>
          <p className="text-muted mb-4">
            Bienvenue dans la communauté MangaSet! Vous allez être redirigé automatiquement.
          </p>
          <div className="d-flex gap-2">
            <Button 
              variant="primary" 
              onClick={() => navigate('/')}
              className="flex-fill"
            >
              Commencer à explorer
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowSuccessModal(false)}
            >
              Fermer
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Custom Styles */}
      <style jsx>{`
        .register-form-container {
          max-width: 500px;
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
        
        .progress {
          border-radius: 2px;
        }
        
        @media (max-width: 576px) {
          .register-form-container {
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

export default RegisterForm;