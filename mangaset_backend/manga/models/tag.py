# manga/models/tag.py
"""
Tag model for additional manga categorization.
"""

from django.db import models
from .base import TimeStampedModel, SluggedModel, TagType


class Tag(SluggedModel, TimeStampedModel):
    """Additional tagging system for manga"""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=20, choices=TagType.CHOICES, default=TagType.THEME)
    color_code = models.CharField(max_length=7, default='#6c757d')
    usage_count = models.PositiveIntegerField(default=0)
    is_system = models.BooleanField(default=False, help_text="System-generated tag")
    
    # Remove created_at from TimeStampedModel since we only need it once
    updated_at = None
    
    class Meta:
        ordering = ['type', 'name']
        indexes = [
            models.Index(fields=['type', 'usage_count']),
            models.Index(fields=['name']),
            models.Index(fields=['type', 'name']),
            models.Index(fields=['is_system', 'type']),
        ]
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'
    
    def get_usage_count(self):
        """Get actual usage count (computed)"""
        return self.manga_tags.count()
    
    def update_usage_count(self):
        """Update the cached usage count"""
        self.usage_count = self.get_usage_count()
        self.save(update_fields=['usage_count'])
    
    def get_related_tags(self, limit=5):
        """Get tags commonly used with this tag"""
        from .manga import MangaTag
        
        # Get manga that have this tag
        manga_with_tag = self.manga_tags.values_list('manga_id', flat=True)
        
        # Get other tags used by those manga
        related_tags = Tag.objects.filter(
            manga_tags__manga_id__in=manga_with_tag
        ).exclude(
            id=self.id
        ).annotate(
            common_count=models.Count('manga_tags')
        ).order_by('-common_count')[:limit]
        
        return related_tags
    
    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"