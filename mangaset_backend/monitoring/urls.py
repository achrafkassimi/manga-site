# monitoring/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/',   views.dashboard,    name='monitoring-dashboard'),
    path('visits/',      views.visits,       name='monitoring-visits'),
    path('activity/',    views.activity_log, name='monitoring-activity'),
    path('top-content/', views.top_content,  name='monitoring-top-content'),
    path('users/',       views.user_stats,   name='monitoring-users'),
]
