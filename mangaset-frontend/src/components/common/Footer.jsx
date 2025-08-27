// src/components/common/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-5 py-4">
      <Container>
        <Row>
          <Col md={4}>
            <h5>MangaSet</h5>
            <p className="text-muted">
              Your ultimate destination for reading manga online. 
              Discover new series and keep up with your favorites.
            </p>
          </Col>
          <Col md={2}>
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li><Link to="/browse" className="text-muted text-decoration-none">Browse</Link></li>
              <li><Link to="/genres" className="text-muted text-decoration-none">Genres</Link></li>
              <li><Link to="/popular" className="text-muted text-decoration-none">Popular</Link></li>
            </ul>
          </Col>
          <Col md={2}>
            <h6>Account</h6>
            <ul className="list-unstyled">
              <li><Link to="/login" className="text-muted text-decoration-none">Login</Link></li>
              <li><Link to="/register" className="text-muted text-decoration-none">Register</Link></li>
              <li><Link to="/profile" className="text-muted text-decoration-none">Profile</Link></li>
              <li><Link to="/favorites" className="text-muted text-decoration-none">Favorites</Link></li>
            </ul>
          </Col>
          <Col md={2}>
            <h6>Support</h6>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-muted text-decoration-none">About</Link></li>
              <li><Link to="/contact" className="text-muted text-decoration-none">Contact</Link></li>
              <li><Link to="/faq" className="text-muted text-decoration-none">FAQ</Link></li>
              <li><Link to="/privacy" className="text-muted text-decoration-none">Privacy</Link></li>
            </ul>
          </Col>
          <Col md={2}>
            <h6>Follow Us</h6>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col className="text-center">
            <p className="text-muted mb-0">
              &copy; 2024 MangaSet. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;