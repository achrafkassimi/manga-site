import React from 'react';
import MangaCard from './MangaCard';

const PopularToday = () => {
  const popularManga = [
    {
      id: "p1",
      title: "Jujutsu Kaisen",
      cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      chapter: "245",
      genres: ["Action", "Supernatural", "School"],
      rating: 4.8,
      views: "2.3M"
    },
    {
      id: "p2",
      title: "Attack on Titan",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      chapter: "139",
      genres: ["Action", "Drama", "Military"],
      rating: 4.9,
      views: "5.1M"
    },
    {
      id: "p3",
      title: "One Piece",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      chapter: "1100",
      genres: ["Adventure", "Comedy", "Action"],
      rating: 4.7,
      views: "8.7M"
    },
    {
      id: "p4",
      title: "Demon Slayer",
      cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      chapter: "205",
      genres: ["Action", "Historical", "Supernatural"],
      rating: 4.6,
      views: "3.2M"
    },
    {
      id: "p5",
      title: "My Hero Academia",
      cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      chapter: "408",
      genres: ["Action", "School", "Superhero"],
      rating: 4.5,
      views: "2.8M"
    },
    {
      id: "p6",
      title: "Chainsaw Man",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      chapter: "150",
      genres: ["Action", "Horror", "Supernatural"],
      rating: 4.7,
      views: "1.9M"
    }
  ];

  return (
    <section className="my-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="h3 mb-0 fw-bold text-dark">
          <i className="fas fa-fire text-danger me-2"></i>
          Popular Today
        </h2>
        <a href="#" className="btn btn-outline-primary btn-sm">
          View All <i className="fas fa-arrow-right ms-1"></i>
        </a>
      </div>

      <div className="row g-3">
        {popularManga.map((manga, index) => (
          <div key={manga.id} className="col-lg-2 col-md-3 col-sm-4 col-6">
            <div className="position-relative">
              {/* Ranking Badge */}
              <div className="position-absolute top-0 start-0 z-index-1">
                <span className={`badge ${index < 3 ? 'bg-warning' : 'bg-secondary'} rounded-pill m-2 px-2 py-1 fw-bold`}>
                  #{index + 1}
                </span>
              </div>
              
              {/* Enhanced MangaCard with popularity data */}
              <div className="card h-100 shadow-sm border-0 manga-card">
                <div className="position-relative overflow-hidden">
                  <img 
                    src={manga.cover} 
                    className="card-img-top" 
                    alt={manga.title} 
                    style={{ height: "220px", objectFit: "cover" }} 
                  />
                  <div className="card-img-overlay p-0 d-flex align-items-end">
                    <div className="w-100 bg-gradient-dark p-2">
                      <div className="d-flex justify-content-between align-items-center text-white small">
                        <span>
                          <i className="fas fa-eye me-1"></i>
                          {manga.views}
                        </span>
                        <span>
                          <i className="fas fa-star text-warning me-1"></i>
                          {manga.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card-body p-2">
                  <h6 className="card-title small mb-1 text-truncate fw-semibold">{manga.title}</h6>
                  <p className="card-text text-muted small mb-2">Ch. {manga.chapter}</p>
                  <div className="d-flex flex-wrap gap-1">
                    {manga.genres.slice(0, 2).map((genre, idx) => (
                      <span key={idx} className="badge bg-light text-dark" style={{ fontSize: "0.6rem" }}>
                        {genre}
                      </span>
                    ))}
                    {manga.genres.length > 2 && (
                      <span className="badge bg-light text-muted" style={{ fontSize: "0.6rem" }}>
                        +{manga.genres.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .manga-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .manga-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .bg-gradient-dark {
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
        }
        .z-index-1 {
          z-index: 1;
        }
      `}</style>
    </section>
  );
};

export default PopularToday;