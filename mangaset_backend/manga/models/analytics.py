# manga/models/analytics.py
"""
Analytics models for tracking user behavior and engagement.
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from .base import TimeStampedModel, DeviceType, VoteType


class ChapterView(models.Model):
    """Track chapter views for analytics"""
    
    chapter = models.ForeignKey('manga.Chapter', on_delete=models.CASCADE, related_name='views')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='chapter_views')
    
    # Analytics data
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(max_length=500, blank=True)
    referrer = models.URLField(blank=True)
    session_id = models.CharField(max_length=100, blank=True)
    
    # Reading behavior
    pages_viewed = models.PositiveIntegerField(default=0)
    reading_time = models.PositiveIntegerField(default=0, help_text="Reading time in seconds")
    device_type = models.CharField(max_length=20, choices=DeviceType.CHOICES, default=DeviceType.DESKTOP)
    
    # Geographic data
    country_code = models.CharField(max_length=2, blank=True)
    region = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['chapter', '-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['ip_address', '-created_at']),
            models.Index(fields=['device_type', '-created_at']),
            models.Index(fields=['country_code', '-created_at']),
        ]
        verbose_name = 'Chapter View'
        verbose_name_plural = 'Chapter Views'
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # Update chapter view count
        self.chapter.view_count += 1
        self.chapter.save(update_fields=['view_count'])
        
        # Update manga view count
        self.chapter.manga.view_count += 1
        self.chapter.manga.save(update_fields=['view_count'])
    
    @property
    def reading_time_formatted(self):
        """Get formatted reading time"""
        minutes = self.reading_time // 60
        seconds = self.reading_time % 60
        return f"{minutes}m {seconds}s" if minutes > 0 else f"{seconds}s"
    
    def __str__(self):
        user_info = self.user.username if self.user else f"Anonymous ({self.ip_address})"
        return f"{user_info} viewed {self.chapter}"


class BookmarkPage(TimeStampedModel):
    """Allow users to bookmark specific pages in chapters"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarked_pages')
    chapter = models.ForeignKey('manga.Chapter', on_delete=models.CASCADE, related_name='bookmarked_pages')
    page_number = models.PositiveIntegerField()
    note = models.TextField(max_length=200, blank=True)
    is_private = models.BooleanField(default=False)
    
    # Additional fields
    bookmark_type = models.CharField(max_length=20, choices=[
        ('favorite_scene', 'Favorite Scene'),
        ('important_plot', 'Important Plot Point'),
        ('funny_moment', 'Funny Moment'),
        ('character_development', 'Character Development'),
        ('other', 'Other'),
    ], default='other')
    
    class Meta:
        unique_together = ['user', 'chapter', 'page_number']
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['chapter', 'page_number']),
            models.Index(fields=['user', 'bookmark_type']),
        ]
        verbose_name = 'Bookmarked Page'
        verbose_name_plural = 'Bookmarked Pages'
    
    def get_page_url(self):
        """Get URL to the bookmarked page"""
        return f"{self.chapter.get_absolute_url()}#page-{self.page_number}"
    
    def __str__(self):
        return f"{self.user.username} bookmarked {self.chapter} page {self.page_number}"


class CommentLike(TimeStampedModel):
    """Track likes/dislikes on comments"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comment_votes')
    comment = models.ForeignKey('manga.Comment', on_delete=models.CASCADE, related_name='votes')
    vote_type = models.CharField(max_length=10, choices=VoteType.LIKE_CHOICES)
    
    # Only need created_at
    updated_at = None
    
    class Meta:
        unique_together = ['user', 'comment']
        indexes = [
            models.Index(fields=['comment', 'vote_type']),
            models.Index(fields=['user', '-created_at']),
        ]
        verbose_name = 'Comment Like'
        verbose_name_plural = 'Comment Likes'
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.update_comment_counts()
    
    def delete(self, *args, **kwargs):
        comment = self.comment
        super().delete(*args, **kwargs)
        self.update_comment_counts(comment)
    
    def update_comment_counts(self, comment=None):
        """Update the comment's like/dislike counts"""
        if not comment:
            comment = self.comment
            
        likes = comment.votes.filter(vote_type=VoteType.LIKE).count()
        dislikes = comment.votes.filter(vote_type=VoteType.DISLIKE).count()
        
        comment.likes_count = likes
        comment.dislikes_count = dislikes
        comment.save(update_fields=['likes_count', 'dislikes_count'])
    
    def __str__(self):
        return f"{self.user.username} {self.vote_type}d comment by {self.comment.user.username}"


class RatingHelpful(TimeStampedModel):
    """Track helpful votes on manga ratings"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rating_votes')
    rating = models.ForeignKey('manga.MangaRating', on_delete=models.CASCADE, related_name='helpfulness_votes')
    vote_type = models.CharField(max_length=15, choices=VoteType.HELPFUL_CHOICES)
    
    # Only need created_at
    updated_at = None
    
    class Meta:
        unique_together = ['user', 'rating']
        indexes = [
            models.Index(fields=['rating', 'vote_type']),
            models.Index(fields=['user', '-created_at']),
        ]
        verbose_name = 'Rating Helpfulness Vote'
        verbose_name_plural = 'Rating Helpfulness Votes'
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.update_rating_counts()
    
    def delete(self, *args, **kwargs):
        rating = self.rating
        super().delete(*args, **kwargs)
        self.update_rating_counts(rating)
    
    def update_rating_counts(self, rating=None):
        """Update the rating's helpful vote counts"""
        if not rating:
            rating = self.rating
            
        helpful = rating.helpfulness_votes.filter(vote_type=VoteType.HELPFUL).count()
        total = rating.helpfulness_votes.count()
        
        rating.helpful_votes = helpful
        rating.total_votes = total
        rating.save(update_fields=['helpful_votes', 'total_votes'])
    
    def __str__(self):
        return f"{self.user.username} found {self.rating.user.username}'s review {self.vote_type}"