# manga/models/manga_rating.py
"""
Manga rating and review model.
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from .base import TimeStampedModel


class MangaRating(TimeStampedModel):
    """User ratings and reviews for manga"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='manga_ratings')
    manga = models.ForeignKey('manga.Manga', on_delete=models.CASCADE, related_name='ratings')
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Rating from 1 to 10"
    )
    review_title = models.CharField(max_length=200, blank=True)
    review_text = models.TextField(max_length=2000, blank=True)
    is_spoiler = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)
    helpful_votes = models.PositiveIntegerField(default=0)
    total_votes = models.PositiveIntegerField(default=0)
    
    # Additional fields
    would_recommend = models.BooleanField(default=True)
    favorite_aspect = models.CharField(max_length=100, blank=True, help_text="What user liked most")
    
    class Meta:
        unique_together = ['user', 'manga']
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['manga', '-rating', '-created_at']),
            models.Index(fields=['manga', 'is_approved']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['rating', '-helpful_votes']),
            models.Index(fields=['is_approved', '-created_at']),
        ]
        verbose_name = 'Manga Rating'
        verbose_name_plural = 'Manga Ratings'
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update manga's average rating
        self.manga.update_statistics()
    
    def delete(self, *args, **kwargs):
        manga = self.manga
        super().delete(*args, **kwargs)
        # Update manga's average rating after deletion
        manga.update_statistics()
    
    @property
    def helpfulness_percentage(self):
        """Calculate helpfulness percentage"""
        if self.total_votes == 0:
            return 0
        return round((self.helpful_votes / self.total_votes) * 100, 1)
    
    @property
    def has_review(self):
        """Check if rating has a text review"""
        return bool(self.review_text.strip())
    
    @property
    def review_length(self):
        """Get review text length"""
        return len(self.review_text) if self.review_text else 0
    
    @property
    def rating_stars(self):
        """Get rating as stars (for display)"""
        return '★' * self.rating + '☆' * (10 - self.rating)
    
    def mark_helpful(self, user):
        """Mark this rating as helpful by a user"""
        from .analytics import RatingHelpful
        
        helpful, created = RatingHelpful.objects.get_or_create(
            user=user,
            rating=self,
            defaults={'vote_type': 'helpful'}
        )
        
        if not created and helpful.vote_type != 'helpful':
            helpful.vote_type = 'helpful'
            helpful.save()
        
        return helpful
    
    def mark_not_helpful(self, user):
        """Mark this rating as not helpful by a user"""
        from .analytics import RatingHelpful
        
        helpful, created = RatingHelpful.objects.get_or_create(
            user=user,
            rating=self,
            defaults={'vote_type': 'not_helpful'}
        )
        
        if not created and helpful.vote_type != 'not_helpful':
            helpful.vote_type = 'not_helpful'
            helpful.save()
        
        return helpful
    
    def get_user_vote(self, user):
        """Get user's helpfulness vote for this rating"""
        if not user.is_authenticated:
            return None
        
        try:
            from .analytics import RatingHelpful
            return RatingHelpful.objects.get(user=user, rating=self)
        except RatingHelpful.DoesNotExist:
            return None
    
    def is_recent(self, days=7):
        """Check if rating was created recently"""
        from django.utils import timezone
        cutoff = timezone.now() - timezone.timedelta(days=days)
        return self.created_at >= cutoff
    
    def get_reading_time_when_rated(self):
        """Get user's reading time when they rated this manga"""
        try:
            from .reading_history import ReadingHistory
            history = ReadingHistory.objects.get(user=self.user, manga=self.manga)
            return history.total_reading_time
        except ReadingHistory.DoesNotExist:
            return 0
    
    def __str__(self):
        stars = '★' * self.rating
        return f"{self.user.username} rated {self.manga.title}: {stars} ({self.rating}/10)"