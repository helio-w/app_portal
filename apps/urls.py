from django.conf import settings
from django.http.response import Http404, FileResponse
from django.urls import path, include, re_path
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import routers

import apps.views as views

router = routers.DefaultRouter()
router.register(r'applications', views.ApplicationViewSet, basename='applications')

@never_cache
@ensure_csrf_cookie
def spa(request):
    index = settings.FRONTEND_DIST / 'index.html'
    if not index.exists():
        raise Http404("Frontend not found")
    return FileResponse(open(index, "rb"), content_type="text/html")

urlpatterns = [
    path('api/', include(router.urls)),
    re_path(r"^(?!api|/admin|/static/).*$", spa)
]