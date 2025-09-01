# manga/models/admin_models.py
"""
Admin and system models for site management.
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from .base import TimeStampedModel, DataType, ActivityType
import json


class SiteSettings(TimeStampedModel):
    """Global site settings"""
    
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    data_type = models.CharField(max_length=20, choices=DataType.CHOICES, default=DataType.STRING)
    is_public = models.BooleanField(default=False, help_text="Can be accessed by non-admin users")
    category = models.CharField(max_length=50, default='general', help_text="Setting category for organization")
    
    class Meta:
        ordering = ['category', 'key']
        indexes = [
            models.Index(fields=['key']),
            models.Index(fields=['category', 'key']),
            models.Index(fields=['is_public']),
        ]
        verbose_name = 'Site Setting'
        verbose_name_plural = 'Site Settings'
    
    def get_value(self):
        """Get the properly typed value"""
        if self.data_type == DataType.INTEGER:
            try:
                return int(self.value)
            except ValueError:
                return 0
        elif self.data_type == DataType.FLOAT:
            try:
                return float(self.value)
            except ValueError:
                return 0.0
        elif self.data_type == DataType.BOOLEAN:
            return self.value.lower() in ('true', '1', 'yes', 'on')
        elif self.data_type == DataType.JSON:
            try:
                return json.loads(self.value)
            except json.JSONDecodeError:
                return {}
        return self.value
    
    def set_value(self, value):
        """Set value with proper type conversion"""
        if self.data_type == DataType.JSON:
            self.value = json.dumps(value, ensure_ascii=False)
        else:
            self.value = str(value)
    
    @classmethod
    def get_setting(cls, key, default=None):
        """Get a setting value by key"""
        try:
            setting = cls.objects.get(key=key)
            return setting.get_value()
        except cls.DoesNotExist:
            return default
    
    @classmethod
    def set_setting(cls, key, value, description='', data_type=DataType.STRING, is_public=False, category='general'):
        """Set a setting value"""
        setting, created = cls.objects.get_or_create(
            key=key,
            defaults={
                'description': description,
                'data_type': data_type,
                'is_public': is_public,
                'category': category
            }
        )
        setting.set_value(value)
        setting.save()
        return setting
    
    def __str__(self):
        return f"{self.category}.{self.key}: {self.value[:50]}..."


class ActivityLog(TimeStampedModel):
    """Log important system activities"""
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='activity_logs')
    action_type = models.CharField(max_length=50, choices=ActivityType.CHOICES)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(max_length=500, blank=True, default='')
    
    # Related objects
    manga = models.ForeignKey('manga.Manga', on_delete=models.SET_NULL, null=True, blank=True)
    chapter = models.ForeignKey('manga.Chapter', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Additional data
    metadata = models.JSONField(default=dict, help_text="Additional structured data")
    severity = models.CharField(max_length=20, choices=[
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('critical', 'Critical'),
    ], default='info')
    
    # Only need created_at
    updated_at = None
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['action_type', '-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['severity', '-created_at']),
        ]
        verbose_name = 'Activity Log'
        verbose_name_plural = 'Activity Logs'
    
    @classmethod
    def log(cls, action_type, description, user=None, manga=None, chapter=None, 
            ip_address=None, user_agent=None, metadata=None, severity='info'):
        """Create a new activity log entry"""
        return cls.objects.create(
            action_type=action_type,
            description=description,
            user=user,
            manga=manga,
            chapter=chapter,
            ip_address=ip_address,
            user_agent=user_agent or 'System',
            metadata=metadata or {},
            severity=severity
        )
    
    @classmethod
    def cleanup_old_logs(cls, days=90):
        """Clean up old activity logs"""
        cutoff_date = timezone.now() - timezone.timedelta(days=days)
        deleted_count, _ = cls.objects.filter(
            created_at__lt=cutoff_date,
            severity__in=['info', 'warning']  # Keep errors and critical logs longer
        ).delete()
        return deleted_count
    
    def get_severity_icon(self):
        """Get icon for severity level"""
        icons = {
            'info': 'fas fa-info-circle text-info',
            'warning': 'fas fa-exclamation-triangle text-warning', 
            'error': 'fas fa-times-circle text-danger',
            'critical': 'fas fa-skull text-danger'
        }
        return icons.get(self.severity, 'fas fa-circle')
    
    def __str__(self):
        user_info = self.user.username if self.user else 'System'
        return f"{user_info} - {self.get_action_type_display()} ({self.severity})"