from django.shortcuts import render
from django.views.generic import TemplateView

from apps.models import Application


def app_root(request):
    apps = Application.objects.all()
    return render(request, 'apps/root.html', {'apps': apps})