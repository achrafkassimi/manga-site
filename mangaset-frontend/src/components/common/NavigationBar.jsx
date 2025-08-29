// // src/components/common/NavigationBar.jsx - Version complète
// import React, { useState, useEffect } from 'react';
// import { 
//   Navbar, 
//   Nav, 
//   NavDropdown, 
//   Form, 
//   FormControl, 
//   Button, 
//   Container,
//   ButtonGroup,
//   Dropdown
// } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const NavigationBar = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [darkMode, setDarkMode] = useState(false);
//   const [language, setLanguage] = useState('en');
//   const { user, isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();

//   // Initialize theme and language from localStorage
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     const savedLanguage = localStorage.getItem('language');
    
//     if (savedTheme) {
//       setDarkMode(savedTheme === 'dark');
//       document.documentElement.setAttribute('data-bs-theme', savedTheme);
//     } else {
//       // Auto-detect system preference
//       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//       setDarkMode(prefersDark);
//       document.documentElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
//     }
    
//     if (savedLanguage) {
//       setLanguage(savedLanguage);
//     }
//   }, []);

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

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     const theme = newMode ? 'dark' : 'light';
//     document.documentElement.setAttribute('data-bs-theme', theme);
//     localStorage.setItem('theme', theme);
//   };

//   const handleLanguageChange = (lang) => {
//     setLanguage(lang);
//     localStorage.setItem('language', lang);
//     // Here you would typically trigger i18n language change
//     console.log('Language changed to:', lang);
//   };

//   const getLanguageFlag = (lang) => {
//     const flags = {
//       'en': '🇺🇸',
//       'fr': '🇫🇷',
//       'ar': '🇲🇦'
//     };
//     return flags[lang] || '🇺🇸';
//   };

//   const getLanguageName = (lang) => {
//     const names = {
//       'en': 'English',
//       'fr': 'Français',
//       'ar': 'العربية'
//     };
//     return names[lang] || 'English';
//   };

//   const siteName = import.meta.env.VITE_SITE_NAME || 'MangaSet';

//   return (
//     <Navbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} expand="lg" sticky="top" className="shadow-sm">
//       <Container>
//         {/* Logo */}
//         <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
//           <i className="fas fa-book-open me-2 text-primary"></i>
//           <span className="text-gradient">{siteName}</span>
//         </Navbar.Brand>
        
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
//         <Navbar.Collapse id="basic-navbar-nav">
//           {/* Main Navigation */}
//           <Nav className="me-auto">
//             {/* Liste Manga Dropdown */}
//             <NavDropdown 
//               title={
//                 <>
//                   <i className="fas fa-list me-1"></i>
//                   Liste Manga
//                 </>
//               } 
//               id="manga-list-dropdown"
//             >
//               <NavDropdown.Item as={Link} to="/popular">
//                 <i className="fas fa-fire me-2 text-danger"></i>
//                 Populaires
//               </NavDropdown.Item>
//               <NavDropdown.Item as={Link} to="/latest">
//                 <i className="fas fa-clock me-2 text-info"></i>
//                 Dernières MAJ
//               </NavDropdown.Item>
//               <NavDropdown.Item as={Link} to="/new">
//                 <i className="fas fa-star me-2 text-success"></i>
//                 Nouvelles Séries
//               </NavDropdown.Item>
//               <NavDropdown.Item as={Link} to="/completed">
//                 <i className="fas fa-check-circle me-2 text-primary"></i>
//                 Terminées
//               </NavDropdown.Item>
//               <NavDropdown.Item as={Link} to="/ongoing">
//                 <i className="fas fa-play-circle me-2 text-warning"></i>
//                 En Cours
//               </NavDropdown.Item>
//               <NavDropdown.Divider />
//               <NavDropdown.Item as={Link} to="/browse">
//                 <i className="fas fa-th me-2"></i>
//                 Tout Parcourir
//               </NavDropdown.Item>
//             </NavDropdown>
            
//             {/* Browse */}
//             <Nav.Link as={Link} to="/browse">
//               <i className="fas fa-compass me-1"></i>
//               Browse
//             </Nav.Link>
            
//             {/* Genres Dropdown */}
//             <NavDropdown 
//               title={
//                 <>
//                   <i className="fas fa-tags me-1"></i>
//                   Genres
//                 </>
//               } 
//               id="genres-dropdown"
//             >
//               <div className="px-3 py-2">
//                 <h6 className="dropdown-header">Populaires</h6>
//               </div>
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
//                 Comédie
//               </NavDropdown.Item>
//               <NavDropdown.Item as={Link} to="/search?genre=drama">
//                 <i className="fas fa-theater-masks me-2 text-info"></i>
//                 Drame
//               </NavDropdown.Item>
//               <NavDropdown.Item as={Link} to="/search?genre=fantasy">
//                 <i className="fas fa-magic me-2 text-primary"></i>
//                 Fantasy
//               </NavDropdown.Item>
//               <NavDropdown.Item as={Link} to="/search?genre=adventure">
//                 <i className="fas fa-map me-2 text-success"></i>
//                 Aventure
//               </NavDropdown.Item>
//               <NavDropdown.Divider />
//               <div className="px-3 py-2">
//                 <h6 className="dropdown-header">Autres</h6>
//               </div>
//               <NavDropdown.Item as={Link} to="/search?genre=horror">
//                 <i className="fas fa-ghost me-2 text-dark"></i>
//                 Horreur
//               </NavDropdown.Item>
//               <NavDropdown.Item as={Link} to="/search?genre=mystery">
//                 <i className="fas fa-search me-2 text-secondary"></i>
//                 Mystère
//               </NavDropdown.Item>
//               <NavDropdown.Item as={Link} to="/search?genre=sports">
//                 <i className="fas fa-running me-2 text-primary"></i>
//                 Sport
//               </NavDropdown.Item>
//               <NavDropdown.Divider />
//               <NavDropdown.Item as={Link} to="/genres" className="fw-bold">
//                 <i className="fas fa-th-large me-2"></i>
//                 Tous les Genres
//               </NavDropdown.Item>
//             </NavDropdown>
//           </Nav>

//           {/* Search Form */}
//           <Form className="d-flex me-3" onSubmit={handleSearch}>
//             <div className="input-group">
//               <FormControl
//                 type="search"
//                 placeholder="Rechercher manga..."
//                 className="border-end-0"
//                 aria-label="Search"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 style={{ minWidth: '200px' }}
//               />
//               <Button 
//                 variant={darkMode ? 'outline-light' : 'outline-primary'} 
//                 type="submit"
//                 className="border-start-0"
//               >
//                 <i className="fas fa-search"></i>
//               </Button>
//             </div>
//           </Form>

//           {/* Right Side Controls */}
//           <Nav className="align-items-center">
//             {/* Language Selector */}
//             <Dropdown as={ButtonGroup} className="me-2">
//               <Button
//                 variant="link"
//                 className={`text-decoration-none ${darkMode ? 'text-light' : 'text-dark'} p-2`}
//                 title="Changer la langue"
//               >
//                 <span className="me-1">{getLanguageFlag(language)}</span>
//                 {/* <span className="d-none d-md-inline">{getLanguageName(language)}</span> */}
//               </Button>
//               <Dropdown.Toggle
//                 split
//                 variant="link"
//                 className={`${darkMode ? 'text-light' : 'text-dark'} border-0 p-2`}
//                 id="language-dropdown"
//               />
//               <Dropdown.Menu align="end">
//                 <Dropdown.Header>Choisir la langue</Dropdown.Header>
//                 <Dropdown.Item 
//                   onClick={() => handleLanguageChange('fr')}
//                   active={language === 'fr'}
//                 >
//                   <span className="me-2">🇫🇷</span>
//                   Français
//                 </Dropdown.Item>
//                 <Dropdown.Item 
//                   onClick={() => handleLanguageChange('ar')}
//                   active={language === 'ar'}
//                 >
//                   <span className="me-2">🇲🇦</span>
//                   arabe
//                 </Dropdown.Item>
//                 <Dropdown.Item 
//                   onClick={() => handleLanguageChange('en')}
//                   active={language === 'en'}
//                 >
//                   <span className="me-2">🇺🇸</span>
//                   English
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>

//             {/* Dark/Light Mode Toggle */}
//             <Button
//               variant="link"
//               className={`${darkMode ? 'text-light' : 'text-dark'} text-decoration-none me-2 p-2`}
//               onClick={toggleDarkMode}
//               title={darkMode ? 'Mode clair' : 'Mode sombre'}
//             >
//               <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} fa-lg`}></i>
//             </Button>

//             {/* Bookmarks (for authenticated users) */}
//             {isAuthenticated && (
//               <Button
//                 as={Link}
//                 to="/favorites"
//                 variant="link"
//                 className={`${darkMode ? 'text-light' : 'text-dark'} text-decoration-none me-2 p-2 position-relative`}
//                 title="Mes favoris"
//               >
//                 <i className="fas fa-bookmark fa-lg"></i>
//                 {/* Badge pour le nombre de favoris (optionnel) */}
//                 <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
//                   5
//                   <span className="visually-hidden">favoris</span>
//                 </span>
//               </Button>
//             )}

//             {/* User Authentication */}
//             {isAuthenticated ? (
//               <NavDropdown 
//                 title={
//                   <span>
//                     <img
//                       src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=007bff&color=fff&size=32`}
//                       alt="Avatar"
//                       className="rounded-circle me-2"
//                       style={{ width: '24px', height: '24px' }}
//                     />
//                     <span className="d-none d-md-inline">{user?.username || 'User'}</span>
//                   </span>
//                 } 
//                 id="user-dropdown" 
//                 align="end"
//               >
//                 <NavDropdown.Item as={Link} to="/profile">
//                   <i className="fas fa-user-circle me-2 text-primary"></i>
//                   Mon Profil
//                 </NavDropdown.Item>
//                 <NavDropdown.Item as={Link} to="/favorites">
//                   <i className="fas fa-heart me-2 text-danger"></i>
//                   Mes Favoris
//                 </NavDropdown.Item>
//                 <NavDropdown.Item as={Link} to="/history">
//                   <i className="fas fa-history me-2 text-info"></i>
//                   Historique
//                 </NavDropdown.Item>
//                 <NavDropdown.Item as={Link} to="/reading-list">
//                   <i className="fas fa-list-ul me-2 text-success"></i>
//                   Liste de Lecture
//                 </NavDropdown.Item>
//                 <NavDropdown.Divider />
//                 <NavDropdown.Item as={Link} to="/settings">
//                   <i className="fas fa-cog me-2 text-secondary"></i>
//                   Paramètres
//                 </NavDropdown.Item>
//                 <NavDropdown.Divider />
//                 <NavDropdown.Item onClick={handleLogout} className="text-danger">
//                   <i className="fas fa-sign-out-alt me-2"></i>
//                   Déconnexion
//                 </NavDropdown.Item>
//               </NavDropdown>
//             ) : (
//               <ButtonGroup>
//                 <Button 
//                   as={Link} 
//                   to="/auth" 
//                   variant={darkMode ? 'outline-light' : 'outline-primary'}
//                   size="sm"
//                   className="d-flex align-items-center"
//                 >
//                   <i className="fas fa-user me-1"></i>
//                   <span className="d-none d-sm-inline">Connexion</span>
//                 </Button>
//               </ButtonGroup>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default NavigationBar;



// src/components/common/NavigationBar.jsx - Clean Working Version
import React, { useState, useEffect, useRef } from 'react';
import { 
  Navbar, 
  Nav, 
  NavDropdown, 
  Form, 
  FormControl, 
  Button, 
  Container,
  ButtonGroup,
  Dropdown,
  ListGroup,
  Badge,
  Spinner,
  Modal,
  Row,
  Col
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavigationBar = () => {
  // State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Refs
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  
  // Context & Navigation
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // Site Configuration
  const siteName = import.meta.env.VITE_SITE_NAME || 'MangaSet';

  // Initialize theme and settings
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedLanguage = localStorage.getItem('language') || 'fr';
    const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-bs-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      document.documentElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
    }
    
    setLanguage(savedLanguage);
    setRecentSearches(savedSearches);
    
    // Mock notifications for authenticated users
    if (isAuthenticated) {
      setNotifications([
        { 
          id: 1, 
          title: 'Nouveau chapitre disponible', 
          message: 'One Piece Chapitre 1090', 
          read: false, 
          type: 'chapter' 
        },
        { 
          id: 2, 
          title: 'Manga ajouté aux favoris', 
          message: 'Attack on Titan', 
          read: true, 
          type: 'favorite' 
        }
      ]);
      setNotificationCount(1);
    }
  }, [isAuthenticated]);

  // Handle click outside search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock search function
  const performSearch = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock search results
      const mockResults = [
        {
          id: 1,
          title: 'One Piece',
          author: 'Eiichiro Oda',
          cover_image: 'https://via.placeholder.com/50x70/007bff/ffffff?text=OP',
          status: 'ongoing',
          rating: 9.2,
          slug: 'one-piece'
        },
        {
          id: 2,
          title: 'Naruto',
          author: 'Masashi Kishimoto',
          cover_image: 'https://via.placeholder.com/50x70/28a745/ffffff?text=N',
          status: 'completed',
          rating: 8.9,
          slug: 'naruto'
        },
        {
          id: 3,
          title: 'Attack on Titan',
          author: 'Hajime Isayama',
          cover_image: 'https://via.placeholder.com/50x70/dc3545/ffffff?text=AOT',
          status: 'completed',
          rating: 9.0,
          slug: 'attack-on-titan'
        }
      ].filter(manga => manga.title.toLowerCase().includes(query.toLowerCase()));
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search input change with debouncing
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchDropdown(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const updatedSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearchDropdown(false);
      setShowMobileSearch(false);
    }
  };

  // Handle search result click
  const handleSearchResultClick = (manga) => {
    const updatedSearches = [manga.title, ...recentSearches.filter(s => s !== manga.title)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    
    navigate(`/manga/${manga.slug}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
    setShowMobileSearch(false);
  };

  // Handle recent search click
  const handleRecentSearchClick = (search) => {
    setSearchQuery(search);
    navigate(`/search?q=${encodeURIComponent(search)}`);
    setShowSearchDropdown(false);
    setShowMobileSearch(false);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    const theme = newTheme ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
  };

  // Toggle language
  const toggleLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get language utilities
  const getLanguageFlag = (lang) => {
    const flags = { en: '🇺🇸', fr: '🇫🇷', es: '🇪🇸', ja: '🇯🇵' };
    return flags[lang] || '🇫🇷';
  };

  return (
    <>
      <Navbar 
        bg={darkMode ? 'dark' : 'light'} 
        variant={darkMode ? 'dark' : 'light'} 
        expand="lg" 
        sticky="top" 
        className="shadow-sm"
      >
        <Container>
          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
            <i className="fas fa-book-open me-2 text-primary"></i>
            <span className="text-gradient">{siteName}</span>
          </Navbar.Brand>
          
          {/* Mobile Controls */}
          <div className="d-lg-none d-flex align-items-center gap-2">
            {/* Mobile Search Button */}
            <Button
              variant="link"
              className={`text-decoration-none ${darkMode ? 'text-light' : 'text-dark'} p-2`}
              onClick={() => setShowMobileSearch(true)}
              title="Rechercher"
            >
              <i className="fas fa-search fa-lg"></i>
            </Button>
            
            {/* Mobile Notifications */}
            {isAuthenticated && (
              <div className="position-relative">
                <Button
                  variant="link"
                  className={`text-decoration-none ${darkMode ? 'text-light' : 'text-dark'} p-2 position-relative`}
                  onClick={() => setShowMobileMenu(true)}
                  title="Notifications"
                >
                  <i className="fas fa-bell fa-lg"></i>
                  {notificationCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute"
                      style={{ 
                        fontSize: '0.7rem',
                        top: '2px',
                        right: '2px',
                        minWidth: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </div>
            )}
            
            {/* Custom Mobile Menu Toggle */}
            <button
              className={`navbar-toggler ${darkMode ? 'text-light' : 'text-dark'}`}
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-expanded={showMobileMenu}
              aria-label="Toggle navigation"
            >
              <div className="navbar-toggler-icon"></div>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-block">
            {/* Main Navigation */}
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="d-flex align-items-center">
                <i className="fas fa-home me-1"></i>
                Accueil
              </Nav.Link>
              
              {/* Browse Dropdown */}
              <NavDropdown 
                title={
                  <>
                    <i className="fas fa-list me-1"></i>
                    Browse
                  </>
                } 
                id="browse-dropdown"
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
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/search" className="fw-bold">
                  <i className="fas fa-search me-2"></i>
                  Recherche Avancée
                </NavDropdown.Item>
              </NavDropdown>
              
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
                <NavDropdown.Item as={Link} to="/search?genre=adventure">
                  <i className="fas fa-map me-2 text-success"></i>
                  Aventure
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/genres" className="fw-bold">
                  <i className="fas fa-th-large me-2"></i>
                  Tous les Genres
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>

            {/* Desktop Search */}
            <div className="position-relative me-3" ref={searchDropdownRef}>
              <Form className="d-flex" onSubmit={handleSearchSubmit}>
                <div className="input-group" style={{ minWidth: '300px' }}>
                  <FormControl
                    ref={searchInputRef}
                    type="search"
                    placeholder="Rechercher manga, auteur..."
                    className="border-end-0"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={() => setShowSearchDropdown(true)}
                  />
                  <Button 
                    variant={darkMode ? 'outline-light' : 'outline-primary'} 
                    type="submit"
                    className="border-start-0"
                  >
                    {searchLoading ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      <i className="fas fa-search"></i>
                    )}
                  </Button>
                </div>
              </Form>
              
              {/* Desktop Search Dropdown */}
              {showSearchDropdown && (
                <div 
                  className={`position-absolute w-100 mt-1 ${darkMode ? 'bg-dark' : 'bg-white'} border rounded shadow-lg`}
                  style={{ zIndex: 1000, maxHeight: '400px', overflowY: 'auto' }}
                >
                  {searchQuery.length >= 2 && searchResults.length > 0 && (
                    <>
                      <div className="px-3 py-2 border-bottom">
                        <small className="text-muted">Résultats de recherche</small>
                      </div>
                      <ListGroup variant="flush">
                        {searchResults.map((manga) => (
                          <ListGroup.Item
                            key={manga.id}
                            action
                            onClick={() => handleSearchResultClick(manga)}
                            className={`d-flex align-items-center ${darkMode ? 'bg-dark text-light' : ''}`}
                          >
                            <img
                              src={manga.cover_image}
                              alt={manga.title}
                              className="rounded me-3"
                              style={{ width: '40px', height: '55px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow-1">
                              <div className="fw-bold">{manga.title}</div>
                              <small className="text-muted">par {manga.author}</small>
                              <div className="d-flex align-items-center mt-1">
                                <Badge 
                                  bg={manga.status === 'ongoing' ? 'success' : 'primary'} 
                                  className="me-2"
                                >
                                  {manga.status === 'ongoing' ? 'En cours' : 'Terminé'}
                                </Badge>
                                <small className="text-warning">
                                  <i className="fas fa-star me-1"></i>
                                  {manga.rating}
                                </small>
                              </div>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </>
                  )}
                  
                  {/* Recent Searches */}
                  {searchQuery.length < 2 && recentSearches.length > 0 && (
                    <>
                      <div className="px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
                        <small className="text-muted">Recherches récentes</small>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-decoration-none"
                          onClick={clearRecentSearches}
                        >
                          <i className="fas fa-times"></i>
                        </Button>
                      </div>
                      <ListGroup variant="flush">
                        {recentSearches.map((search, index) => (
                          <ListGroup.Item
                            key={index}
                            action
                            onClick={() => handleRecentSearchClick(search)}
                            className={`d-flex align-items-center ${darkMode ? 'bg-dark text-light' : ''}`}
                          >
                            <i className="fas fa-history me-3 text-muted"></i>
                            <span className="flex-grow-1">{search}</span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Right Controls */}
            <Nav className="align-items-center">
              {/* Desktop Notifications */}
              {isAuthenticated && (
                <Dropdown className="me-2">
                  <Dropdown.Toggle
                    variant="link"
                    className={`text-decoration-none ${darkMode ? 'text-light' : 'text-dark'} position-relative`}
                  >
                    <i className="fas fa-bell fa-lg"></i>
                    {notificationCount > 0 && (
                      <Badge
                        bg="danger"
                        pill
                        className="position-absolute top-0 start-100 translate-middle"
                        style={{ fontSize: '0.6rem' }}
                      >
                        {notificationCount}
                      </Badge>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end" style={{ minWidth: '300px' }}>
                    <Dropdown.Header>Notifications</Dropdown.Header>
                    {notifications.map((notification) => (
                      <Dropdown.Item key={notification.id} className={notification.read ? 'text-muted' : ''}>
                        <div className="d-flex">
                          <i className={`fas ${notification.type === 'chapter' ? 'fa-book' : 'fa-heart'} me-2 mt-1`}></i>
                          <div>
                            <div className="fw-bold">{notification.title}</div>
                            <small>{notification.message}</small>
                          </div>
                        </div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
              
              {/* Theme Toggle */}
              <Button
                variant="link"
                className={`text-decoration-none ${darkMode ? 'text-light' : 'text-dark'} me-2`}
                onClick={toggleTheme}
                title="Changer de thème"
              >
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} fa-lg`}></i>
              </Button>
              
              {/* Language Selector */}
              <Dropdown as={ButtonGroup} className="me-2">
                <Button
                  variant="link"
                  className={`text-decoration-none ${darkMode ? 'text-light' : 'text-dark'}`}
                >
                  {getLanguageFlag(language)}
                </Button>
                <Dropdown.Toggle
                  split
                  variant="link"
                  className={`${darkMode ? 'text-light' : 'text-dark'} border-0`}
                />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => toggleLanguage('fr')}>
                    🇫🇷 Français
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => toggleLanguage('en')}>
                    🇺🇸 English
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => toggleLanguage('es')}>
                    🇪🇸 Español
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => toggleLanguage('ja')}>
                    🇯🇵 日本語
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              
              {/* User Menu */}
              {isAuthenticated ? (
                <NavDropdown 
                  title={
                    <span className="d-flex align-items-center">
                      <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=007bff&color=fff&size=32`}
                        alt="Avatar"
                        className="rounded-circle me-2"
                        style={{ width: '28px', height: '28px' }}
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
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/settings">
                    <i className="fas fa-cog me-2 text-secondary"></i>
                    Paramètres
                  </NavDropdown.Item>
                  {user?.is_admin && (
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/admin" className="text-warning">
                        <i className="fas fa-shield-alt me-2"></i>
                        Administration
                      </NavDropdown.Item>
                    </>
                  )}
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
                    to="/login" 
                    variant={darkMode ? 'outline-light' : 'outline-primary'}
                    size="sm"
                  >
                    <i className="fas fa-sign-in-alt me-1"></i>
                    <span className="d-none d-sm-inline">Connexion</span>
                  </Button>
                  <Button 
                    as={Link} 
                    to="/register" 
                    variant="primary"
                    size="sm"
                    className="ms-1"
                  >
                    <i className="fas fa-user-plus me-1"></i>
                    <span className="d-none d-sm-inline">S'inscrire</span>
                  </Button>
                </ButtonGroup>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Search Modal */}
      <Modal show={showMobileSearch} onHide={() => setShowMobileSearch(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-search me-2"></i>
            Rechercher
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="input-group">
              <FormControl
                type="search"
                placeholder="Rechercher manga, auteur..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                autoFocus
              />
              <Button variant="primary" type="submit">
                {searchLoading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <i className="fas fa-search"></i>
                )}
              </Button>
            </div>
          </Form>
          
          {/* Mobile Search Results */}
          {searchQuery.length >= 2 && searchResults.length > 0 && (
            <>
              <h6>Résultats</h6>
              <ListGroup>
                {searchResults.map((manga) => (
                  <ListGroup.Item
                    key={manga.id}
                    action
                    onClick={() => handleSearchResultClick(manga)}
                    className="d-flex align-items-center"
                  >
                    <img
                      src={manga.cover_image}
                      alt={manga.title}
                      className="rounded me-3"
                      style={{ width: '40px', height: '55px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <div className="fw-bold">{manga.title}</div>
                      <small className="text-muted">par {manga.author}</small>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
          
          {/* Mobile Recent Searches */}
          {recentSearches.length > 0 && (
            <>
              <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
                <h6>Recherches récentes</h6>
                <Button variant="link" size="sm" className="p-0" onClick={clearRecentSearches}>
                  Effacer
                </Button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    bg="secondary"
                    pill
                    role="button"
                    onClick={() => handleRecentSearchClick(search)}
                    style={{ cursor: 'pointer' }}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Mobile Navigation Menu */}
      <Modal 
        show={showMobileMenu} 
        onHide={() => setShowMobileMenu(false)} 
        fullscreen
        className="mobile-menu-modal"
      >
        <Modal.Header closeButton className={darkMode ? 'bg-dark text-light' : 'bg-light'}>
          <Modal.Title className="d-flex align-items-center">
            <i className="fas fa-book-open me-2 text-primary"></i>
            {siteName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`p-0 ${darkMode ? 'bg-dark' : 'bg-light'}`}>
          <div className="mobile-menu-content">
            {/* User Section */}
            {isAuthenticated ? (
              <div className={`p-4 border-bottom ${darkMode ? 'border-secondary' : 'border-light'}`}>
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=007bff&color=fff&size=60`}
                    alt="Avatar"
                    className="rounded-circle me-3"
                    style={{ width: '50px', height: '50px' }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-bold">{user?.username || 'User'}</div>
                    <small className="text-muted">{user?.email}</small>
                  </div>
                  {notificationCount > 0 && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="position-relative ms-2"
                      onClick={() => {
                        navigate('/notifications');
                        setShowMobileMenu(false);
                      }}
                    >
                      <i className="fas fa-bell"></i>
                      <Badge
                        bg="danger"
                        pill
                        className="position-absolute top-0 start-100 translate-middle"
                        style={{ fontSize: '0.6rem' }}
                      >
                        {notificationCount}
                      </Badge>
                    </Button>
                  )}
                </div>
                <div className="d-flex gap-2">
                  <Badge bg="primary">
                    <i className="fas fa-heart me-1"></i>
                    {user?.favoritesCount || 0} Favoris
                  </Badge>
                  <Badge bg="success">
                    <i className="fas fa-book me-1"></i>
                    {user?.readingCount || 0} En cours
                  </Badge>
                </div>
              </div>
            ) : (
              <div className={`p-4 border-bottom ${darkMode ? 'border-secondary' : 'border-light'}`}>
                <Row>
                  <Col xs={6}>
                    <Button 
                      as={Link} 
                      to="/login" 
                      variant="primary"
                      className="w-100"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Connexion
                    </Button>
                  </Col>
                  <Col xs={6}>
                    <Button 
                      as={Link} 
                      to="/register" 
                      variant="outline-primary"
                      className="w-100"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <i className="fas fa-user-plus me-2"></i>
                      S'inscrire
                    </Button>
                  </Col>
                </Row>
              </div>
            )}

            {/* Quick Actions */}
            <div className="p-4">
              <h6 className="mb-3">
                <i className="fas fa-bolt me-2 text-warning"></i>
                Actions rapides
              </h6>
              <Row>
                <Col xs={6} className="mb-2">
                  <Button
                    as={Link}
                    to="/popular"
                    variant="outline-danger"
                    className="w-100"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-fire me-2"></i>
                    Populaires
                  </Button>
                </Col>
                <Col xs={6} className="mb-2">
                  <Button
                    as={Link}
                    to="/new"
                    variant="outline-success"
                    className="w-100"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-star me-2"></i>
                    Nouveautés
                  </Button>
                </Col>
                <Col xs={6} className="mb-2">
                  <Button
                    as={Link}
                    to="/latest"
                    variant="outline-info"
                    className="w-100"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-clock me-2"></i>
                    Récents
                  </Button>
                </Col>
                <Col xs={6} className="mb-2">
                  <Button
                    as={Link}
                    to="/completed"
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-check-circle me-2"></i>
                    Terminés
                  </Button>
                </Col>
              </Row>
            </div>

            {/* Main Navigation */}
            <div className={`border-top ${darkMode ? 'border-secondary' : 'border-light'}`}>
              <ListGroup variant="flush">
                <ListGroup.Item 
                  as={Link} 
                  to="/" 
                  action
                  className={`d-flex align-items-center py-3 ${darkMode ? 'bg-dark text-light' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <i className="fas fa-home me-3 text-primary fa-lg"></i>
                  <div>
                    <div className="fw-bold">Accueil</div>
                    <small className="text-muted">Page principale</small>
                  </div>
                </ListGroup.Item>

                <ListGroup.Item 
                  as={Link} 
                  to="/search" 
                  action
                  className={`d-flex align-items-center py-3 ${darkMode ? 'bg-dark text-light' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <i className="fas fa-search me-3 text-info fa-lg"></i>
                  <div>
                    <div className="fw-bold">Recherche Avancée</div>
                    <small className="text-muted">Filtres et tri</small>
                  </div>
                </ListGroup.Item>

                <ListGroup.Item 
                  as={Link} 
                  to="/genres" 
                  action
                  className={`d-flex align-items-center py-3 ${darkMode ? 'bg-dark text-light' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <i className="fas fa-tags me-3 text-warning fa-lg"></i>
                  <div>
                    <div className="fw-bold">Tous les Genres</div>
                    <small className="text-muted">Action, Romance, Comédie...</small>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </div>

            {/* User Menu Items (if authenticated) */}
            {isAuthenticated && (
              <>
                {/* Notifications Section */}
                {notifications.length > 0 && (
                  <div className={`border-top ${darkMode ? 'border-secondary' : 'border-light'}`}>
                    <div className="p-3 d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">
                        <i className="fas fa-bell me-2 text-warning"></i>
                        Notifications
                      </h6>
                      {notificationCount > 0 && (
                        <Badge bg="danger" pill>{notificationCount}</Badge>
                      )}
                    </div>
                    <div className="px-3 pb-3">
                      {notifications.slice(0, 3).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-2 mb-2 rounded ${darkMode ? 'bg-secondary' : 'bg-light'} ${
                            !notification.read ? 'border-start border-primary border-3' : ''
                          }`}
                        >
                          <div className="d-flex align-items-start">
                            <i className={`fas ${
                              notification.type === 'chapter' ? 'fa-book' : 'fa-heart'
                            } me-2 mt-1 ${notification.type === 'chapter' ? 'text-info' : 'text-danger'}`}></i>
                            <div className="flex-grow-1">
                              <div className="fw-bold small">{notification.title}</div>
                              <small className="text-muted">{notification.message}</small>
                            </div>
                            {!notification.read && (
                              <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Account Menu */}
                <div className={`border-top ${darkMode ? 'border-secondary' : 'border-light'}`}>
                  <div className="p-3">
                    <h6 className="mb-3">
                      <i className="fas fa-user me-2 text-primary"></i>
                      Mon compte
                    </h6>
                  </div>
                  <ListGroup variant="flush">
                    <ListGroup.Item 
                      as={Link} 
                      to="/profile" 
                      action
                      className={`d-flex align-items-center py-3 ${darkMode ? 'bg-dark text-light' : ''}`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <i className="fas fa-user-circle me-3 text-primary fa-lg"></i>
                      <span>Mon Profil</span>
                    </ListGroup.Item>

                    <ListGroup.Item 
                      as={Link} 
                      to="/favorites" 
                      action
                      className={`d-flex align-items-center py-3 ${darkMode ? 'bg-dark text-light' : ''}`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <i className="fas fa-heart me-3 text-danger fa-lg"></i>
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <span>Mes Favoris</span>
                        {user?.favoritesCount && (
                          <Badge bg="danger">{user.favoritesCount}</Badge>
                        )}
                      </div>
                    </ListGroup.Item>

                    <ListGroup.Item 
                      as={Link} 
                      to="/history" 
                      action
                      className={`d-flex align-items-center py-3 ${darkMode ? 'bg-dark text-light' : ''}`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <i className="fas fa-history me-3 text-info fa-lg"></i>
                      <span>Historique</span>
                    </ListGroup.Item>

                    <ListGroup.Item 
                      as={Link} 
                      to="/settings" 
                      action
                      className={`d-flex align-items-center py-3 ${darkMode ? 'bg-dark text-light' : ''}`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <i className="fas fa-cog me-3 text-secondary fa-lg"></i>
                      <span>Paramètres</span>
                    </ListGroup.Item>

                    {user?.is_admin && (
                      <ListGroup.Item 
                        as={Link} 
                        to="/admin" 
                        action
                        className={`d-flex align-items-center py-3 ${darkMode ? 'bg-dark text-light' : ''}`}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <i className="fas fa-shield-alt me-3 text-warning fa-lg"></i>
                        <span>Administration</span>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </div>
              </>
            )}

            {/* Popular Genres */}
            <div className={`border-top ${darkMode ? 'border-secondary' : 'border-light'}`}>
              <div className="p-3">
                <h6 className="mb-3">
                  <i className="fas fa-tags me-2 text-warning"></i>
                  Genres populaires
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  <Badge
                    as={Link}
                    to="/search?genre=action"
                    bg="danger"
                    className="text-decoration-none"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-fist-raised me-1"></i>
                    Action
                  </Badge>
                  <Badge
                    as={Link}
                    to="/search?genre=romance"
                    bg="pink"
                    className="text-decoration-none"
                    style={{ backgroundColor: '#e91e63', color: 'white' }}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-heart me-1"></i>
                    Romance
                  </Badge>
                  <Badge
                    as={Link}
                    to="/search?genre=comedy"
                    bg="warning"
                    className="text-decoration-none"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-laugh me-1"></i>
                    Comédie
                  </Badge>
                  <Badge
                    as={Link}
                    to="/search?genre=adventure"
                    bg="success"
                    className="text-decoration-none"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className="fas fa-map me-1"></i>
                    Aventure
                  </Badge>
                </div>
              </div>
            </div>

            {/* Settings & Controls */}
            <div className={`border-top ${darkMode ? 'border-secondary' : 'border-light'} p-4`}>
              <h6 className="mb-3">
                <i className="fas fa-cogs me-2 text-secondary"></i>
                Préférences
              </h6>
              
              {/* Theme Toggle */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} me-2`}></i>
                  <span>Mode {darkMode ? 'clair' : 'sombre'}</span>
                </div>
                <Form.Check
                  type="switch"
                  id="theme-switch-mobile"
                  checked={darkMode}
                  onChange={toggleTheme}
                />
              </div>

              {/* Language Selection */}
              <div className="mb-3">
                <label className="form-label">
                  <i className="fas fa-language me-2"></i>
                  Langue
                </label>
                <Form.Select
                  value={language}
                  onChange={(e) => toggleLanguage(e.target.value)}
                  size="sm"
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="es">🇪🇸 Español</option>
                  <option value="ja">🇯🇵 日本語</option>
                </Form.Select>
              </div>
            </div>

            {/* Logout Button (if authenticated) */}
            {isAuthenticated && (
              <div className={`border-top ${darkMode ? 'border-secondary' : 'border-light'} p-4`}>
                <Button
                  variant="outline-danger"
                  className="w-100"
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Déconnexion
                </Button>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
      
      {/* Custom Styles */}
      <style jsx>{`
        .text-gradient {
          background: linear-gradient(45deg, #007bff, #6f42c1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .navbar-nav .nav-link {
          transition: all 0.3s ease;
        }
        
        .navbar-nav .nav-link:hover {
          transform: translateY(-1px);
        }
        
        .dropdown-menu {
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border: none;
          border-radius: 10px;
        }
        
        .dropdown-item {
          transition: all 0.3s ease;
          border-radius: 8px;
          margin: 2px 8px;
        }
        
        .dropdown-item:hover {
          background-color: var(--bs-primary);
          color: white;
          transform: translateX(5px);
        }
        
        .search-dropdown {
          animation: fadeInDown 0.3s ease-out;
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Mobile Menu Styles */
        .mobile-menu-modal .modal-content {
          border-radius: 0;
          border: none;
        }
        
        .mobile-menu-content {
          height: 100%;
          overflow-y: auto;
        }
        
        .mobile-menu-content .list-group-item {
          border-left: none;
          border-right: none;
          border-radius: 0;
          transition: all 0.3s ease;
        }
        
        .mobile-menu-content .list-group-item:hover {
          background-color: var(--bs-primary);
          color: white;
          transform: translateX(10px);
        }
        
        .mobile-menu-content .list-group-item:hover i {
          color: white !important;
        }
        
        /* Custom Mobile Hamburger Toggle */
        .navbar-toggler {
          border: none !important;
          padding: 4px 8px;
          position: relative;
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }
        
        .navbar-toggler:focus {
          box-shadow: none !important;
          outline: none !important;
        }
        
        .navbar-toggler-icon {
          background-image: none !important;
          width: 24px;
          height: 3px;
          position: relative;
          background-color: currentColor;
          border-radius: 1px;
          transition: 0.3s ease-in-out;
          display: block;
        }
        
        .navbar-toggler-icon::before,
        .navbar-toggler-icon::after {
          content: '';
          position: absolute;
          height: 3px;
          width: 24px;
          background-color: currentColor;
          border-radius: 1px;
          left: 0;
          transition: 0.25s ease-in-out;
        }
        
        .navbar-toggler-icon::before {
          top: -8px;
        }
        
        .navbar-toggler-icon::after {
          top: 8px;
        }
        
        .navbar-toggler[aria-expanded="true"] .navbar-toggler-icon {
          background-color: transparent;
        }
        
        .navbar-toggler[aria-expanded="true"] .navbar-toggler-icon::before {
          top: 0;
          transform: rotate(45deg);
        }
        
        .navbar-toggler[aria-expanded="true"] .navbar-toggler-icon::after {
          top: 0;
          transform: rotate(-45deg);
        }
        
        /* Hide default Bootstrap navbar collapse on mobile */
        @media (max-width: 991px) {
          .navbar-collapse {
            display: none !important;
          }
        }
        
        /* Mobile controls enhancement */
        .mobile-controls .btn {
          transition: all 0.2s ease;
          border-radius: 8px;
        }
        
        .mobile-controls .btn:hover {
          background-color: rgba(var(--bs-primary-rgb), 0.1);
          transform: scale(1.05);
        }
        
        .mobile-controls .btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
};

export default NavigationBar;