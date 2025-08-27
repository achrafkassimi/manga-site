import React, { useEffect } from 'react';

const FeaturedManga = ({ items = [] }) => {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min');
  }, []);

  if (!items.length) return null;

  const getImageUrl = (cover, title) => {
    if (cover && cover !== 'image_url_1' && cover !== 'image_url_2') {
      return cover;
    }
    return `https://via.placeholder.com/400x600/2a2a2a/ffffff?text=${encodeURIComponent(title)}`;
  };

  return (
    <>
      <section className="featured-section py-4">
        <div className="container-fluid px-4">
          
          <div id="featuredCarousel" className="carousel slide featured-carousel" data-bs-ride="carousel" data-bs-interval="5000">
            
            {/* Indicators */}
            <div className="carousel-indicators">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  data-bs-target="#featuredCarousel"
                  data-bs-slide-to={idx}
                  className={idx === 0 ? "active" : ""}
                  aria-current={idx === 0 ? "true" : "false"}
                ></button>
              ))}
            </div>

            <div className="carousel-inner">
              {items.map((manga, idx) => (
                <div key={manga.id} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                  <div className="featured-slide">
                    
                    {/* Background Image */}
                    <div 
                      className="slide-background"
                      style={{
                        backgroundImage: `url(${getImageUrl(manga.cover, manga.title)})`,
                      }}
                    ></div>
                    
                    {/* Content */}
                    <div className="slide-content">
                      <div className="container-fluid px-4 h-100">
                        <div className="row align-items-center h-100">
                          
                          <div className="col-md-8 col-lg-9">
                            <div className="featured-info">
                              
                              <div className="featured-badge mb-3">
                                <span className="badge bg-primary px-3 py-2">
                                  <i className="fas fa-star me-2"></i>
                                  FEATURED
                                </span>
                              </div>
                              
                              <h1 className="featured-title mb-3">
                                {manga.title}
                              </h1>
                              
                              <div className="featured-meta mb-4">
                                <span className="chapter-info me-4">
                                  <i className="fas fa-book-open me-2"></i>
                                  Chapter {manga.chapter}
                                </span>
                                <span className="status-info">
                                  <i className="fas fa-circle text-success me-2"></i>
                                  Ongoing
                                </span>
                              </div>
                              
                              <div className="featured-genres mb-4">
                                {manga.genres.map((genre, idx) => (
                                  <span key={idx} className="genre-tag me-2 mb-2">
                                    {genre}
                                  </span>
                                ))}
                              </div>
                              
                              <div className="featured-actions">
                                <button className="btn btn-primary btn-lg me-3">
                                  <i className="fas fa-play me-2"></i>
                                  Read Now
                                </button>
                                <button className="btn btn-outline-light btn-lg">
                                  <i className="fas fa-bookmark me-2"></i>
                                  Add to Library
                                </button>
                              </div>
                              
                            </div>
                          </div>
                          
                          <div className="col-md-4 col-lg-3 d-none d-md-block">
                            <div className="featured-cover">
                              <img
                                src={getImageUrl(manga.cover, manga.title)}
                                alt={manga.title}
                                className="img-fluid cover-image"
                              />
                              <div className="cover-overlay">
                                <button className="btn btn-light btn-sm">
                                  <i className="fas fa-eye me-1"></i>
                                  Preview
                                </button>
                              </div>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <button className="carousel-control-prev" type="button" data-bs-target="#featuredCarousel" data-bs-slide="prev">
              <div className="carousel-control-icon">
                <i className="fas fa-chevron-left"></i>
              </div>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#featuredCarousel" data-bs-slide="next">
              <div className="carousel-control-icon">
                <i className="fas fa-chevron-right"></i>
              </div>
            </button>
          </div>
          
        </div>
      </section>

      <style jsx>{`
        .featured-section {
          background-color: #1a1a1a;
          color: #fff;
        }
        
        .featured-carousel {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }
        
        .featured-slide {
          position: relative;
          height: 500px;
          overflow: hidden;
        }
        
        .slide-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: cover;
          background-position: center;
          filter: blur(20px) brightness(0.3);
          transform: scale(1.1);
        }
        
        .slide-content {
          position: relative;
          z-index: 2;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(0, 0, 0, 0.7) 60%,
            rgba(0, 0, 0, 0.4) 100%
          );
        }
        
        .featured-info {
          max-width: 600px;
        }
        
        .featured-title {
          font-size: 3rem;
          font-weight: 900;
          line-height: 1.2;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          margin-bottom: 1rem;
        }
        
        .featured-meta {
          font-size: 1.1rem;
          opacity: 0.9;
        }
        
        .chapter-info,
        .status-info {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        
        .genre-tag {
          display: inline-block;
          background-color: rgba(0, 123, 255, 0.2);
          color: #007bff;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          border: 1px solid rgba(0, 123, 255, 0.4);
          transition: all 0.3s ease;
        }
        
        .genre-tag:hover {
          background-color: #007bff;
          color: #fff;
          transform: translateY(-2px);
        }
        
        .featured-cover {
          position: relative;
          text-align: center;
        }
        
        .cover-image {
          max-height: 400px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
          transition: transform 0.3s ease;
        }
        
        .cover-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .featured-cover:hover .cover-image {
          transform: scale(1.05);
        }
        
        .featured-cover:hover .cover-overlay {
          opacity: 1;
        }
        
        .carousel-control-prev,
        .carousel-control-next {
          width: 60px;
          height: 60px;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .carousel-control-prev {
          left: 20px;
        }
        
        .carousel-control-next {
          right: 20px;
        }
        
        .carousel-control-prev:hover,
        .carousel-control-next:hover {
          background-color: rgba(0, 123, 255, 0.8);
          transform: translateY(-50%) scale(1.1);
        }
        
        .carousel-control-icon {
          font-size: 1.2rem;
          color: #fff;
        }
        
        .carousel-indicators {
          bottom: 20px;
        }
        
        .carousel-indicators button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
        }
        
        .carousel-indicators button.active {
          background-color: #007bff;
          border-color: #007bff;
          transform: scale(1.2);
        }
        
        @media (max-width: 768px) {
          .featured-slide {
            height: 400px;
          }
          
          .featured-title {
            font-size: 2rem;
          }
          
          .featured-actions .btn {
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
          }
        }
        
        @media (max-width: 576px) {
          .featured-slide {
            height: 350px;
          }
          
          .featured-title {
            font-size: 1.5rem;
          }
          
          .featured-actions {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .featured-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default FeaturedManga;