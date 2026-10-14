from rest_framework.serializers import ModelSerializer

from apps.models import Application


class ApplicationSerializer(ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'