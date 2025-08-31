# manga/models/user_favorite.py
"""
User favorite manga model for tracking user's favorite manga.
"""

from django.db import models
from django.contrib.auth.models import User
from .base import TimeStampedModel


class UserFavorite(TimeStampedModel):
    """User's favorite manga"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    manga = models.ForeignKey('manga.Manga', on_delete=models.CASCADE, related_name='user_favorites')
    added_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(max_length=500, blank=True)
    notification_enabled = models.BooleanField(default=True)
    is_private = models.BooleanField(default=False)
    
    # Custom fields
    priority = models.PositiveIntegerField(
        default=0, 
        help_text="Priority order for user (0=highest priority)"
    )
    tags = models.JSONField(
        default=list,
        help_text="Custom tags added by user"
    )
    
    # Remove created_at from TimeStampedModel since we have added_at
    created_at = None
    
    class Meta:
        unique_together = ['user', 'manga']
        ordering = ['-added_at']
        indexes = [
            models.Index(fields=['user', '-added_at']),
            models.Index(fields=['manga', '-added_at']),
            models.Index(fields=['user', 'is_private']),
            models.Index(fields=['user', 'notification_enabled']),
            models.Index(fields=['user', 'priority', '-added_at']),
        ]
        verbose_name = 'User Favorite'
        verbose_name_plural = 'User Favorites'
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update manga's favorite count
        self.manga.favorite_count = self.manga.user_favorites.count()
        self.manga.save(update_fields=['favorite_count'])
    
    def delete(self, *args, **kwargs):
        manga = self.manga
        super().delete(*args, **kwargs)
        # Update manga's favorite count after deletion
        manga.favorite_count = manga.user_favorites.count()
        manga.save(update_fields=['favorite_count'])
    
    def add_custom_tag(self, tag):
        """Add a custom tag to this favorite"""
        if tag and tag not in self.tags:
            self.tags.append(tag)
            self.save(update_fields=['tags'])
    
    def remove_custom_tag(self, tag):
        """Remove a custom tag from this favorite"""
        if tag in self.tags:
            self.tags.remove(tag)
            self.save(update_fields=['tags'])
    
    def toggle_notifications(self):
        """Toggle notification setting for this favorite"""
        self.notification_enabled = not self.notification_enabled
        self.save(update_fields=['notification_enabled'])
    
    def toggle_privacy(self):
        """Toggle privacy setting for this favorite"""
        self.is_private = not self.is_private
        self.save(update_fields=['is_private'])
    
    def set_priority(self, priority):
        """Set priority for this favorite"""
        self.priority = max(0, priority)
        self.save(update_fields=['priority'])
    
    def get_reading_status(self):
        """Get user's reading status for this manga"""
        try:
            from .reading_history import ReadingHistory
            history = ReadingHistory.objects.get(user=self.user, manga=self.manga)
            return history.reading_status
        except ReadingHistory.DoesNotExist:
            return None
    
    def get_last_read_chapter(self):
        """Get the last chapter the user read"""
        try:
            from .reading_history import ReadingHistory
            history = ReadingHistory.objects.get(user=self.user, manga=self.manga)
            return history.chapter
        except ReadingHistory.DoesNotExist:
            return None
    
    def has_unread_chapters(self):
        """Check if there are unread chapters since user last read"""
        last_chapter = self.get_last_read_chapter()
        if not last_chapter:
            # User hasn't started reading, check if there are published chapters
            return self.manga.chapters.filter(is_published=True).exists()
        
        # Check if there are chapters after the last read chapter
        return self.manga.chapters.filter(
            is_published=True,
            chapter_number__gt=last_chapter.chapter_number
        ).exists()
    
    def get_unread_chapters_count(self):
        """Get count of unread chapters"""
        last_chapter = self.get_last_read_chapter()
        if not last_chapter:
            return self.manga.chapters.filter(is_published=True).count()
        
        return self.manga.chapters.filter(
            is_published=True,
            chapter_number__gt=last_chapter.chapter_number
        ).count()
    
    def get_next_chapter_to_read(self):
        """Get the next chapter user should read"""
        last_chapter = self.get_last_read_chapter()
        if not last_chapter:
            # Start from the beginning
            return self.manga.chapters.filter(is_published=True).order_by('chapter_number').first()
        
        # Get next chapter after last read
        return self.manga.chapters.filter(
            is_published=True,
            chapter_number__gt=last_chapter.chapter_number
        ).order_by('chapter_number').first()
    
    def __str__(self):
        private_indicator = " (Private)" if self.is_private else ""
        return f"{self.user.username} - {self.manga.title}{private_indicator}"