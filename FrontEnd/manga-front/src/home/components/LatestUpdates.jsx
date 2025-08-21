import React from 'react';

const LatestUpdates = () => {
  const latestUpdates = [
    {
      id: "u1",
      title: "Wind Breaker",
      cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=200&fit=crop",
      chapter: "478",
      timeAgo: "2 hours ago",
      type: "Manga"
    },
    {
      id: "u2",
      title: "Lookism",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&h=200&fit=crop",
      chapter: "475",
      timeAgo: "3 hours ago",
      type: "Manhwa"
    },
    {
      id: "u3",
      title: "The God of High School",
      cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=150&h=200&fit=crop",
      chapter: "565",
      timeAgo: "5 hours ago",
      type: "Manhwa"
    },
    {
      id: "u4",
      title: "Tales of Demons and Gods",
      cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop",
      chapter: "423",
      timeAgo: "6 hours ago",
      type: "Manhua"
    },
    {
      id: "u5",
      title: "Martial Peak",
      cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=200&fit=crop",
      chapter: "3892",
      timeAgo: "8 hours ago",
      type: "Manhua"
    },
    {
      id: "u6",
      title: "One Punch Man",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&h=200&fit=crop",
      chapter: "195",
      timeAgo: "12 hours ago",
      type: "Manga"
    },
    {
      id: "u7",
      title: "Noblesse",
      cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=150&h=200&fit=crop",
      chapter: "544",
      timeAgo: "1 day ago",
      type: "Manhwa"
    },
    {
      id: "u8",
      title: "Tower of God",
      cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop",
      chapter: "623",
      timeAgo: "1 day ago",
      type: "Manhwa"
    }
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'Manga': return 'bg-primary';
      case 'Manhwa': return 'bg-success';
      case 'Manhua': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  const getTimeColor = (timeAgo) => {
    if (timeAgo.includes('hour')) return 'text-success';
    if (timeAgo.includes('day')) return 'text-warning';
    return 'text-muted';
  };

  return (
    <section className="my-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="h3 mb-0 fw-bold text-dark">
          <i className="fas fa-clock text-info me-2"></i>
          Latest Updates
        </h2>
        <a href="#" className="btn btn-outline-info btn-sm">
          View All <i className="fas fa-arrow-right ms-1"></i>
        </a>
      </div>

      <div className="row g-3">
        {latestUpdates.map((manga) => (
          <div key={manga.id} className="col-lg-3 col-md-4 col-sm-6">
            <div className="card border-0 shadow-sm h-100 latest-card">
              <div className="row g-0 h-100">
                <div className="col-4">
                  <div className="position-relative h-100">
                    <img
                      src={manga.cover}
                      className="img-fluid h-100 w-100 rounded-start"
                      alt={manga.title}
                      style={{ objectFit: "cover", minHeight: "120px" }}
                    />
                    <div className="position-absolute top-0 end-0 m-1">
                      <span className={`badge ${getTypeColor(manga.type)} rounded-pill px-2 py-1`} style={{ fontSize: '0.6rem' }}>
                        {manga.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-8">
                  <div className="card-body p-3 d-flex flex-column h-100">
                    <h6 className="card-title mb-2 fw-semibold text-truncate" title={manga.title}>
                      {manga.title}
                    </h6>
                    
                    <div className="mb-2">
                      <span className="badge bg-dark text-white px-2 py-1" style={{ fontSize: '0.7rem' }}>
                        <i className="fas fa-book-open me-1"></i>
                        Ch. {manga.chapter}
                      </span>
                    </div>
                    
                    <div className="mt-auto">
                      <small className={`fw-semibold ${getTimeColor(manga.timeAgo)}`}>
                        <i className="fas fa-clock me-1"></i>
                        {manga.timeAgo}
                      </small>
                    </div>
                    
                    <div className="mt-2">
                      <button className="btn btn-outline-primary btn-sm w-100">
                        <i className="fas fa-play me-1"></i>
                        Read Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Update Feed */}
      <div className="mt-4 p-3 bg-light rounded-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="mb-0 fw-semibold">
            <i className="fas fa-rss text-orange me-2"></i>
            Live Update Feed
          </h5>
          <button className="btn btn-sm btn-outline-secondary">
            <i className="fas fa-sync-alt me-1"></i>
            Refresh
          </button>
        </div>
        
        <div className="row">
          {latestUpdates.slice(0, 4).map((manga) => (
            <div key={`feed-${manga.id}`} className="col-md-6 mb-2">
              <div className="d-flex align-items-center p-2 bg-white rounded-2 shadow-sm">
                <img
                  src={manga.cover}
                  className="rounded me-3"
                  alt={manga.title}
                  style={{ width: "40px", height: "50px", objectFit: "cover" }}
                />
                <div className="flex-grow-1 min-width-0">
                  <p className="mb-0 fw-semibold text-truncate small">{manga.title}</p>
                  <small className="text-muted">Chapter {manga.chapter} • {manga.timeAgo}</small>
                </div>
                <span className={`badge ${getTypeColor(manga.type)} ms-2`} style={{ fontSize: '0.6rem' }}>
                  {manga.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .latest-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .latest-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.1) !important;
        }
        .min-width-0 {
          min-width: 0;
        }
        .text-orange {
          color: #ff6b35 !important;
        }
      `}</style>
    </section>
  );
};

export default LatestUpdates;