# monitoring/views.py
"""
Admin-only monitoring and analytics endpoints.
All views require is_staff=True.
"""

from django.utils import timezone
from django.db.models import Count, Avg
from django.contrib.auth.models import User
from datetime import timedelta

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from manga.models import Manga, Chapter, ChapterView, ActivityLog, SiteVisit


def _since(days):
    return timezone.now() - timedelta(days=days)


# ── Dashboard ─────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard(request):
    """
    Main monitoring dashboard — 30-day summary.
    GET /api/v1/monitoring/dashboard/
    """
    now   = timezone.now()
    start = now - timedelta(days=30)
    prev  = now - timedelta(days=60)

    visits_now  = SiteVisit.objects.filter(created_at__gte=start).count()
    visits_prev = SiteVisit.objects.filter(created_at__gte=prev, created_at__lt=start).count()
    unique_ips  = SiteVisit.objects.filter(created_at__gte=start).values('ip_address').distinct().count()

    chapter_reads = ChapterView.objects.filter(created_at__gte=start).count()
    avg_reading   = ChapterView.objects.filter(created_at__gte=start).aggregate(avg=Avg('reading_time'))['avg'] or 0

    # Daily visits — last 14 days
    daily_visits = []
    for i in range(13, -1, -1):
        day       = now - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end   = day_start + timedelta(days=1)
        count     = SiteVisit.objects.filter(created_at__gte=day_start, created_at__lt=day_end).count()
        daily_visits.append({'date': day_start.strftime('%Y-%m-%d'), 'visits': count})

    # Device breakdown
    device_breakdown = list(
        SiteVisit.objects.filter(created_at__gte=start)
        .values('device_type').annotate(count=Count('id')).order_by('-count')
    )

    # Top countries
    country_breakdown = list(
        SiteVisit.objects.filter(created_at__gte=start)
        .exclude(country_code='')
        .values('country_code', 'country_name').annotate(count=Count('id')).order_by('-count')[:10]
    )

    # Top manga by chapter reads this period
    top_manga = list(
        ChapterView.objects.filter(created_at__gte=start)
        .values('chapter__manga__title', 'chapter__manga__slug')
        .annotate(reads=Count('id')).order_by('-reads')[:10]
    )

    # Recent activity log
    recent_activity = list(
        ActivityLog.objects.select_related('user').order_by('-created_at')[:20]
        .values('id', 'action_type', 'description', 'severity', 'ip_address', 'created_at', 'user__username')
    )
    for e in recent_activity:
        if e['created_at']:
            e['created_at'] = e['created_at'].isoformat()

    return Response({
        'period_days': 30,
        'summary': {
            'total_visits':             visits_now,
            'visits_prev_period':       visits_prev,
            'unique_visitors':          unique_ips,
            'total_users':              User.objects.count(),
            'new_users_this_period':    User.objects.filter(date_joined__gte=start).count(),
            'chapter_reads':            chapter_reads,
            'avg_reading_time_seconds': round(avg_reading),
            'total_manga':              Manga.objects.count(),
            'total_chapters':           Chapter.objects.count(),
        },
        'device_breakdown':  device_breakdown,
        'country_breakdown': country_breakdown,
        'top_manga':         top_manga,
        'daily_visits':      daily_visits,
        'recent_activity':   recent_activity,
    })


# ── Visits ────────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAdminUser])
def visits(request):
    """GET /api/v1/monitoring/visits/?days=7"""
    days = int(request.query_params.get('days', 7))
    rows = list(
        SiteVisit.objects.filter(created_at__gte=_since(days))
        .select_related('user').order_by('-created_at')[:200]
        .values('id', 'ip_address', 'path', 'device_type',
                'country_code', 'country_name', 'city',
                'referrer', 'created_at', 'user__username')
    )
    for r in rows:
        if r['created_at']:
            r['created_at'] = r['created_at'].isoformat()
    return Response({'count': len(rows), 'results': rows})


# ── Activity log ──────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAdminUser])
def activity_log(request):
    """GET /api/v1/monitoring/activity/?days=7&severity=error"""
    days     = int(request.query_params.get('days', 7))
    severity = request.query_params.get('severity', '')

    qs = ActivityLog.objects.filter(created_at__gte=_since(days)).select_related('user')
    if severity:
        qs = qs.filter(severity=severity)

    rows = list(
        qs.order_by('-created_at')[:200]
        .values('id', 'action_type', 'description', 'severity',
                'ip_address', 'created_at', 'user__username', 'metadata')
    )
    for r in rows:
        if r['created_at']:
            r['created_at'] = r['created_at'].isoformat()
    return Response({'count': len(rows), 'results': rows})


# ── Top content ───────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAdminUser])
def top_content(request):
    """GET /api/v1/monitoring/top-content/"""
    return Response({
        'top_manga': list(
            Manga.objects.order_by('-view_count')[:20]
            .values('id', 'title', 'slug', 'view_count', 'average_rating', 'status')
        ),
        'top_chapters': list(
            Chapter.objects.order_by('-view_count')[:20]
            .values('id', 'title', 'chapter_number', 'view_count', 'manga__title', 'manga__slug')
        ),
    })


# ── User stats ────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_stats(request):
    """GET /api/v1/monitoring/users/"""
    now = timezone.now()
    daily_signups = []
    for i in range(29, -1, -1):
        day       = now - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end   = day_start + timedelta(days=1)
        count     = User.objects.filter(date_joined__gte=day_start, date_joined__lt=day_end).count()
        daily_signups.append({'date': day_start.strftime('%Y-%m-%d'), 'signups': count})

    active_readers = list(
        ChapterView.objects.filter(user__isnull=False)
        .values('user__username').annotate(reads=Count('id')).order_by('-reads')[:10]
    )

    return Response({
        'total_users':         User.objects.count(),
        'active_users':        User.objects.filter(is_active=True).count(),
        'staff_users':         User.objects.filter(is_staff=True).count(),
        'daily_signups_30d':   daily_signups,
        'most_active_readers': active_readers,
    })
