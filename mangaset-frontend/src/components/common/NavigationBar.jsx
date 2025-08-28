// // src/components/common/NavigationBar.jsx - Version basique
// import React, { useState } from 'react';
// import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const NavigationBar = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const { user, isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery('');
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
//       <Container>
//         <Navbar.Brand as={Link} to="/">
//           <i className="fas fa-book-open me-2"></i>
//           {import.meta.env.VITE_SITE_NAME || 'MangaSet'}
//         </Navbar.Brand>
        
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto">
//             <Nav.Link as={Link} to="/">
//               <i className="fas fa-home me-1"></i>
//               Home
//             </Nav.Link>
//             <Nav.Link as={Link} to="/browse">
//               <i className="fas fa-compass me-1"></i>
//               Browse
//             </Nav.Link>
//             <NavDropdown title={<><i className="fas fa-tags me-1"></i>Genres</>} id="genres-dropdown">
//               <NavDropdown.Item as={Link} to="/search?genre=action">
//                 <i className="fas fa-fist-raised me-2 text-danger"></i>
//                 Action
//               </NavDropdown.Item>
//               <NavDropdown.Item as={Link} to="/search?genre=romance">
//                 <i className="fas fa-heart me-2 text-pink"></i>
//                 Romance
//               </NavDropdown.Item>
//               <NavDropdown.Item as={Link} to="/search?genre=comedy">
//                 <i className="fas fa-laugh me-2 text-warning"></i>
//                 Comedy
//               </NavDropdown.Item>
//               <NavDropdown.Item as={Link} to="/search?genre=drama">
//                 <i className="fas fa-theater-masks me-2 text-info"></i>
//                 Drama
//               </NavDropdown.Item>
//               <NavDropdown.Divider />
//               <NavDropdown.Item as={Link} to="/browse">
//                 <i className="fas fa-list me-2"></i>
//                 All Genres
//               </NavDropdown.Item>
//             </NavDropdown>
            
//             {/* Test Link */}
//             <Nav.Link as={Link} to="/test">
//               <i className="fas fa-flask me-1"></i>
//               <span className="badge bg-warning text-dark ms-1">Test</span>
//             </Nav.Link>
//           </Nav>

//           {/* Search Form */}
//           <Form className="d-flex me-3" onSubmit={handleSearch}>
//             <FormControl
//               type="search"
//               placeholder="Search manga..."
//               className="me-2"
//               aria-label="Search"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               style={{ minWidth: '200px' }}
//             />
//             <Button variant="outline-light" type="submit">
//               <i className="fas fa-search"></i>
//             </Button>
//           </Form>

//           {/* User Menu */}
//           <Nav>
//             {isAuthenticated ? (
//               <NavDropdown 
//                 title={
//                   <span>
//                     <i className="fas fa-user me-1"></i>
//                     {user?.username || 'User'}
//                   </span>
//                 } 
//                 id="user-dropdown" 
//                 align="end"
//               >
//                 <NavDropdown.Item as={Link} to="/profile">
//                   <i className="fas fa-user-circle me-2"></i>
//                   Profile
//                 </NavDropdown.Item>
//                 <NavDropdown.Item as={Link} to="/favorites">
//                   <i className="fas fa-heart me-2"></i>
//                   Favorites
//                 </NavDropdown.Item>
//                 <NavDropdown.Item as={Link} to="/history">
//                   <i className="fas fa-history me-2"></i>
//                   Reading History
//                 </NavDropdown.Item>
//                 <NavDropdown.Divider />
//                 <NavDropdown.Item onClick={handleLogout}>
//                   <i className="fas fa-sign-out-alt me-2"></i>
//                   Logout
//                 </NavDropdown.Item>
//               </NavDropdown>
//             ) : (
//               <>
//                 <Nav.Link as={Link} to="/login">
//                   <i className="fas fa-sign-in-alt me-1"></i>
//                   Login
//                 </Nav.Link>
//                 <Nav.Link as={Link} to="/register">
//                   <i className="fas fa-user-plus me-1"></i>
//                   Register
//                 </Nav.Link>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default NavigationBar;

// src/components/common/NavigationBar.jsx - Version complète
import React, { useState, useEffect } from 'react';
import { 
  Navbar, 
  Nav, 
  NavDropdown, 
  Form, 
  FormControl, 
  Button, 
  Container,
  ButtonGroup,
  Dropdown
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavigationBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Initialize theme and language from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedLanguage = localStorage.getItem('language');
    
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-bs-theme', savedTheme);
    } else {
      // Auto-detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      document.documentElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

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

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    const theme = newMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    // Here you would typically trigger i18n language change
    console.log('Language changed to:', lang);
  };

  const getLanguageFlag = (lang) => {
    const flags = {
      'en': '🇺🇸',
      'fr': '🇫🇷',
      'ar': '🇲🇦'
    };
    return flags[lang] || '🇺🇸';
  };

  const getLanguageName = (lang) => {
    const names = {
      'en': 'English',
      'fr': 'Français',
      'ar': 'العربية'
    };
    return names[lang] || 'English';
  };

  const siteName = import.meta.env.VITE_SITE_NAME || 'MangaSet';

  return (
    <Navbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} expand="lg" sticky="top" className="shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          <i className="fas fa-book-open me-2 text-primary"></i>
          <span className="text-gradient">{siteName}</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Main Navigation */}
          <Nav className="me-auto">
            {/* Liste Manga Dropdown */}
            <NavDropdown 
              title={
                <>
                  <i className="fas fa-list me-1"></i>
                  Liste Manga
                </>
              } 
              id="manga-list-dropdown"
            >
              <NavDropdown.Item as={Link} to="/popular">
                <i className="fas fa-fire me-2 text-danger"></i>
                Populaires
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/latest">
                <i className="fas fa-clock me-2 text-info"></i>
                Dernières MAJ
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/new">
                <i className="fas fa-star me-2 text-success"></i>
                Nouvelles Séries
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/completed">
                <i className="fas fa-check-circle me-2 text-primary"></i>
                Terminées
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/ongoing">
                <i className="fas fa-play-circle me-2 text-warning"></i>
                En Cours
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/browse">
                <i className="fas fa-th me-2"></i>
                Tout Parcourir
              </NavDropdown.Item>
            </NavDropdown>
            
            {/* Browse */}
            <Nav.Link as={Link} to="/browse">
              <i className="fas fa-compass me-1"></i>
              Browse
            </Nav.Link>
            
            {/* Genres Dropdown */}
            <NavDropdown 
              title={
                <>
                  <i className="fas fa-tags me-1"></i>
                  Genres
                </>
              } 
              id="genres-dropdown"
            >
              <div className="px-3 py-2">
                <h6 className="dropdown-header">Populaires</h6>
              </div>
              <NavDropdown.Item as={Link} to="/search?genre=action">
                <i className="fas fa-fist-raised me-2 text-danger"></i>
                Action
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/search?genre=romance">
                <i className="fas fa-heart me-2 text-pink"></i>
                Romance
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/search?genre=comedy">
                <i className="fas fa-laugh me-2 text-warning"></i>
                Comédie
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/search?genre=drama">
                <i className="fas fa-theater-masks me-2 text-info"></i>
                Drame
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/search?genre=fantasy">
                <i className="fas fa-magic me-2 text-primary"></i>
                Fantasy
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/search?genre=adventure">
                <i className="fas fa-map me-2 text-success"></i>
                Aventure
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <div className="px-3 py-2">
                <h6 className="dropdown-header">Autres</h6>
              </div>
              <NavDropdown.Item as={Link} to="/search?genre=horror">
                <i className="fas fa-ghost me-2 text-dark"></i>
                Horreur
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/search?genre=mystery">
                <i className="fas fa-search me-2 text-secondary"></i>
                Mystère
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/search?genre=sports">
                <i className="fas fa-running me-2 text-primary"></i>
                Sport
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/genres" className="fw-bold">
                <i className="fas fa-th-large me-2"></i>
                Tous les Genres
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* Search Form */}
          <Form className="d-flex me-3" onSubmit={handleSearch}>
            <div className="input-group">
              <FormControl
                type="search"
                placeholder="Rechercher manga..."
                className="border-end-0"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ minWidth: '200px' }}
              />
              <Button 
                variant={darkMode ? 'outline-light' : 'outline-primary'} 
                type="submit"
                className="border-start-0"
              >
                <i className="fas fa-search"></i>
              </Button>
            </div>
          </Form>

          {/* Right Side Controls */}
          <Nav className="align-items-center">
            {/* Language Selector */}
            <Dropdown as={ButtonGroup} className="me-2">
              <Button
                variant="link"
                className={`text-decoration-none ${darkMode ? 'text-light' : 'text-dark'} p-2`}
                title="Changer la langue"
              >
                <span className="me-1">{getLanguageFlag(language)}</span>
                {/* <span className="d-none d-md-inline">{getLanguageName(language)}</span> */}
              </Button>
              <Dropdown.Toggle
                split
                variant="link"
                className={`${darkMode ? 'text-light' : 'text-dark'} border-0 p-2`}
                id="language-dropdown"
              />
              <Dropdown.Menu align="end">
                <Dropdown.Header>Choisir la langue</Dropdown.Header>
                <Dropdown.Item 
                  onClick={() => handleLanguageChange('fr')}
                  active={language === 'fr'}
                >
                  <span className="me-2">🇫🇷</span>
                  Français
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => handleLanguageChange('ar')}
                  active={language === 'ar'}
                >
                  <span className="me-2">🇲🇦</span>
                  arabe
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => handleLanguageChange('en')}
                  active={language === 'en'}
                >
                  <span className="me-2">🇺🇸</span>
                  English
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Dark/Light Mode Toggle */}
            <Button
              variant="link"
              className={`${darkMode ? 'text-light' : 'text-dark'} text-decoration-none me-2 p-2`}
              onClick={toggleDarkMode}
              title={darkMode ? 'Mode clair' : 'Mode sombre'}
            >
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} fa-lg`}></i>
            </Button>

            {/* Bookmarks (for authenticated users) */}
            {isAuthenticated && (
              <Button
                as={Link}
                to="/favorites"
                variant="link"
                className={`${darkMode ? 'text-light' : 'text-dark'} text-decoration-none me-2 p-2 position-relative`}
                title="Mes favoris"
              >
                <i className="fas fa-bookmark fa-lg"></i>
                {/* Badge pour le nombre de favoris (optionnel) */}
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                  5
                  <span className="visually-hidden">favoris</span>
                </span>
              </Button>
            )}

            {/* User Authentication */}
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <span>
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=007bff&color=fff&size=32`}
                      alt="Avatar"
                      className="rounded-circle me-2"
                      style={{ width: '24px', height: '24px' }}
                    />
                    <span className="d-none d-md-inline">{user?.username || 'User'}</span>
                  </span>
                } 
                id="user-dropdown" 
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <i className="fas fa-user-circle me-2 text-primary"></i>
                  Mon Profil
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/favorites">
                  <i className="fas fa-heart me-2 text-danger"></i>
                  Mes Favoris
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/history">
                  <i className="fas fa-history me-2 text-info"></i>
                  Historique
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/reading-list">
                  <i className="fas fa-list-ul me-2 text-success"></i>
                  Liste de Lecture
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/settings">
                  <i className="fas fa-cog me-2 text-secondary"></i>
                  Paramètres
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Déconnexion
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <ButtonGroup>
                <Button 
                  as={Link} 
                  to="/auth" 
                  variant={darkMode ? 'outline-light' : 'outline-primary'}
                  size="sm"
                  className="d-flex align-items-center"
                >
                  <i className="fas fa-user me-1"></i>
                  <span className="d-none d-sm-inline">Connexion</span>
                </Button>
              </ButtonGroup>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;