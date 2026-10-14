from django.urls import path, include
from rest_framework import routers

import apps.views as views

router = routers.DefaultRouter()
router.register(r'applications', views.ApplicationViewSet, basename='applications')


urlpatterns = [
    path('', views.app_root, name='index'),
    path('api/', include(router.urls)),
]