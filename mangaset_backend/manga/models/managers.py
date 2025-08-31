# manga/models/managers.py
"""
Custom managers and querysets for optimized database queries.
"""

from django.db import models
from django.utils import timezone


class MangaQuerySet(models.QuerySet):
    """Custom queryset for Manga model with optimized queries"""
    
    def published(self):
        """Get manga with at least one published chapter"""
        return self.filter(chapters__is_published=True).distinct()
    
    def popular(self):
        """Get popular manga ordered by view count and rating"""
        return self.filter(is_popular=True).order_by('-view_count', '-average_rating')
    
    def featured(self):
        """Get featured manga"""
        return self.filter(is_featured=True).order_by('-updated_at')
    
    def trending(self):
        """Get trending manga based on recent activity"""
        return self.filter(is_trending=True).order_by('-view_count', '-last_chapter_added')
    
    def by_genre(self, genre_name):
        """Filter manga by genre name"""
        return self.filter(genres__name__iexact=genre_name)
    
    def by_status(self, status):
        """Filter manga by publication status"""
        return self.filter(status=status)
    
    def recently_updated(self, days=7):
        """Get manga updated in the last N days"""
        cutoff_date = timezone.now() - timezone.timedelta(days=days)
        return self.filter(last_chapter_added__gte=cutoff_date)
    
    def with_ratings_above(self, rating):
        """Get manga with average rating above specified value"""
        return self.filter(average_rating__gte=rating, total_ratings__gte=5)
    
    def search(self, query):
        """Full text search across title, description, and author"""
        return self.filter(
            models.Q(title__icontains=query) |
            models.Q(description__icontains=query) |
            models.Q(author__icontains=query) |
            models.Q(alternative_titles__icontains=query)
        )
    
    def with_chapters(self):
        """Get manga that have chapters"""
        return self.filter(total_chapters__gt=0)
    
    def completed(self):
        """Get completed manga"""
        return self.filter(status='completed')
    
    def ongoing(self):
        """Get ongoing manga"""
        return self.filter(status='ongoing')
    
    def new_series(self, days=30):
        """Get manga created in the last N days"""
        cutoff_date = timezone.now() - timezone.timedelta(days=days)
        return self.filter(created_at__gte=cutoff_date)
    
    def highly_rated(self, min_rating=8.0, min_votes=10):
        """Get highly rated manga"""
        return self.filter(
            average_rating__gte=min_rating,
            total_ratings__gte=min_votes
        )
    
    def for_age_rating(self, content_rating):
        """Filter by content rating"""
        return self.filter(content_rating=content_rating)
    
    def with_external_id(self, external_source=None):
        """Get manga with external IDs"""
        queryset = self.exclude(external_id='')
        if external_source:
            queryset = queryset.filter(external_source=external_source)
        return queryset


class ChapterQuerySet(models.QuerySet):
    """Custom queryset for Chapter model"""
    
    def published(self):
        """Get only published chapters"""
        return self.filter(is_published=True)
    
    def accessible_by(self, user):
        """Get chapters accessible by a specific user"""
        queryset = self.filter(is_published=True)
        
        # Filter out locked chapters that haven't been unlocked yet
        now = timezone.now()
        queryset = queryset.filter(
            models.Q(is_locked=False) |
            models.Q(is_locked=True, unlock_date__lte=now)
        )
        
        # If user is not premium, filter out premium chapters
        if not (user.is_authenticated and hasattr(user, 'profile') and 
                getattr(user.profile, 'is_premium', False)):
            queryset = queryset.filter(is_premium=False)
        
        return queryset
    
    def recent(self, days=7):
        """Get chapters published in the last N days"""
        cutoff_date = timezone.now() - timezone.timedelta(days=days)
        return self.filter(published_at__gte=cutoff_date)
    
    def by_manga(self, manga_slug):
        """Get chapters for a specific manga by slug"""
        return self.filter(manga__slug=manga_slug)
    
    def premium_only(self):
        """Get only premium chapters"""
        return self.filter(is_premium=True)
    
    def free_chapters(self):
        """Get only free chapters"""
        return self.filter(is_premium=False)
    
    def scheduled(self):
        """Get chapters with scheduled releases"""
        return self.filter(scheduled_release__isnull=False)
    
    def ready_to_publish(self):
        """Get chapters ready to be published"""
        now = timezone.now()
        return self.filter(
            is_published=False,
            scheduled_release__lte=now
        )


class NotificationQuerySet(models.QuerySet):
    """Custom queryset for Notification model"""
    
    def unread(self):
        """Get unread notifications"""
        return self.filter(is_read=False)
    
    def read(self):
        """Get read notifications"""
        return self.filter(is_read=True)
    
    def for_user(self, user):
        """Get notifications for a specific user"""
        return self.filter(user=user)
    
    def active(self):
        """Get non-expired notifications"""
        now = timezone.now()
        return self.filter(
            models.Q(expires_at__isnull=True) |
            models.Q(expires_at__gt=now)
        )
    
    def expired(self):
        """Get expired notifications"""
        now = timezone.now()
        return self.filter(expires_at__lte=now)
    
    def by_type(self, notification_type):
        """Filter by notification type"""
        return self.filter(type=notification_type)
    
    def high_priority(self):
        """Get high priority notifications"""
        return self.filter(priority='high')
    
    def recent(self, hours=24):
        """Get notifications from last N hours"""
        cutoff_date = timezone.now() - timezone.timedelta(hours=hours)
        return self.filter(created_at__gte=cutoff_date)


class CommentQuerySet(models.QuerySet):
    """Custom queryset for Comment model"""
    
    def approved(self):
        """Get approved comments"""
        return self.filter(is_approved=True)
    
    def pending(self):
        """Get pending approval comments"""
        return self.filter(is_approved=False)
    
    def by_manga(self, manga):
        """Get comments for a specific manga"""
        return self.filter(manga=manga)
    
    def by_chapter(self, chapter):
        """Get comments for a specific chapter"""
        return self.filter(chapter=chapter)
    
    def top_level(self):
        """Get only top-level comments (not replies)"""
        return self.filter(parent__isnull=True)
    
    def replies(self):
        """Get only reply comments"""
        return self.filter(parent__isnull=False)
    
    def popular(self, min_likes=5):
        """Get popular comments"""
        return self.filter(likes_count__gte=min_likes)
    
    def with_spoilers(self):
        """Get comments marked as spoilers"""
        return self.filter(is_spoiler=True)
    
    def without_spoilers(self):
        """Get comments not marked as spoilers"""
        return self.filter(is_spoiler=False)


class RatingQuerySet(models.QuerySet):
    """Custom queryset for MangaRating model"""
    
    def approved(self):
        """Get approved ratings"""
        return self.filter(is_approved=True)
    
    def with_reviews(self):
        """Get ratings that have review text"""
        return self.exclude(review_text='')
    
    def by_rating(self, rating):
        """Filter by specific rating value"""
        return self.filter(rating=rating)
    
    def high_ratings(self, min_rating=8):
        """Get high ratings"""
        return self.filter(rating__gte=min_rating)
    
    def low_ratings(self, max_rating=5):
        """Get low ratings"""
        return self.filter(rating__lte=max_rating)
    
    def helpful(self, min_helpful_votes=3):
        """Get helpful ratings"""
        return self.filter(helpful_votes__gte=min_helpful_votes)
    
    def recent(self, days=7):
        """Get recent ratings"""
        cutoff_date = timezone.now() - timezone.timedelta(days=days)
        return self.filter(created_at__gte=cutoff_date)


class ReadingHistoryQuerySet(models.QuerySet):
    """Custom queryset for ReadingHistory model"""
    
    def currently_reading(self):
        """Get manga currently being read"""
        return self.filter(reading_status='reading')
    
    def completed(self):
        """Get completed manga"""
        return self.filter(reading_status='completed')
    
    def dropped(self):
        """Get dropped manga"""
        return self.filter(reading_status='dropped')
    
    def plan_to_read(self):
        """Get plan to read manga"""
        return self.filter(reading_status='plan_to_read')
    
    def on_hold(self):
        """Get on hold manga"""
        return self.filter(reading_status='on_hold')
    
    def recent_activity(self, days=7):
        """Get recent reading activity"""
        cutoff_date = timezone.now() - timezone.timedelta(days=days)
        return self.filter(last_read_at__gte=cutoff_date)
    
    def with_progress_above(self, percentage):
        """Get reading history with progress above threshold"""
        return self.filter(progress_percentage__gte=percentage)
    
    def nearly_completed(self, threshold=90):
        """Get manga that are nearly completed"""
        return self.filter(
            progress_percentage__gte=threshold,
            reading_status='reading'
        )


# Custom managers - these will be assigned to models in their respective files
MangaManager = MangaQuerySet.as_manager
ChapterManager = ChapterQuerySet.as_manager
NotificationManager = NotificationQuerySet.as_manager
CommentManager = CommentQuerySet.as_manager
RatingManager = RatingQuerySet.as_manager
ReadingHistoryManager = ReadingHistoryQuerySet.as_manager