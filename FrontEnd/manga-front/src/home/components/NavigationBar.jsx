import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavigationBar = () => {
  // useEffect(() => {
  //   // Import Bootstrap JS dynamically to ensure dropdown and collapse functionality
  //   import('bootstrap/dist/js/bootstrap.bundle.min.js');
  // }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        
        <a className="navbar-brand fw-bold fs-4" href="#" style={{ color: '#ff6b35' }}>
          📚 MangaSet
        </a>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active fw-semibold" aria-current="page" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Comics</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Manhwa</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Manhua</a>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                Genres
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Romance</a></li>
                <li><a className="dropdown-item" href="#">Fantasy</a></li>
                <li><a className="dropdown-item" href="#">Slice of Life</a></li>
                <li><a className="dropdown-item" href="#">Drama</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">View All Genres</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-bookmark"></i> Bookmarks
              </a>
            </li>
          </ul>

          <form className="d-flex" role="search">
            <input 
              className="form-control me-2" 
              type="search" 
              placeholder="Search Manga" 
              aria-label="Search" 
            />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>

        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;

