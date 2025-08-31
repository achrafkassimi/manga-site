# manga/models/base.py
"""
Base imports, abstract models, and custom exceptions for the manga application.
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify
from django.urls import reverse
from django.utils import timezone
from decimal import Decimal
import json


# ============================================================================
# ABSTRACT BASE MODELS
# ============================================================================

class TimeStampedModel(models.Model):
    """Abstract base model with created_at and updated_at fields"""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class SluggedModel(models.Model):
    """Abstract base model with auto-generated slug field"""
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    
    class Meta:
        abstract = True
    
    def save(self, *args, **kwargs):
        if not self.slug and hasattr(self, 'title'):
            self.slug = slugify(self.title)
        elif not self.slug and hasattr(self, 'name'):
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class ViewCountMixin(models.Model):
    """Mixin for models that track view counts"""
    view_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        abstract = True
    
    def increment_views(self, amount=1):
        """Increment view count"""
        self.view_count = models.F('view_count') + amount
        self.save(update_fields=['view_count'])


class RatingMixin(models.Model):
    """Mixin for models that have ratings"""
    average_rating = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        default=0
    )
    total_ratings = models.PositiveIntegerField(default=0)
    
    class Meta:
        abstract = True
    
    def calculate_average_rating(self):
        """Calculate and update average rating"""
        if hasattr(self, 'ratings'):
            ratings = self.ratings.all()
            if ratings.exists():
                self.average_rating = ratings.aggregate(avg=models.Avg('rating'))['avg'] or 0
                self.total_ratings = ratings.count()
            else:
                self.average_rating = 0
                self.total_ratings = 0
            self.save(update_fields=['average_rating', 'total_ratings'])


# ============================================================================
# CUSTOM EXCEPTIONS
# ============================================================================

class MangaException(Exception):
    """Base exception for manga-related errors"""
    pass


class ChapterAccessDenied(MangaException):
    """Raised when user tries to access a restricted chapter"""
    pass


class MangaNotFound(MangaException):
    """Raised when manga is not found"""
    pass


class InvalidRating(MangaException):
    """Raised when an invalid rating is provided"""
    pass


class InvalidChapterNumber(MangaException):
    """Raised when an invalid chapter number is provided"""
    pass


class DuplicateEntry(MangaException):
    """Raised when trying to create a duplicate entry"""
    pass


# ============================================================================
# COMMON CHOICES
# ============================================================================

class ContentRating:
    """Content rating choices for manga"""
    SAFE = 'safe'
    SUGGESTIVE = 'suggestive'
    EROTICA = 'erotica'
    PORNOGRAPHIC = 'pornographic'
    
    CHOICES = [
        (SAFE, 'Safe'),
        (SUGGESTIVE, 'Suggestive'),
        (EROTICA, 'Erotica'),
        (PORNOGRAPHIC, 'Pornographic'),
    ]


class PublicationStatus:
    """Publication status choices for manga"""
    ONGOING = 'ongoing'
    COMPLETED = 'completed'
    HIATUS = 'hiatus'
    CANCELLED = 'cancelled'
    
    CHOICES = [
        (ONGOING, 'Ongoing'),
        (COMPLETED, 'Completed'),
        (HIATUS, 'Hiatus'),
        (CANCELLED, 'Cancelled'),
    ]


class ReadingStatus:
    """Reading status choices for user reading history"""
    READING = 'reading'
    COMPLETED = 'completed'
    DROPPED = 'dropped'
    PLAN_TO_READ = 'plan_to_read'
    ON_HOLD = 'on_hold'
    
    CHOICES = [
        (READING, 'Reading'),
        (COMPLETED, 'Completed'),
        (DROPPED, 'Dropped'),
        (PLAN_TO_READ, 'Plan to Read'),
        (ON_HOLD, 'On Hold'),
    ]


class NotificationType:
    """Notification type choices"""
    NEW_CHAPTER = 'new_chapter'
    MANGA_UPDATE = 'manga_update'
    COMMENT_REPLY = 'comment_reply'
    FAVORITE_UPDATE = 'favorite_update'
    SYSTEM_MESSAGE = 'system_message'
    RATING_LIKE = 'rating_like'
    COMMENT_LIKE = 'comment_like'
    
    CHOICES = [
        (NEW_CHAPTER, 'New Chapter'),
        (MANGA_UPDATE, 'Manga Update'),
        (COMMENT_REPLY, 'Comment Reply'),
        (FAVORITE_UPDATE, 'Favorite Update'),
        (SYSTEM_MESSAGE, 'System Message'),
        (RATING_LIKE, 'Rating Liked'),
        (COMMENT_LIKE, 'Comment Liked'),
    ]


class Priority:
    """Priority level choices"""
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'
    
    CHOICES = [
        (LOW, 'Low'),
        (MEDIUM, 'Medium'),
        (HIGH, 'High'),
    ]


class DeviceType:
    """Device type choices for analytics"""
    DESKTOP = 'desktop'
    MOBILE = 'mobile'
    TABLET = 'tablet'
    
    CHOICES = [
        (DESKTOP, 'Desktop'),
        (MOBILE, 'Mobile'),
        (TABLET, 'Tablet'),
    ]


class Gender:
    """Gender choices for user profiles"""
    MALE = 'male'
    FEMALE = 'female'
    OTHER = 'other'
    PREFER_NOT_TO_SAY = 'prefer_not_to_say'
    
    CHOICES = [
        (MALE, 'Male'),
        (FEMALE, 'Female'),
        (OTHER, 'Other'),
        (PREFER_NOT_TO_SAY, 'Prefer not to say'),
    ]


class VoteType:
    """Vote type choices for likes/dislikes"""
    LIKE = 'like'
    DISLIKE = 'dislike'
    HELPFUL = 'helpful'
    NOT_HELPFUL = 'not_helpful'
    
    LIKE_CHOICES = [
        (LIKE, 'Like'),
        (DISLIKE, 'Dislike'),
    ]
    
    HELPFUL_CHOICES = [
        (HELPFUL, 'Helpful'),
        (NOT_HELPFUL, 'Not Helpful'),
    ]


class TagType:
    """Tag type choices"""
    THEME = 'theme'
    DEMOGRAPHIC = 'demographic'
    FORMAT = 'format'
    STATUS = 'status'
    CONTENT = 'content'
    
    CHOICES = [
        (THEME, 'Theme'),
        (DEMOGRAPHIC, 'Demographic'),
        (FORMAT, 'Format'),
        (STATUS, 'Status'),
        (CONTENT, 'Content Warning'),
    ]


class DataType:
    """Data type choices for site settings"""
    STRING = 'string'
    INTEGER = 'integer'
    FLOAT = 'float'
    BOOLEAN = 'boolean'
    JSON = 'json'
    
    CHOICES = [
        (STRING, 'String'),
        (INTEGER, 'Integer'),
        (FLOAT, 'Float'),
        (BOOLEAN, 'Boolean'),
        (JSON, 'JSON'),
    ]


class ActivityType:
    """Activity log type choices"""
    USER_REGISTER = 'user_register'
    USER_LOGIN = 'user_login'
    MANGA_CREATE = 'manga_create'
    MANGA_UPDATE = 'manga_update'
    MANGA_DELETE = 'manga_delete'
    CHAPTER_PUBLISH = 'chapter_publish'
    COMMENT_CREATE = 'comment_create'
    RATING_CREATE = 'rating_create'
    ADMIN_ACTION = 'admin_action'
    SYSTEM_ERROR = 'system_error'
    
    CHOICES = [
        (USER_REGISTER, 'User Registration'),
        (USER_LOGIN, 'User Login'),
        (MANGA_CREATE, 'Manga Created'),
        (MANGA_UPDATE, 'Manga Updated'),
        (MANGA_DELETE, 'Manga Deleted'),
        (CHAPTER_PUBLISH, 'Chapter Published'),
        (COMMENT_CREATE, 'Comment Created'),
        (RATING_CREATE, 'Rating Created'),
        (ADMIN_ACTION, 'Admin Action'),
        (SYSTEM_ERROR, 'System Error'),
    ]


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def get_default_reading_preferences():
    """Get default reading preferences for user profiles"""
    return {
        'reading_direction': 'ltr',
        'page_fit': 'width',
        'reading_mode': 'single_page',
        'dark_mode': False,
        'auto_mark_read': True,
    }


def get_default_notification_settings():
    """Get default notification settings for user profiles"""
    return {
        'new_chapters': True,
        'manga_updates': True,
        'email_notifications': False,
        'comment_replies': True,
    }


def get_default_privacy_settings():
    """Get default privacy settings for user profiles"""
    return {
        'show_reading_history': True,
        'show_favorites': True,
        'allow_friend_requests': True,
    }