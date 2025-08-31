import time
from django.core.cache import cache
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
import logging

logger = logging.getLogger(__name__)

class RateLimitMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.path.startswith('/api/'):
            ip = self.get_client_ip(request)
            cache_key = f'rate_limit_{ip}'
            
            # Allow 100 requests per minute per IP
            requests = cache.get(cache_key, 0)
            if requests >= 100:
                return JsonResponse({
                    'error': 'Rate limit exceeded',
                    'detail': 'Too many requests. Please try again later.'
                }, status=429)
            
            cache.set(cache_key, requests + 1, 60)  # 1 minute timeout
        
        return None
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class ErrorHandlingMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        if request.path.startswith('/api/'):
            logger.error(f"API Error: {str(exception)}", exc_info=True)
            return JsonResponse({
                'error': 'Internal server error',
                'detail': 'An unexpected error occurred.'
            }, status=500)
        return None