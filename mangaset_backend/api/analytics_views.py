# api/analytics_views.py
"""
Analytics and monitoring API views.
Admin-only endpoints that aggregate site-wide statistics.
"""

from django.utils import timezone
from django.db.models import Count, Avg, Sum, Q
from django.contrib.auth.models import User
from datetime import timedelta

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from manga.models import (
    Manga, Chapter, ChapterView, ActivityLog, SiteVisit,
)


def _date_range(days):
    return timezone.now() - timedelta(days=days)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def analytics_dashboard(request):
    """
    Main dashboard: key metrics for the last 30 days compared to previous 30.
    GET /api/v1/analytics/dashboard/
    """
    now = timezone.now()
    period_start = now - timedelta(days=30)
    prev_start = now - timedelta(days=60)

    # ── Visits ──────────────────────────────────────────────────────────────
    visits_current = SiteVisit.objects.filter(created_at__gte=period_start).count()
    visits_prev = SiteVisit.objects.filter(
        created_at__gte=prev_start, created_at__lt=period_start
    ).count()

    unique_ips_current = (
        SiteVisit.objects.filter(created_at__gte=period_start)
        .values('ip_address').distinct().count()
    )

    # ── Users ────────────────────────────────────────────────────────────────
    total_users = User.objects.count()
    new_users = User.objects.filter(date_joined__gte=period_start).count()

    # ── Chapter reads ────────────────────────────────────────────────────────
    chapter_reads = ChapterView.objects.filter(created_at__gte=period_start).count()
    avg_reading_time = (
        ChapterView.objects.filter(created_at__gte=period_start)
        .aggregate(avg=Avg('reading_time'))['avg'] or 0
    )

    # ── Content ──────────────────────────────────────────────────────────────
    total_manga = Manga.objects.count()
    total_chapters = Chapter.objects.count()

    # ── Device breakdown (last 30 days) ──────────────────────────────────────
    device_breakdown = list(
        SiteVisit.objects.filter(created_at__gte=period_start)
        .values('device_type')
        .annotate(count=Count('id'))
        .order_by('-count')
    )

    # ── Country breakdown (last 30 days, top 10) ─────────────────────────────
    country_breakdown = list(
        SiteVisit.objects.filter(created_at__gte=period_start)
        .exclude(country_code='')
        .values('country_code', 'country_name')
        .annotate(count=Count('id'))
        .order_by('-count')[:10]
    )

    # ── Top manga by chapter reads (last 30 days) ─────────────────────────────
    top_manga = list(
        ChapterView.objects.filter(created_at__gte=period_start)
        .values('chapter__manga__title', 'chapter__manga__slug')
        .annotate(reads=Count('id'))
        .order_by('-reads')[:10]
    )

    # ── Daily visits for chart (last 14 days) ────────────────────────────────
    daily_visits = []
    for i in range(13, -1, -1):
        day = now - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        count = SiteVisit.objects.filter(
            created_at__gte=day_start, created_at__lt=day_end
        ).count()
        daily_visits.append({
            'date': day_start.strftime('%Y-%m-%d'),
            'visits': count,
        })

    # ── Recent activity log (last 20 entries) ────────────────────────────────
    recent_activity = list(
        ActivityLog.objects.select_related('user')
        .order_by('-created_at')[:20]
        .values(
            'id', 'action_type', 'description', 'severity',
            'ip_address', 'created_at', 'user__username',
        )
    )
    for entry in recent_activity:
        if entry['created_at']:
            entry['created_at'] = entry['created_at'].isoformat()

    return Response({
        'period_days': 30,
        'summary': {
            'total_visits': visits_current,
            'visits_prev_period': visits_prev,
            'unique_visitors': unique_ips_current,
            'total_users': total_users,
            'new_users_this_period': new_users,
            'chapter_reads': chapter_reads,
            'avg_reading_time_seconds': round(avg_reading_time),
            'total_manga': total_manga,
            'total_chapters': total_chapters,
        },
        'device_breakdown': device_breakdown,
        'country_breakdown': country_breakdown,
        'top_manga': top_manga,
        'daily_visits': daily_visits,
        'recent_activity': recent_activity,
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def analytics_visits(request):
    """
    Paginated site visits list.
    GET /api/v1/analytics/visits/?days=7&page=1
    """
    days = int(request.query_params.get('days', 7))
    since = _date_range(days)

    visits = list(
        SiteVisit.objects.filter(created_at__gte=since)
        .select_related('user')
        .order_by('-created_at')[:200]
        .values(
            'id', 'ip_address', 'path', 'device_type',
            'country_code', 'country_name', 'city',
            'referrer', 'created_at', 'user__username',
        )
    )
    for v in visits:
        if v['created_at']:
            v['created_at'] = v['created_at'].isoformat()

    return Response({'count': len(visits), 'results': visits})


@api_view(['GET'])
@permission_classes([IsAdminUser])
def analytics_activity_log(request):
    """
    Paginated activity log.
    GET /api/v1/analytics/activity/?severity=error&days=7
    """
    days = int(request.query_params.get('days', 7))
    severity = request.query_params.get('severity', '')
    since = _date_range(days)

    qs = ActivityLog.objects.filter(created_at__gte=since).select_related('user')
    if severity:
        qs = qs.filter(severity=severity)

    entries = list(
        qs.order_by('-created_at')[:200]
        .values(
            'id', 'action_type', 'description', 'severity',
            'ip_address', 'created_at', 'user__username', 'metadata',
        )
    )
    for e in entries:
        if e['created_at']:
            e['created_at'] = e['created_at'].isoformat()

    return Response({'count': len(entries), 'results': entries})


@api_view(['GET'])
@permission_classes([IsAdminUser])
def analytics_top_content(request):
    """
    Top manga and chapters by all-time view count.
    GET /api/v1/analytics/top-content/
    """
    top_manga = list(
        Manga.objects.order_by('-view_count')[:20]
        .values('id', 'title', 'slug', 'view_count', 'average_rating', 'status')
    )
    top_chapters = list(
        Chapter.objects.order_by('-view_count')[:20]
        .values('id', 'title', 'chapter_number', 'view_count', 'manga__title', 'manga__slug')
    )

    return Response({
        'top_manga': top_manga,
        'top_chapters': top_chapters,
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def analytics_user_stats(request):
    """
    User registration and activity stats.
    GET /api/v1/analytics/users/
    """
    now = timezone.now()

    daily_signups = []
    for i in range(29, -1, -1):
        day = now - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        count = User.objects.filter(
            date_joined__gte=day_start, date_joined__lt=day_end
        ).count()
        daily_signups.append({'date': day_start.strftime('%Y-%m-%d'), 'signups': count})

    # Most active readers
    active_readers = list(
        ChapterView.objects.filter(user__isnull=False)
        .values('user__username')
        .annotate(reads=Count('id'))
        .order_by('-reads')[:10]
    )

    return Response({
        'total_users': User.objects.count(),
        'active_users': User.objects.filter(is_active=True).count(),
        'staff_users': User.objects.filter(is_staff=True).count(),
        'daily_signups_30d': daily_signups,
        'most_active_readers': active_readers,
    })
