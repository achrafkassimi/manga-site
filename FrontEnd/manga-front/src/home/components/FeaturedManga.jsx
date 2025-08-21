import React, { useEffect } from 'react';

const FeaturedManga = ({ items = [] }) => {
  useEffect(() => {
    // Import Bootstrap JS for carousel functionality
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  if (!items.length) return null;

  // Function to get placeholder image if cover is not available
  const getImageUrl = (cover, title) => {
    if (cover && cover !== 'image_url_1' && cover !== 'image_url_2') {
      return cover;
    }
    // Return a placeholder with the title
    return `https://via.placeholder.com/300x400/2c3e50/ffffff?text=${encodeURIComponent(title)}`;
  };

  return (
    <section className="my-5">
      {/* <div className="d-flex align-items-center mb-4">
        <h2 className="h3 mb-0 fw-bold text-dark">
          <i className="fas fa-star text-warning me-2"></i>
          Featured Manga
        </h2>
      </div> */}

      <div id="featuredCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
        
        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              data-bs-target="#featuredCarousel"
              data-bs-slide-to={idx}
              className={idx === 0 ? "active" : ""}
              aria-current={idx === 0 ? "true" : "false"}
              aria-label={`Slide ${idx + 1}`}
            ></button>
          ))}
        </div>

        <div className="carousel-inner rounded-3 overflow-hidden shadow">
          {items.map((manga, idx) => (
            <div
              key={manga.id}
              className={`carousel-item ${idx === 0 ? "active" : ""}`}
            >
              <div className="position-relative text-white">
                
                {/* Blurred background */}
                <div
                  className="position-absolute w-100 h-100"
                  style={{
                    backgroundImage: `url(${getImageUrl(manga.cover, manga.title)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(20px) brightness(0.4)",
                    zIndex: 0,
                    transform: "scale(1.1)", // Slight scale to hide blur edges
                  }}
                ></div>

                {/* Gradient overlay */}
                <div
                  className="position-absolute w-100 h-100"
                  style={{
                    background: "linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)",
                    zIndex: 1,
                  }}
                ></div>

                {/* Foreground content */}
                <div className="d-flex align-items-center justify-content-center position-relative py-5" style={{ zIndex: 2, minHeight: "500px" }}>
                  <div className="container">
                    <div className="row justify-content-center">
                      <div className="col-lg-10">
                        <div className="card bg-transparent border-0 text-white">
                          <div className="row g-4 align-items-center">
                            
                            {/* Manga Cover */}
                            <div className="col-md-4 col-lg-3 text-center">
                              <div className="position-relative">
                                <img
                                  src={getImageUrl(manga.cover, manga.title)}
                                  className="img-fluid rounded-3 shadow-lg"
                                  alt={manga.title}
                                  style={{ 
                                    maxHeight: "350px",
                                    objectFit: "cover",
                                    border: "3px solid rgba(255, 255, 255, 0.2)"
                                  }}
                                />
                                <div className="position-absolute top-0 start-0 m-2">
                                  <span className="badge bg-danger">Featured</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Manga Info */}
                            <div className="col-md-8 col-lg-9">
                              <div className="p-3">
                                <h3 className="display-6 fw-bold mb-3 text-shadow">
                                  {manga.title}
                                </h3>
                                
                                <div className="mb-3">
                                  <span className="badge bg-primary me-2">
                                    <i className="fas fa-book-open me-1"></i>
                                    Chapter {manga.chapter}
                                  </span>
                                  <span className="badge bg-success">
                                    <i className="fas fa-clock me-1"></i>
                                    Latest
                                  </span>
                                </div>
                                
                                <div className="mb-4">
                                  {manga.genres.map((genre, genreIdx) => (
                                    <span 
                                      key={genreIdx} 
                                      className="badge bg-secondary bg-opacity-75 me-2 mb-1 px-3 py-2"
                                      style={{ fontSize: "0.8rem" }}
                                    >
                                      {genre}
                                    </span>
                                  ))}
                                </div>
                                
                                <div className="d-flex flex-wrap gap-3">
                                  <button className="btn btn-warning btn-lg px-4 fw-semibold">
                                    <i className="fas fa-play me-2"></i>
                                    Start Reading
                                  </button>
                                  <button className="btn btn-outline-light btn-lg px-4">
                                    <i className="fas fa-bookmark me-2"></i>
                                    Add to List
                                  </button>
                                </div>
                              </div>
                            </div>
                            
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
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#featuredCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#featuredCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  );
};

export default FeaturedManga;