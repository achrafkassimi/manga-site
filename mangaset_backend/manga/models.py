# manga/models.py
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Genre(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    color_code = models.CharField(max_length=7, default='#007bff')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Manga(models.Model):
    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('hiatus', 'Hiatus'),
        ('cancelled', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    author = models.CharField(max_length=100)
    artist = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ongoing')
    publication_year = models.PositiveIntegerField(null=True, blank=True)
    
    # Images
    cover_image = models.ImageField(upload_to='manga/covers/', blank=True)
    
    # Metadata
    total_chapters = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        default=0
    )
    view_count = models.PositiveIntegerField(default=0)
    
    # Relationships
    genres = models.ManyToManyField(Genre, related_name='manga')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['rating']),
            models.Index(fields=['view_count']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

class Chapter(models.Model):
    manga = models.ForeignKey(Manga, on_delete=models.CASCADE, related_name='chapters')
    chapter_number = models.DecimalField(max_digits=6, decimal_places=2)
    title = models.CharField(max_length=200, blank=True)
    
    # Chapter content
    images = models.JSONField(default=list)  # List of image URLs/paths
    page_count = models.PositiveIntegerField(default=0)
    
    # Metadata
    is_published = models.BooleanField(default=True)
    view_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    release_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['chapter_number']
        unique_together = ['manga', 'chapter_number']
        indexes = [
            models.Index(fields=['manga', 'chapter_number']),
            models.Index(fields=['release_date']),
        ]
    
    def __str__(self):
        return f"{self.manga.title} - Chapter {self.chapter_number}"

# User-related models
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    bio = models.TextField(max_length=500, blank=True)
    reading_preferences = models.JSONField(default=dict)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

class UserFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    manga = models.ForeignKey(Manga, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'manga']
    
    def __str__(self):
        return f"{self.user.username} - {self.manga.title}"

class ReadingHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    manga = models.ForeignKey(Manga, on_delete=models.CASCADE)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, null=True)
    last_page = models.PositiveIntegerField(default=0)
    progress_percentage = models.FloatField(default=0.0)
    
    # Timestamps
    first_read_at = models.DateTimeField(auto_now_add=True)
    last_read_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'manga']
        ordering = ['-last_read_at']
    
    def __str__(self):
        return f"{self.user.username} reading {self.manga.title}"