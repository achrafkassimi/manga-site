import time
import re
from django.core.cache import cache
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
import logging

logger = logging.getLogger(__name__)

# Paths to skip when recording SiteVisit (static assets, admin, media)
_SKIP_VISIT_PATTERN = re.compile(
    r'^(/admin|/static|/media|/favicon\.ico|/api/v1/analytics)'
)

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

class SiteVisitMiddleware(MiddlewareMixin):
    """Record every frontend page request as a SiteVisit (async, non-blocking)."""

    def process_response(self, request, response):
        if _SKIP_VISIT_PATTERN.match(request.path):
            return response
        # Only track successful GET requests (not API calls)
        if request.method != 'GET' or request.path.startswith('/api/'):
            return response

        try:
            from manga.models import SiteVisit

            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            ip = x_forwarded_for.split(',')[0].strip() if x_forwarded_for else request.META.get('REMOTE_ADDR', '')

            user_agent = request.META.get('HTTP_USER_AGENT', '')
            device_type = 'mobile' if any(m in user_agent.lower() for m in ('mobile', 'android', 'iphone')) else \
                          'tablet' if 'tablet' in user_agent.lower() or 'ipad' in user_agent.lower() else 'desktop'

            SiteVisit.objects.create(
                user=request.user if request.user.is_authenticated else None,
                ip_address=ip or '0.0.0.0',
                path=request.path,
                query_string=request.META.get('QUERY_STRING', ''),
                referrer=request.META.get('HTTP_REFERER', ''),
                user_agent=user_agent[:500],
                device_type=device_type,
                session_id=request.session.session_key or '',
            )
        except Exception:
            pass  # Never let tracking break the response

        return response


class ErrorHandlingMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        if request.path.startswith('/api/'):
            logger.error(f"API Error: {str(exception)}", exc_info=True)
            return JsonResponse({
                'error': 'Internal server error',
                'detail': 'An unexpected error occurred.'
            }, status=500)
        return None