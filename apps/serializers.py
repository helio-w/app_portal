from rest_framework.serializers import ModelSerializer

from apps.models import Application


class ApplicationSerializer(ModelSerializer):
    class Meta:
        model = Application
        fields = ['id', 'title', 'url', 'icon', 'description', 'date_added', 'date_updated']
        read_only_fields = ['date_added', 'date_updated']