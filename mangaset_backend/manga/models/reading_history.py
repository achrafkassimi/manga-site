# manga/models/reading_history.py
"""
Reading history model for tracking user reading progress and history.
"""

from django.db import models
from django.contrib.auth.models import User
from .base import TimeStampedModel, ReadingStatus


class ReadingHistory(TimeStampedModel):
    """Track user reading progress and history"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reading_history')
    manga = models.ForeignKey('manga.Manga', on_delete=models.CASCADE, related_name='reading_history')
    chapter = models.ForeignKey('manga.Chapter', on_delete=models.CASCADE, null=True, blank=True, related_name='reading_history')
    last_page = models.PositiveIntegerField(default=0)
    progress_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    reading_status = models.CharField(max_length=20, choices=ReadingStatus.CHOICES, default=ReadingStatus.READING)
    
    # Time tracking
    first_read_at = models.DateTimeField(auto_now_add=True)
    last_read_at = models.DateTimeField(auto_now=True)
    total_reading_time = models.PositiveIntegerField(default=0, help_text="Total reading time in seconds")
    session_count = models.PositiveIntegerField(default=0)
    
    # Device tracking
    last_device = models.CharField(max_length=50, blank=True)
    last_ip = models.GenericIPAddressField(null=True, blank=True)
    
    # Additional metadata
    rating_reminder_sent = models.BooleanField(default=False)
    completion_date = models.DateTimeField(null=True, blank=True)
    
    # Rename TimeStampedModel fields to avoid confusion
    created_at = None  # Use first_read_at instead
    updated_at = None  # Use last_read_at instead
    
    class Meta:
        unique_together = ['user', 'manga']
        ordering = ['-last_read_at']
        indexes = [
            models.Index(fields=['user', '-last_read_at']),
            models.Index(fields=['manga', '-last_read_at']),
            models.Index(fields=['user', 'reading_status']),
            models.Index(fields=['user', 'progress_percentage']),
            models.Index(fields=['reading_status', '-last_read_at']),
        ]
        verbose_name = 'Reading History'
        verbose_name_plural = 'Reading Histories'
    
    def update_progress(self, chapter, page=0):
        """Update reading progress"""
        from django.utils import timezone
        
        self.chapter = chapter
        self.last_page = page
        
        # Calculate progress percentage
        if chapter and self.manga.total_chapters > 0:
            chapter_progress = float(chapter.chapter_number) / self.manga.total_chapters * 100
            if page > 0 and chapter.page_count > 0:
                page_progress = (page / chapter.page_count) * (100 / self.manga.total_chapters)
                self.progress_percentage = min(100, chapter_progress + page_progress)
            else:
                self.progress_percentage = min(100, chapter_progress)
        
        # Auto-update reading status
        if self.progress_percentage >= 100:
            if self.reading_status != ReadingStatus.COMPLETED:
                self.reading_status = ReadingStatus.COMPLETED
                self.completion_date = timezone.now()
        elif self.reading_status == ReadingStatus.PLAN_TO_READ:
            self.reading_status = ReadingStatus.READING
        
        self.session_count += 1
        self.save()
    
    def add_reading_time(self, seconds):
        """Add reading time to total"""
        self.total_reading_time += seconds
        # Update user profile total reading time
        if hasattr(self.user, 'profile'):
            self.user.profile.total_reading_time += seconds
            self.user.profile.save(update_fields=['total_reading_time'])
        self.save(update_fields=['total_reading_time'])
    
    def mark_as_completed(self):
        """Mark manga as completed"""
        from django.utils import timezone
        
        self.reading_status = ReadingStatus.COMPLETED
        self.progress_percentage = 100
        self.completion_date = timezone.now()
        self.save(update_fields=['reading_status', 'progress_percentage', 'completion_date'])
    
    def mark_as_dropped(self):
        """Mark manga as dropped"""
        self.reading_status = ReadingStatus.DROPPED
        self.save(update_fields=['reading_status'])
    
    def mark_as_on_hold(self):
        """Mark manga as on hold"""
        self.reading_status = ReadingStatus.ON_HOLD
        self.save(update_fields=['reading_status'])
    
    def mark_as_plan_to_read(self):
        """Mark manga as plan to read"""
        self.reading_status = ReadingStatus.PLAN_TO_READ
        self.save(update_fields=['reading_status'])
    
    def get_chapters_read(self):
        """Get number of chapters read"""
        if not self.chapter:
            return 0
        return int(self.chapter.chapter_number)
    
    def get_chapters_behind(self):
        """Get number of chapters behind latest"""
        latest_chapter = self.manga.get_latest_chapter()
        if not latest_chapter or not self.chapter:
            return 0
        
        return max(0, int(latest_chapter.chapter_number) - int(self.chapter.chapter_number))
    
    def get_estimated_time_to_complete(self):
        """Get estimated time to complete manga in seconds"""
        if self.reading_status == ReadingStatus.COMPLETED:
            return 0
        
        remaining_chapters = self.manga.total_chapters - self.get_chapters_read()
        if remaining_chapters <= 0:
            return 0
        
    def get_estimated_time_to_complete(self):
        """Get estimated time to complete manga in seconds"""
        if self.reading_status == ReadingStatus.COMPLETED:
            return 0
        
        remaining_chapters = self.manga.total_chapters - self.get_chapters_read()
        if remaining_chapters <= 0:
            return 0
        
        # Estimate based on average reading time or default
        avg_time_per_chapter = self.get_average_reading_time_per_chapter()
        return remaining_chapters * avg_time_per_chapter
    
    def get_average_reading_time_per_chapter(self):
        """Get user's average reading time per chapter for this manga"""
        if self.session_count > 0 and self.total_reading_time > 0:
            chapters_read = self.get_chapters_read()
            if chapters_read > 0:
                return self.total_reading_time // chapters_read
        
        # Default estimate: 5 minutes per chapter
        return 300
    
    def should_send_rating_reminder(self):
        """Check if user should be reminded to rate manga"""
        return (
            not self.rating_reminder_sent and
            self.reading_status == ReadingStatus.COMPLETED and
            not self.manga.ratings.filter(user=self.user).exists()
        )
    
    def send_rating_reminder(self):
        """Mark that rating reminder has been sent"""
        self.rating_reminder_sent = True
        self.save(update_fields=['rating_reminder_sent'])
    
    @property
    def current_chapter_number(self):
        """Get current chapter number"""
        return self.chapter.chapter_number if self.chapter else 0
    
    @property
    def reading_time_formatted(self):
        """Get formatted reading time"""
        hours = self.total_reading_time // 3600
        minutes = (self.total_reading_time % 3600) // 60
        
        if hours > 0:
            return f"{hours}h {minutes}m"
        return f"{minutes}m"
    
    @property
    def is_up_to_date(self):
        """Check if user is up to date with latest chapter"""
        latest_chapter = self.manga.get_latest_chapter()
        if not latest_chapter or not self.chapter:
            return False
        
        return self.chapter.chapter_number >= latest_chapter.chapter_number
    
    def __str__(self):
        return f"{self.user.username} reading {self.manga.title} ({self.get_reading_status_display()})"