# manga/models/utils.py
"""
Utility functions for manga models including caching, recommendations, and statistics.
"""

from django.core.cache import cache
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User


# ============================================================================
# CACHING UTILITIES
# ============================================================================

def get_popular_manga_cached(limit=10):
    """Get popular manga with caching"""
    cache_key = f"popular_manga_{limit}"
    popular = cache.get(cache_key)
    
    if popular is None:
        from .manga import Manga
        popular = list(Manga.objects.popular()[:limit])
        cache.set(cache_key, popular, 3600)  # Cache for 1 hour
    
    return popular


def get_featured_manga_cached(limit=5):
    """Get featured manga with caching"""
    cache_key = f"featured_manga_{limit}"
    featured = cache.get(cache_key)
    
    if featured is None:
        from .manga import Manga
        featured = list(Manga.objects.featured()[:limit])
        cache.set(cache_key, featured, 1800)  # Cache for 30 minutes
    
    return featured


def get_latest_chapters_cached(limit=20):
    """Get latest chapters with caching"""
    cache_key = f"latest_chapters_{limit}"
    chapters = cache.get(cache_key)
    
    if chapters is None:
        from .chapter import Chapter
        chapters = list(Chapter.objects.published().order_by('-published_at')[:limit])
        cache.set(cache_key, chapters, 300)  # Cache for 5 minutes
    
    return chapters


def get_trending_manga_cached(limit=10):
    """Get trending manga with caching"""
    cache_key = f"trending_manga_{limit}"
    trending = cache.get(cache_key)
    
    if trending is None:
        from .manga import Manga
        trending = list(Manga.objects.trending()[:limit])
        cache.set(cache_key, trending, 600)  # Cache for 10 minutes
    
    return trending


def invalidate_manga_cache(manga_id):
    """Invalidate cache for a specific manga"""
    cache_keys = [
        f"manga_detail_{manga_id}",
        f"manga_chapters_{manga_id}",
        "popular_manga_10",
        "featured_manga_5",
        "latest_chapters_20",
        "trending_manga_10"
    ]
    cache.delete_many(cache_keys)


def invalidate_all_manga_caches():
    """Invalidate all manga-related caches"""
    cache_patterns = [
        "popular_manga_*",
        "featured_manga_*", 
        "latest_chapters_*",
        "trending_manga_*",
        "manga_detail_*",
        "manga_chapters_*"
    ]
    
    # Note: This requires a cache backend that supports pattern deletion
    for pattern in cache_patterns:
        try:
            cache.delete_pattern(pattern)
        except AttributeError:
            # Fallback for cache backends that don't support patterns
            pass


# ============================================================================
# STATISTICS UTILITIES
# ============================================================================

def get_manga_stats():
    """Get general manga statistics"""
    from .manga import Manga
    from .chapter import Chapter
    from .genre import Genre
    
    return {
        'total_manga': Manga.objects.count(),
        'published_manga': Manga.objects.published().count(),
        'total_chapters': Chapter.objects.filter(is_published=True).count(),
        'total_users': User.objects.filter(is_active=True).count(),
        'popular_genres': list(Genre.objects.filter(is_popular=True).values('name', 'manga_count')[:10]),
        'recent_updates': Manga.objects.recently_updated().count(),
        'featured_count': Manga.objects.filter(is_featured=True).count(),
        'completed_manga': Manga.objects.filter(status='completed').count(),
        'ongoing_manga': Manga.objects.filter(status='ongoing').count(),
    }


def get_user_reading_stats(user):
    """Get comprehensive reading statistics for a user"""
    if not user.is_authenticated:
        return {}
    
    from .reading_history import ReadingHistory
    from .user_favorite import UserFavorite
    from .manga_rating import MangaRating
    from .comment import Comment
    
    reading_history = ReadingHistory.objects.filter(user=user)
    
    return {
        'favorites_count': UserFavorite.objects.filter(user=user).count(),
        'reading_count': reading_history.filter(reading_status='reading').count(),
        'completed_count': reading_history.filter(reading_status='completed').count(),
        'dropped_count': reading_history.filter(reading_status='dropped').count(),
        'plan_to_read_count': reading_history.filter(reading_status='plan_to_read').count(),
        'on_hold_count': reading_history.filter(reading_status='on_hold').count(),
        'total_reading_time': sum(
            history.total_reading_time for history in reading_history
        ),
        'ratings_given': MangaRating.objects.filter(user=user).count(),
        'comments_made': Comment.objects.filter(user=user, is_approved=True).count(),
        'average_rating_given': MangaRating.objects.filter(user=user).aggregate(
            avg=models.Avg('rating')
        )['avg'] or 0,
        'chapters_read': sum(
            history.get_chapters_read() for history in reading_history
        ),
    }


def get_genre_statistics():
    """Get genre usage statistics"""
    from .genre import Genre
    
    return Genre.objects.annotate(
        manga_count_actual=models.Count('manga_genres'),
        avg_rating=models.Avg('manga_genres__manga__average_rating'),
        total_views=models.Sum('manga_genres__manga__view_count')
    ).order_by('-manga_count_actual')


# ============================================================================
# RECOMMENDATION ENGINE
# ============================================================================

def get_similar_manga(manga, limit=5):
    """Get manga similar to the given manga based on genres and tags"""
    from .manga import Manga
    
    # Get manga with overlapping genres
    genre_ids = manga.genres.values_list('id', flat=True)
    
    similar = Manga.objects.filter(
        genres__in=genre_ids
    ).exclude(
        id=manga.id
    ).annotate(
        genre_overlap=models.Count('genres', filter=models.Q(genres__in=genre_ids)),
        tag_overlap=models.Count('tags', filter=models.Q(tags__in=manga.tags.all()))
    ).order_by(
        '-genre_overlap', '-tag_overlap', '-average_rating', '-view_count'
    ).distinct()[:limit]
    
    return similar


def get_user_recommendations(user, limit=10):
    """Get personalized recommendations for a user"""
    if not user.is_authenticated:
        from .manga import Manga
        return Manga.objects.popular()[:limit]
    
    from .manga import Manga
    from .genre import Genre
    from .user_favorite import UserFavorite
    
    # Get user's favorite genres based on their favorited manga
    favorite_genres = Genre.objects.filter(
        manga_genres__manga__user_favorites__user=user
    ).annotate(
        user_count=models.Count('manga_genres__manga__user_favorites')
    ).order_by('-user_count')[:5]
    
    if not favorite_genres.exists():
        # New user - return popular manga
        return Manga.objects.popular()[:limit]
    
    # Get manga from favorite genres that user hasn't favorited or read
    favorited_manga_ids = UserFavorite.objects.filter(user=user).values_list('manga_id', flat=True)
    
    from .reading_history import ReadingHistory
    read_manga_ids = ReadingHistory.objects.filter(user=user).values_list('manga_id', flat=True)
    
    excluded_ids = list(favorited_manga_ids) + list(read_manga_ids)
    
    recommendations = Manga.objects.filter(
        genres__in=favorite_genres
    ).exclude(
        id__in=excluded_ids
    ).order_by(
        '-average_rating', '-view_count'
    ).distinct()[:limit]
    
    return recommendations


def get_continue_reading_list(user, limit=10):
    """Get list of manga user should continue reading"""
    if not user.is_authenticated:
        return []
    
    from .reading_history import ReadingHistory
    
    continue_reading = ReadingHistory.objects.filter(
        user=user,
        reading_status__in=['reading', 'on_hold']
    ).select_related('manga', 'chapter').order_by('-last_read_at')[:limit]
    
    return continue_reading


# ============================================================================
# BULK OPERATIONS
# ============================================================================

def bulk_update_manga_statistics():
    """Bulk update statistics for all manga"""
    from django.db import transaction
    from .manga import Manga
    
    with transaction.atomic():
        for manga in Manga.objects.all():
            manga.update_statistics()


def cleanup_old_data(days=90):
    """Clean up old analytics data"""
    from .analytics import ChapterView
    from .notification import Notification
    from .admin_models import ActivityLog
    
    cutoff_date = timezone.now() - timezone.timedelta(days=days)
    
    # Clean up old chapter views
    old_views_count = ChapterView.objects.filter(created_at__lt=cutoff_date).delete()[0]
    
    # Clean up old read notifications
    old_notifications_count = Notification.cleanup_old_notifications(days)
    
    # Clean up old activity logs (keep errors longer)
    old_logs_count = ActivityLog.cleanup_old_logs(days)
    
    return {
        'chapter_views_deleted': old_views_count,
        'notifications_deleted': old_notifications_count,
        'activity_logs_deleted': old_logs_count
    }


# ============================================================================
# SEARCH UTILITIES
# ============================================================================

def search_manga_advanced(query, filters=None):
    """Advanced manga search with multiple filters"""
    from .manga import Manga
    
    queryset = Manga.objects.all()
    
    # Text search
    if query:
        queryset = queryset.search(query)
    
    # Apply filters
    if filters:
        if filters.get('genres'):
            queryset = queryset.filter(genres__slug__in=filters['genres'])
        
        if filters.get('status'):
            queryset = queryset.filter(status__in=filters['status'])
        
        if filters.get('content_rating'):
            queryset = queryset.filter(content_rating__in=filters['content_rating'])
        
        if filters.get('min_rating'):
            queryset = queryset.filter(average_rating__gte=filters['min_rating'])
        
        if filters.get('year_from'):
            queryset = queryset.filter(publication_year__gte=filters['year_from'])
        
        if filters.get('year_to'):
            queryset = queryset.filter(publication_year__lte=filters['year_to'])
        
        if filters.get('sort_by'):
            sort_options = {
                'title': 'title',
                'rating': '-average_rating',
                'views': '-view_count',
                'updated': '-updated_at',
                'created': '-created_at',
                'chapters': '-total_chapters'
            }
            if filters['sort_by'] in sort_options:
                queryset = queryset.order_by(sort_options[filters['sort_by']])
    
    return queryset.distinct()


# ============================================================================
# SITE SETTINGS UTILITIES
# ============================================================================

def get_site_setting(key, default=None):
    """Get a site setting value"""
    from .admin_models import SiteSettings
    return SiteSettings.get_setting(key, default)


def set_site_setting(key, value, description='', data_type='string', is_public=False, category='general'):
    """Set a site setting value"""
    from .admin_models import SiteSettings
    return SiteSettings.set_setting(key, value, description, data_type, is_public, category)


# ============================================================================
# ACTIVITY LOGGING
# ============================================================================

def log_activity(action_type, description, user=None, manga=None, chapter=None, 
                ip_address=None, user_agent=None, metadata=None, severity='info'):
    """Log an activity"""
    from .admin_models import ActivityLog
    return ActivityLog.log(
        action_type=action_type,
        description=description,
        user=user,
        manga=manga,
        chapter=chapter,
        ip_address=ip_address,
        user_agent=user_agent,
        metadata=metadata,
        severity=severity
    )


# ============================================================================
# DATA VALIDATION
# ============================================================================

def validate_manga_data(data):
    """Validate manga data before creation/update"""
    errors = []
    
    if not data.get('title', '').strip():
        errors.append("Title is required")
    
    if not data.get('description', '').strip():
        errors.append("Description is required")
    
    if not data.get('author', '').strip():
        errors.append("Author is required")
    
    if data.get('publication_year'):
        current_year = timezone.now().year
        if data['publication_year'] > current_year + 5:
            errors.append("Publication year cannot be more than 5 years in the future")
        if data['publication_year'] < 1900:
            errors.append("Publication year cannot be before 1900")
    
    if data.get('average_rating'):
        if not (0 <= data['average_rating'] <= 10):
            errors.append("Rating must be between 0 and 10")
    
    return errors


def validate_chapter_data(data, manga):
    """Validate chapter data before creation/update"""
    from .chapter import Chapter
    
    errors = []
    
    if not data.get('chapter_number'):
        errors.append("Chapter number is required")
    
    # Check for duplicate chapter numbers
    existing_chapter = Chapter.objects.filter(
        manga=manga, 
        chapter_number=data.get('chapter_number')
    )
    
    if 'chapter_id' in data:
        existing_chapter = existing_chapter.exclude(id=data['chapter_id'])
    
    if existing_chapter.exists():
        errors.append("Chapter number already exists for this manga")
    
    if data.get('pages') and not isinstance(data['pages'], list):
        errors.append("Pages must be a list")
    
    if data.get('chapter_number', 0) <= 0:
        errors.append("Chapter number must be positive")
    
    return errors


# ============================================================================
# PERFORMANCE UTILITIES
# ============================================================================

def optimize_queryset_for_manga_list():
    """Get optimized queryset for manga list views"""
    from .manga import Manga
    
    return Manga.objects.select_related().prefetch_related(
        'genres',
        'manga_genres__genre',
        'tags',
        'manga_tags__tag'
    )


def optimize_queryset_for_chapter_list(manga):
    """Get optimized queryset for chapter list"""
    return manga.chapters.filter(is_published=True).select_related('manga')


# ============================================================================
# NOTIFICATION UTILITIES
# ============================================================================

def send_bulk_notifications(notification_type, title, message, users, manga=None, chapter=None):
    """Send bulk notifications to multiple users"""
    from .notification import Notification
    from .base import Priority
    
    notifications = []
    for user in users:
        notifications.append(
            Notification(
                user=user,
                manga=manga,
                chapter=chapter,
                type=notification_type,
                title=title,
                message=message,
                priority=Priority.MEDIUM
            )
        )
    
    return Notification.objects.bulk_create(notifications)


def get_unread_notification_count(user):
    """Get count of unread notifications for user"""
    if not user.is_authenticated:
        return 0
    
    from .notification import Notification
    return Notification.objects.filter(user=user, is_read=False).count()


# ============================================================================
# MANGA DISCOVERY UTILITIES
# ============================================================================

def get_new_series(days=30, limit=10):
    """Get recently added manga series"""
    from .manga import Manga
    
    cutoff_date = timezone.now() - timezone.timedelta(days=days)
    return Manga.objects.filter(
        created_at__gte=cutoff_date
    ).order_by('-created_at')[:limit]


def get_recently_completed(days=30, limit=10):
    """Get manga that were recently completed"""
    from .manga import Manga
    
    cutoff_date = timezone.now() - timezone.timedelta(days=days)
    return Manga.objects.filter(
        status='completed',
        updated_at__gte=cutoff_date
    ).order_by('-updated_at')[:limit]


def get_random_manga(limit=10, filters=None):
    """Get random manga for discovery"""
    from .manga import Manga
    
    queryset = Manga.objects.published()
    
    if filters:
        if filters.get('min_rating'):
            queryset = queryset.filter(average_rating__gte=filters['min_rating'])
        if filters.get('genres'):
            queryset = queryset.filter(genres__slug__in=filters['genres'])
    
    return queryset.order_by('?')[:limit]


# ============================================================================
# DATA EXPORT UTILITIES
# ============================================================================

def export_user_data(user):
    """Export all user data for GDPR compliance"""
    if not user.is_authenticated:
        return {}
    
    from .user_favorite import UserFavorite
    from .reading_history import ReadingHistory
    from .manga_rating import MangaRating
    from .comment import Comment
    from .notification import Notification
    
    return {
        'profile': {
            'username': user.username,
            'email': user.email,
            'bio': user.profile.bio if hasattr(user, 'profile') else '',
            'country': user.profile.country if hasattr(user, 'profile') else '',
            'reading_preferences': user.profile.get_reading_preferences() if hasattr(user, 'profile') else {},
        },
        'favorites': list(UserFavorite.objects.filter(user=user).values(
            'manga__title', 'added_at', 'notes'
        )),
        'reading_history': list(ReadingHistory.objects.filter(user=user).values(
            'manga__title', 'reading_status', 'progress_percentage', 'total_reading_time'
        )),
        'ratings': list(MangaRating.objects.filter(user=user).values(
            'manga__title', 'rating', 'review_title', 'review_text', 'created_at'
        )),
        'comments': list(Comment.objects.filter(user=user).values(
            'manga__title', 'content', 'created_at', 'likes_count'
        )),
        'notifications': list(Notification.objects.filter(user=user).values(
            'type', 'title', 'message', 'created_at', 'is_read'
        ))
    }


# ============================================================================
# MAINTENANCE UTILITIES
# ============================================================================

def update_all_manga_statistics():
    """Update statistics for all manga"""
    from .manga import Manga
    
    updated_count = 0
    for manga in Manga.objects.all():
        manga.update_statistics()
        updated_count += 1
    
    return updated_count


def recalculate_trending_manga():
    """Recalculate trending status for all manga"""
    from .manga import Manga
    from .analytics import ChapterView
    
    cutoff = timezone.now() - timezone.timedelta(hours=24)
    
    # Get manga with high recent activity
    trending_manga_ids = ChapterView.objects.filter(
        created_at__gte=cutoff
    ).values('chapter__manga_id').annotate(
        view_count=models.Count('id')
    ).filter(view_count__gte=50).values_list('chapter__manga_id', flat=True)
    
    # Update trending status
    Manga.objects.update(is_trending=False)
    Manga.objects.filter(id__in=trending_manga_ids).update(is_trending=True)
    
    return len(trending_manga_ids)


def cleanup_orphaned_data():
    """Clean up orphaned data and fix inconsistencies"""
    from .manga import Manga
    from .genre import Genre
    from .tag import Tag
    
    cleanup_results = {}
    
    # Update genre manga counts
    for genre in Genre.objects.all():
        old_count = genre.manga_count
        genre.update_manga_count()
        if old_count != genre.manga_count:
            cleanup_results[f'genre_{genre.id}_count'] = f'{old_count} -> {genre.manga_count}'
    
    # Update tag usage counts
    for tag in Tag.objects.all():
        old_count = tag.usage_count
        tag.update_usage_count()
        if old_count != tag.usage_count:
            cleanup_results[f'tag_{tag.id}_count'] = f'{old_count} -> {tag.usage_count}'
    
    # Update manga statistics
    for manga in Manga.objects.all():
        old_stats = {
            'chapters': manga.total_chapters,
            'favorites': manga.favorite_count,
            'rating': manga.average_rating
        }
        manga.update_statistics()
        
        # Check if anything changed
        if (manga.total_chapters != old_stats['chapters'] or 
            manga.favorite_count != old_stats['favorites'] or
            manga.average_rating != old_stats['rating']):
            cleanup_results[f'manga_{manga.id}_stats'] = 'Updated'
    
    return cleanup_results