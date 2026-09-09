from django.urls import path
import apps.views as views

urlpatterns = [
    path('', views.app_root, name='index'),
]