from django.contrib import admin

from apps.models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['title', 'featured', 'url', 'description', 'date_updated']
    list_editable = ['featured']
    list_filter = ['featured']
    search_fields = ['title', 'url', 'description']
    ordering = ['-featured', 'title']
