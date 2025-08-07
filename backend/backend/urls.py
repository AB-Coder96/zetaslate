from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin sub-domain handled by the 'admin' app
    path('admin/', admin.site.urls),

    # API sub-domain handled by the 'blog_api' app
    path('api/', include('blogapi.urls')),
]