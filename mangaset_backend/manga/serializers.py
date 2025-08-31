from rest_framework import serializers
from .models import Manga, Chapter, Genre, UserFavorite, ReadingHistory

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = '__all__'

class MangaListSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    latest_chapter = serializers.SerializerMethodField()
    
    class Meta:
        model = Manga
        fields = ['id', 'title', 'slug', 'cover_image', 'status', 'genres', 
                 'rating', 'total_chapters', 'latest_chapter', 'updated_at']
    
    def get_latest_chapter(self, obj):
        latest = obj.chapters.filter(is_published=True).last()
        return latest.chapter_number if latest else None

class MangaDetailSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    chapters = ChapterSerializer(many=True, read_only=True)
    is_favorited = serializers.SerializerMethodField()
    
    class Meta:
        model = Manga
        fields = '__all__'
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserFavorite.objects.filter(user=request.user, manga=obj).exists()
        return False

class UserFavoriteSerializer(serializers.ModelSerializer):
    manga = MangaListSerializer(read_only=True)
    manga_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = UserFavorite
        fields = ['id', 'manga', 'manga_id', 'added_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)