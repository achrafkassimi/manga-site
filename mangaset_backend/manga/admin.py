from django.contrib import admin
from manga.models import (
    Manga, Chapter, Genre, Tag,
    UserProfile, UserFavorite, ReadingHistory, MangaRating,
    Comment, Notification,
    ChapterView, SiteVisit, BookmarkPage,
    ActivityLog, SiteSettings,
)


@admin.register(Manga)
class MangaAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'status', 'average_rating', 'view_count', 'created_at')
    list_filter = ('status', 'genres')
    search_fields = ('title', 'author', 'description')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('view_count', 'average_rating', 'created_at', 'updated_at')


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ('manga', 'chapter_number', 'title', 'is_published', 'view_count', 'created_at')
    list_filter = ('is_published', 'manga')
    search_fields = ('title', 'manga__title')
    readonly_fields = ('view_count', 'created_at', 'updated_at')


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('name', 'color_code')
    search_fields = ('name',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'bio')
    search_fields = ('user__username', 'user__email')


@admin.register(UserFavorite)
class UserFavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'manga', 'created_at')
    list_filter = ('user',)
    search_fields = ('user__username', 'manga__title')


@admin.register(ReadingHistory)
class ReadingHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'manga', 'chapter', 'last_page', 'updated_at')
    list_filter = ('user',)
    search_fields = ('user__username', 'manga__title')


@admin.register(MangaRating)
class MangaRatingAdmin(admin.ModelAdmin):
    list_display = ('user', 'manga', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('user__username', 'manga__title')


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'manga', 'content', 'created_at')
    list_filter = ('manga',)
    search_fields = ('user__username', 'content')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'notification_type', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read')
    search_fields = ('user__username',)


@admin.register(SiteVisit)
class SiteVisitAdmin(admin.ModelAdmin):
    list_display = ('ip_address', 'path', 'device_type', 'country_code', 'user', 'created_at')
    list_filter = ('device_type', 'country_code')
    search_fields = ('ip_address', 'path', 'user__username')
    readonly_fields = ('created_at',)


@admin.register(ChapterView)
class ChapterViewAdmin(admin.ModelAdmin):
    list_display = ('chapter', 'ip_address', 'device_type', 'country_code', 'reading_time', 'created_at')
    list_filter = ('device_type', 'country_code')
    search_fields = ('ip_address', 'chapter__title')
    readonly_fields = ('created_at',)


@admin.register(BookmarkPage)
class BookmarkPageAdmin(admin.ModelAdmin):
    list_display = ('user', 'chapter', 'page_number', 'bookmark_type', 'created_at')
    list_filter = ('bookmark_type',)
    search_fields = ('user__username',)


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action_type', 'severity', 'ip_address', 'created_at')
    list_filter = ('action_type', 'severity')
    search_fields = ('user__username', 'description', 'ip_address')
    readonly_fields = ('created_at',)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('key', 'category', 'data_type', 'is_public', 'value')
    list_filter = ('category', 'data_type', 'is_public')
    search_fields = ('key', 'description')
