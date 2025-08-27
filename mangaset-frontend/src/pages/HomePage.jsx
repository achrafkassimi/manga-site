// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import FeaturedManga from '../components/manga/FeaturedManga';
import PopularToday from '../components/manga/PopularToday';
import LatestUpdates from '../components/manga/LatestUpdates';
import NewSeries from '../components/manga/NewSeries';
import GenreCloud from '../components/manga/GenreCloud';

const HomePage = () => {
  useEffect(() => {
    // Set page title
    document.title = `${import.meta.env.VITE_SITE_NAME || 'MangaSet'} - Read Manga Online`;
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Read your favorite manga online for free. Discover new series, popular titles, and latest updates.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Read your favorite manga online for free. Discover new series, popular titles, and latest updates.';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, []);

  return (
    <div className="homepage fade-in">
      {/* Hero Section - Featured Manga */}
      <FeaturedManga />
      
      {/* Popular Today Section */}
      <PopularToday />
      
      {/* Latest Updates Section */}
      <LatestUpdates />
      
      {/* New Series Section */}
      <NewSeries />
      
      {/* Genre Cloud Section */}
      <GenreCloud />
      
      {/* Call to Action Section */}
      <section className="cta-section py-5 bg-light">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h3 className="mb-3">
                <i className="fas fa-book-reader text-primary me-2"></i>
                Start Your Manga Journey
              </h3>
              <p className="lead text-muted mb-4">
                Join thousands of readers discovering amazing stories every day. 
                Create your account to track your favorites and reading progress.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <a href="/register" className="btn btn-primary btn-lg">
                  <i className="fas fa-user-plus me-2"></i>
                  Sign Up Free
                </a>
                <a href="/browse" className="btn btn-outline-primary btn-lg">
                  <i className="fas fa-compass me-2"></i>
                  Browse Manga
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-4 mb-4">
              <div className="feature-item p-4">
                <div className="feature-icon mb-3">
                  <i className="fas fa-mobile-alt fa-3x text-primary"></i>
                </div>
                <h5>Mobile Friendly</h5>
                <p className="text-muted">
                  Read anywhere, anytime. Our responsive design works perfectly on all devices.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4 mb-4">
              <div className="feature-item p-4">
                <div className="feature-icon mb-3">
                  <i className="fas fa-bookmark fa-3x text-success"></i>
                </div>
                <h5>Track Progress</h5>
                <p className="text-muted">
                  Never lose your place. Bookmark chapters and track your reading history.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4 mb-4">
              <div className="feature-item p-4">
                <div className="feature-icon mb-3">
                  <i className="fas fa-heart fa-3x text-danger"></i>
                </div>
                <h5>Build Your Collection</h5>
                <p className="text-muted">
                  Create your personal library with favorites and get updates on new chapters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section py-5 bg-dark text-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <div className="stat-item">
                <h2 className="display-6 fw-bold text-primary mb-0">1000+</h2>
                <p className="mb-0">Manga Series</p>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <div className="stat-item">
                <h2 className="display-6 fw-bold text-success mb-0">50K+</h2>
                <p className="mb-0">Chapters</p>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <div className="stat-item">
                <h2 className="display-6 fw-bold text-info mb-0">100K+</h2>
                <p className="mb-0">Active Readers</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-item">
                <h2 className="display-6 fw-bold text-warning mb-0">Daily</h2>
                <p className="mb-0">Updates</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;