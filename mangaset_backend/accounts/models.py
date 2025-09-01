# accounts/models.py - Add Password Reset Token Model
from datetime import timezone
from django.db import models
from django.contrib.auth.models import User

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def __str__(self):
        return f"Reset token for {self.user.username}"
    
# class UserProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
#     bio = models.TextField(max_length=500, blank=True)
#     avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
#     birth_date = models.DateField(blank=True, null=True)
#     preferred_language = models.CharField(max_length=10, default='en')
#     reading_preferences = models.JSONField(default=dict, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.user.username}'s Profile"