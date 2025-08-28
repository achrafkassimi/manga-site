// src/pages/SearchPage.jsx - Recherche avancée complète
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Card, 
  Pagination, 
  Badge,
  ButtonGroup,
  Dropdown,
  Collapse,
  InputGroup,
  Spinner
} from 'react-bootstrap';
import MangaCard from '../components/manga/MangaCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { mangaService } from '../services/mangaService';
import api from '../services/api';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchResults, setSearchResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    q: '',
    genres: [],
    status: '',
    ordering: '-updated_at',
    rating_min: '',
    rating_max: '',
    year_min: '',
    year_max: '',
    chapters_min: '',
    chapters_max: ''
  });

  // View options
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(location.search);
    const newFilters = { ...filters };
    
    params.forEach((value, key) => {
      if (key === 'genres') {
        newFilters.genres = value.split(',').filter(Boolean);
      } else if (key === 'page') {
        setCurrentPage(parseInt(value) || 1);
      } else {
        newFilters[key] = value;
      }
    });
    
    setFilters(newFilters);
    
    // Auto-search if there are parameters
    if (params.toString()) {
      performSearch(newFilters, parseInt(params.get('page')) || 1);
    }
  }, [location.search]);

  const fetchGenres = async () => {
    try {
      const response = await api.get('/genres/');
      setGenres(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const performSearch = async (searchFilters = filters, page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        per_page: itemsPerPage,
        ...searchFilters,
        genres: searchFilters.genres.join(',')
      };

      // Remove empty parameters
      Object.keys(params).forEach(key => {
        if (!params[key] || (Array.isArray(params[key]) && params[key].length === 0)) {
          delete params[key];
        }
      });

      const response = await mangaService.searchManga(params.q || '', params);
      const data = response.data;
      
      setSearchResults(data.results || data || []);
      setTotalResults(data.count || data.length || 0);
      setTotalPages(Math.ceil((data.count || data.length || 0) / itemsPerPage));
      
      // Update URL
      updateURL(params, page);
      
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setTotalResults(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (params, page) => {
    const urlParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] && key !== 'page' && key !== 'per_page') {
        urlParams.set(key, params[key]);
      }
    });
    
    if (page > 1) {
      urlParams.set('page', page);
    }
    
    const newSearch = urlParams.toString();
    navigate(`/search${newSearch ? `?${newSearch}` : ''}`, { replace: true });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
  };

  const handleGenreToggle = (genreName) => {
    const newGenres = filters.genres.includes(genreName)
      ? filters.genres.filter(g => g !== genreName)
      : [...filters.genres, genreName];
    
    handleFilterChange('genres', newGenres);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    performSearch(filters, 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    performSearch(filters, page);
    window.scrollTo(0, 0);
  };

  const clearFilters = () => {
    const resetFilters = {
      q: '',
      genres: [],
      status: '',
      ordering: '-updated_at',
      rating_min: '',
      rating_max: '',
      year_min: '',
      year_max: '',
      chapters_min: '',
      chapters_max: ''
    };
    setFilters(resetFilters);
    setCurrentPage(1);
    navigate('/search');
    setSearchResults([]);
    setTotalResults(0);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'ongoing': return 'success';
      case 'completed': return 'primary';
      case 'hiatus': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="search-page">
      {/* Search Header */}
      <div className="bg-light py-4 mb-4">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h1 className="mb-0">
                <i className="fas fa-search me-2"></i>
                Recherche Manga
              </h1>
              {totalResults > 0 && (
                <p className="text-muted mb-0 mt-1">
                  {totalResults} résultat{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
                </p>
              )}
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-primary"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="me-2"
              >
                <i className={`fas fa-${showAdvancedFilters ? 'chevron-up' : 'sliders-h'} me-1`}></i>
                Filtres avancés
              </Button>
              
              <ButtonGroup>
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  title="Vue grille"
                >
                  <i className="fas fa-th"></i>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  title="Vue liste"
                >
                  <i className="fas fa-list"></i>
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row>
          {/* Filters Sidebar */}
          <Col lg={3} className="mb-4">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-filter me-2"></i>
                  Filtres
                </h5>
                <Button variant="link" size="sm" onClick={clearFilters} className="text-decoration-none p-0">
                  <i className="fas fa-times me-1"></i>
                  Effacer
                </Button>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSearch}>
                  {/* Search Query */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="fas fa-search me-1"></i>
                      Recherche
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Titre, auteur..."
                        value={filters.q}
                        onChange={(e) => handleFilterChange('q', e.target.value)}
                      />
                      <Button variant="outline-primary" type="submit">
                        <i className="fas fa-search"></i>
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  {/* Quick Filters */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="fas fa-bolt me-1"></i>
                      Filtres rapides
                    </Form.Label>
                    <div className="d-flex flex-wrap gap-1">
                      <Badge
                        bg={filters.status === 'ongoing' ? 'success' : 'outline-success'}
                        className="cursor-pointer"
                        onClick={() => handleFilterChange('status', filters.status === 'ongoing' ? '' : 'ongoing')}
                      >
                        En cours
                      </Badge>
                      <Badge
                        bg={filters.status === 'completed' ? 'primary' : 'outline-primary'}
                        className="cursor-pointer"
                        onClick={() => handleFilterChange('status', filters.status === 'completed' ? '' : 'completed')}
                      >
                        Terminé
                      </Badge>
                      <Badge
                        bg={filters.rating_min === '8' ? 'warning' : 'outline-warning'}
                        className="cursor-pointer"
                        onClick={() => handleFilterChange('rating_min', filters.rating_min === '8' ? '' : '8')}
                      >
                        Note ≥ 8
                      </Badge>
                    </div>
                  </Form.Group>

                  {/* Status Filter */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="fas fa-info-circle me-1"></i>
                      Statut
                    </Form.Label>
                    <Form.Select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">Tous les statuts</option>
                      <option value="ongoing">En cours</option>
                      <option value="completed">Terminé</option>
                      <option value="hiatus">En pause</option>
                      <option value="cancelled">Annulé</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Sorting */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="fas fa-sort me-1"></i>
                      Trier par
                    </Form.Label>
                    <Form.Select
                      value={filters.ordering}
                      onChange={(e) => handleFilterChange('ordering', e.target.value)}
                    >
                      <option value="-updated_at">Dernière MAJ</option>
                      <option value="-created_at">Plus récent</option>
                      <option value="-rating">Mieux noté</option>
                      <option value="-view_count">Plus populaire</option>
                      <option value="title">Titre A-Z</option>
                      <option value="-title">Titre Z-A</option>
                      <option value="-total_chapters">Plus de chapitres</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Advanced Filters */}
                  <Collapse in={showAdvancedFilters}>
                    <div>
                      {/* Rating Range */}
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="fas fa-star me-1"></i>
                          Note
                        </Form.Label>
                        <Row>
                          <Col>
                            <Form.Control
                              type="number"
                              placeholder="Min"
                              min="0"
                              max="10"
                              step="0.1"
                              value={filters.rating_min}
                              onChange={(e) => handleFilterChange('rating_min', e.target.value)}
                            />
                          </Col>
                          <Col xs="auto" className="px-1">
                            <span className="form-control-plaintext">à</span>
                          </Col>
                          <Col>
                            <Form.Control
                              type="number"
                              placeholder="Max"
                              min="0"
                              max="10"
                              step="0.1"
                              value={filters.rating_max}
                              onChange={(e) => handleFilterChange('rating_max', e.target.value)}
                            />
                          </Col>
                        </Row>
                      </Form.Group>

                      {/* Year Range */}
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="fas fa-calendar me-1"></i>
                          Année de publication
                        </Form.Label>
                        <Row>
                          <Col>
                            <Form.Control
                              type="number"
                              placeholder="2000"
                              min="1950"
                              max={new Date().getFullYear()}
                              value={filters.year_min}
                              onChange={(e) => handleFilterChange('year_min', e.target.value)}
                            />
                          </Col>
                          <Col xs="auto" className="px-1">
                            <span className="form-control-plaintext">à</span>
                          </Col>
                          <Col>
                            <Form.Control
                              type="number"
                              placeholder={new Date().getFullYear()}
                              min="1950"
                              max={new Date().getFullYear()}
                              value={filters.year_max}
                              onChange={(e) => handleFilterChange('year_max', e.target.value)}
                            />
                          </Col>
                        </Row>
                      </Form.Group>

                      {/* Chapters Range */}
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="fas fa-list-ol me-1"></i>
                          Nombre de chapitres
                        </Form.Label>
                        <Row>
                          <Col>
                            <Form.Control
                              type="number"
                              placeholder="Min"
                              min="0"
                              value={filters.chapters_min}
                              onChange={(e) => handleFilterChange('chapters_min', e.target.value)}
                            />
                          </Col>
                          <Col xs="auto" className="px-1">
                            <span className="form-control-plaintext">à</span>
                          </Col>
                          <Col>
                            <Form.Control
                              type="number"
                              placeholder="Max"
                              min="0"
                              value={filters.chapters_max}
                              onChange={(e) => handleFilterChange('chapters_max', e.target.value)}
                            />
                          </Col>
                        </Row>
                      </Form.Group>
                    </div>
                  </Collapse>

                  {/* Genres Filter */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="fas fa-tags me-1"></i>
                      Genres ({filters.genres.length} sélectionnés)
                    </Form.Label>
                    <div className="genre-filter border rounded p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {genres.map(genre => (
                        <Form.Check
                          key={genre.id}
                          type="checkbox"
                          id={`genre-${genre.id}`}
                          label={
                            <span>
                              {genre.name}
                              {genre.manga_count && (
                                <small className="text-muted ms-1">({genre.manga_count})</small>
                              )}
                            </span>
                          }
                          checked={filters.genres.includes(genre.name.toLowerCase())}
                          onChange={() => handleGenreToggle(genre.name.toLowerCase())}
                          className="small"
                        />
                      ))}
                    </div>
                  </Form.Group>

                  <div className="d-grid">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Recherche...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-search me-2"></i>
                          Rechercher
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Active Filters Summary */}
            {(filters.q || filters.genres.length > 0 || filters.status || filters.rating_min || filters.rating_max) && (
              <Card className="mt-3">
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="fas fa-eye me-2"></i>
                    Filtres actifs
                  </h6>
                </Card.Header>
                <Card.Body className="p-2">
                  <div className="d-flex flex-wrap gap-1">
                    {filters.q && (
                      <Badge bg="primary" className="d-flex align-items-center">
                        "{filters.q}"
                        <i 
                          className="fas fa-times ms-1 cursor-pointer" 
                          onClick={() => handleFilterChange('q', '')}
                        ></i>
                      </Badge>
                    )}
                    {filters.status && (
                      <Badge bg={getStatusBadgeVariant(filters.status)} className="d-flex align-items-center">
                        {filters.status}
                        <i 
                          className="fas fa-times ms-1 cursor-pointer" 
                          onClick={() => handleFilterChange('status', '')}
                        ></i>
                      </Badge>
                    )}
                    {filters.genres.map(genre => (
                      <Badge key={genre} bg="secondary" className="d-flex align-items-center">
                        {genre}
                        <i 
                          className="fas fa-times ms-1 cursor-pointer" 
                          onClick={() => handleGenreToggle(genre)}
                        ></i>
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Search Results */}
          <Col lg={9}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="mb-0">Résultats de recherche</h4>
                {!loading && searchResults.length > 0 && (
                  <small className="text-muted">
                    Page {currentPage} sur {totalPages} • {totalResults} manga
                  </small>
                )}
              </div>
              
              <div className="d-flex align-items-center gap-2">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <i className="fas fa-eye me-1"></i>
                    {itemsPerPage} par page
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {[10, 20, 50].map(count => (
                      <Dropdown.Item
                        key={count}
                        onClick={() => {
                          setItemsPerPage(count);
                          setCurrentPage(1);
                          performSearch(filters, 1);
                        }}
                        active={itemsPerPage === count}
                      >
                        {count} par page
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <LoadingSpinner text="Recherche en cours..." />
              </div>
            ) : searchResults.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <Row>
                    {searchResults.map(manga => (
                      <Col key={manga.id} xl={3} lg={4} md={6} className="mb-4">
                        <MangaCard manga={manga} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div className="manga-list">
                    {searchResults.map(manga => (
                      <Card key={manga.id} className="mb-3">
                        <Row className="g-0">
                          <Col md={2}>
                            <img
                              src={manga.cover_image || '/placeholder-cover.jpg'}
                              alt={manga.title}
                              className="img-fluid rounded-start h-100 w-100"
                              style={{ objectFit: 'cover', minHeight: '120px' }}
                            />
                          </Col>
                          <Col md={10}>
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <Card.Title as="h5">
                                    <a 
                                      href={`/manga/${manga.slug}`} 
                                      className="text-decoration-none"
                                    >
                                      {manga.title}
                                    </a>
                                  </Card.Title>
                                  <Card.Text className="text-muted small mb-1">
                                    by {manga.author || 'Unknown'}
                                  </Card.Text>
                                  <Card.Text className="mb-2">
                                    {manga.description?.substring(0, 200)}...
                                  </Card.Text>
                                  <div className="d-flex flex-wrap gap-1 mb-2">
                                    {manga.genres?.slice(0, 3).map(genre => (
                                      <Badge key={genre.id} bg="light" text="dark" className="small">
                                        {genre.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="text-end ms-3">
                                  <Badge bg={getStatusBadgeVariant(manga.status)} className="mb-1">
                                    {manga.status}
                                  </Badge>
                                  {manga.rating > 0 && (
                                    <div className="small">
                                      <i className="fas fa-star text-warning me-1"></i>
                                      {manga.rating}
                                    </div>
                                  )}
                                  <div className="small text-muted">
                                    {manga.total_chapters} ch.
                                  </div>
                                </div>
                              </div>
                            </Card.Body>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.First
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      />
                      <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                      
                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                        const pageNum = Math.max(1, Math.min(currentPage - 2 + index, totalPages - 4 + index));
                        return (
                          <Pagination.Item
                            key={pageNum}
                            active={pageNum === currentPage}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Pagination.Item>
                        );
                      })}

                      <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                      <Pagination.Last
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">Aucun manga trouvé</h4>
                <p className="text-muted">
                  Essayez d'ajuster vos critères de recherche ou explorez nos suggestions
                </p>
                <Button variant="primary" onClick={clearFilters}>
                  <i className="fas fa-refresh me-2"></i>
                  Effacer les filtres
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SearchPage;