// src/components/manga/FeaturedManga.jsx
import React, { useState, useEffect } from 'react';
import { Carousel, Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { mangaService } from '../../services/mangaService';
import LoadingSpinner from '../common/LoadingSpinner';

const FeaturedManga = () => {
  const [featuredManga, setFeaturedManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchFeaturedManga();
  }, []);

  const fetchFeaturedManga = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mangaService.getFeaturedManga();
      
      // Handle both paginated and non-paginated responses
      const mangaData = response.data.results || response.data || [];
      setFeaturedManga(mangaData);
    } catch (error) {
      console.error('Error fetching featured manga:', error);
      setError('Failed to load featured manga');
      setFeaturedManga([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-hero.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
    return imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
  };

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const handleRetry = () => {
    fetchFeaturedManga();
  };

  if (loading) {
    return (
      <section className="featured-section mb-5">
        <div style={{ height: '500px', backgroundColor: '#f8f9fa' }}>
          <Container className="h-100 d-flex align-items-center justify-content-center">
            <LoadingSpinner text="Loading featured manga..." />
          </Container>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-section mb-5">
        <div style={{ height: '500px', backgroundColor: '#f8f9fa' }}>
          <Container className="h-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
              <h4 className="text-muted">{error}</h4>
              <Button variant="primary" onClick={handleRetry}>
                <i className="fas fa-redo me-2"></i>
                Try Again
              </Button>
            </div>
          </Container>
        </div>
      </section>
    );
  }

  if (featuredManga.length === 0) {
    return (
      <section className="featured-section mb-5">
        <div style={{ height: '500px', backgroundColor: '#f8f9fa' }}>
          <Container className="h-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <i className="fas fa-star fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No featured manga available</h4>
              <p className="text-muted">Check back later for featured content!</p>
            </div>
          </Container>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-section mb-5">
      <Carousel 
        fade 
        className="featured-carousel"
        activeIndex={activeIndex}
        onSelect={handleSelect}
        interval={5000}
        pause="hover"
      >
        {featuredManga.map((manga, index) => (
          <Carousel.Item key={manga.id}>
            <div 
              className="carousel-bg d-flex align-items-center"
              style={{
                height: '500px',
                background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${getImageUrl(manga.cover_image)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
              }}
            >
              <Container>
                <Row className="align-items-center h-100">
                  <Col md={8} lg={6}>
                    <div className="text-white">
                      <div className="mb-3">
                        <Badge bg="warning" text="dark" className="me-2">
                          <i className="fas fa-crown me-1"></i>
                          FEATURED
                        </Badge>
                        {manga.rating && manga.rating > 0 && (
                          <Badge bg="dark" className="me-2">
                            <i className="fas fa-star text-warning me-1"></i>
                            {Number(manga.rating).toFixed(1)}
                          </Badge>
                        )}
                        {manga.status && (
                          <Badge 
                            bg={manga.status === 'ongoing' ? 'success' : 'primary'}
                          >
                            {manga.status.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      
                      <h1 className="display-4 fw-bold mb-3 text-shadow">
                        {manga.title || 'Unknown Title'}
                      </h1>
                      
                      <p className="lead mb-3">
                        by {manga.author || 'Unknown Author'}
                        {manga.artist && manga.artist !== manga.author && (
                          <span> • Art by {manga.artist}</span>
                        )}
                      </p>
                      
                      <p className="mb-4 fs-6" style={{ 
                        maxHeight: '4.5em', 
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {manga.description || 'No description available.'}
                      </p>

                      {/* Genres */}
                      <div className="mb-4">
                        {manga.genres && manga.genres.slice(0, 3).map(genre => (
                          <Badge 
                            key={genre.id}
                            bg="light" 
                            text="dark" 
                            className="me-2"
                            style={{ opacity: 0.9 }}
                          >
                            {genre.name}
                          </Badge>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-3 flex-wrap">
                        <Button 
                          as={Link}
                          to={`/manga/${manga.slug}`}
                          variant="primary"
                          size="lg"
                          className="btn-glow"
                        >
                          <i className="fas fa-book-open me-2"></i>
                          Read Now
                        </Button>
                        
                        <Button 
                          as={Link}
                          to={`/manga/${manga.slug}`}
                          variant="outline-light"
                          size="lg"
                        >
                          <i className="fas fa-info-circle me-2"></i>
                          View Details
                        </Button>
                        
                        {manga.total_chapters > 0 && (
                          <Button 
                            variant="outline-light"
                            size="lg"
                            disabled
                          >
                            <i className="fas fa-list me-2"></i>
                            {manga.total_chapters} Chapter{manga.total_chapters !== 1 ? 's' : ''}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Col>
                  
                  {/* Optional: Show cover image on larger screens */}
                  <Col md={4} lg={3} className="d-none d-lg-block">
                    <div className="text-center">
                      <img
                        src={getImageUrl(manga.cover_image)}
                        alt={manga.title}
                        className="img-fluid rounded shadow-lg"
                        style={{ 
                          maxHeight: '300px',
                          objectFit: 'cover',
                          opacity: 0.9
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Carousel Indicators (Custom) */}
      {featuredManga.length > 1 && (
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
          <div className="d-flex gap-2">
            {featuredManga.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`carousel-indicator-custom ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleSelect(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: '2px solid white',
                  backgroundColor: index === activeIndex ? 'white' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedManga;




// import React, { useState, useEffect } from 'react';
// import { Carousel, Container } from 'react-bootstrap';
// import ApiService from '../../services/apiService';
// import LoadingSpinner from '../common/LoadingSpinner';

// const FeaturedManga = () => {
//     const [featuredManga, setFeaturedManga] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchFeaturedManga();
//     }, []);

//     const fetchFeaturedManga = async () => {
//         try {
//             setLoading(true);
//             const response = await ApiService.getFeaturedManga();
//             setFeaturedManga(response.results || response);
//         } catch (error) {
//             console.error('Error fetching featured manga:', error);
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return <LoadingSpinner size="lg" text="Loading featured manga..." />;
//     if (error) return <div className="alert alert-danger">Error: {error}</div>;

//     return (
//         <Container fluid className="px-0">
//             <Carousel fade interval={5000}>
//                 {featuredManga.map((manga) => (
//                     <Carousel.Item key={manga.id}>
//                         <div
//                             className="carousel-slide"
//                             style={{
//                                 height: '500px',
//                                 backgroundImage: `url(${manga.cover_image})`,
//                                 backgroundSize: 'cover',
//                                 backgroundPosition: 'center',
//                                 position: 'relative',
//                             }}
//                         >
//                             <div className="carousel-overlay">
//                                 <Container>
//                                     <div className="carousel-content">
//                                         <h2 className="text-white">{manga.title}</h2>
//                                         <p className="text-light">{manga.description?.slice(0, 150)}...</p>
//                                         <div className="d-flex gap-2">
//                                             <a href={`/manga/${manga.slug}`} className="btn btn-primary">
//                                                 Read Now
//                                             </a>
//                                             <button className="btn btn-outline-light">
//                                                 Add to Favorites
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </Container>
//                             </div>
//                         </div>
//                     </Carousel.Item>
//                 ))}
//             </Carousel>
//         </Container>
//     );
// };

// export default FeaturedManga;