# manga/models/signals.py
"""
Django signals for maintaining data consistency across models.
"""

from django.db.models.signals import post_save, post_delete, pre_delete
from django.dispatch import receiver
from django.contrib.auth.models import User


def connect_all_signals():
    """Connect all signal handlers - called from __init__.py"""
    pass  # Signals are auto-connected when this module is imported


# ============================================================================
# USER PROFILE SIGNALS
# ============================================================================

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create UserProfile when User is created"""
    if created:
        from .user_profile import UserProfile
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save UserProfile when User is saved"""
    if hasattr(instance, 'profile'):
        instance.profile.save()


# ============================================================================
# MANGA-GENRE RELATIONSHIP SIGNALS
# ============================================================================

@receiver(post_save, sender='manga.MangaGenre')
def update_genre_manga_count(sender, instance, created, **kwargs):
    """Update genre manga count when MangaGenre is created"""
    if created:
        instance.genre.update_manga_count()


@receiver(post_delete, sender='manga.MangaGenre')
def update_genre_manga_count_on_delete(sender, instance, **kwargs):
    """Update genre manga count when MangaGenre is deleted"""
    instance.genre.update_manga_count()


# ============================================================================
# MANGA-TAG RELATIONSHIP SIGNALS
# ============================================================================

@receiver(post_save, sender='manga.MangaTag')
def update_tag_usage_count(sender, instance, created, **kwargs):
    """Update tag usage count when MangaTag is created"""
    if created:
        instance.tag.update_usage_count()


@receiver(post_delete, sender='manga.MangaTag')
def update_tag_usage_count_on_delete(sender, instance, **kwargs):
    """Update tag usage count when MangaTag is deleted"""
    instance.tag.update_usage_count()


# ============================================================================
# CHAPTER VIEW SIGNALS
# ============================================================================

@receiver(post_save, sender='manga.ChapterView')
def update_chapter_view_count(sender, instance, created, **kwargs):
    """Update chapter view count when ChapterView is created"""
    if created:
        # These updates are handled in the ChapterView.save() method
        # to avoid duplicate database calls
        pass


# ============================================================================
# FAVORITES SIGNALS
# ============================================================================

@receiver(post_save, sender='manga.UserFavorite')
def update_manga_favorite_count(sender, instance, created, **kwargs):
    """Update manga favorite count when favorite is added"""
    if created:
        # This is handled in UserFavorite.save() method
        pass


@receiver(post_delete, sender='manga.UserFavorite')
def update_manga_favorite_count_on_delete(sender, instance, **kwargs):
    """Update manga favorite count when favorite is removed"""
    # This is handled in UserFavorite.delete() method
    pass


# ============================================================================
# COMMENT SIGNALS
# ============================================================================

@receiver(post_save, sender='manga.Comment')
def handle_comment_creation(sender, instance, created, **kwargs):
    """Handle comment creation and updates"""
    if created:
        # Create notification for comment reply
        if instance.parent and instance.parent.user != instance.user:
            from .notification import Notification
            from .base import NotificationType, Priority
            
            Notification.objects.create(
                user=instance.parent.user,
                manga=instance.manga,
                chapter=instance.chapter,
                type=NotificationType.COMMENT_REPLY,
                title='Someone replied to your comment',
                message=f'{instance.user.username} replied to your comment on {instance.target_title}',
                action_url=f"{instance.manga.get_absolute_url() if instance.manga else instance.chapter.get_absolute_url()}#comment-{instance.id}",
                priority=Priority.MEDIUM
            )


@receiver(post_delete, sender='manga.Comment')
def update_comment_count_on_delete(sender, instance, **kwargs):
    """Update comment count when comment is deleted"""
    # This is handled in Comment.delete() method
    pass


# ============================================================================
# CHAPTER PUBLICATION SIGNALS
# ============================================================================

@receiver(post_save, sender='manga.Chapter')
def handle_chapter_publication(sender, instance, created, **kwargs):
    """Handle chapter publication and notifications"""
    if instance.is_published and (created or 'is_published' in (kwargs.get('update_fields', []))):
        # Create notifications for users who favorited this manga
        from .notification import Notification
        
        # This is handled more efficiently in the Notification.create_new_chapter_notification method
        # which uses bulk_create for better performance
        favorite_users = User.objects.filter(
            favorites__manga=instance.manga,
            favorites__notification_enabled=True
        ).distinct()
        
        if favorite_users.exists():
            Notification.create_new_chapter_notification(instance, favorite_users)


# ============================================================================
# MANGA DELETION CLEANUP SIGNALS
# ============================================================================

@receiver(pre_delete, sender='manga.Manga')
def cleanup_manga_related_data(sender, instance, **kwargs):
    """Clean up related data when manga is deleted"""
    from .notification import Notification
    from .analytics import ChapterView
    from .admin_models import ActivityLog
    from .base import ActivityType
    
    # Delete all related notifications
    Notification.objects.filter(manga=instance).delete()
    
    # Delete all chapter views for this manga
    ChapterView.objects.filter(chapter__manga=instance).delete()
    
    # Log the deletion
    ActivityLog.log(
        action_type=ActivityType.MANGA_DELETE,
        description=f'Manga "{instance.title}" was deleted',
        manga=None,  # Will be null after deletion
        metadata={
            'manga_title': instance.title, 
            'manga_id': instance.id,
            'total_chapters': instance.total_chapters,
            'view_count': instance.view_count
        },
        severity='warning'
    )


# ============================================================================
# RATING SIGNALS
# ============================================================================

@receiver(post_save, sender='manga.MangaRating')
def handle_rating_creation(sender, instance, created, **kwargs):
    """Handle rating creation"""
    if created:
        from .admin_models import ActivityLog
        from .base import ActivityType
        
        # Log rating creation
        ActivityLog.log(
            action_type=ActivityType.RATING_CREATE,
            description=f'{instance.user.username} rated {instance.manga.title}: {instance.rating}/10',
            user=instance.user,
            manga=instance.manga,
            metadata={'rating': instance.rating, 'has_review': bool(instance.review_text)}
        )


# ============================================================================
# USER ACTIVITY TRACKING SIGNALS
# ============================================================================

# manga/models/signals.py - SOLUTION 1 (RECOMMANDÉE)

# Remplacer cette fonction:
@receiver(post_save, sender=User)
def log_user_registration(sender, instance, created, **kwargs):
    """Log user registration"""
    if created:
        from .admin_models import ActivityLog
        from .base import ActivityType
        
        ActivityLog.log(
            action_type=ActivityType.USER_REGISTER,
            description=f'New user registered: {instance.username}',
            user=instance,
            user_agent='Django System',  # ✅ AJOUT: user_agent par défaut
            metadata={'email': instance.email}
        )


# ============================================================================
# CACHE INVALIDATION SIGNALS
# ============================================================================

@receiver(post_save, sender='manga.Manga')
def invalidate_manga_cache(sender, instance, **kwargs):
    """Invalidate cache when manga is updated"""
    from .utils import invalidate_manga_cache
    invalidate_manga_cache(instance.id)


@receiver(post_save, sender='manga.Chapter')
def invalidate_chapter_cache(sender, instance, **kwargs):
    """Invalidate cache when chapter is updated"""
    if instance.is_published:
        from .utils import invalidate_manga_cache
        invalidate_manga_cache(instance.manga.id)


# ============================================================================
# AUTOMATIC TRENDING CALCULATION
# ============================================================================

@receiver(post_save, sender='manga.ChapterView')
def update_trending_status(sender, instance, created, **kwargs):
    """Update manga trending status based on recent views"""
    if created:
        from django.utils import timezone
        from django.db.models import Count
        
        # Check views in last 24 hours
        cutoff = timezone.now() - timezone.timedelta(hours=24)
        recent_views = instance.chapter.manga.chapters.filter(
            views__created_at__gte=cutoff
        ).aggregate(
            total_views=Count('views')
        )['total_views'] or 0
        
        # Mark as trending if more than 100 views in 24 hours
        should_be_trending = recent_views > 100
        
        if instance.chapter.manga.is_trending != should_be_trending:
            instance.chapter.manga.is_trending = should_be_trending
            instance.chapter.manga.save(update_fields=['is_trending'])