from django.contrib import admin

from apps.models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['title', 'url', 'description', 'date_updated']
    search_fields = ['title', 'url', 'description']
    ordering = ['title']
