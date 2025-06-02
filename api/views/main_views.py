# views.py
from rest_framework.generics import ListAPIView
from api.models import MainBanner
from api.serializers.main_serializer import MainBannerSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes


class MainBannerListView(ListAPIView):
    queryset = MainBanner.objects.filter(is_active=True)
    serializer_class = MainBannerSerializer
    permission_classes = [AllowAny]  # ✅ 이렇게