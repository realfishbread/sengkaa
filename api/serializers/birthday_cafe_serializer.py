from rest_framework import serializers
from api.models import BirthdayCafe, Goods
class GoodsSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Goods
        fields = ['id', 'name', 'description', 'price', 'image']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None

class BirthdayCafeDetailSerializer(serializers.ModelSerializer):
    goods = GoodsSerializer(many=True, read_only=True)  # related_name='goods'
    image = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()

    class Meta:
        model = BirthdayCafe
        fields = [
            'id', 'cafe_name', 'description', 'genre', 'star',
            'start_date', 'end_date', 'location', 'image', 'goods'
        ]

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None

    def get_location(self, obj):
        return f"{obj.road_address} {obj.detail_address}"
    
class BirthdayCafeListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()

    class Meta:
        model = BirthdayCafe
        fields = ['id', 'cafe_name', 'genre', 'start_date', 'end_date', 'location', 'image']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None

    def get_location(self, obj):
        return f"{obj.road_address} {obj.detail_address}"