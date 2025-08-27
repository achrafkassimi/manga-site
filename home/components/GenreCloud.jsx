import React, { useState } from 'react';

const GenreCloud = () => {
  const [hoveredGenre, setHoveredGenre] = useState(null);

  const genres = [
    { name: 'Action', count: 1245, color: '#dc3545', size: 'large' },
    { name: 'Romance', count: 987, color: '#e91e63', size: 'large' },
    { name: 'Fantasy', count: 856, color: '#9c27b0', size: 'medium' },
    { name: 'Comedy', count: 743, color: '#ff9800', size: 'medium' },
    { name: 'Drama', count: 698, color: '#795548', size: 'medium' },
    { name: 'Slice of Life', count: 542, color: '#4caf50', size: 'medium' },
    { name: 'Adventure', count: 489, color: '#2196f3', size: 'small' },
    { name: 'Supernatural', count: 423, color: '#673ab7', size: 'small' },
    { name: 'School', count: 387, color: '#03a9f4', size: 'small' },
    { name: 'Sci-Fi', count: 345, color: '#00bcd4', size: 'small' },
    { name: 'Horror', count: 298, color: '#424242', size: 'small' },
    { name: 'Mystery', count: 267, color: '#607d8b', size: 'small' },
    { name: 'Sports', count: 234, color: '#8bc34a', size: 'small' },
    { name: 'Historical', count: 198, color: '#ff5722', size: 'small' },
    { name: 'Thriller', count: 176, color: '#f44336', size: 'small' },
    { name: 'Martial Arts', count: 145, color: '#ff6f00', size: 'small' },
    { name: 'Mecha', count: 123, color: '#37474f', size: 'small' },
    { name: 'Music', count: 98, color: '#e1bee7', size: 'small' },
    { name: 'Medical', count: 87, color: '#81c784', size: 'small' },
    { name: 'Military', count: 76, color: '#a5d6a7', size: 'small' }
  ];

  const popularCombinations = [
    { genres: ['Action', 'Fantasy'], count: 324, trend: 'up' },
    { genres: ['Romance', 'School'], count: 298, trend: 'up' },
    { genres: ['Comedy', 'Slice of Life'], count: 267, trend: 'stable' },
    { genres: ['Action', 'Supernatural'], count: 234, trend: 'up' },
    { genres: ['Drama', 'Romance'], count: 198, trend: 'down' },
    { genres: ['Fantasy', 'Adventure'], count: 176, trend: 'up' }
  ];

  const getSizeClass = (size) => {
    switch(size) {
      case 'large': return 'fs-1 fw-bold';
      case 'medium': return 'fs-3 fw-semibold';
      case 'small': return 'fs-5';
      default: return 'fs-5';
    }
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return 'fa-arrow-up text-success';
      case 'down': return 'fa-arrow-down text-danger';
      default: return 'fa-minus text-muted';
    }
  };

  return (
    <section className="my-5">
      <div className="d-flex align-items-center mb-4">
        <h2 className="h3 mb-0 fw-bold text-dark">
          <i className="fas fa-tags text-info me-2"></i>
          Genre Explorer
        </h2>
      </div>

      {/* Genre Cloud */}
      <div className="card border-0 shadow-sm mb-5">
        <div className="card-body p-5">
          <h4 className="text-center mb-4 fw-semibold text-muted">
            <i className="fas fa-cloud me-2"></i>
            Genre Cloud
          </h4>
          
          <div className="genre-cloud text-center p-4">
            {genres.map((genre, index) => (
              <span
                key={genre.name}
                className={`genre-tag ${getSizeClass(genre.size)} me-3 mb-3 d-inline-block`}
                style={{ 
                  color: hoveredGenre === genre.name ? '#fff' : genre.color,
                  backgroundColor: hoveredGenre === genre.name ? genre.color : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: '0.5rem 1rem',
                  borderRadius: '25px',
                  border: `2px solid ${genre.color}`,
                  textDecoration: 'none',
                  userSelect: 'none',
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={() => setHoveredGenre(genre.name)}
                onMouseLeave={() => setHoveredGenre(null)}
                title={`${genre.count} manga in ${genre.name} genre`}
              >
                {genre.name}
                <small className="ms-2 opacity-75">({genre.count})</small>
              </span>
            ))}
          </div>

          <div className="text-center mt-4">
            <p className="text-muted small mb-0">
              <i className="fas fa-info-circle me-1"></i>
              Hover over genres to see details • Font size indicates popularity
            </p>
          </div>
        </div>
      </div>

      {/* Genre Statistics */}
      <div className="row g-4 mb-5">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 pb-0">
              <h5 className="mb-0 fw-semibold">
                <i className="fas fa-chart-line text-primary me-2"></i>
                Popular Genre Combinations
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {popularCombinations.map((combo, index) => (
                  <div key={index} className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded-3">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-1">
                          {combo.genres.map((genre, idx) => (
                            <React.Fragment key={genre}>
                              <span className="badge bg-primary me-1">{genre}</span>
                              {idx < combo.genres.length - 1 && (
                                <i className="fas fa-plus text-muted mx-1" style={{ fontSize: '0.7rem' }}></i>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        <small className="text-muted">{combo.count} series</small>
                      </div>
                      <div className="text-end">
                        <i className={`fas ${getTrendIcon(combo.trend)}`}></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 pb-0">
              <h5 className="mb-0 fw-semibold">
                <i className="fas fa-trophy text-warning me-2"></i>
                Top Genres
              </h5>
            </div>
            <div className="card-body">
              <div className="genre-ranking">
                {genres.slice(0, 5).map((genre, index) => (
                  <div key={genre.name} className="d-flex align-items-center mb-3 p-2 rounded-2 bg-light">
                    <div className="genre-rank me-3">
                      <span className={`badge ${index < 3 ? 'bg-warning' : 'bg-secondary'} rounded-circle fw-bold`} style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{genre.name}</div>
                      <div className="progress mt-1" style={{ height: '4px' }}>
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${(genre.count / genres[0].count) * 100}%`,
                            backgroundColor: genre.color 
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-end ms-3">
                      <small className="text-muted">{genre.count}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Genre Categories */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100 category-card">
            <div className="card-body text-center p-4">
              <div className="category-icon mb-3">
                <i className="fas fa-fist-raised fa-3x text-danger"></i>
              </div>
              <h5 className="fw-bold mb-3">Action & Adventure</h5>
              <p className="text-muted mb-3">High-octane stories filled with battles, quests, and thrilling adventures.</p>
              <div className="genre-tags mb-3">
                <span className="badge bg-danger me-1 mb-1">Action</span>
                <span className="badge bg-primary me-1 mb-1">Adventure</span>
                <span className="badge bg-warning me-1 mb-1">Martial Arts</span>
                <span className="badge bg-secondary me-1 mb-1">Military</span>
              </div>
              <button className="btn btn-outline-danger">
                Explore <i className="fas fa-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100 category-card">
            <div className="card-body text-center p-4">
              <div className="category-icon mb-3">
                <i className="fas fa-heart fa-3x text-pink"></i>
              </div>
              <h5 className="fw-bold mb-3">Romance & Drama</h5>
              <p className="text-muted mb-3">Heartwarming tales of love, relationships, and emotional journeys.</p>
              <div className="genre-tags mb-3">
                <span className="badge bg-pink me-1 mb-1">Romance</span>
                <span className="badge bg-info me-1 mb-1">Drama</span>
                <span className="badge bg-success me-1 mb-1">Slice of Life</span>
                <span className="badge bg-warning me-1 mb-1">School</span>
              </div>
              <button className="btn btn-outline-pink">
                Explore <i className="fas fa-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100 category-card">
            <div className="card-body text-center p-4">
              <div className="category-icon mb-3">
                <i className="fas fa-magic fa-3x text-purple"></i>
              </div>
              <h5 className="fw-bold mb-3">Fantasy & Supernatural</h5>
              <p className="text-muted mb-3">Mystical worlds filled with magic, creatures, and otherworldly powers.</p>
              <div className="genre-tags mb-3">
                <span className="badge bg-purple me-1 mb-1">Fantasy</span>
                <span className="badge bg-dark me-1 mb-1">Supernatural</span>
                <span className="badge bg-secondary me-1 mb-1">Horror</span>
                <span className="badge bg-info me-1 mb-1">Mystery</span>
              </div>
              <button className="btn btn-outline-purple">
                Explore <i className="fas fa-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .genre-cloud {
          min-height: 300px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
        }
        .genre-tag {
          animation: fadeInUp 0.6s ease-out both;
        }
        .category-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .category-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
        }
        .text-pink {
          color: #e91e63 !important;
        }
        .text-purple {
          color: #9c27b0 !important;
        }
        .bg-pink {
          background-color: #e91e63 !important;
        }
        .bg-purple {
          background-color: #9c27b0 !important;
        }
        .btn-outline-pink {
          color: #e91e63;
          border-color: #e91e63;
        }
        .btn-outline-pink:hover {
          background-color: #e91e63;
          border-color: #e91e63;
          color: white;
        }
        .btn-outline-purple {
          color: #9c27b0;
          border-color: #9c27b0;
        }
        .btn-outline-purple:hover {
          background-color: #9c27b0;
          border-color: #9c27b0;
          color: white;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default GenreCloud;