# manga/models/__init__.py
"""
Django models for the manga application.

This module imports all model classes to maintain backwards compatibility
and provide a single import point for all models.
"""

# Import base utilities first
from .base import *

# Import core content models
from .genre import Genre
from .tag import Tag
from .manga import Manga, MangaGenre, MangaTag
from .chapter import Chapter

# Import user-related models
from .user_profile import UserProfile
from .user_favorite import UserFavorite
from .reading_history import ReadingHistory
from .manga_rating import MangaRating

# Import interaction models
from .comment import Comment
from .analytics import CommentLike
from .notification import Notification

# Import analytics models
from .analytics import ChapterView, BookmarkPage, RatingHelpful

# Import admin/system models
from .admin_models import SiteSettings, ActivityLog

# Import custom managers and querysets
from .managers import MangaQuerySet, ChapterQuerySet, NotificationQuerySet

# Import utility functions
from .utils import (
    get_site_setting,
    set_site_setting, 
    log_activity,
    get_popular_manga_cached,
    get_featured_manga_cached,
    get_latest_chapters_cached,
    invalidate_manga_cache,
    get_manga_stats,
    get_user_reading_stats,
    get_similar_manga,
    get_user_recommendations
)

# Import custom exceptions
from .base import MangaException, ChapterAccessDenied, MangaNotFound, InvalidRating

# Import signals (this will register them)
from . import signals

# Ensure all signals are connected
signals.connect_all_signals()

# For backwards compatibility, export all models
__all__ = [
    # Core models
    'Genre', 'Tag', 'Manga', 'MangaGenre', 'MangaTag', 'Chapter',
    
    # User models  
    'UserProfile', 'UserFavorite', 'ReadingHistory', 'MangaRating',
    
    # Interaction models
    'Comment', 'CommentLike', 'Notification',
    
    # Analytics models
    'ChapterView', 'BookmarkPage', 'RatingHelpful',
    
    # Admin models
    'SiteSettings', 'ActivityLog',
    
    # Custom managers
    'MangaQuerySet', 'ChapterQuerySet', 'NotificationQuerySet',
    
    # Utilities
    'get_site_setting', 'set_site_setting', 'log_activity',
    'get_popular_manga_cached', 'get_featured_manga_cached', 
    'get_latest_chapters_cached', 'invalidate_manga_cache',
    'get_manga_stats', 'get_user_reading_stats',
    'get_similar_manga', 'get_user_recommendations',
    
    # Exceptions
    'MangaException', 'ChapterAccessDenied', 'MangaNotFound', 'InvalidRating'
]