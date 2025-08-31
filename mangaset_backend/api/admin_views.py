from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Count, Q, Avg
from django.utils import timezone
from datetime import timedelta
from manga.models import Manga, Chapter, Genre
from .serializers import MangaDetailSerializer
# , UserProfileSerializer
import logging

logger = logging.getLogger(__name__)

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

# Admin Manga Management
class AdminMangaListView(generics.ListCreateAPIView):
    queryset = Manga.objects.all()
    serializer_class = MangaDetailSerializer
    permission_classes = [IsAdminUser]
    
    def perform_create(self, serializer):
        serializer.save()

class AdminMangaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Manga.objects.all()
    serializer_class = MangaDetailSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'slug'

# Admin User Management
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    # serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser]

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_stats(request):
    """Get dashboard statistics for admin"""
    
    # Calculate date ranges
    now = timezone.now()
    last_week = now - timedelta(days=7)
    last_month = now - timedelta(days=30)
    
    stats = {
        'total_manga': Manga.objects.count(),
        'total_chapters': Chapter.objects.count(),
        'total_users': User.objects.count(),
        'active_users': User.objects.filter(last_login__gte=last_week).count(),
        'new_users_this_week': User.objects.filter(date_joined__gte=last_week).count(),
        'popular_manga': list(
            Manga.objects.order_by('-view_count')[:5].values('title', 'view_count')
        ),
        'recent_manga': list(
            Manga.objects.filter(created_at__gte=last_month).values('title', 'created_at')
        ),
        'genre_distribution': list(
            Genre.objects.annotate(
                manga_count=Count('manga')
            ).order_by('-manga_count').values('name', 'manga_count')
        )
    }
    
    return Response(stats)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def bulk_manga_actions(request):
    """Handle bulk operations on manga"""
    
    action = request.data.get('action')
    manga_ids = request.data.get('manga_ids', [])
    
    if not action or not manga_ids:
        return Response({
            'error': 'Action and manga_ids required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    manga_queryset = Manga.objects.filter(id__in=manga_ids)
    
    try:
        if action == 'delete':
            count = manga_queryset.count()
            manga_queryset.delete()
            return Response({
                'message': f'{count} manga deleted successfully'
            })
        elif action == 'feature':
            manga_queryset.update(is_featured=True)
            return Response({
                'message': f'{manga_queryset.count()} manga featured'
            })
        elif action == 'unfeature':
            manga_queryset.update(is_featured=False)
            return Response({
                'message': f'{manga_queryset.count()} manga unfeatured'
            })
        else:
            return Response({
                'error': 'Invalid action'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Bulk action failed: {str(e)}")
        return Response({
            'error': 'Bulk action failed',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)