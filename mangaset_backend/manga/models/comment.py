# manga/models/comment.py
"""
Comment model for user comments on manga and chapters.
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from .base import TimeStampedModel


class Comment(TimeStampedModel):
    """User comments on manga and chapters"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    manga = models.ForeignKey('manga.Manga', on_delete=models.CASCADE, null=True, blank=True, related_name='comments')
    chapter = models.ForeignKey('manga.Chapter', on_delete=models.CASCADE, null=True, blank=True, related_name='comments')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    content = models.TextField(max_length=1000)
    is_spoiler = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)
    is_edited = models.BooleanField(default=False)
    is_pinned = models.BooleanField(default=False, help_text="Pinned by moderator")
    
    # Engagement
    likes_count = models.PositiveIntegerField(default=0)
    dislikes_count = models.PositiveIntegerField(default=0)
    reply_count = models.PositiveIntegerField(default=0)
    
    # Additional timestamps
    edited_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-is_pinned', '-created_at']
        indexes = [
            models.Index(fields=['manga', '-created_at']),
            models.Index(fields=['chapter', '-created_at']),
            models.Index(fields=['parent', 'created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['is_approved', '-created_at']),
            models.Index(fields=['is_spoiler', '-created_at']),
        ]
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'
    
    def save(self, *args, **kwargs):
        # Set edited timestamp if content is being updated
        if self.pk and self._state.adding is False:
            self.is_edited = True
            self.edited_at = timezone.now()
        
        # Set approved_at if being approved for first time
        if self.is_approved and not self.approved_at:
            self.approved_at = timezone.now()
        
        super().save(*args, **kwargs)
        
        # Update parent comment's reply count
        if self.parent:
            self.parent.reply_count = self.parent.replies.filter(is_approved=True).count()
            self.parent.save(update_fields=['reply_count'])
        
        # Update manga comment count
        if self.manga:
            self.manga.comment_count = self.manga.comments.filter(is_approved=True).count()
            self.manga.save(update_fields=['comment_count'])
    
    def delete(self, *args, **kwargs):
        parent = self.parent
        manga = self.manga
        
        super().delete(*args, **kwargs)
        
        # Update parent comment's reply count
        if parent:
            parent.reply_count = parent.replies.filter(is_approved=True).count()
            parent.save(update_fields=['reply_count'])
        
        # Update manga comment count
        if manga:
            manga.comment_count = manga.comments.filter(is_approved=True).count()
            manga.save(update_fields=['comment_count'])
    
    def get_replies(self):
        """Get approved replies to this comment"""
        return self.replies.filter(is_approved=True).order_by('created_at')
    
    def get_all_replies(self):
        """Get all replies (including unapproved) - for moderators"""
        return self.replies.all().order_by('created_at')
    
    def approve(self):
        """Approve this comment"""
        if not self.is_approved:
            self.is_approved = True
            self.approved_at = timezone.now()
            self.save(update_fields=['is_approved', 'approved_at'])
    
    def unapprove(self):
        """Unapprove this comment"""
        if self.is_approved:
            self.is_approved = False
            self.approved_at = None
            self.save(update_fields=['is_approved', 'approved_at'])
    
    def pin(self):
        """Pin this comment"""
        self.is_pinned = True
        self.save(update_fields=['is_pinned'])
    
    def unpin(self):
        """Unpin this comment"""
        self.is_pinned = False
        self.save(update_fields=['is_pinned'])
    
    def like(self, user):
        """Like this comment by a user"""
        from .analytics import CommentLike
        
        like, created = CommentLike.objects.get_or_create(
            user=user,
            comment=self,
            defaults={'vote_type': 'like'}
        )
        
        if not created and like.vote_type != 'like':
            like.vote_type = 'like'
            like.save()
        
        return like
    
    def dislike(self, user):
        """Dislike this comment by a user"""
        from .analytics import CommentLike
        
        like, created = CommentLike.objects.get_or_create(
            user=user,
            comment=self,
            defaults={'vote_type': 'dislike'}
        )
        
        if not created and like.vote_type != 'dislike':
            like.vote_type = 'dislike'
            like.save()
        
        return like
    
    def get_user_vote(self, user):
        """Get user's like/dislike vote for this comment"""
        if not user.is_authenticated:
            return None
        
        try:
            from .analytics import CommentLike
            return CommentLike.objects.get(user=user, comment=self)
        except CommentLike.DoesNotExist:
            return None
    
    @property
    def target_title(self):
        """Get the title of what this comment is on"""
        if self.manga:
            return self.manga.title
        elif self.chapter:
            return f"{self.chapter.manga.title} - {self.chapter.display_title}"
        return "Unknown"
    
    @property
    def engagement_score(self):
        """Calculate engagement score (likes - dislikes + replies)"""
        return self.likes_count - self.dislikes_count + self.reply_count
    
    @property
    def is_popular(self):
        """Check if comment is popular (high engagement)"""
        return self.engagement_score >= 5 or self.likes_count >= 10
    
    def get_depth(self):
        """Get nesting depth of this comment"""
        depth = 0
        current = self.parent
        while current:
            depth += 1
            current = current.parent
        return depth
    
    def can_be_edited_by(self, user):
        """Check if comment can be edited by user"""
        if not user.is_authenticated:
            return False
        
        # Author can edit their own comments
        if self.user == user:
            return True
        
        # Admins can edit any comment
        if user.is_staff or user.is_superuser:
            return True
        
        return False
    
    def can_be_deleted_by(self, user):
        """Check if comment can be deleted by user"""
        if not user.is_authenticated:
            return False
        
        # Author can delete their own comments
        if self.user == user:
            return True
        
        # Moderators can delete any comment
        if user.is_staff or user.is_superuser:
            return True
        
        return False
    
    def __str__(self):
        content_preview = self.content[:50] + "..." if len(self.content) > 50 else self.content
        return f"{self.user.username} on {self.target_title}: {content_preview}"