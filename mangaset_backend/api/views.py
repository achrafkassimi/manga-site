# api/views.py
from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Avg
from manga.models import Manga, Chapter, Genre, UserFavorite, ReadingHistory
from .serializers import *

# Manga Views
class MangaListView(generics.ListAPIView):
    queryset = Manga.objects.all()
    serializer_class = MangaListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'genres__name']
    search_fields = ['title', 'author', 'description']
    ordering_fields = ['created_at', 'updated_at', 'rating', 'view_count']
    ordering = ['-updated_at']

class MangaDetailView(generics.RetrieveAPIView):
    queryset = Manga.objects.all()
    serializer_class = MangaDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.view_count += 1
        instance.save(update_fields=['view_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

# Special manga lists
class PopularMangaView(generics.ListAPIView):
    serializer_class = MangaListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Manga.objects.order_by('-view_count', '-rating')[:20]

class FeaturedMangaView(generics.ListAPIView):
    serializer_class = MangaListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Manga.objects.filter(rating__gte=8.0).order_by('-rating')[:10]

class LatestUpdatesView(generics.ListAPIView):
    serializer_class = MangaListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Manga.objects.order_by('-updated_at')[:20]

class NewSeriesView(generics.ListAPIView):
    serializer_class = MangaListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Manga.objects.order_by('-created_at')[:20]

# Chapter Views
class ChapterDetailView(generics.RetrieveAPIView):
    queryset = Chapter.objects.filter(is_published=True)
    serializer_class = ChapterDetailSerializer
    permission_classes = [AllowAny]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.view_count += 1
        instance.save(update_fields=['view_count'])
        
        # Update reading history for authenticated users
        if request.user.is_authenticated:
            history, created = ReadingHistory.objects.get_or_create(
                user=request.user,
                manga=instance.manga,
                defaults={'chapter': instance}
            )
            if not created:
                history.chapter = instance
                history.save()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class MangaChaptersView(generics.ListAPIView):
    serializer_class = ChapterListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        manga_slug = self.kwargs['manga_slug']
        return Chapter.objects.filter(
            manga__slug=manga_slug, 
            is_published=True
        ).order_by('chapter_number')

# User-specific views
class UserFavoritesView(generics.ListCreateAPIView):
    serializer_class = UserFavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserFavorite.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserFavoriteDetailView(generics.DestroyAPIView):
    serializer_class = UserFavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserFavorite.objects.filter(user=self.request.user)

class UserReadingHistoryView(generics.ListAPIView):
    serializer_class = ReadingHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ReadingHistory.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_reading_progress(request):
    """Update user reading progress for a specific chapter"""
    manga_id = request.data.get('manga_id')
    chapter_id = request.data.get('chapter_id')
    last_page = request.data.get('last_page', 0)
    progress_percentage = request.data.get('progress_percentage', 0.0)
    
    try:
        manga = Manga.objects.get(id=manga_id)
        chapter = Chapter.objects.get(id=chapter_id) if chapter_id else None
        
        history, created = ReadingHistory.objects.get_or_create(
            user=request.user,
            manga=manga,
            defaults={
                'chapter': chapter,
                'last_page': last_page,
                'progress_percentage': progress_percentage
            }
        )
        
        if not created:
            history.chapter = chapter
            history.last_page = last_page
            history.progress_percentage = progress_percentage
            history.save()
        
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    
    except (Manga.DoesNotExist, Chapter.DoesNotExist):
        return Response(
            {'error': 'Manga or Chapter not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

# Search functionality
class MangaSearchView(generics.ListAPIView):
    serializer_class = MangaListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if query:
            return Manga.objects.filter(
                Q(title__icontains=query) |
                Q(author__icontains=query) |
                Q(description__icontains=query) |
                Q(genres__name__icontains=query)
            ).distinct()
        return Manga.objects.none()