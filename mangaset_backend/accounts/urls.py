from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Custom authentication views
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('login/', views.custom_login, name='custom_login'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    
    # JWT token views (alternative)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]