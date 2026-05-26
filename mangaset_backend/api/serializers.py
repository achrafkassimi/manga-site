# api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from manga.models import Manga, Chapter, Genre, UserFavorite, ReadingHistory
from manga.models.comment import Comment
from manga.models.notification import Notification

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name', 'description', 'color_code']

class ChapterListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'chapter_number', 'title', 'page_count', 'release_date', 'view_count']

class ChapterDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = '__all__'

class MangaListSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    latest_chapter = serializers.SerializerMethodField()
    
    class Meta:
        model = Manga
        fields = [
            'id', 'title', 'slug', 'description', 'author', 'artist', 
            'status', 'cover_image', 'average_rating', 'total_ratings', 'total_chapters', 
            'genres', 'latest_chapter', 'view_count', 'created_at', 'updated_at'
        ]
    
    def get_latest_chapter(self, obj):
        latest = obj.chapters.filter(is_published=True).last()
        return ChapterListSerializer(latest).data if latest else None

class MangaDetailSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    chapters = ChapterListSerializer(many=True, read_only=True)
    is_favorited = serializers.SerializerMethodField()
    reading_progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Manga
        fields = '__all__'
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserFavorite.objects.filter(user=request.user, manga=obj).exists()
        return False
    
    def get_reading_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                history = ReadingHistory.objects.get(user=request.user, manga=obj)
                return {
                    'last_chapter': history.chapter.chapter_number if history.chapter else None,
                    'last_page': history.last_page,
                    'progress_percentage': history.progress_percentage
                }
            except ReadingHistory.DoesNotExist:
                pass
        return None

class UserFavoriteSerializer(serializers.ModelSerializer):
    manga = MangaListSerializer(read_only=True)
    manga_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = UserFavorite
        fields = ['id', 'manga', 'manga_id', 'added_at']

class ReadingHistorySerializer(serializers.ModelSerializer):
    manga = MangaListSerializer(read_only=True)
    chapter_info = ChapterListSerializer(source='chapter', read_only=True)

    class Meta:
        model = ReadingHistory
        fields = '__all__'


class CommentAuthorSerializer(serializers.ModelSerializer):
    """Minimal user info embedded in comments."""
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar_url']

    def get_avatar_url(self, obj):
        try:
            if hasattr(obj, 'profile') and obj.profile and obj.profile.avatar:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.profile.avatar.url)
                return obj.profile.avatar.url
        except Exception:
            pass
        return None


class CommentSerializer(serializers.ModelSerializer):
    user = CommentAuthorSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id', 'user', 'content', 'parent', 'is_spoiler', 'is_edited',
            'is_pinned', 'likes_count', 'dislikes_count', 'reply_count',
            'replies', 'can_edit', 'can_delete',
            'created_at', 'edited_at',
        ]
        read_only_fields = [
            'id', 'user', 'is_edited', 'is_pinned',
            'likes_count', 'dislikes_count', 'reply_count',
            'replies', 'can_edit', 'can_delete',
            'created_at', 'edited_at',
        ]

    def get_replies(self, obj):
        # Only return immediate replies — UI can paginate deeper if needed.
        if obj.parent_id is not None:
            return []
        replies_qs = obj.replies.filter(is_approved=True).order_by('created_at')[:20]
        return CommentSerializer(replies_qs, many=True, context=self.context).data

    def get_can_edit(self, obj):
        request = self.context.get('request')
        return bool(request and obj.can_be_edited_by(request.user))

    def get_can_delete(self, obj):
        request = self.context.get('request')
        return bool(request and obj.can_be_deleted_by(request.user))


class NotificationSerializer(serializers.ModelSerializer):
    icon = serializers.SerializerMethodField()
    color_class = serializers.SerializerMethodField()
    target_title = serializers.CharField(read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'type', 'title', 'message', 'action_url',
            'is_read', 'priority', 'icon', 'color_class', 'target_title',
            'read_at', 'created_at',
        ]
        read_only_fields = fields

    def get_icon(self, obj):
        return obj.get_icon()

    def get_color_class(self, obj):
        return obj.get_color_class()