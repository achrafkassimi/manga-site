# manga/models/manga.py
"""
Main Manga model and related junction tables.
"""

from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from .base import (
    TimeStampedModel, SluggedModel, ViewCountMixin, RatingMixin,
    ContentRating, PublicationStatus
)
from .genre import Genre
from .tag import Tag


class Manga(SluggedModel, TimeStampedModel, ViewCountMixin, RatingMixin):
    """Main manga model with comprehensive metadata"""
    
    # Basic Information
    title = models.CharField(max_length=200, db_index=True)
    alternative_titles = models.JSONField(default=dict, help_text="Alternative titles in different languages")
    description = models.TextField()
    synopsis = models.TextField(blank=True, help_text="Short summary")
    author = models.CharField(max_length=100, db_index=True)
    artist = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=PublicationStatus.CHOICES, default=PublicationStatus.ONGOING)
    publication_year = models.PositiveIntegerField(null=True, blank=True)
    serialization = models.CharField(max_length=100, blank=True, help_text="Magazine or platform")
    original_language = models.CharField(max_length=10, default='ja')
    content_rating = models.CharField(max_length=20, choices=ContentRating.CHOICES, default=ContentRating.SAFE)
    
    # Images
    cover_image = models.ImageField(upload_to='manga/covers/', blank=True)
    banner_image = models.ImageField(upload_to='manga/banners/', blank=True)
    thumbnail = models.ImageField(upload_to='manga/thumbnails/', blank=True)
    
    # Metadata (from RatingMixin: average_rating, total_ratings)
    # (from ViewCountMixin: view_count)
    total_chapters = models.PositiveIntegerField(default=0)
    total_volumes = models.PositiveIntegerField(default=0)
    favorite_count = models.PositiveIntegerField(default=0)
    bookmark_count = models.PositiveIntegerField(default=0)
    comment_count = models.PositiveIntegerField(default=0)
    
    # Features
    is_featured = models.BooleanField(default=False)
    is_popular = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    is_official = models.BooleanField(default=False)
    
    # External data
    external_id = models.CharField(max_length=100, blank=True, help_text="External API ID (e.g., MangaDex)")
    external_source = models.CharField(max_length=50, blank=True)
    original_source_url = models.URLField(blank=True)
    last_external_sync = models.DateTimeField(null=True, blank=True)
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(max_length=300, blank=True)
    keywords = models.CharField(max_length=500, blank=True)
    
    # Relationships
    genres = models.ManyToManyField(Genre, through='MangaGenre', blank=True)
    tags = models.ManyToManyField(Tag, through='MangaTag', blank=True)
    
    # Additional timestamp
    last_chapter_added = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['author']),
            models.Index(fields=['status', 'is_featured']),
            models.Index(fields=['-average_rating', '-view_count']),
            models.Index(fields=['-updated_at']),
            models.Index(fields=['is_popular', 'is_trending']),
            models.Index(fields=['external_id', 'external_source']),
            models.Index(fields=['is_featured', '-updated_at']),
            models.Index(fields=['status', 'is_completed']),
        ]
        verbose_name = 'Manga'
        verbose_name_plural = 'Manga'
    
    def save(self, *args, **kwargs):
        # Auto-set completed status based on status field
        self.is_completed = (self.status == PublicationStatus.COMPLETED)
        
        # Set meta_title if not provided
        if not self.meta_title:
            self.meta_title = self.title
        
        # Set synopsis if not provided (truncated description)
        if not self.synopsis and self.description:
            self.synopsis = self.description[:200] + '...' if len(self.description) > 200 else self.description
        
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('manga-detail', kwargs={'slug': self.slug})
    
    def update_statistics(self):
        """Update calculated fields based on related data"""
        self.total_chapters = self.chapters.filter(is_published=True).count()
        self.favorite_count = self.user_favorites.count()
        self.comment_count = self.comments.filter(is_approved=True).count()
        
        # Update average rating (from RatingMixin)
        self.calculate_average_rating()
        
        self.save(update_fields=[
            'total_chapters', 'favorite_count', 'comment_count',
            'average_rating', 'total_ratings'
        ])
    
    def get_latest_chapter(self):
        """Get the most recent published chapter"""
        return self.chapters.filter(is_published=True).order_by('-chapter_number').first()
    
    def get_chapter_list(self):
        """Get all published chapters ordered by chapter number"""
        return self.chapters.filter(is_published=True).order_by('chapter_number')
    
    def is_favorited_by(self, user):
        """Check if manga is favorited by a specific user"""
        if not user.is_authenticated:
            return False
        return self.user_favorites.filter(user=user).exists()
    
    @property
    def primary_genre(self):
        """Get the primary genre for this manga"""
        primary = self.manga_genres.filter(is_primary=True).first()
        return primary.genre if primary else None
    
    @property
    def genre_list(self):
        """Get list of all genres"""
        return [mg.genre for mg in self.manga_genres.all()]
    
    @property
    def tag_list(self):
        """Get list of all tags"""
        return [mt.tag for mt in self.manga_tags.all()]
    
    def get_reading_progress(self, user):
        """Get reading progress for a specific user"""
        if not user.is_authenticated:
            return None
        
        try:
            from .reading_history import ReadingHistory
            return ReadingHistory.objects.get(user=user, manga=self)
        except ReadingHistory.DoesNotExist:
            return None
    
    def get_user_rating(self, user):
        """Get user's rating for this manga"""
        if not user.is_authenticated:
            return None
        
        try:
            from .manga_rating import MangaRating
            return MangaRating.objects.get(user=user, manga=self)
        except MangaRating.DoesNotExist:
            return None
    
    def get_completion_percentage(self):
        """Get completion percentage based on status"""
        if self.status == PublicationStatus.COMPLETED:
            return 100
        elif self.status == PublicationStatus.CANCELLED:
            return 0
        else:
            # For ongoing/hiatus, we can't determine completion
            return None
    
    def __str__(self):
        return self.title


class MangaGenre(TimeStampedModel):
    """Junction table for Manga-Genre many-to-many relationship"""
    manga = models.ForeignKey(Manga, on_delete=models.CASCADE, related_name='manga_genres')
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE, related_name='manga_genres')
    is_primary = models.BooleanField(default=False, help_text="Main genre for this manga")
    
    # Only need created_at from TimeStampedModel
    updated_at = None
    
    class Meta:
        unique_together = ['manga', 'genre']
        indexes = [
            models.Index(fields=['manga', 'is_primary']),
            models.Index(fields=['genre', 'is_primary']),
            models.Index(fields=['manga', 'genre']),
        ]
        verbose_name = 'Manga Genre'
        verbose_name_plural = 'Manga Genres'
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update genre manga count
        self.genre.update_manga_count()
    
    def delete(self, *args, **kwargs):
        genre = self.genre
        super().delete(*args, **kwargs)
        # Update genre manga count after deletion
        genre.update_manga_count()
    
    def __str__(self):
        primary_indicator = " (Primary)" if self.is_primary else ""
        return f"{self.manga.title} - {self.genre.name}{primary_indicator}"


class MangaTag(TimeStampedModel):
    """Junction table for Manga-Tag many-to-many relationship"""
    manga = models.ForeignKey(Manga, on_delete=models.CASCADE, related_name='manga_tags')
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name='manga_tags')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Only need created_at from TimeStampedModel
    updated_at = None
    
    class Meta:
        unique_together = ['manga', 'tag']
        indexes = [
            models.Index(fields=['manga']),
            models.Index(fields=['tag']),
            models.Index(fields=['manga', 'tag']),
            models.Index(fields=['created_by', 'tag']),
        ]
        verbose_name = 'Manga Tag'
        verbose_name_plural = 'Manga Tags'
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update tag usage count
        self.tag.update_usage_count()
    
    def delete(self, *args, **kwargs):
        tag = self.tag
        super().delete(*args, **kwargs)
        # Update tag usage count after deletion
        tag.update_usage_count()
    
    def __str__(self):
        creator_info = f" (by {self.created_by.username})" if self.created_by else ""
        return f"{self.manga.title} - {self.tag.name}{creator_info}"