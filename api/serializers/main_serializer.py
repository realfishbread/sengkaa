# serializers.py
from rest_framework import serializers
from api.models import MainBanner

class MainBannerSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = MainBanner
        fields = ['id', 'image', 'caption', 'link']