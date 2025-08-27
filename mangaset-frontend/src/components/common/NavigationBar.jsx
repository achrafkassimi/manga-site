// src/components/common/NavigationBar.jsx
import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavigationBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="fas fa-book-open me-2"></i>
          MangaSet
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/browse">Browse</Nav.Link>
            <NavDropdown title="Genres" id="genres-dropdown">
              <NavDropdown.Item as={Link} to="/genre/action">Action</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/genre/romance">Romance</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/genre/comedy">Comedy</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/genres">All Genres</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* Search Form */}
          <Form className="d-flex me-3" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search manga..."
              className="me-2"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-light" type="submit">
              <i className="fas fa-search"></i>
            </Button>
          </Form>

          {/* User Menu */}
          <Nav>
            {isAuthenticated ? (
              <NavDropdown title={
                <span>
                  <i className="fas fa-user me-1"></i>
                  {user?.username || 'User'}
                </span>
              } id="user-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/profile">
                  <i className="fas fa-user-circle me-2"></i>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/favorites">
                  <i className="fas fa-heart me-2"></i>
                  Favorites
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/history">
                  <i className="fas fa-history me-2"></i>
                  Reading History
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <i className="fas fa-user-plus me-1"></i>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;