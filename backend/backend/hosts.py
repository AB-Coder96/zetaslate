from django_hosts import patterns, host
from django.urls import include, path
from django.contrib import admin
from backend import urls

urlpatterns = patterns('',
    host(r'www|zetaslate', urls,   name='www'),      # www.zetaslate.com
    host(r'admin',          'backend.host_admin', name='admin'),
    host(r'api',            'backend.host_api',   name='api'),
)
