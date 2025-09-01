// src/components/manga/PopularToday.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MangaCard from './MangaCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { mangaService } from '../../services/mangaService';

const PopularToday = () => {
  const [popularManga, setPopularManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPopularManga();
  }, []);

  const fetchPopularManga = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mangaService.getPopularManga();
      
      // Handle both paginated and non-paginated responses
      const mangaData = response.data.results || response.data || [];
      setPopularManga(mangaData);
    } catch (error) {
      console.error('Error fetching popular manga:', error);
      setError('Failed to load popular manga');
      setPopularManga([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchPopularManga();
  };

  if (loading) {
    return (
      <section className="popular-section mb-5">
        <Container>
          <LoadingSpinner text="Loading popular manga..." />
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="popular-section mb-5">
        <Container>
          <div className="text-center py-5">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h4 className="text-muted">{error}</h4>
            <Button variant="primary" onClick={handleRetry}>
              <i className="fas fa-redo me-2"></i>
              Try Again
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="popular-section mb-5">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">
            <i className="fas fa-fire text-danger me-2"></i>
            Popular Today
          </h2>
          <Button as={Link} to="/popular" variant="outline-primary">
            View All <i className="fas fa-arrow-right ms-1"></i>
          </Button>
        </div>
        
        {popularManga.length > 0 ? (
          <Row>
            {popularManga.slice(0, 8).map(manga => (
              <Col key={manga.id} xl={3} lg={4} md={6} className="mb-4">
                <MangaCard manga={manga} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h4 className="text-muted">No popular manga available</h4>
            <p className="text-muted">Check back later for trending content!</p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default PopularToday;






// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Button } from 'react-bootstrap';
// import ApiService from '../../services/apiService';
// import MangaCard from './MangaCard';
// import LoadingSpinner from '../common/LoadingSpinner';

// const PopularToday = () => {
//     const [popularManga, setPopularManga] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchPopularManga();
//     }, []);

//     const fetchPopularManga = async () => {
//         try {
//             setLoading(true);
//             const response = await ApiService.getPopularManga();
//             setPopularManga(response.results || response);
//         } catch (error) {
//             console.error('Error fetching popular manga:', error);
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return <LoadingSpinner size="md" text="Loading popular manga..." />;
//     if (error) return <div className="alert alert-danger">Error: {error}</div>;

//     return (
//         <section className="popular-today py-5">
//             <Container>
//                 <div className="d-flex justify-content-between align-items-center mb-4">
//                     <h2>
//                         <i className="fas fa-fire text-danger me-2"></i>
//                         Popular Today
//                     </h2>
//                     <Button variant="outline-primary" href="/browse?sort=popular">
//                         View All
//                     </Button>
//                 </div>
                
//                 <Row>
//                     {popularManga.slice(0, 12).map((manga) => (
//                         <Col key={manga.id} xl={2} lg={3} md={4} sm={6} className="mb-4">
//                             <MangaCard manga={manga} showFavoriteButton={true} />
//                         </Col>
//                     ))}
//                 </Row>
//             </Container>
//         </section>
//     );
// };

// export default PopularToday;