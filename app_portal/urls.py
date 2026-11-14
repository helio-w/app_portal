from django.contrib import admin
from django.urls import path, include, re_path
from django.views.static import serve
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    # It's OK to do that here because it's a small project that have few users ! Don't throw me into a fire for doing that lol
    # Must stay before the apps urls: they end with the SPA catch-all.
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    path('', include('apps.urls')),
]