// src/components/manga/MangaCard.jsx
import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mangaService } from '../../services/mangaService';
import { toast } from 'react-toastify';

const MangaCard = ({ manga, showFavoriteButton = true }) => {
  const { isAuthenticated } = useAuth();
  
  const handleAddToFavorites = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.warn('Please login to add favorites');
      return;
    }

    try {
      await mangaService.addToFavorites(manga.id);
      toast.success('Added to favorites!');
    } catch (error) {
      toast.error('Failed to add to favorites');
      console.error('Add to favorites error:', error);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'ongoing': return 'success';
      case 'completed': return 'primary';
      case 'hiatus': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  // Handle image URL - support both relative and absolute paths
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-cover.jpg';
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // If it's a relative path, prepend the base URL
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
    return imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
  };

  // Fallback values for undefined manga properties
  const {
    id = 0,
    title = 'Unknown Title',
    slug = 'unknown-manga',
    author = 'Unknown Author',
    description = 'No description available.',
    status = 'unknown',
    cover_image,
    rating = 0,
    total_chapters = 0,
    genres = [],
    latest_chapter = null
  } = manga || {};

  return (
    <Card className="h-100 manga-card" style={{ transition: 'transform 0.2s' }}>
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={getImageUrl(cover_image)}
          alt={title}
          style={{ height: '300px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = '/placeholder-cover.jpg';
          }}
        />
        
        {/* Status Badge */}
        <Badge 
          bg={getStatusBadgeVariant(status)}
          className="position-absolute top-0 start-0 m-2"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        
        {/* Rating Badge */}
        {rating > 0 && (
          <Badge 
            bg="dark"
            className="position-absolute top-0 end-0 m-2"
          >
            <i className="fas fa-star text-warning me-1"></i>
            {Number(rating).toFixed(1)}
          </Badge>
        )}
        
        {/* Favorite Button */}
        {showFavoriteButton && isAuthenticated && (
          <Button
            variant="light"
            size="sm"
            className="position-absolute bottom-0 end-0 m-2"
            onClick={handleAddToFavorites}
            style={{ opacity: 0.9 }}
          >
            <i className="fas fa-heart text-danger"></i>
          </Button>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-truncate" title={title}>
          <Link 
            to={`/manga/${slug}`} 
            className="text-decoration-none text-dark"
          >
            {title}
          </Link>
        </Card.Title>
        
        <Card.Text className="text-muted small mb-2">
          by {author}
        </Card.Text>
        
        <Card.Text 
          className="text-muted flex-grow-1"
          style={{ 
            fontSize: '0.875rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {description}
        </Card.Text>
        
        {/* Genres */}
        <div className="mb-2">
          {genres?.slice(0, 2).map(genre => (
            <Badge 
              key={genre.id} 
              bg="light" 
              text="dark" 
              className="me-1"
              style={{ fontSize: '0.7rem' }}
            >
              {genre.name}
            </Badge>
          ))}
          {genres?.length > 2 && (
            <Badge bg="light" text="dark" style={{ fontSize: '0.7rem' }}>
              +{genres.length - 2}
            </Badge>
          )}
        </div>
        
        {/* Chapter Info */}
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <small className="text-muted">
            <i className="fas fa-list me-1"></i>
            {total_chapters} chapter{total_chapters !== 1 ? 's' : ''}
          </small>
          
          {latest_chapter && (
            <small className="text-muted">
              <i className="fas fa-clock me-1"></i>
              Ch. {latest_chapter.chapter_number}
            </small>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MangaCard;