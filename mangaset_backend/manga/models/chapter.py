# manga/models/chapter.py
"""
Chapter model for individual manga chapters.
"""

from django.db import models
from django.urls import reverse
from django.utils import timezone
from decimal import Decimal
from .base import TimeStampedModel, SluggedModel, ViewCountMixin


class Chapter(SluggedModel, TimeStampedModel, ViewCountMixin):
    """Individual manga chapters"""
    
    manga = models.ForeignKey('manga.Manga', on_delete=models.CASCADE, related_name='chapters')
    chapter_number = models.DecimalField(
        max_digits=6, 
        decimal_places=2, 
        help_text="Allows fractional chapters like 1.5"
    )
    volume_number = models.PositiveIntegerField(null=True, blank=True)
    title = models.CharField(max_length=200, blank=True)
    pages = models.JSONField(default=list, help_text="Array of image URLs or file paths")
    page_count = models.PositiveIntegerField(default=0)
    size_mb = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    # Status
    is_published = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    unlock_date = models.DateTimeField(null=True, blank=True)
    
    # Analytics (view_count from ViewCountMixin)
    unique_views = models.PositiveIntegerField(default=0)
    reading_time_avg = models.PositiveIntegerField(default=0, help_text="Average reading time in seconds")
    
    # External
    external_id = models.CharField(max_length=100, blank=True)
    external_source = models.CharField(max_length=50, blank=True)
    original_url = models.URLField(blank=True)
    
    # Publishing
    release_date = models.DateTimeField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    scheduled_release = models.DateTimeField(null=True, blank=True)
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(max_length=300, blank=True)
    
    class Meta:
        unique_together = ['manga', 'chapter_number']
        ordering = ['manga', 'chapter_number']
        indexes = [
            models.Index(fields=['manga', 'chapter_number', 'is_published']),
            models.Index(fields=['is_published', 'release_date']),
            models.Index(fields=['manga', 'is_published', '-chapter_number']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['manga', '-published_at']),
            models.Index(fields=['is_published', '-published_at']),
            models.Index(fields=['scheduled_release']),
        ]
        verbose_name = 'Chapter'
        verbose_name_plural = 'Chapters'
    
    def save(self, *args, **kwargs):
        # Auto-generate slug if not provided
        if not self.slug:
            base_slug = f"{self.manga.slug}-chapter-{self.chapter_number}"
            self.slug = base_slug.replace('.', '-')
        
        # Auto-set page count based on pages array
        if isinstance(self.pages, list):
            self.page_count = len(self.pages)
        
        # Set published_at when first published
        if self.is_published and not self.published_at:
            self.published_at = timezone.now()
        
        # Set release_date if not provided
        if self.is_published and not self.release_date:
            self.release_date = timezone.now()
        
        # Set meta_title if not provided
        if not self.meta_title:
            self.meta_title = f"{self.manga.title} - {self.display_title}"
        
        super().save(*args, **kwargs)
        
        # Update manga's last chapter added timestamp
        if self.is_published:
            self.manga.last_chapter_added = timezone.now()
            self.manga.save(update_fields=['last_chapter_added'])
    
    def get_absolute_url(self):
        return reverse('chapter-read', kwargs={
            'manga_slug': self.manga.slug, 
            'chapter_number': str(self.chapter_number).replace('.', '-')
        })
    
    def get_next_chapter(self):
        """Get the next published chapter"""
        return Chapter.objects.filter(
            manga=self.manga,
            chapter_number__gt=self.chapter_number,
            is_published=True
        ).order_by('chapter_number').first()
    
    def get_previous_chapter(self):
        """Get the previous published chapter"""
        return Chapter.objects.filter(
            manga=self.manga,
            chapter_number__lt=self.chapter_number,
            is_published=True
        ).order_by('-chapter_number').first()
    
    def is_accessible_by(self, user):
        """Check if chapter is accessible by user (considering premium/locked status)"""
        if not self.is_published:
            return False
        
        # Check if chapter is locked and still locked
        if self.is_locked and self.unlock_date and timezone.now() < self.unlock_date:
            return False
        
        # Check premium status
        if self.is_premium:
            if not user.is_authenticated:
                return False
            if not hasattr(user, 'profile') or not user.profile.is_premium:
                return False
        
        return True
    
    def get_reading_progress(self, user):
        """Get user's reading progress for this chapter"""
        if not user.is_authenticated:
            return None
        
        try:
            from .reading_history import ReadingHistory
            history = ReadingHistory.objects.get(user=user, manga=self.manga)
            if history.chapter == self:
                return {
                    'last_page': history.last_page,
                    'total_pages': self.page_count,
                    'percentage': (history.last_page / self.page_count * 100) if self.page_count > 0 else 0
                }
        except:
            pass
        
        return None
    
    def update_reading_progress(self, user, page_number):
        """Update user's reading progress for this chapter"""
        if not user.is_authenticated:
            return False
        
        try:
            from .reading_history import ReadingHistory
            history, created = ReadingHistory.objects.get_or_create(
                user=user,
                manga=self.manga,
                defaults={'chapter': self}
            )
            history.update_progress(self, page_number)
            return True
        except Exception as e:
            return False
    
    def get_estimated_reading_time(self):
        """Get estimated reading time based on page count"""
        if self.reading_time_avg > 0:
            return self.reading_time_avg
        
        # Estimate: ~30 seconds per page for manga
        return self.page_count * 30 if self.page_count > 0 else 0
    
    @property
    def display_title(self):
        """Get display title for chapter"""
        if self.title:
            return f"Chapter {self.chapter_number}: {self.title}"
        return f"Chapter {self.chapter_number}"
    
    @property
    def short_title(self):
        """Get short title for navigation"""
        if self.title:
            return f"Ch. {self.chapter_number}: {self.title[:30]}..."
        return f"Chapter {self.chapter_number}"
    
    @property
    def is_available(self):
        """Check if chapter is currently available to read"""
        if not self.is_published:
            return False
        
        if self.scheduled_release and timezone.now() < self.scheduled_release:
            return False
        
        if self.is_locked and self.unlock_date and timezone.now() < self.unlock_date:
            return False
        
        return True
    
    def get_page_url(self, page_number):
        """Get URL for a specific page"""
        if not self.pages or page_number > len(self.pages):
            return None
        
        return self.pages[page_number - 1]  # Pages are 1-indexed
    
    def __str__(self):
        return f"{self.manga.title} - {self.display_title}"