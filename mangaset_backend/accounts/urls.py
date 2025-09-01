from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'accounts'

urlpatterns = [
    # JWT Token endpoints
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Custom authentication endpoints
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),  
    path('logout/', views.logout_view, name='logout'),
    
    # User profile endpoints
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('change-password/', views.change_password_view, name='change_password'),
    
    # Password reset endpoints
    path('password/reset/', views.password_reset_request_view, name='password_reset'),
    
    # Password reset endpoints
    path('forgot-password/', views.password_reset_request_view, name='forgot_password'),
    path('reset-password/', views.password_reset_confirm_view, name='reset_password'),
    
    # User favorites endpoints
    path('favorites/', views.user_favorites_view, name='user_favorites'),
    path('favorites/<int:manga_id>/', views.remove_favorite_view, name='remove_favorite'),
    
    # User activity endpoints
    path('history/', views.user_reading_history_view, name='reading_history'),
    path('stats/', views.user_stats_view, name='user_stats'),

    # Health check
    path('health/', views.health_check_view, name='health_check'),

]