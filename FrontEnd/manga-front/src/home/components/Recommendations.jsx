import React, { useState } from 'react';

const Recommendations = () => {
  const [activeTab, setActiveTab] = useState('forYou');

  const recommendations = {
    forYou: [
      {
        id: "r1",
        title: "Spy x Family",
        cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
        chapter: "95",
        genres: ["Comedy", "Action", "Family"],
        rating: 4.9,
        reason: "Based on your romance reading history",
        similarity: 92
      },
      {
        id: "r2",
        title: "Kaguya-sama: Love is War",
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
        chapter: "281",
        genres: ["Romance", "Comedy", "School"],
        rating: 4.8,
        reason: "Popular among romance readers",
        similarity: 89
      },
      {
        id: "r3",
        title: "Blue Lock",
        cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
        chapter: "245",
        genres: ["Sports", "Action", "Drama"],
        rating: 4.7,
        reason: "Trending in your region",
        similarity: 85
      },
      {
        id: "r4",
        title: "Mob Psycho 100",
        cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
        chapter: "101",
        genres: ["Supernatural", "Comedy", "Action"],
        rating: 4.8,
        reason: "Similar to your favorites",
        similarity: 88
      }
    ],
    trending: [
      {
        id: "t1",
        title: "Hell's Paradise",
        cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
        chapter: "127",
        genres: ["Action", "Historical", "Supernatural"],
        rating: 4.6,
        trendScore: 95,
        weeklyGrowth: "+234%"
      },
      {
        id: "t2",
        title: "Dandadan",
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
        chapter: "135",
        genres: ["Comedy", "Supernatural", "Romance"],
        rating: 4.7,
        trendScore: 92,
        weeklyGrowth: "+156%"
      },
      {
        id: "t3",
        title: "Kaiju No. 8",
        cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
        chapter: "112",
        genres: ["Action", "Military", "Monsters"],
        rating: 4.5,
        trendScore: 90,
        weeklyGrowth: "+123%"
      },
      {
        id: "t4",
        title: "Sakamoto Days",
        cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
        chapter: "148",
        genres: ["Action", "Comedy", "Crime"],
        rating: 4.6,
        trendScore: 88,
        weeklyGrowth: "+98%"
      }
    ],
    newReleases: [
      {
        id: "n1",
        title: "Undead Unluck",
        cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
        chapter: "5",
        genres: ["Action", "Comedy", "Supernatural"],
        rating: 4.4,
        releaseDate: "2024-01-15",
        isNew: true
      },
      {
        id: "n2",
        title: "Akane-banashi",
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
        chapter: "8",
        genres: ["Drama", "Slice of Life", "Traditional"],
        rating: 4.3,
        releaseDate: "2024-01-12",
        isNew: true
      },
      {
        id: "n3",
        title: "Cipher Academy",
        cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
        chapter: "12",
        genres: ["Mystery", "School", "Puzzle"],
        rating: 4.2,
        releaseDate: "2024-01-08",
        isNew: true
      },
      {
        id: "n4",
        title: "Aliens Area",
        cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
        chapter: "15",
        genres: ["Action", "Sci-Fi", "Comedy"],
        rating: 4.1,
        releaseDate: "2024-01-05",
        isNew: true
      }
    ]
  };

  const TabContent = ({ data, type }) => (
    <div className="row g-3">
      {data.map((item) => (
        <div key={item.id} className="col-lg-3 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm h-100 recommendation-card">
            <div className="position-relative overflow-hidden">
              <img
                src={item.cover}
                className="card-img-top"
                alt={item.title}
                style={{ height: "250px", objectFit: "cover" }}
              />
              
              {/* Overlays based on tab type */}
              <div className="position-absolute top-0 start-0 m-2">
                {type === 'forYou' && (
                  <span className="badge bg-success rounded-pill px-2 py-1">
                    <i className="fas fa-heart me-1"></i>
                    {item.similarity}% Match
                  </span>
                )}
                {type === 'trending' && (
                  <span className="badge bg-danger rounded-pill px-2 py-1">
                    <i className="fas fa-fire me-1"></i>
                    {item.weeklyGrowth}
                  </span>
                )}
                {type === 'newReleases' && item.isNew && (
                  <span className="badge bg-warning text-dark rounded-pill px-2 py-1">
                    <i className="fas fa-star me-1"></i>
                    NEW
                  </span>
                )}
              </div>

              <div className="position-absolute top-0 end-0 m-2">
                <span className="badge bg-dark bg-opacity-75 rounded-pill px-2 py-1">
                  <i className="fas fa-star text-warning me-1"></i>
                  {item.rating}
                </span>
              </div>
            </div>

            <div className="card-body p-3">
              <h6 className="card-title mb-2 fw-semibold">{item.title}</h6>
              
              <div className="mb-2">
                <small className="text-muted">
                  <i className="fas fa-book-open me-1"></i>
                  Chapter {item.chapter}
                </small>
              </div>

              <div className="mb-3">
                {item.genres.slice(0, 3).map((genre, idx) => (
                  <span key={idx} className="badge bg-light text-dark me-1 mb-1" style={{ fontSize: '0.7rem' }}>
                    {genre}
                  </span>
                ))}
              </div>

              {/* Reason/Info based on tab type */}
              {type === 'forYou' && (
                <div className="mb-3">
                  <small className="text-info fw-semibold">
                    <i className="fas fa-lightbulb me-1"></i>
                    {item.reason}
                  </small>
                </div>
              )}

              {type === 'trending' && (
                <div className="mb-3">
                  <small className="text-danger fw-semibold">
                    <i className="fas fa-trending-up me-1"></i>
                    Trend Score: {item.trendScore}/100
                  </small>
                </div>
              )}

              {type === 'newReleases' && (
                <div className="mb-3">
                  <small className="text-success fw-semibold">
                    <i className="fas fa-calendar me-1"></i>
                    Released: {new Date(item.releaseDate).toLocaleDateString()}
                  </small>
                </div>
              )}

              <div className="d-grid gap-2">
                <button className="btn btn-primary btn-sm">
                  <i className="fas fa-play me-1"></i>
                  Read Now
                </button>
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="fas fa-plus me-1"></i>
                  Add to List
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="my-5">
      <div className="d-flex align-items-center mb-4">
        <h2 className="h3 mb-0 fw-bold text-dark">
          <i className="fas fa-magic text-purple me-2"></i>
          Recommendations
        </h2>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills mb-4 justify-content-center bg-light rounded-3 p-2">
        <li className="nav-item">
          <button
            className={`nav-link px-4 py-2 rounded-2 fw-semibold ${activeTab === 'forYou' ? 'active bg-primary text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('forYou')}
          >
            <i className="fas fa-user-heart me-2"></i>
            For You
          </button>
        </li>
        <li className="nav-item ms-2">
          <button
            className={`nav-link px-4 py-2 rounded-2 fw-semibold ${activeTab === 'trending' ? 'active bg-danger text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('trending')}
          >
            <i className="fas fa-fire me-2"></i>
            Trending
          </button>
        </li>
        <li className="nav-item ms-2">
          <button
            className={`nav-link px-4 py-2 rounded-2 fw-semibold ${activeTab === 'newReleases' ? 'active bg-warning text-dark' : 'text-dark'}`}
            onClick={() => setActiveTab('newReleases')}
          >
            <i className="fas fa-sparkles me-2"></i>
            New Releases
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'forYou' && <TabContent data={recommendations.forYou} type="forYou" />}
        {activeTab === 'trending' && <TabContent data={recommendations.trending} type="trending" />}
        {activeTab === 'newReleases' && <TabContent data={recommendations.newReleases} type="newReleases" />}
      </div>

      {/* Personalization Notice */}
      <div className="mt-4 p-3 bg-info bg-opacity-10 rounded-3 border border-info border-opacity-25">
        <div className="d-flex align-items-center">
          <i className="fas fa-info-circle text-info me-3 fs-5"></i>
          <div>
            <p className="mb-0 fw-semibold text-info">Personalized Recommendations</p>
            <small className="text-muted">
              These suggestions are based on your reading history, ratings, and preferences. 
              <a href="#" className="text-decoration-none ms-1">Learn more</a>
            </small>
          </div>
        </div>
      </div>

      <style jsx>{`
        .recommendation-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .recommendation-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.15) !important;
        }
        .text-purple {
          color: #6f42c1 !important;
        }
        .nav-link {
          transition: all 0.3s ease;
          border: none;
        }
        .nav-link:not(.active):hover {
          background-color: rgba(0,0,0,0.05);
        }
      `}</style>
    </section>
  );
};

export default Recommendations;