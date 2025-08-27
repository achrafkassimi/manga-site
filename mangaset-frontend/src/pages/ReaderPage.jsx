// src/pages/ReaderPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Dropdown, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { mangaService } from '../services/mangaService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ReaderPage = () => {
  const { slug, chapterId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [chapter, setChapter] = useState(null);
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [readerSettings, setReaderSettings] = useState({
    fitMode: 'width', // 'width', 'height', 'original'
    backgroundColor: '#000000'
  });

  useEffect(() => {
    fetchChapterData();
  }, [chapterId]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Prevent default behavior for navigation keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', 'w', 's'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          previousPage();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          nextPage();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          previousChapter();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          nextChapter();
          break;
        case 'Escape':
          navigate(`/manga/${slug}`);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, chapters, chapter, navigate, slug]);

  const fetchChapterData = async () => {
    setLoading(true);
    try {
      const [chapterResponse, mangaResponse, chaptersResponse] = await Promise.all([
        mangaService.getChapterDetails(chapterId),
        mangaService.getMangaBySlug(slug),
        mangaService.getMangaChapters(slug)
      ]);
      
      setChapter(chapterResponse.data);
      setManga(mangaResponse.data);
      setChapters(chaptersResponse.data.results || chaptersResponse.data);
      setCurrentPage(0); // Reset to first page when chapter changes
    } catch (error) {
      console.error('Error fetching chapter data:', error);
      toast.error('Failed to load chapter');
    } finally {
      setLoading(false);
    }
  };

  const updateReadingProgress = useCallback(async () => {
    if (!isAuthenticated || !chapter || !manga) return;

    const progressPercentage = ((currentPage + 1) / (chapter.images?.length || 1)) * 100;
    
    try {
      await mangaService.updateReadingProgress(
        manga.id,
        chapter.id,
        currentPage,
        Math.round(progressPercentage)
      );
    } catch (error) {
      console.error('Error updating reading progress:', error);
    }
  }, [currentPage, chapter, manga, isAuthenticated]);

  useEffect(() => {
    if (!chapter?.images?.length) return;

    const timer = setTimeout(() => {
      updateReadingProgress();
    }, 2000); // Update progress after 2 seconds of staying on a page

    return () => clearTimeout(timer);
  }, [currentPage, updateReadingProgress, chapter]);

  const nextPage = () => {
    if (!chapter?.images?.length) return;
    
    if (currentPage < chapter.images.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      nextChapter();
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    } else {
      previousChapter();
    }
  };

  const nextChapter = () => {
    const currentIndex = chapters.findIndex(ch => ch.id === parseInt(chapterId));
    if (currentIndex < chapters.length - 1) {
      const nextChapter = chapters[currentIndex + 1];
      navigate(`/read/${slug}/${nextChapter.id}`);
    } else {
      toast.info('This is the latest chapter');
    }
  };

  const previousChapter = () => {
    const currentIndex = chapters.findIndex(ch => ch.id === parseInt(chapterId));
    if (currentIndex > 0) {
      const prevChapter = chapters[currentIndex - 1];
      navigate(`/read/${slug}/${prevChapter.id}`);
    } else {
      toast.info('This is the first chapter');
    }
  };

  const goToChapter = (selectedChapterId) => {
    navigate(`/read/${slug}/${selectedChapterId}`);
  };

  const goToPage = (pageIndex) => {
    if (pageIndex >= 0 && pageIndex < (chapter?.images?.length || 0)) {
      setCurrentPage(pageIndex);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // If it's a relative path, prepend the base URL
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
    return imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
  };

  const getImageStyle = () => {
    const baseStyle = {
      display: 'block',
      margin: '0 auto',
      maxHeight: '100vh',
      cursor: 'pointer'
    };

    switch (readerSettings.fitMode) {
      case 'width':
        return { ...baseStyle, width: '100%', height: 'auto' };
      case 'height':
        return { ...baseStyle, height: '100vh', width: 'auto' };
      case 'original':
        return { ...baseStyle, maxWidth: '100%', height: 'auto' };
      default:
        return baseStyle;
    }
  };

  const preloadImages = useCallback(() => {
    if (!chapter?.images) return;

    const preloadCount = 3;
    for (let i = 1; i <= preloadCount; i++) {
      if (currentPage + i < chapter.images.length) {
        const img = new Image();
        img.src = getImageUrl(chapter.images[currentPage + i]);
      }
    }
  }, [chapter, currentPage]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  // Loading state
  if (loading) return <LoadingSpinner text="Loading chapter..." />;

  // Chapter not found
  if (!chapter) {
    return (
      <Container className="mt-5 text-center">
        <h2>Chapter not found</h2>
        <Button onClick={() => navigate(`/manga/${slug}`)} variant="primary">
          Back to Manga
        </Button>
      </Container>
    );
  }

  // No images available
  if (!chapter.images || chapter.images.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <h2>No pages available</h2>
        <p>This chapter doesn't have any pages to display.</p>
        <Button onClick={() => navigate(`/manga/${slug}`)} variant="primary">
          Back to Manga
        </Button>
      </Container>
    );
  }

  const currentChapterIndex = chapters.findIndex(ch => ch.id === parseInt(chapterId));
  const isFirstChapter = currentChapterIndex === 0;
  const isLastChapter = currentChapterIndex === chapters.length - 1;
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === chapter.images.length - 1;

  return (
    <div style={{ backgroundColor: readerSettings.backgroundColor, minHeight: '100vh' }}>
      {/* Reader Controls */}
      <div className="reader-controls bg-dark text-white p-3 sticky-top">
        <Container>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            {/* Left Controls */}
            <div className="d-flex align-items-center gap-3 mb-2 mb-md-0">
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => navigate(`/manga/${slug}`)}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back
              </Button>
              
              <h5 className="mb-0 d-none d-md-block">
                {manga?.title} - Ch. {chapter.chapter_number}
              </h5>
              
              <h6 className="mb-0 d-md-none">
                Ch. {chapter.chapter_number}
              </h6>
            </div>

            {/* Right Controls */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* Chapter Selector */}
              <Dropdown>
                <Dropdown.Toggle variant="outline-light" size="sm">
                  <i className="fas fa-list me-1"></i>
                  <span className="d-none d-sm-inline">Chapter {chapter.chapter_number}</span>
                  <span className="d-sm-none">Ch.</span>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {chapters.map(ch => (
                    <Dropdown.Item
                      key={ch.id}
                      onClick={() => goToChapter(ch.id)}
                      active={ch.id === parseInt(chapterId)}
                    >
                      Chapter {ch.chapter_number}
                      {ch.title && `: ${ch.title}`}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              {/* Navigation Buttons */}
              <div className="d-flex gap-1">
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={previousChapter}
                  disabled={isFirstChapter}
                  title="Previous Chapter (W)"
                >
                  <i className="fas fa-step-backward"></i>
                </Button>
                
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={previousPage}
                  disabled={isFirstPage && isFirstChapter}
                  title="Previous Page (A)"
                >
                  <i className="fas fa-chevron-left"></i>
                </Button>
                
                <span className="text-light d-flex align-items-center px-2">
                  {currentPage + 1} / {chapter.images.length}
                </span>
                
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={nextPage}
                  disabled={isLastPage && isLastChapter}
                  title="Next Page (D)"
                >
                  <i className="fas fa-chevron-right"></i>
                </Button>
                
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={nextChapter}
                  disabled={isLastChapter}
                  title="Next Chapter (S)"
                >
                  <i className="fas fa-step-forward"></i>
                </Button>
              </div>

              {/* Settings */}
              <Dropdown>
                <Dropdown.Toggle variant="outline-light" size="sm">
                  <i className="fas fa-cog"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Header>Fit Mode</Dropdown.Header>
                  <Dropdown.Item
                    onClick={() => setReaderSettings(prev => ({ ...prev, fitMode: 'width' }))}
                    active={readerSettings.fitMode === 'width'}
                  >
                    <i className="fas fa-arrows-alt-h me-2"></i>
                    Fit Width
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setReaderSettings(prev => ({ ...prev, fitMode: 'height' }))}
                    active={readerSettings.fitMode === 'height'}
                  >
                    <i className="fas fa-arrows-alt-v me-2"></i>
                    Fit Height
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setReaderSettings(prev => ({ ...prev, fitMode: 'original' }))}
                    active={readerSettings.fitMode === 'original'}
                  >
                    <i className="fas fa-expand me-2"></i>
                    Original Size
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Header>Background</Dropdown.Header>
                  <Dropdown.Item
                    onClick={() => setReaderSettings(prev => ({ ...prev, backgroundColor: '#000000' }))}
                    active={readerSettings.backgroundColor === '#000000'}
                  >
                    <div className="d-flex align-items-center">
                      <div style={{ width: '16px', height: '16px', backgroundColor: '#000000', marginRight: '8px' }}></div>
                      Black
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setReaderSettings(prev => ({ ...prev, backgroundColor: '#ffffff' }))}
                    active={readerSettings.backgroundColor === '#ffffff'}
                  >
                    <div className="d-flex align-items-center">
                      <div style={{ width: '16px', height: '16px', backgroundColor: '#ffffff', border: '1px solid #ccc', marginRight: '8px' }}></div>
                      White
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setReaderSettings(prev => ({ ...prev, backgroundColor: '#2d2d2d' }))}
                    active={readerSettings.backgroundColor === '#2d2d2d'}
                  >
                    <div className="d-flex align-items-center">
                      <div style={{ width: '16px', height: '16px', backgroundColor: '#2d2d2d', marginRight: '8px' }}></div>
                      Dark Gray
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            now={((currentPage + 1) / chapter.images.length) * 100}
            className="mt-2"
            style={{ height: '3px', cursor: 'pointer' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percentage = clickX / rect.width;
              const targetPage = Math.floor(percentage * chapter.images.length);
              goToPage(targetPage);
            }}
          />
        </Container>
      </div>

      {/* Reader Content */}
      <div className="reader-content">
        {chapter.images && chapter.images.length > 0 ? (
          <div className="page-container text-center" style={{ position: 'relative' }}>
            {/* Loading overlay */}
            {imageLoading && (
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
              >
                <LoadingSpinner text="Loading page..." />
              </div>
            )}
            
            <img
              src={getImageUrl(chapter.images[currentPage])}
              alt={`Page ${currentPage + 1}`}
              style={getImageStyle()}
              onClick={nextPage}
              onLoad={() => {
                setImageLoading(false);
                preloadImages();
              }}
              onLoadStart={() => setImageLoading(true)}
              onError={(e) => {
                setImageLoading(false);
                console.error('Failed to load image:', e.target.src);
                toast.error(`Failed to load page ${currentPage + 1}`);
              }}
            />
            
            {/* Click areas for navigation */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '20%',
                height: '100%',
                cursor: 'w-resize',
                zIndex: 5
              }}
              onClick={(e) => {
                e.stopPropagation();
                previousPage();
              }}
              title="Previous page"
            />
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '20%',
                height: '100%',
                cursor: 'e-resize',
                zIndex: 5
              }}
              onClick={(e) => {
                e.stopPropagation();
                nextPage();
              }}
              title="Next page"
            />
          </div>
        ) : (
          <Container className="mt-5 text-center">
            <p style={{ color: readerSettings.backgroundColor === '#ffffff' ? '#000' : '#fff' }}>
              No pages available for this chapter.
            </p>
          </Container>
        )}
      </div>

      {/* Mobile Navigation Hints */}
      <div className="d-md-none position-fixed bottom-0 start-0 p-3" style={{ zIndex: 1000 }}>
        <small 
          className="bg-dark text-light p-2 rounded"
          style={{ opacity: 0.8 }}
        >
          Tap sides to navigate • Tap center for controls
        </small>
      </div>

      {/* Desktop Navigation Hints */}
      <div className="d-none d-md-block position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1000 }}>
        <small 
          className="bg-dark text-light p-2 rounded"
          style={{ opacity: 0.8 }}
        >
          A/D: Pages • W/S: Chapters • ESC: Back
        </small>
      </div>
    </div>
  );
};

export default ReaderPage;