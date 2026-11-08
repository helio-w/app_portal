from django.urls import path, include
from rest_framework import routers

import apps.views as views

router = routers.DefaultRouter()
router.register(r'applications', views.ApplicationViewSet, basename='applications')


urlpatterns = [
    path('api/', include(router.urls)),
]