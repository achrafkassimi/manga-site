"""
URL configuration for mangaset_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# mangaset_backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    """API root endpoint"""
    return JsonResponse({
        'message': 'Welcome to MangaSet API',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/v1/auth/',
            'manga': '/api/v1/',
            'admin': '/admin/',
            'health': '/api/v1/auth/health/',
        }
    })

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),
    
    # API root
    path('api/', api_root, name='api_root'),
    
    # FIXED: API v1 endpoints - match frontend expectations
    path('api/v1/auth/', include('accounts.urls')),  # ✅ Changed from /api/auth/
    path('api/v1/', include('api.urls')),             # ✅ Keep existing API endpoints
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)