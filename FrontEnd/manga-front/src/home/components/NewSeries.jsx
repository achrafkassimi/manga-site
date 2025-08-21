import React, { useState } from 'react';

const NewSeries = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const newSeries = [
    {
      id: "ns1",
      title: "Undead Unluck",
      cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      chapter: "12",
      genres: ["Action", "Comedy", "Supernatural"],
      rating: 4.4,
      releaseDate: "2024-01-15",
      type: "Manga",
      description: "A thrilling supernatural comedy about luck and misfortune.",
      author: "Yoshifumi Tozuka",
      status: "Ongoing"
    },
    {
      id: "ns2",
      title: "Return of the Mount Hua Sect",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      chapter: "8",
      genres: ["Action", "Martial Arts", "Reincarnation"],
      rating: 4.6,
      releaseDate: "2024-01-12",
      type: "Manhwa",
      description: "A martial artist returns to rebuild his fallen sect.",
      author: "LICO",
      status: "Ongoing"
    },
    {
      id: "ns3",
      title: "Absolute Sword Sense",
      cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
      chapter: "15",
      genres: ["Action", "Fantasy", "Martial Arts"],
      rating: 4.3,
      releaseDate: "2024-01-10",
      type: "Manhwa",
      description: "A warrior gains mysterious sword abilities.",
      author: "Han Joong-Wuel",
      status: "Ongoing"
    },
    {
      id: "ns4",
      title: "Immortal Swordsman In The Reverse World",
      cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      chapter: "22",
      genres: ["Fantasy", "Romance", "Gender Bender"],
      rating: 4.2,
      releaseDate: "2024-01-08",
      type: "Manhua",
      description: "A swordsman adapts to a world where gender roles are reversed.",
      author: "Flying Lines",
      status: "Ongoing"
    },
    {
      id: "ns5",
      title: "Akane-banashi",
      cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      chapter: "18",
      genres: ["Drama", "Slice of Life", "Traditional"],
      rating: 4.5,
      releaseDate: "2024-01-06",
      type: "Manga",
      description: "A girl pursues the traditional art of rakugo storytelling.",
      author: "Yuki Suenaga",
      status: "Ongoing"
    },
    {
      id: "ns6",
      title: "Aliens Area",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      chapter: "25",
      genres: ["Action", "Sci-Fi", "Comedy"],
      rating: 4.1,
      releaseDate: "2024-01-04",
      type: "Manga",
      description: "Agents deal with alien encounters in modern Japan.",
      author: "Fusai Naba",
      status: "Ongoing"
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Types', icon: 'fa-globe' },
    { value: 'Manga', label: 'Manga', icon: 'fa-book' },
    { value: 'Manhwa', label: 'Manhwa', icon: 'fa-bookmark' },
    { value: 'Manhua', label: 'Manhua', icon: 'fa-scroll' }
  ];

  const filteredSeries = activeFilter === 'all' 
    ? newSeries 
    : newSeries.filter(series => series.type === activeFilter);

  const getTypeColor = (type) => {
    switch(type) {
      case 'Manga': return 'bg-primary';
      case 'Manhwa': return 'bg-success';
      case 'Manhua': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  const getDaysAgo = (dateString) => {
    const releaseDate = new Date(dateString);
    const today = new Date();
    const timeDiff = today - releaseDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return '1 day ago';
    if (daysDiff < 7) return `${daysDiff} days ago`;
    if (daysDiff < 14) return '1 week ago';
    return `${Math.floor(daysDiff / 7)} weeks ago`;
  };

  return (
    <section className="my-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="h3 mb-0 fw-bold text-dark">
          <i className="fas fa-sparkles text-warning me-2"></i>
          New Series
        </h2>
        <a href="#" className="btn btn-outline-warning btn-sm">
          View All New <i className="fas fa-arrow-right ms-1"></i>
        </a>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group shadow-sm" role="group">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`btn ${activeFilter === option.value ? 'btn-warning' : 'btn-outline-warning'} px-4`}
              onClick={() => setActiveFilter(option.value)}
            >
              <i className={`fas ${option.icon} me-2`}></i>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* New Series Grid */}
      <div className="row g-4">
        {filteredSeries.map((series) => (
          <div key={series.id} className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm h-100 new-series-card">
              <div className="row g-0 h-100">
                <div className="col-5">
                  <div className="position-relative h-100">
                    <img
                      src={series.cover}
                      className="img-fluid h-100 w-100 rounded-start"
                      alt={series.title}
                      style={{ objectFit: "cover", minHeight: "200px" }}
                    />
                    
                    {/* NEW Badge */}
                    <div className="position-absolute top-0 start-0 m-2">
                      <span className="badge bg-danger rounded-pill px-2 py-1 fw-bold animate-pulse">
                        <i className="fas fa-star me-1"></i>
                        NEW
                      </span>
                    </div>

                    {/* Type Badge */}
                    <div className="position-absolute bottom-0 start-0 m-2">
                      <span className={`badge ${getTypeColor(series.type)} rounded-pill px-2 py-1`}>
                        {series.type}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="col-7">
                  <div className="card-body p-3 h-100 d-flex flex-column">
                    <div className="mb-2">
                      <h6 className="card-title mb-1 fw-bold text-truncate" title={series.title}>
                        {series.title}
                      </h6>
                      <small className="text-muted">by {series.author}</small>
                    </div>

                    <div className="mb-2">
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="badge bg-dark text-white px-2 py-1">
                          <i className="fas fa-book-open me-1"></i>
                          Ch. {series.chapter}
                        </span>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-star text-warning me-1"></i>
                          <small className="fw-semibold">{series.rating}</small>
                        </div>
                      </div>
                    </div>

                    <div className="mb-2 flex-grow-1">
                      <p className="text-muted small mb-2" style={{ fontSize: '0.8rem', lineHeight: '1.3' }}>
                        {series.description}
                      </p>
                    </div>

                    <div className="mb-3">
                      {series.genres.slice(0, 2).map((genre, idx) => (
                        <span key={idx} className="badge bg-light text-dark me-1 mb-1" style={{ fontSize: '0.65rem' }}>
                          {genre}
                        </span>
                      ))}
                      {series.genres.length > 2 && (
                        <span className="badge bg-light text-muted" style={{ fontSize: '0.65rem' }}>
                          +{series.genres.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <small className="text-success fw-semibold">
                        <i className="fas fa-clock me-1"></i>
                        Released {getDaysAgo(series.releaseDate)}
                      </small>
                    </div>

                    <div className="mt-auto">
                      <div className="d-grid gap-2">
                        <button className="btn btn-warning btn-sm fw-semibold">
                          <i className="fas fa-play me-1"></i>
                          Start Reading
                        </button>
                        <button className="btn btn-outline-secondary btn-sm">
                          <i className="fas fa-plus me-1"></i>
                          Add to Library
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured New Series Highlight */}
      <div className="mt-5 p-4 bg-gradient-warning rounded-3 shadow-sm">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h4 className="fw-bold mb-2 text-dark">
              <i className="fas fa-crown text-warning me-2"></i>
              Featured New Series
            </h4>
            <p className="mb-3 text-dark">
              Don't miss out on the hottest new releases! These series are gaining massive popularity 
              among readers worldwide. Be among the first to discover the next big hit!
            </p>
            <div className="d-flex gap-2 flex-wrap">
              {newSeries.slice(0, 3).map((series) => (
                <span key={series.id} className="badge bg-white text-dark px-3 py-2 fw-semibold">
                  {series.title}
                </span>
              ))}
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="position-relative">
              <i className="fas fa-rocket fa-4x text-warning mb-3"></i>
              <div className="position-absolute top-0 start-50 translate-middle">
                <span className="badge bg-danger rounded-pill">HOT</span>
              </div>
            </div>
            <button className="btn btn-dark btn-lg px-4">
              <i className="fas fa-fire me-2"></i>
              Explore Now
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 row text-center">
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 bg-light h-100">
            <div className="card-body py-3">
              <i className="fas fa-plus-circle fa-2x text-success mb-2"></i>
              <h5 className="mb-0 fw-bold">{filteredSeries.length}</h5>
              <small className="text-muted">New This Month</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 bg-light h-100">
            <div className="card-body py-3">
              <i className="fas fa-fire fa-2x text-danger mb-2"></i>
              <h5 className="mb-0 fw-bold">24</h5>
              <small className="text-muted">Trending New</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 bg-light h-100">
            <div className="card-body py-3">
              <i className="fas fa-star fa-2x text-warning mb-2"></i>
              <h5 className="mb-0 fw-bold">4.3</h5>
              <small className="text-muted">Avg Rating</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 bg-light h-100">
            <div className="card-body py-3">
              <i className="fas fa-users fa-2x text-info mb-2"></i>
              <h5 className="mb-0 fw-bold">15.2K</h5>
              <small className="text-muted">New Readers</small>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .new-series-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          border-left: 4px solid transparent;
        }
        .new-series-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
          border-left: 4px solid #ffc107;
        }
        .bg-gradient-warning {
          background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
          border: 1px solid #ffc107;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default NewSeries;