from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework import viewsets


from apps.models import Application
from apps.serializers import ApplicationSerializer


def app_root(request):
    apps = Application.objects.all()
    return render(request, 'apps/root.html', {'apps': apps})

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer