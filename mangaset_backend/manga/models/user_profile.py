# manga/models/user_profile.py
"""
Extended user profile model for additional user information.
"""

from django.db import models
from django.contrib.auth.models import User
from .base import (
    TimeStampedModel, Gender,
    get_default_reading_preferences,
    get_default_notification_settings,
    get_default_privacy_settings
)


class UserProfile(TimeStampedModel):
    """Extended user profile information"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    bio = models.TextField(max_length=500, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=Gender.CHOICES, blank=True)
    country = models.CharField(max_length=50, blank=True)
    language_preference = models.CharField(max_length=10, default='en')
    timezone = models.CharField(max_length=50, default='UTC')
    
    # Preferences stored as JSON
    reading_preferences = models.JSONField(
        default=get_default_reading_preferences, 
        help_text="User reading preferences"
    )
    notification_settings = models.JSONField(
        default=get_default_notification_settings,
        help_text="Notification preferences"
    )
    privacy_settings = models.JSONField(
        default=get_default_privacy_settings,
        help_text="Privacy settings"
    )
    
    # Verification and status
    is_verified = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    premium_expires_at = models.DateTimeField(null=True, blank=True)
    
    # Additional metadata
    total_reading_time = models.PositiveIntegerField(default=0, help_text="Total reading time in seconds")
    favorite_genres = models.ManyToManyField('manga.Genre', blank=True, help_text="User's preferred genres")
    
    class Meta:
        indexes = [
            models.Index(fields=['user', 'is_verified']),
            models.Index(fields=['country']),
            models.Index(fields=['is_premium', 'premium_expires_at']),
            models.Index(fields=['language_preference']),
        ]
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
    
    def get_reading_preferences(self):
        """Get reading preferences with defaults"""
        defaults = get_default_reading_preferences()
        return {**defaults, **self.reading_preferences}
    
    def get_notification_settings(self):
        """Get notification settings with defaults"""
        defaults = get_default_notification_settings()
        return {**defaults, **self.notification_settings}
    
    def get_privacy_settings(self):
        """Get privacy settings with defaults"""
        defaults = get_default_privacy_settings()
        return {**defaults, **self.privacy_settings}
    
    def update_reading_preference(self, key, value):
        """Update a specific reading preference"""
        self.reading_preferences[key] = value
        self.save(update_fields=['reading_preferences'])
    
    def update_notification_setting(self, key, value):
        """Update a specific notification setting"""
        self.notification_settings[key] = value
        self.save(update_fields=['notification_settings'])
    
    def update_privacy_setting(self, key, value):
        """Update a specific privacy setting"""
        self.privacy_settings[key] = value
        self.save(update_fields=['privacy_settings'])
    
    def is_premium_active(self):
        """Check if user has active premium subscription"""
        if not self.is_premium:
            return False
        
        if self.premium_expires_at:
            from django.utils import timezone
            return timezone.now() < self.premium_expires_at
        
        return True  # No expiration set
    
    def get_age(self):
        """Get user's age if date of birth is provided"""
        if not self.date_of_birth:
            return None
        
        from django.utils import timezone
        today = timezone.now().date()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )
    
    def get_reading_stats(self):
        """Get comprehensive reading statistics"""
        from .reading_history import ReadingHistory
        from .user_favorite import UserFavorite
        from .manga_rating import MangaRating
        from .comment import Comment
        
        reading_history = ReadingHistory.objects.filter(user=self.user)
        
        return {
            'total_manga_read': reading_history.count(),
            'currently_reading': reading_history.filter(reading_status='reading').count(),
            'completed': reading_history.filter(reading_status='completed').count(),
            'dropped': reading_history.filter(reading_status='dropped').count(),
            'plan_to_read': reading_history.filter(reading_status='plan_to_read').count(),
            'on_hold': reading_history.filter(reading_status='on_hold').count(),
            'total_favorites': UserFavorite.objects.filter(user=self.user).count(),
            'total_ratings': MangaRating.objects.filter(user=self.user).count(),
            'total_comments': Comment.objects.filter(user=self.user, is_approved=True).count(),
            'total_reading_time': self.total_reading_time,
            'average_rating_given': MangaRating.objects.filter(user=self.user).aggregate(
                avg=models.Avg('rating')
            )['avg'] or 0,
        }
    
    def get_favorite_genres_list(self):
        """Get list of user's favorite genres"""
        return list(self.favorite_genres.all().order_by('name'))
    
    def add_favorite_genre(self, genre):
        """Add a genre to user's favorites"""
        self.favorite_genres.add(genre)
    
    def remove_favorite_genre(self, genre):
        """Remove a genre from user's favorites"""
        self.favorite_genres.remove(genre)
    
    def get_recommended_manga(self, limit=10):
        """Get personalized manga recommendations"""
        from .utils import get_user_recommendations
        return get_user_recommendations(self.user, limit)
    
    def can_access_premium_content(self):
        """Check if user can access premium content"""
        return self.is_premium_active()
    
    def __str__(self):
        return f"{self.user.username}'s Profile"