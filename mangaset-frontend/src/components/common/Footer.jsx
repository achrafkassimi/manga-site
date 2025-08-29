// src/components/common/Footer.jsx - Enhanced Version
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Toast } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const siteName = import.meta.env.VITE_SITE_NAME || 'MangaSet';

  // Newsletter signup handler
  const handleNewsletterSignup = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setToastMessage('Please enter a valid email address');
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await newsletterService.subscribe(email);
      
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setToastMessage('Successfully subscribed to newsletter!');
      setShowToast(true);
      setEmail('');
    } catch (error) {
      setToastMessage('Failed to subscribe. Please try again.');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Social media links with actual URLs (you can customize these)
  const socialLinks = [
    {
      name: 'Facebook',
      icon: 'fab fa-facebook-f',
      url: '#', // Replace with actual Facebook page URL
      color: '#1877F2'
    },
    {
      name: 'Twitter',
      icon: 'fab fa-twitter',
      url: '#', // Replace with actual Twitter URL
      color: '#1DA1F2'
    },
    {
      name: 'Instagram',
      icon: 'fab fa-instagram',
      url: '#', // Replace with actual Instagram URL
      color: '#E4405F'
    },
    {
      name: 'Discord',
      icon: 'fab fa-discord',
      url: '#', // Replace with actual Discord invite URL
      color: '#5865F2'
    },
    {
      name: 'YouTube',
      icon: 'fab fa-youtube',
      url: '#', // Replace with actual YouTube channel URL
      color: '#FF0000'
    }
  ];

  return (
    <>
      {/* Toast Notifications */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={4000} 
          autohide
          bg={toastMessage.includes('Success') ? 'success' : 'danger'}
        >
          <Toast.Body className="text-white">
            <i className={`fas ${toastMessage.includes('Success') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </div>

      <footer className="bg-dark text-light mt-auto">
        {/* Newsletter Section */}
        <div className="bg-primary py-4">
          <Container>
            <Row className="align-items-center">
              <Col lg={6} className="mb-3 mb-lg-0">
                <h5 className="text-white mb-2">
                  <i className="fas fa-envelope me-2"></i>
                  Stay Updated!
                </h5>
                <p className="text-white-50 mb-0">
                  Get notified about new manga releases and updates
                </p>
              </Col>
              <Col lg={6}>
                <Form onSubmit={handleNewsletterSignup} className="d-flex gap-2">
                  <Form.Control
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="flex-grow-1"
                  />
                  <Button 
                    type="submit" 
                    variant="light" 
                    disabled={isLoading}
                    className="px-4"
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Subscribe
                      </>
                    )}
                  </Button>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Main Footer Content */}
        <div className="py-5">
          <Container>
            <Row>
              {/* Brand Section */}
              <Col lg={4} md={6} className="mb-4">
                <h4 className="mb-3">
                  <i className="fas fa-book-open me-2 text-primary"></i>
                  {siteName}
                </h4>
                <p className="text-light mb-4">
                  Your ultimate destination for reading manga online. 
                  Discover new series, keep up with your favorites, and join 
                  a community of manga enthusiasts from around the world.
                </p>
                
                {/* Social Media Links */}
                <div className="mb-3">
                  <h6 className="mb-3">Follow Us</h6>
                  <div className="d-flex gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        className="text-light"
                        title={social.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          transition: 'color 0.3s ease',
                          fontSize: '1.2rem'
                        }}
                        onMouseEnter={(e) => e.target.style.color = social.color}
                        onMouseLeave={(e) => e.target.style.color = ''}
                      >
                        <i className={`${social.icon} fa-lg`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </Col>
              
              {/* Quick Links */}
              <Col lg={2} md={6} sm={6} className="mb-4">
                <h6 className="mb-3 text-primary">Browse</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link to="/" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-home me-2"></i>Home
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/search" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-search me-2"></i>Browse All
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/popular" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-fire me-2"></i>Popular
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/latest" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-clock me-2"></i>Latest Updates
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/new" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-plus-circle me-2"></i>New Series
                    </Link>
                  </li>
                </ul>
              </Col>
              
              {/* Account Links */}
              <Col lg={2} md={6} sm={6} className="mb-4">
                <h6 className="mb-3 text-primary">Account</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link to="/login" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-sign-in-alt me-2"></i>Login
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/register" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-user-plus me-2"></i>Register
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/profile" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-user me-2"></i>My Profile
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/favorites" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-heart me-2"></i>Favorites
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/history" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-history me-2"></i>Reading History
                    </Link>
                  </li>
                </ul>
              </Col>
              
              {/* Support Links */}
              <Col lg={2} md={6} sm={6} className="mb-4">
                <h6 className="mb-3 text-primary">Support</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link to="/about" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-info-circle me-2"></i>About Us
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/contact" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-envelope me-2"></i>Contact
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/faq" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-question-circle me-2"></i>FAQ
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/privacy" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-shield-alt me-2"></i>Privacy Policy
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/terms" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-file-contract me-2"></i>Terms of Service
                    </Link>
                  </li>
                </ul>
              </Col>
              
              {/* Development & Stats */}
              <Col lg={2} md={6} sm={6} className="mb-4">
                <h6 className="mb-3 text-primary">Resources</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link to="/test" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-flask me-2"></i>Test Components
                    </Link>
                  </li>
                  <li className="mb-2">
                    <a 
                      href="#" 
                      className="text-light text-decoration-none footer-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-code me-2"></i>API Documentation
                    </a>
                  </li>
                  <li className="mb-2">
                    <a 
                      href="#" 
                      className="text-light text-decoration-none footer-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-github me-2"></i>GitHub Repository
                    </a>
                  </li>
                  <li className="mb-2">
                    <Link to="/stats" className="text-light text-decoration-none footer-link">
                      <i className="fas fa-chart-bar me-2"></i>Site Statistics
                    </Link>
                  </li>
                </ul>
              </Col>
            </Row>
          </Container>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-top border-secondary py-3">
          <Container>
            <Row className="align-items-center">
              <Col md={8} className="mb-2 mb-md-0">
                <p className="text-light mb-0">
                  &copy; {currentYear} {siteName}. All rights reserved.
                  <span className="ms-3 text-muted">
                    Made with <i className="fas fa-heart text-danger"></i> for manga lovers worldwide
                  </span>
                </p>
              </Col>
              <Col md={4} className="text-md-end">
                <div className="d-flex align-items-center justify-content-md-end gap-3">
                  {/* Environment Info */}
                  <small className="text-muted">
                    v{import.meta.env.VITE_APP_VERSION || '1.0.0'} | 
                    {import.meta.env.MODE}
                  </small>
                  
                  {/* Back to Top Button */}
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={scrollToTop}
                    className="border-0"
                    title="Back to Top"
                    style={{
                      transition: 'all 0.3s ease',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <i className="fas fa-chevron-up"></i>
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        .footer-link {
          transition: all 0.3s ease;
          display: inline-block;
        }
        
        .footer-link:hover {
          color: var(--bs-primary) !important;
          transform: translateX(5px);
        }
        
        .footer-link i {
          transition: transform 0.3s ease;
        }
        
        .footer-link:hover i {
          transform: scale(1.1);
        }
        
        @media (max-width: 768px) {
          .footer-link:hover {
            transform: none;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;