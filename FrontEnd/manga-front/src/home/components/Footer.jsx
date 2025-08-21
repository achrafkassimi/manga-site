import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    manga: [
      { name: 'Popular Manga', href: '#' },
      { name: 'Latest Updates', href: '#' },
      { name: 'New Releases', href: '#' },
      { name: 'Top Rated', href: '#' },
      { name: 'Completed Series', href: '#' }
    ],
    genres: [
      { name: 'Action', href: '#' },
      { name: 'Romance', href: '#' },
      { name: 'Fantasy', href: '#' },
      { name: 'Comedy', href: '#' },
      { name: 'Drama', href: '#' }
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Bug Reports', href: '#' },
      { name: 'Feature Requests', href: '#' },
      { name: 'Community Guidelines', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'DMCA', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Disclaimer', href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'Discord', icon: 'fab fa-discord', href: '#', color: '#7289da' },
    { name: 'Twitter', icon: 'fab fa-twitter', href: '#', color: '#1da1f2' },
    { name: 'Facebook', icon: 'fab fa-facebook', href: '#', color: '#1877f2' },
    { name: 'Reddit', icon: 'fab fa-reddit', href: '#', color: '#ff4500' },
    { name: 'YouTube', icon: 'fab fa-youtube', href: '#', color: '#ff0000' },
    { name: 'Instagram', icon: 'fab fa-instagram', href: '#', color: '#e4405f' }
  ];

  const statistics = [
    { label: 'Total Manga', value: '50,000+', icon: 'fas fa-book' },
    { label: 'Active Readers', value: '2.5M+', icon: 'fas fa-users' },
    { label: 'Daily Updates', value: '1,200+', icon: 'fas fa-clock' },
    { label: 'Languages', value: '25+', icon: 'fas fa-globe' }
  ];

  return (
    <footer className="bg-dark text-light mt-5">
      {/* Statistics Bar */}
      <div className="border-bottom border-secondary py-4">
        <div className="container">
          <div className="row text-center">
            {statistics.map((stat, index) => (
              <div key={index} className="col-6 col-md-3 mb-3 mb-md-0">
                <div className="d-flex flex-column align-items-center">
                  <i className={`${stat.icon} fa-2x text-warning mb-2`}></i>
                  <h4 className="mb-1 fw-bold text-white">{stat.value}</h4>
                  <small className="text-muted">{stat.label}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-5">
        <div className="row g-4">
          
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6">
            <div className="mb-4">
              <h3 className="fw-bold mb-3" style={{ color: '#ff6b35' }}>
                📚 MangaSet
              </h3>
              <p className="text-muted mb-4">
                Your ultimate destination for manga, manhwa, and manhua. 
                Discover thousands of titles, track your reading progress, 
                and join a community of passionate readers from around the world.
              </p>
              
              {/* Newsletter Signup */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3 text-white">
                  <i className="fas fa-envelope me-2 text-warning"></i>
                  Stay Updated
                </h6>
                <form className="d-flex">
                  <input
                    type="email"
                    className="form-control me-2 bg-secondary border-0 text-white"
                    placeholder="Enter your email"
                    style={{ backgroundColor: '#495057 !important' }}
                  />
                  <button className="btn btn-warning px-3" type="submit">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
                <small className="text-muted mt-1 d-block">
                  Get notified about new releases and updates
                </small>
              </div>

              {/* App Download */}
              <div>
                <h6 className="fw-semibold mb-3 text-white">
                  <i className="fas fa-mobile-alt me-2 text-warning"></i>
                  Download App
                </h6>
                <div className="d-flex gap-2">
                  <a href="#" className="btn btn-outline-light btn-sm">
                    <i className="fab fa-apple me-1"></i>
                    iOS
                  </a>
                  <a href="#" className="btn btn-outline-light btn-sm">
                    <i className="fab fa-google-play me-1"></i>
                    Android
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-semibold mb-3 text-white">
              <i className="fas fa-book-open me-2 text-warning"></i>
              Manga
            </h6>
            <ul className="list-unstyled">
              {footerLinks.manga.map((link, index) => (
                <li key={index} className="mb-2">
                  <a href={link.href} className="text-muted text-decoration-none hover-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-semibold mb-3 text-white">
              <i className="fas fa-tags me-2 text-warning"></i>
              Genres
            </h6>
            <ul className="list-unstyled">
              {footerLinks.genres.map((link, index) => (
                <li key={index} className="mb-2">
                  <a href={link.href} className="text-muted text-decoration-none hover-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-semibold mb-3 text-white">
              <i className="fas fa-life-ring me-2 text-warning"></i>
              Support
            </h6>
            <ul className="list-unstyled">
              {footerLinks.support.map((link, index) => (
                <li key={index} className="mb-2">
                  <a href={link.href} className="text-muted text-decoration-none hover-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-semibold mb-3 text-white">
              <i className="fas fa-gavel me-2 text-warning"></i>
              Legal
            </h6>
            <ul className="list-unstyled">
              {footerLinks.legal.map((link, index) => (
                <li key={index} className="mb-2">
                  <a href={link.href} className="text-muted text-decoration-none hover-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="border-top border-secondary mt-5 pt-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h6 className="fw-semibold mb-3 text-white">
                <i className="fas fa-users me-2 text-warning"></i>
                Join Our Community
              </h6>
              <div className="d-flex gap-3 flex-wrap">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="btn btn-outline-light btn-sm social-btn"
                    style={{ '--hover-color': social.color }}
                    title={social.name}
                  >
                    <i className={social.icon}></i>
                    <span className="ms-1 d-none d-sm-inline">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <div className="mb-2">
                <span className="badge bg-success me-2">
                  <i className="fas fa-circle me-1"></i>
                  Online
                </span>
                <small className="text-muted">Server Status: All systems operational</small>
              </div>
              <div>
                <small className="text-muted">
                  <i className="fas fa-clock me-1"></i>
                  Last updated: {new Date().toLocaleString()}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black py-3">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0 text-muted small">
                © {currentYear} MangaSet. All rights reserved. 
                <span className="mx-2">|</span>
                Made with <i className="fas fa-heart text-danger mx-1"></i> for manga lovers
              </p>
            </div>
            <div className="col-md-6 text-md-end mt-2 mt-md-0">
              <div className="d-flex justify-content-md-end align-items-center gap-3">
                <select className="form-select form-select-sm bg-secondary border-0 text-white" style={{ width: 'auto' }}>
                  <option>🇺🇸 English</option>
                  <option>🇯🇵 日本語</option>
                  <option>🇰🇷 한국어</option>
                  <option>🇨🇳 中文</option>
                </select>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="fas fa-moon"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-link {
          transition: color 0.3s ease;
        }
        .hover-link:hover {
          color: #ff6b35 !important;
        }
        .social-btn {
          transition: all 0.3s ease;
          border-color: #6c757d;
        }
        .social-btn:hover {
          background-color: var(--hover-color);
          border-color: var(--hover-color);
          color: white;
          transform: translateY(-2px);
        }
        .form-control:focus {
          background-color: #495057 !important;
          border-color: #ff6b35;
          color: white;
          box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
        }
        .form-control::placeholder {
          color: #adb5bd;
        }
      `}</style>
    </footer>
  );
};

export default Footer;