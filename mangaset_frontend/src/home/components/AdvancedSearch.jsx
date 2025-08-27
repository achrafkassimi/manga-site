import React, { useState } from 'react';

const AdvancedSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    query: '',
    genres: [],
    status: '',
    type: '',
    rating: '',
    year: '',
    sortBy: 'popularity',
    orderBy: 'desc'
  });

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 
    'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural',
    'Thriller', 'Mystery', 'Historical', 'School', 'Military'
  ];

  const statusOptions = ['Ongoing', 'Completed', 'Hiatus', 'Cancelled'];
  const typeOptions = ['Manga', 'Manhwa', 'Manhua', 'Light Novel'];
  const yearOptions = ['2024', '2023', '2022', '2021', '2020', '2019', 'Older'];
  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'rating', label: 'Rating' },
    { value: 'updated', label: 'Last Updated' },
    { value: 'created', label: 'Date Added' },
    { value: 'title', label: 'Title' },
    { value: 'chapters', label: 'Chapter Count' }
  ];

  const handleGenreToggle = (genre) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      genres: [],
      status: '',
      type: '',
      rating: '',
      year: '',
      sortBy: 'popularity',
      orderBy: 'desc'
    });
  };

  const searchResults = [
    {
      id: 1,
      title: "Attack on Titan",
      cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=280&fit=crop",
      genres: ["Action", "Drama", "Military"],
      rating: 4.9,
      status: "Completed",
      type: "Manga",
      chapters: 139,
      year: 2009
    },
    {
      id: 2,
      title: "Solo Leveling",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop",
      genres: ["Action", "Adventure", "Fantasy"],
      rating: 4.8,
      status: "Completed",
      type: "Manhwa",
      chapters: 179,
      year: 2018
    },
    {
      id: 3,
      title: "One Piece",
      cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=280&fit=crop",
      genres: ["Action", "Adventure", "Comedy"],
      rating: 4.7,
      status: "Ongoing",
      type: "Manga",
      chapters: 1100,
      year: 1997
    }
  ];

  return (
    <section className="my-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-gradient-primary text-white py-3">
          <div className="d-flex align-items-center justify-content-between">
            <h2 className="h4 mb-0 fw-bold">
              <i className="fas fa-search-plus me-2"></i>
              Advanced Search
            </h2>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} me-1`}></i>
              {isExpanded ? 'Collapse' : 'Expand'} Filters
            </button>
          </div>
        </div>

        <div className="card-body p-4">
          {/* Basic Search */}
          <div className="row mb-4">
            <div className="col-md-8">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light">
                  <i className="fas fa-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title, author, or description..."
                  value={filters.query}
                  onChange={(e) => handleInputChange('query', e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary btn-lg w-100">
                <i className="fas fa-search me-2"></i>
                Search
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className={`collapse ${isExpanded ? 'show' : ''}`}>
            <div className="border-top pt-4">
              
              {/* Genre Selection */}
              <div className="row mb-4">
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-tags me-2 text-primary"></i>
                    Genres
                  </label>
                  <div className="genre-grid">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        className={`btn btn-sm me-2 mb-2 ${
                          filters.genres.includes(genre)
                            ? 'btn-primary'
                            : 'btn-outline-secondary'
                        }`}
                        onClick={() => handleGenreToggle(genre)}
                      >
                        {genre}
                        {filters.genres.includes(genre) && (
                          <i className="fas fa-check ms-1"></i>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Row 1 */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-flag me-2 text-success"></i>
                    Status
                  </label>
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="">Any Status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-book me-2 text-info"></i>
                    Type
                  </label>
                  <select
                    className="form-select"
                    value={filters.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <option value="">Any Type</option>
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-star me-2 text-warning"></i>
                    Minimum Rating
                  </label>
                  <select
                    className="form-select"
                    value={filters.rating}
                    onChange={(e) => handleInputChange('rating', e.target.value)}
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-calendar me-2 text-danger"></i>
                    Release Year
                  </label>
                  <select
                    className="form-select"
                    value={filters.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                  >
                    <option value="">Any Year</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort Options */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-sort me-2 text-secondary"></i>
                    Sort By
                  </label>
                  <select
                    className="form-select"
                    value={filters.sortBy}
                    onChange={(e) => handleInputChange('sortBy', e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-arrow-up-down me-2 text-secondary"></i>
                    Order
                  </label>
                  <div className="btn-group w-100" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="orderBy"
                      id="desc"
                      checked={filters.orderBy === 'desc'}
                      onChange={() => handleInputChange('orderBy', 'desc')}
                    />
                    <label className="btn btn-outline-secondary" htmlFor="desc">
                      <i className="fas fa-arrow-down me-1"></i>
                      Descending
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="orderBy"
                      id="asc"
                      checked={filters.orderBy === 'asc'}
                      onChange={() => handleInputChange('orderBy', 'asc')}
                    />
                    <label className="btn btn-outline-secondary" htmlFor="asc">
                      <i className="fas fa-arrow-up me-1"></i>
                      Ascending
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3 justify-content-center">
                <button className="btn btn-success px-4">
                  <i className="fas fa-search me-2"></i>
                  Apply Filters
                </button>
                <button className="btn btn-outline-secondary px-4" onClick={clearFilters}>
                  <i className="fas fa-times me-2"></i>
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Preview */}
      <div className="mt-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3 className="h5 mb-0 fw-semibold">Search Results</h3>
          <span className="text-muted">Showing {searchResults.length} results</span>
        </div>

        <div className="row g-4">
          {searchResults.map((manga) => (
            <div key={manga.id} className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100 search-result-card">
                <div className="row g-0 h-100">
                  <div className="col-4">
                    <img
                      src={manga.cover}
                      className="img-fluid h-100 w-100 rounded-start"
                      alt={manga.title}
                      style={{ objectFit: "cover", minHeight: "160px" }}
                    />
                  </div>
                  <div className="col-8">
                    <div className="card-body p-3 h-100 d-flex flex-column">
                      <h6 className="card-title mb-2 fw-semibold">{manga.title}</h6>
                      
                      <div className="mb-2">
                        <span className="badge bg-primary me-1">{manga.type}</span>
                        <span className={`badge ${manga.status === 'Ongoing' ? 'bg-success' : 'bg-secondary'}`}>
                          {manga.status}
                        </span>
                      </div>

                      <div className="mb-2">
                        <small className="text-muted">
                          <i className="fas fa-star text-warning me-1"></i>
                          {manga.rating} • {manga.chapters} chapters • {manga.year}
                        </small>
                      </div>

                      <div className="mb-3 flex-grow-1">
                        {manga.genres.slice(0, 3).map((genre, idx) => (
                          <span key={idx} className="badge bg-light text-dark me-1 mb-1" style={{ fontSize: '0.65rem' }}>
                            {genre}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto">
                        <button className="btn btn-primary btn-sm w-100">
                          <i className="fas fa-book-open me-1"></i>
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
      </div>

      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .genre-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .search-result-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .search-result-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </section>
  );
};

export default AdvancedSearch;