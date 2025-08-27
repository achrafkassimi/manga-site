import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavigationBar = () => {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min');
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark-custom sticky-top shadow-sm">
        <div className="container-fluid px-4">
          
          <a className="navbar-brand fw-bold d-flex align-items-center" href="#">
            <div className="me-2">
              <h3 className="" style={{ color: '#ff6b35' }}>
                📚 MangaSet
              </h3>
            </div>
          </a>
          
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent" 
            aria-controls="navbarContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active px-3" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="#">Manga</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="#">Manhwa</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="#">Manhua</a>
              </li>
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle px-3" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                >
                  Genres
                </a>
                <ul className="dropdown-menu dropdown-menu-dark bg-dark border-secondary">
                  <li><a className="dropdown-item" href="#">Action</a></li>
                  <li><a className="dropdown-item" href="#">Romance</a></li>
                  <li><a className="dropdown-item" href="#">Fantasy</a></li>
                  <li><a className="dropdown-item" href="#">Slice of Life</a></li>
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li><a className="dropdown-item" href="#">All Genres</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="#">
                  <i className="fas fa-bookmark me-1"></i>Bookmarks
                </a>
              </li>
            </ul>

            <div className="d-flex align-items-center">
              <form className="search-form me-3" role="search">
                <div className="input-group">
                  <input 
                    className="form-control search-input" 
                    type="search" 
                    placeholder="Search manga..." 
                    aria-label="Search"
                  />
                  <button className="btn btn-primary" type="submit">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </form>
              
              <div className="nav-icons">
                <button className="btn btn-link text-light p-2 me-2" title="Random">
                  <i className="fas fa-random"></i>
                </button>
                <button className="btn btn-link text-light p-2" title="Settings">
                  <i className="fas fa-cog"></i>
                </button>
              </div>
            </div>

          </div>
        </div>
      </nav>

      <style jsx>{`
        .bg-dark-custom {
          background-color: #1a1a1a !important;
          border-bottom: 1px solid #333;
        }
        
        .brand-logo {
          font-family: 'Arial Black', Arial, sans-serif;
        }
        
        .nav-link {
          color: #ccc !important;
          transition: color 0.3s ease;
          position: relative;
        }
        
        .nav-link:hover,
        .nav-link.active {
          color: #007bff !important;
        }
        
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 2px;
          background-color: #007bff;
        }
        
        .search-input {
          background-color: #2a2a2a;
          border: 1px solid #444;
          color: #fff;
          min-width: 300px;
        }
        
        .search-input:focus {
          background-color: #2a2a2a;
          border-color: #007bff;
          color: #fff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        .search-input::placeholder {
          color: #888;
        }
        
        .dropdown-menu-dark {
          background-color: #1a1a1a;
          border: 1px solid #333;
        }
        
        .dropdown-item {
          color: #ccc;
          transition: all 0.3s ease;
        }
        
        .dropdown-item:hover {
          background-color: #007bff;
          color: #fff;
        }
        
        .nav-icons .btn {
          color: #ccc;
          transition: color 0.3s ease;
        }
        
        .nav-icons .btn:hover {
          color: #007bff;
        }
        
        @media (max-width: 991px) {
          .search-input {
            min-width: 250px;
          }
        }
        
        @media (max-width: 576px) {
          .search-input {
            min-width: 200px;
          }
        }
      `}</style>
    </>
  );
};

export default NavigationBar;