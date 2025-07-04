# backend/backend/hosts.py
from django_hosts import patterns, host

host_patterns = patterns(
    '',
    host(r'api',   'backend.host_api',   name='api'),
    host(r'admin', 'backend.host_admin', name='admin'),
)
