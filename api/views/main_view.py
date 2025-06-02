# views.py
from rest_framework.generics import ListAPIView
from api.models import MainBanner
from api.serializers.main_serializer import MainBannerSerializer

class MainBannerListView(ListAPIView):
    queryset = MainBanner.objects.filter(is_active=True)
    serializer_class = MainBannerSerializer