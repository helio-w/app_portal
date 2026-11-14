from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.models import Application
from apps.serializers import ApplicationSerializer


class ApplicationViewSet(viewsets.ModelViewSet):
    # Writes are restricted to staff by DEFAULT_PERMISSION_CLASSES (settings/base.py).
    queryset = Application.objects.order_by("title")
    serializer_class = ApplicationSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def current_user(request):
    user = request.user
    return Response({
        "is_authenticated": user.is_authenticated,
        "is_staff": user.is_staff,
        "username": user.get_username() if user.is_authenticated else None,
    })
