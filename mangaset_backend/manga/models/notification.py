# manga/models/notification.py
"""
Notification model for user notifications.
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from .base import TimeStampedModel, NotificationType, Priority


class Notification(TimeStampedModel):
    """User notifications for updates and activities"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    manga = models.ForeignKey('manga.Manga', on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    chapter = models.ForeignKey('manga.Chapter', on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    
    type = models.CharField(max_length=50, choices=NotificationType.CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField(max_length=500)
    action_url = models.CharField(max_length=500, blank=True)
    
    is_read = models.BooleanField(default=False)
    is_email_sent = models.BooleanField(default=False)
    priority = models.CharField(max_length=20, choices=Priority.CHOICES, default=Priority.MEDIUM)
    
    read_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read', '-created_at']),
            models.Index(fields=['-created_at', 'expires_at']),
            models.Index(fields=['type', '-created_at']),
            models.Index(fields=['user', 'type', 'is_read']),
            models.Index(fields=['priority', '-created_at']),
        ]
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
    
    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])
    
    def mark_as_unread(self):
        """Mark notification as unread"""
        if self.is_read:
            self.is_read = False
            self.read_at = None
            self.save(update_fields=['is_read', 'read_at'])
    
    def is_expired(self):
        """Check if notification is expired"""
        return self.expires_at and timezone.now() > self.expires_at
    
    def set_expiry(self, hours=24):
        """Set expiry time for notification"""
        self.expires_at = timezone.now() + timezone.timedelta(hours=hours)
        self.save(update_fields=['expires_at'])
    
    def mark_email_sent(self):
        """Mark that email notification was sent"""
        self.is_email_sent = True
        self.save(update_fields=['is_email_sent'])
    
    @property
    def target_title(self):
        """Get the title of what this notification is about"""
        if self.manga:
            return self.manga.title
        elif self.chapter:
            return f"{self.chapter.manga.title} - {self.chapter.display_title}"
        return "System"
    
    @property
    def age_in_hours(self):
        """Get notification age in hours"""
        return (timezone.now() - self.created_at).total_seconds() / 3600
    
    @property
    def is_recent(self):
        """Check if notification is recent (less than 1 hour old)"""
        return self.age_in_hours < 1
    
    def get_icon(self):
        """Get appropriate icon for notification type"""
        icons = {
            NotificationType.NEW_CHAPTER: 'fas fa-plus-circle',
            NotificationType.MANGA_UPDATE: 'fas fa-edit',
            NotificationType.COMMENT_REPLY: 'fas fa-reply',
            NotificationType.FAVORITE_UPDATE: 'fas fa-heart',
            NotificationType.SYSTEM_MESSAGE: 'fas fa-cog',
            NotificationType.RATING_LIKE: 'fas fa-thumbs-up',
            NotificationType.COMMENT_LIKE: 'fas fa-heart',
        }
        return icons.get(self.type, 'fas fa-bell')
    
    def get_color_class(self):
        """Get Bootstrap color class for notification"""
        colors = {
            Priority.LOW: 'info',
            Priority.MEDIUM: 'primary',
            Priority.HIGH: 'warning',
        }
        return colors.get(self.priority, 'secondary')
    
    @classmethod
    def create_new_chapter_notification(cls, chapter, users=None):
        """Create new chapter notifications for users"""
        if not users:
            # Get users who have this manga favorited with notifications enabled
            from .user_favorite import UserFavorite
            users = User.objects.filter(
                favorites__manga=chapter.manga,
                favorites__notification_enabled=True
            ).distinct()
        
        notifications = []
        for user in users:
            notifications.append(
                cls(
                    user=user,
                    manga=chapter.manga,
                    chapter=chapter,
                    type=NotificationType.NEW_CHAPTER,
                    title='New chapter available!',
                    message=f'{chapter.manga.title} - {chapter.display_title} is now available.',
                    action_url=chapter.get_absolute_url(),
                    priority=Priority.MEDIUM
                )
            )
        
        return cls.objects.bulk_create(notifications)
    
    @classmethod
    def cleanup_old_notifications(cls, days=30):
        """Clean up old read notifications"""
        cutoff_date = timezone.now() - timezone.timedelta(days=days)
        deleted_count, _ = cls.objects.filter(
            is_read=True,
            read_at__lt=cutoff_date
        ).delete()
        return deleted_count
    
    def __str__(self):
        read_status = "Read" if self.is_read else "Unread"
        return f"{self.user.username}: {self.title} ({read_status})"