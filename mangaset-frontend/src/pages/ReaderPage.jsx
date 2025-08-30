// src/pages/ReaderPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ReaderPage.css';



// Mock manga data
const mangaData = {
  'attack-on-titan': {
    title: 'Attack on Titan',
    totalChapters: 139,
    chapters: {
      1: { pages: 20 },
      2: { pages: 18 },
      3: { pages: 22 }
    }
  },
  'one-piece': {
    title: 'One Piece',
    totalChapters: 1100,
    chapters: {
      1: { pages: 15 },
      2: { pages: 17 },
      3: { pages: 19 }
    }
  }
};

const ReaderPage = () => {
  const { slug: mangaSlug, chapterId: chapterNumber } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [mangaInfo, setMangaInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChapter = () => {
      // Get manga info
      const manga = mangaData[mangaSlug] || mangaData['attack-on-titan'];
      const chapter = manga.chapters[chapterNumber] || { pages: 15 };
      
      setMangaInfo(manga);
      
      // Generate image URLs
      const imageList = [];
      for (let i = 1; i <= chapter.pages; i++) {
        imageList.push({
          id: i,
          url: `https://picsum.photos/800/1200?random=${mangaSlug}-${chapterNumber}-${i}`
        });
      }
      
      setImages(imageList);
      setLoading(false);
    };

    loadChapter();
  }, [mangaSlug, chapterNumber]);

  const goToChapter = (num) => {
    navigate(`/read/${mangaSlug}/${num}`);
  };

  const currentChapter = parseInt(chapterNumber);
  const canGoPrev = currentChapter > 1;
  const canGoNext = mangaInfo && currentChapter < mangaInfo.totalChapters;

  if (loading) {
    return <div className="loading">Loading Chapter...</div>;
  }

  return (
    <div className="reader-container">
      {/* Sticky Header */}
      <header >
        <h1 class="center">{mangaInfo?.title || mangaSlug} - Chapter {chapterNumber}</h1>
        
        <nav className="reader-nav">
          <button 
            onClick={() => canGoPrev && goToChapter(currentChapter - 1)}
            disabled={!canGoPrev}
            className="nav-btn"
          >
            ← Previous
          </button>
          
          <select 
            value={chapterNumber}
            onChange={(e) => goToChapter(e.target.value)}
            className="chapter-select"
          >
            {[...Array(mangaInfo?.totalChapters || 10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Chapter {i + 1}
              </option>
            ))}
          </select>
          
          <button 
            onClick={() => canGoNext && goToChapter(currentChapter + 1)}
            disabled={!canGoNext}
            className="nav-btn"
          >
            Next →
          </button>
        </nav>
        <br />
      </header>

      {/* Images Container */}
      <main className="images-container">
        {images.map((img) => (
          <div key={img.id} className="page-wrapper">
            <img
              src={img.url}
              alt={`Page ${img.id}`}
              className="manga-page"
              loading={img.id <= 3 ? "eager" : "lazy"}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/800x1200/333/fff?text=Page+${img.id}`;
              }}
            />
          </div>
        ))}
      </main>

      {/* Footer Navigation */}
      <footer className="reader-footer">
        <button 
          onClick={() => canGoPrev && goToChapter(currentChapter - 1)}
          disabled={!canGoPrev}
          className="nav-btn large"
        >
          ← Previous Chapter
        </button>
        
        <span className="chapter-info">
          Chapter {chapterNumber} • {images.length} pages
        </span>
        
        <button 
          onClick={() => canGoNext && goToChapter(currentChapter + 1)}
          disabled={!canGoNext}
          className="nav-btn large"
        >
          Next Chapter →
        </button>
      </footer>
    </div>
  );
};

export default ReaderPage;