# api/views.py
# from rest_framework import generics, status, filters
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework.response import Response
# from django_filters.rest_framework import DjangoFilterBackend
# from django.db.models import Q, Count, Avg
# from mangaset_backend.manga.models import Manga, Chapter, Genre, UserFavorite, ReadingHistory
# from .serializers import *

# # Manga Views
# class MangaListView(generics.ListAPIView):
#     queryset = Manga.objects.all()
#     serializer_class = MangaListSerializer
#     permission_classes = [AllowAny]
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
#     filterset_fields = ['status', 'genres__name']
#     search_fields = ['title', 'author', 'description']
#     ordering_fields = ['created_at', 'updated_at', 'rating', 'view_count']
#     ordering = ['-updated_at']

# class MangaDetailView(generics.RetrieveAPIView):
#     queryset = Manga.objects.all()
#     serializer_class = MangaDetailSerializer
#     permission_classes = [AllowAny]
#     lookup_field = 'slug'
    
#     def retrieve(self, request, *args, **kwargs):
#         instance = self.get_object()
#         # Increment view count
#         instance.view_count += 1
#         instance.save(update_fields=['view_count'])
#         serializer = self.get_serializer(instance)
#         return Response(serializer.data)

# # Special manga lists
# class PopularMangaView(generics.ListAPIView):
#     serializer_class = MangaListSerializer
#     permission_classes = [AllowAny]
    
#     def get_queryset(self):
#         return Manga.objects.order_by('-view_count', '-rating')[:20]

# class FeaturedMangaView(generics.ListAPIView):
#     serializer_class = MangaListSerializer
#     permission_classes = [AllowAny]
    
#     def get_queryset(self):
#         return Manga.objects.filter(rating__gte=8.0).order_by('-rating')[:10]

# class LatestUpdatesView(generics.ListAPIView):
#     serializer_class = MangaListSerializer
#     permission_classes = [AllowAny]
    
#     def get_queryset(self):
#         return Manga.objects.order_by('-updated_at')[:20]

# class NewSeriesView(generics.ListAPIView):
#     serializer_class = MangaListSerializer
#     permission_classes = [AllowAny]
    
#     def get_queryset(self):
#         return Manga.objects.order_by('-created_at')[:20]

# # Chapter Views
# class ChapterDetailView(generics.RetrieveAPIView):
#     queryset = Chapter.objects.filter(is_published=True)
#     serializer_class = ChapterDetailSerializer
#     permission_classes = [AllowAny]
    
#     def retrieve(self, request, *args, **kwargs):
#         instance = self.get_object()
#         # Increment view count
#         instance.view_count += 1
#         instance.save(update_fields=['view_count'])
        
#         # Update reading history for authenticated users
#         if request.user.is_authenticated:
#             history, created = ReadingHistory.objects.get_or_create(
#                 user=request.user,
#                 manga=instance.manga,
#                 defaults={'chapter': instance}
#             )
#             if not created:
#                 history.chapter = instance
#                 history.save()
        
#         serializer = self.get_serializer(instance)
#         return Response(serializer.data)

# class MangaChaptersView(generics.ListAPIView):
#     serializer_class = ChapterListSerializer
#     permission_classes = [AllowAny]
    
#     def get_queryset(self):
#         manga_slug = self.kwargs['manga_slug']
#         return Chapter.objects.filter(
#             manga__slug=manga_slug, 
#             is_published=True
#         ).order_by('chapter_number')

# # User-specific views
# class UserFavoritesView(generics.ListCreateAPIView):
#     serializer_class = UserFavoriteSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         return UserFavorite.objects.filter(user=self.request.user)
    
#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)

# class UserFavoriteDetailView(generics.DestroyAPIView):
#     serializer_class = UserFavoriteSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         return UserFavorite.objects.filter(user=self.request.user)

# class UserReadingHistoryView(generics.ListAPIView):
#     serializer_class = ReadingHistorySerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         return ReadingHistory.objects.filter(user=self.request.user)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def update_reading_progress(request):
#     """Update user reading progress for a specific chapter"""
#     manga_id = request.data.get('manga_id')
#     chapter_id = request.data.get('chapter_id')
#     last_page = request.data.get('last_page', 0)
#     progress_percentage = request.data.get('progress_percentage', 0.0)
    
#     try:
#         manga = Manga.objects.get(id=manga_id)
#         chapter = Chapter.objects.get(id=chapter_id) if chapter_id else None
        
#         history, created = ReadingHistory.objects.get_or_create(
#             user=request.user,
#             manga=manga,
#             defaults={
#                 'chapter': chapter,
#                 'last_page': last_page,
#                 'progress_percentage': progress_percentage
#             }
#         )
        
#         if not created:
#             history.chapter = chapter
#             history.last_page = last_page
#             history.progress_percentage = progress_percentage
#             history.save()
        
#         return Response({'status': 'success'}, status=status.HTTP_200_OK)
    
#     except (Manga.DoesNotExist, Chapter.DoesNotExist):
#         return Response(
#             {'error': 'Manga or Chapter not found'}, 
#             status=status.HTTP_404_NOT_FOUND
#         )

# # Search functionality
# class MangaSearchView(generics.ListAPIView):
#     serializer_class = MangaListSerializer
#     permission_classes = [AllowAny]
    
#     def get_queryset(self):
#         query = self.request.query_params.get('q', '')
#         if query:
#             return Manga.objects.filter(
#                 Q(title__icontains=query) |
#                 Q(author__icontains=query) |
#                 Q(description__icontains=query) |
#                 Q(genres__name__icontains=query)
#             ).distinct()
#         return Manga.objects.none()




# from rest_framework import generics, permissions, filters, status
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from django_filters.rest_framework import DjangoFilterBackend
# from django.db.models import Q, Count, Avg
# from manga.models import Manga, Chapter, Genre, UserFavorite, ReadingHistory
# from manga.serializers import (
#     MangaListSerializer, MangaDetailSerializer, ChapterSerializer,
#     GenreSerializer, UserFavoriteSerializer
# )

# class MangaListView(generics.ListAPIView):
#     queryset = Manga.objects.all()
#     serializer_class = MangaListSerializer
#     permission_classes = [permissions.AllowAny]
#     filter_backends = [DjangoFilterBackend, filters.SearchBackend, filters.OrderingFilter]
#     filterset_fields = ['status', 'genres', 'publication_year']
#     search_fields = ['title', 'author', 'artist']
#     ordering_fields = ['created_at', 'rating', 'view_count', 'updated_at']
#     ordering = ['-updated_at']

# class MangaDetailView(generics.RetrieveAPIView):
#     queryset = Manga.objects.prefetch_related('genres', 'chapters')
#     serializer_class = MangaDetailSerializer
#     lookup_field = 'slug'
#     permission_classes = [permissions.AllowAny]

# class PopularMangaView(generics.ListAPIView):
#     serializer_class = MangaListSerializer
#     permission_classes = [permissions.AllowAny]
    
#     def get_queryset(self):
#         return Manga.objects.order_by('-view_count', '-rating')[:20]

# class FeaturedMangaView(generics.ListAPIView):
#     serializer_class = MangaListSerializer
#     permission_classes = [permissions.AllowAny]
    
#     def get_queryset(self):
#         return Manga.objects.filter(is_featured=True).order_by('-updated_at')

# class LatestUpdatesView(generics.ListAPIView):
#     serializer_class = MangaListSerializer
#     permission_classes = [permissions.AllowAny]
    
#     def get_queryset(self):
#         return Manga.objects.order_by('-updated_at')[:50]

# class NewSeriesView(generics.ListAPIView):
#     serializer_class = MangaListSerializer
#     permission_classes = [permissions.AllowAny]
    
#     def get_queryset(self):
#         return Manga.objects.order_by('-created_at')[:20]

# class MangaSearchView(generics.ListAPIView):
#     serializer_class = MangaListSerializer
#     permission_classes = [permissions.AllowAny]
    
#     def get_queryset(self):
#         query = self.request.query_params.get('q', '')
#         if query:
#             return Manga.objects.filter(
#                 Q(title__icontains=query) | 
#                 Q(author__icontains=query) | 
#                 Q(description__icontains=query)
#             ).distinct()
#         return Manga.objects.none()

# # User Features
# class UserFavoritesView(generics.ListCreateAPIView):
#     serializer_class = UserFavoriteSerializer
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get_queryset(self):
#         return UserFavorite.objects.filter(user=self.request.user)

# @api_view(['POST'])
# @permission_classes([permissions.IsAuthenticated])
# def update_reading_progress(request):
#     manga_id = request.data.get('manga_id')
#     chapter_id = request.data.get('chapter_id')
#     last_page = request.data.get('last_page', 0)
    
#     try:
#         manga = Manga.objects.get(id=manga_id)
#         chapter = Chapter.objects.get(id=chapter_id)
        
#         history, created = ReadingHistory.objects.update_or_create(
#             user=request.user,
#             manga=manga,
#             defaults={'chapter': chapter, 'last_page': last_page}
#         )
        
#         return Response({'status': 'success'})
#     except (Manga.DoesNotExist, Chapter.DoesNotExist):
#         return Response({'error': 'Invalid manga or chapter'}, 
#                        status=status.HTTP_400_BAD_REQUEST)
    



# from rest_framework.views import exception_handler
# from rest_framework.response import Response
# from django.http import Http404
# from django.core.exceptions import ValidationError
# import logging

# logger = logging.getLogger(__name__)

# def custom_exception_handler(exc, context):
#     # Call REST framework's default exception handler first
#     response = exception_handler(exc, context)
    
#     if response is not None:
#         custom_response_data = {
#             'error': True,
#             'message': 'An error occurred',
#             'details': response.data
#         }
#         response.data = custom_response_data
    
#     return response

# # Add to each view class
# class MangaListView(generics.ListAPIView):
#     # ... existing code ...
    
#     def handle_exception(self, exc):
#         logger.error(f"Error in MangaListView: {str(exc)}")
#         return super().handle_exception(exc)
    


# from django.shortcuts import get_object_or_404
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework import status
# from django.db.models import Count, Q, Avg
# from django.utils import timezone
# from datetime import timedelta

# # Complete your existing views and add these:

# class MangaChaptersView(generics.ListAPIView):
#     serializer_class = ChapterListSerializer
#     permission_classes = [AllowAny]
    
#     def get_queryset(self):
#         manga_slug = self.kwargs['manga_slug']
#         manga = get_object_or_404(Manga, slug=manga_slug)
#         return manga.chapters.filter(is_published=True).order_by('chapter_number')

# class ChapterDetailView(generics.RetrieveAPIView):
#     queryset = Chapter.objects.all()
#     serializer_class = ChapterDetailSerializer
#     permission_classes = [AllowAny]
    
#     def retrieve(self, request, *args, **kwargs):
#         instance = self.get_object()
#         # Increment view count
#         instance.view_count += 1
#         instance.save(update_fields=['view_count'])
#         serializer = self.get_serializer(instance)
#         return Response(serializer.data)

# class GenreListView(generics.ListAPIView):
#     queryset = Genre.objects.all()
#     serializer_class = GenreSerializer
#     permission_classes = [AllowAny]

# # Update your existing special manga list views
# class PopularMangaView(generics.ListAPIView):
#     serializer_class = MangaListSerializer
#     permission_classes = [AllowAny]
    
#     def get_queryset(self):
#         # Popular based on views and favorites in last 30 days
#         return Manga.objects.annotate(
#             recent_favorites=Count('userfavorite', 
#                 filter=Q(userfavorite__added_at__gte=timezone.now()-timedelta(days=30))),
#             avg_rating=Avg('rating')
#         ).order_by('-view_count', '-recent_favorites', '-avg_rating')[:20]

# class FeaturedMangaView(generics.ListAPIView):
#     serializer_class = MangaListSerializer
#     permission_classes = [AllowAny]
    
#     def get_queryset(self):
#         return Manga.objects.filter(is_featured=True).order_by('-updated_at')[:10]

# class LatestUpdatesView(generics.ListAPIView):
#     serializer_class = MangaListSerializer
#     permission_classes = [AllowAny]
    
#     def get_queryset(self):
#         # Manga with recent chapter updates
#         return Manga.objects.filter(
#             chapters__release_date__gte=timezone.now()-timedelta(days=7)
#         ).distinct().order_by('-updated_at')[:50]

# class NewSeriesView(generics.ListAPIView):
#     serializer_class = MangaListSerializer
#     permission_classes = [AllowAny]
    
#     def get_queryset(self):
#         return Manga.objects.filter(
#             created_at__gte=timezone.now()-timedelta(days=30)
#         ).order_by('-created_at')[:20]

# # Search with better implementation
# class MangaSearchView(generics.ListAPIView):
#     serializer_class = MangaListSerializer
#     permission_classes = [AllowAny]
#     pagination_class = None  # Remove pagination for search
    
#     def get_queryset(self):
#         query = self.request.query_params.get('q', '').strip()
#         if not query:
#             return Manga.objects.none()
        
#         # Advanced search with ranking
#         queryset = Manga.objects.filter(
#             Q(title__icontains=query) | 
#             Q(author__icontains=query) | 
#             Q(artist__icontains=query) |
#             Q(description__icontains=query) |
#             Q(genres__name__icontains=query)
#         ).distinct()
        
#         # Order by relevance (title matches first)
#         return queryset.extra(
#             select={
#                 'title_match': "CASE WHEN title ILIKE %s THEN 1 ELSE 0 END",
#                 'author_match': "CASE WHEN author ILIKE %s THEN 1 ELSE 0 END"
#             },
#             select_params=[f'%{query}%', f'%{query}%'],
#             order_by=['-title_match', '-author_match', '-rating', '-view_count']
#         )
    



# # User Features (add to api/views.py)

# class UserFavoritesView(generics.ListCreateAPIView):
#     serializer_class = UserFavoriteSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         return UserFavorite.objects.filter(user=self.request.user).select_related('manga')
    
#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)

# class UserFavoriteDetailView(generics.DestroyAPIView):
#     serializer_class = UserFavoriteSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         return UserFavorite.objects.filter(user=self.request.user)

# class UserReadingHistoryView(generics.ListAPIView):
#     serializer_class = ReadingHistorySerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         return ReadingHistory.objects.filter(user=self.request.user).select_related('manga', 'chapter')

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def update_reading_progress(request):
#     try:
#         manga_id = request.data.get('manga_id')
#         chapter_id = request.data.get('chapter_id')
#         last_page = request.data.get('last_page', 0)
        
#         manga = get_object_or_404(Manga, id=manga_id)
#         chapter = get_object_or_404(Chapter, id=chapter_id)
        
#         history, created = ReadingHistory.objects.update_or_create(
#             user=request.user,
#             manga=manga,
#             defaults={
#                 'chapter': chapter,
#                 'last_page': last_page,
#                 'progress_percentage': min(100, (last_page / len(chapter.pages)) * 100) if chapter.pages else 0
#             }
#         )
        
#         return Response({
#             'message': 'Reading progress updated',
#             'progress': ReadingHistorySerializer(history).data
#         })
        
#     except Exception as e:
#         return Response({
#             'error': 'Failed to update progress',
#             'details': str(e)
#         }, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def user_reading_stats(request):
#     user = request.user
#     stats = {
#         'total_favorites': UserFavorite.objects.filter(user=user).count(),
#         'total_read_manga': ReadingHistory.objects.filter(user=user).values('manga').distinct().count(),
#         'total_chapters_read': ReadingHistory.objects.filter(user=user).count(),
#         'reading_streak': 0,  # Implement streak logic
#         'favorite_genres': list(
#             Genre.objects.filter(
#                 manga__userfavorite__user=user
#             ).annotate(
#                 count=Count('manga__userfavorite')
#             ).order_by('-count')[:5].values_list('name', flat=True)
#         )
#     }
#     return Response(stats)


# # Add this view to your existing api/views.py file

# class MangaChaptersView(generics.ListAPIView):
#     serializer_class = ChapterListSerializer
#     permission_classes = [AllowAny]
    
#     def get_queryset(self):
#         manga_slug = self.kwargs['manga_slug']
#         return Chapter.objects.filter(
#             manga__slug=manga_slug, 
#             is_published=True
#         ).order_by('chapter_number')
    








# api/views.py
from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Avg
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta
import logging

# Import models from manga app
from manga.models import Manga, Chapter, Genre, UserFavorite, ReadingHistory

# Import serializers from current app
from .serializers import (
    MangaListSerializer, MangaDetailSerializer, ChapterListSerializer,
    ChapterDetailSerializer, GenreSerializer, UserFavoriteSerializer,
    ReadingHistorySerializer
)

logger = logging.getLogger(__name__)

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
    queryset = Manga.objects.prefetch_related('genres', 'chapters')
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

class MangaChaptersView(generics.ListAPIView):
    serializer_class = ChapterListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        manga_slug = self.kwargs['manga_slug']
        return Chapter.objects.filter(
            manga__slug=manga_slug, 
            is_published=True
        ).order_by('chapter_number')

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
        return Manga.objects.filter(is_featured=True).order_by('-updated_at')[:10]

class LatestUpdatesView(generics.ListAPIView):
    serializer_class = MangaListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Manga.objects.order_by('-updated_at')[:50]

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

# Genre View
class GenreListView(generics.ListAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [AllowAny]

# User-specific views
class UserFavoritesView(generics.ListCreateAPIView):
    serializer_class = UserFavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserFavorite.objects.filter(user=self.request.user).select_related('manga')
    
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
        return ReadingHistory.objects.filter(user=self.request.user).select_related('manga', 'chapter').order_by('-last_read_at')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_reading_progress(request):
    """Update user reading progress for a specific chapter"""
    manga_id = request.data.get('manga_id')
    chapter_id = request.data.get('chapter_id')
    last_page = request.data.get('last_page', 0)
    progress_percentage = request.data.get('progress_percentage', 0.0)
    
    try:
        manga = get_object_or_404(Manga, id=manga_id)
        chapter = get_object_or_404(Chapter, id=chapter_id) if chapter_id else None
        
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
        
        return Response({
            'status': 'success',
            'message': 'Reading progress updated'
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': 'Failed to update reading progress',
            'details': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

# Search functionality
class MangaSearchView(generics.ListAPIView):
    serializer_class = MangaListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        query = self.request.query_params.get('q', '').strip()
        if not query:
            return Manga.objects.none()
        
        return Manga.objects.filter(
            Q(title__icontains=query) |
            Q(author__icontains=query) |
            Q(description__icontains=query) |
            Q(genres__name__icontains=query)
        ).distinct().order_by('-view_count', '-rating')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_reading_stats(request):
    """Get reading statistics for the authenticated user"""
    user = request.user
    stats = {
        'total_favorites': UserFavorite.objects.filter(user=user).count(),
        'total_read_manga': ReadingHistory.objects.filter(user=user).values('manga').distinct().count(),
        'total_chapters_read': ReadingHistory.objects.filter(user=user).count(),
        'favorite_genres': list(
            Genre.objects.filter(
                manga__userfavorite__user=user
            ).annotate(
                count=Count('manga__userfavorite')
            ).order_by('-count')[:5].values_list('name', flat=True)
        )
    }
    return Response(stats)