// // src/components/common/Footer.jsx
// import React from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// const Footer = () => {
//   return (
//     <footer className="bg-dark text-light mt-5 py-4">
//       <Container>
//         <Row>
//           <Col md={4}>
//             <h5>MangaSet</h5>
//             <p className="text-muted">
//               Your ultimate destination for reading manga online. 
//               Discover new series and keep up with your favorites.
//             </p>
//           </Col>
//           <Col md={2}>
//             <h6>Quick Links</h6>
//             <ul className="list-unstyled">
//               <li><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
//               <li><Link to="/browse" className="text-muted text-decoration-none">Browse</Link></li>
//               <li><Link to="/genres" className="text-muted text-decoration-none">Genres</Link></li>
//               <li><Link to="/popular" className="text-muted text-decoration-none">Popular</Link></li>
//             </ul>
//           </Col>
//           <Col md={2}>
//             <h6>Account</h6>
//             <ul className="list-unstyled">
//               <li><Link to="/login" className="text-muted text-decoration-none">Login</Link></li>
//               <li><Link to="/register" className="text-muted text-decoration-none">Register</Link></li>
//               <li><Link to="/profile" className="text-muted text-decoration-none">Profile</Link></li>
//               <li><Link to="/favorites" className="text-muted text-decoration-none">Favorites</Link></li>
//             </ul>
//           </Col>
//           <Col md={2}>
//             <h6>Support</h6>
//             <ul className="list-unstyled">
//               <li><Link to="/about" className="text-muted text-decoration-none">About</Link></li>
//               <li><Link to="/contact" className="text-muted text-decoration-none">Contact</Link></li>
//               <li><Link to="/faq" className="text-muted text-decoration-none">FAQ</Link></li>
//               <li><Link to="/privacy" className="text-muted text-decoration-none">Privacy</Link></li>
//             </ul>
//           </Col>
//           <Col md={2}>
//             <h6>Follow Us</h6>
//             <div className="d-flex gap-3">
//               <a href="#" className="text-muted">
//                 <i className="fab fa-facebook-f"></i>
//               </a>
//               <a href="#" className="text-muted">
//                 <i className="fab fa-twitter"></i>
//               </a>
//               <a href="#" className="text-muted">
//                 <i className="fab fa-instagram"></i>
//               </a>
//               <a href="#" className="text-muted">
//                 <i className="fab fa-discord"></i>
//               </a>
//             </div>
//           </Col>
//         </Row>
//         <hr className="my-4" />
//         <Row>
//           <Col className="text-center">
//             <p className="text-muted mb-0">
//               &copy; 2024 MangaSet. All rights reserved.
//             </p>
//           </Col>
//         </Row>
//       </Container>
//     </footer>
//   );
// };

// export default Footer;

// src/components/common/Footer.jsx - Version basique
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const siteName = import.meta.env.VITE_SITE_NAME || 'MangaSet';

  return (
    <footer className="bg-dark text-light mt-auto py-4">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5>
              <i className="fas fa-book-open me-2"></i>
              {siteName}
            </h5>
            <p className="text-muted">
              Your ultimate destination for reading manga online. 
              Discover new series and keep up with your favorites.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted" title="Facebook">
                <i className="fab fa-facebook-f fa-lg"></i>
              </a>
              <a href="#" className="text-muted" title="Twitter">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="text-muted" title="Instagram">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
              <a href="#" className="text-muted" title="Discord">
                <i className="fab fa-discord fa-lg"></i>
              </a>
            </div>
          </Col>
          
          <Col md={2} className="mb-3">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li><Link to="/browse" className="text-muted text-decoration-none">Browse</Link></li>
              <li><Link to="/popular" className="text-muted text-decoration-none">Popular</Link></li>
              <li><Link to="/latest" className="text-muted text-decoration-none">Latest</Link></li>
              <li><Link to="/new" className="text-muted text-decoration-none">New Series</Link></li>
            </ul>
          </Col>
          
          <Col md={2} className="mb-3">
            <h6>Account</h6>
            <ul className="list-unstyled">
              <li><Link to="/login" className="text-muted text-decoration-none">Login</Link></li>
              <li><Link to="/register" className="text-muted text-decoration-none">Register</Link></li>
              <li><Link to="/profile" className="text-muted text-decoration-none">Profile</Link></li>
              <li><Link to="/favorites" className="text-muted text-decoration-none">Favorites</Link></li>
            </ul>
          </Col>
          
          <Col md={2} className="mb-3">
            <h6>Support</h6>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-muted text-decoration-none">About</Link></li>
              <li><Link to="/contact" className="text-muted text-decoration-none">Contact</Link></li>
              <li><Link to="/faq" className="text-muted text-decoration-none">FAQ</Link></li>
              <li><Link to="/privacy" className="text-muted text-decoration-none">Privacy</Link></li>
            </ul>
          </Col>
          
          <Col md={2} className="mb-3">
            <h6>Development</h6>
            <ul className="list-unstyled">
              <li><Link to="/test" className="text-muted text-decoration-none">
                <i className="fas fa-flask me-1"></i>
                Test Components
              </Link></li>
              <li><a href="#" className="text-muted text-decoration-none">API Docs</a></li>
              <li><a href="#" className="text-muted text-decoration-none">GitHub</a></li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row className="align-items-center">
          <Col md={8}>
            <p className="text-muted mb-0">
              &copy; {currentYear} {siteName}. All rights reserved. 
              <span className="ms-3">
                Made with <i className="fas fa-heart text-danger"></i> for manga lovers
              </span>
            </p>
          </Col>
          <Col md={4} className="text-md-end">
            <small className="text-muted">
              Environment: {import.meta.env.MODE} | 
              Version: {import.meta.env.VITE_APP_VERSION || '1.0.0'}
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;