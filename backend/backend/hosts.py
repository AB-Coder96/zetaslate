from django_hosts import patterns, host
from django.urls import include, path
from django.contrib import admin
from backend import urls

urlpatterns = patterns('',
    # API subdomain - points to your DRF endpoints
    host(r'api', 'backend.host_api', name='api'),
    
    # Admin subdomain - points to Django admin
    host(r'admin', 'backend.host_admin', name='admin'),
    
    # No host pattern for www/root - handled by IIS directly
    # (This is where your frontend is served from)
)