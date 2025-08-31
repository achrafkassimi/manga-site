# manga/models/genre.py
"""
Genre model for categorizing manga.
"""

from django.db import models
from .base import TimeStampedModel, SluggedModel


class Genre(SluggedModel, TimeStampedModel):
    """Genre model for categorizing manga"""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    color_code = models.CharField(max_length=7, default='#007bff', help_text="Hex color code")
    icon = models.CharField(max_length=50, blank=True, help_text="FontAwesome icon class")
    is_popular = models.BooleanField(default=False)
    manga_count = models.PositiveIntegerField(default=0)
    parent_genre = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['display_order', 'name']
        indexes = [
            models.Index(fields=['is_popular', 'manga_count']),
            models.Index(fields=['parent_genre', 'display_order']),
            models.Index(fields=['name']),
            models.Index(fields=['is_active', 'is_popular']),
        ]
        verbose_name = 'Genre'
        verbose_name_plural = 'Genres'
    
    def get_children(self):
        """Get child genres if this is a parent genre"""
        return self.genre_set.filter(is_active=True).order_by('display_order')
    
    def is_parent(self):
        """Check if this genre has child genres"""
        return self.genre_set.exists()
    
    def get_breadcrumbs(self):
        """Get breadcrumb trail for nested genres"""
        breadcrumbs = []
        current = self
        while current:
            breadcrumbs.insert(0, current)
            current = current.parent_genre
        return breadcrumbs
    
    def get_manga_count(self):
        """Get actual manga count (computed)"""
        return self.manga_genres.count()
    
    def update_manga_count(self):
        """Update the cached manga count"""
        self.manga_count = self.get_manga_count()
        self.save(update_fields=['manga_count'])
    
    def __str__(self):
        if self.parent_genre:
            return f"{self.parent_genre.name} > {self.name}"
        return self.name