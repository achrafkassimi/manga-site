from django.urls import path
from api import admin_views
from . import views


urlpatterns = [
    # Manga endpoints
    path('manga/', views.MangaListView.as_view(), name='manga-list'),
    path('manga/<slug:slug>/', views.MangaDetailView.as_view(), name='manga-detail'),
    path('manga/<slug:manga_slug>/chapters/', views.MangaChaptersView.as_view(), name='manga-chapters'),
    
    # Special manga lists
    path('manga/lists/popular/', views.PopularMangaView.as_view(), name='popular-manga'),
    path('manga/lists/featured/', views.FeaturedMangaView.as_view(), name='featured-manga'),
    path('manga/lists/latest/', views.LatestUpdatesView.as_view(), name='latest-updates'),
    path('manga/lists/new/', views.NewSeriesView.as_view(), name='new-series'),
    
    # Chapter endpoints
    path('chapters/<int:pk>/', views.ChapterDetailView.as_view(), name='chapter-detail'),
    
    # Genre endpoints
    path('genres/', views.GenreListView.as_view(), name='genre-list'),
    
    # User endpoints (move to separate app later)
    path('user/favorites/', views.UserFavoritesView.as_view(), name='user-favorites'),
    path('user/favorites/<int:pk>/', views.UserFavoriteDetailView.as_view(), name='user-favorite-detail'),
    path('user/history/', views.UserReadingHistoryView.as_view(), name='user-history'),
    path('user/reading-progress/', views.update_reading_progress, name='update-reading-progress'),
    
    # Search
    path('search/', views.MangaSearchView.as_view(), name='manga-search'),

        # Admin endpoints
    # path('admin/dashboard/stats/', views.admin_dashboard_stats, name='admin-dashboard-stats'),
    path('admin/manga/', admin_views.AdminMangaListView.as_view(), name='admin-manga-list'),
    path('admin/manga/<slug:slug>/', admin_views.AdminMangaDetailView.as_view(), name='admin-manga-detail'),
    path('admin/manga/bulk-actions/', admin_views.bulk_manga_actions, name='admin-bulk-actions'),
    path('admin/users/', admin_views.AdminUserListView.as_view(), name='admin-users'),
]