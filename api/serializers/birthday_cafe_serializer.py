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
    type = serializers.CharField(source='genre')  # genre를 type으로 보여줄 거라면
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    goods = GoodsSerializer(many=True, read_only=True)

    class Meta:
        model = BirthdayCafe
        fields = [
            'id', 'cafe_name', 'description', 'genre', 'star',
            'start_date', 'end_date', 'location', 'image', 'goods', 'like_count', 'is_liked', 'view_count', 'goods'
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
    
    def get_like_count(self, obj):
        return obj.liked_events.count()

    def get_is_liked(self, obj):
        user = self.context.get("request").user
        return obj.liked_events.filter(user_id=user.user_id).exists() if user.is_authenticated else False
    
class BirthdayCafeListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    view_count = serializers.IntegerField(read_only=True)
    goods = GoodsSerializer(many=True, read_only=True)

    class Meta:
        model = BirthdayCafe
        fields = ['id', 'cafe_name', 'genre', 'start_date', 'end_date', 'location', 'image', 'like_count', 'is_liked', 'view_count', 'goods']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None

    def get_location(self, obj):
        return f"{obj.road_address} {obj.detail_address}"
    
    def get_like_count(self, obj):
        return obj.liked_events.count()  # ✅ 이름 변경 반영

    def get_is_liked(self, obj):
        user = self.context.get("request").user
        return obj.liked_events.filter(user_id=user.user_id).exists() if user.is_authenticated else False

    
    