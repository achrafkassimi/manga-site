# api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from manga.models import Manga, Chapter, Genre, UserFavorite, ReadingHistory

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
            'status', 'cover_image', 'rating', 'total_chapters', 
            'genres', 'latest_chapter', 'created_at', 'updated_at'
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