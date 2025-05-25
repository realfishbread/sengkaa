from rest_framework import serializers
from api.serializers.star_serializer import StarSerializer
from api.models import BirthdayCafe, Goods, Star
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
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    goods = GoodsSerializer(many=True, read_only=True)  # related_name='goods'
    image = serializers.ImageField(required=False)  # ✅ write용 필드 추가
    image_url = serializers.SerializerMethodField()  # ✅ 조회용 필드 따로
    location = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    goods = GoodsSerializer(many=True, read_only=True)
    latitude = serializers.FloatField(required=False, allow_null=True)
    longitude = serializers.FloatField(required=False, allow_null=True)

    class Meta:
        model = BirthdayCafe
        fields ='__all__'

    def get_image_url(self, obj):
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
    
    def get_star(self, obj):
        return {
            "id": obj.star.id,
            "name": obj.star.name,
            "group": obj.star.group,
            "display": obj.star.display,
            "image": self.context['request'].build_absolute_uri(obj.star.image.url) if obj.star.image else None,
        }
    
class BirthdayCafeListSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    image = serializers.ImageField(required=False)  # ✅ write용 필드 추가
    image_url = serializers.SerializerMethodField()  # ✅ 조회용 필드 따로
    location = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    view_count = serializers.IntegerField(read_only=True)
    goods = GoodsSerializer(many=True, read_only=True)
    latitude = serializers.FloatField(required=False, allow_null=True)
    longitude = serializers.FloatField(required=False, allow_null=True)
    star_display = serializers.CharField(source='star.display', read_only=True)

    class Meta:
        model = BirthdayCafe
        fields = '__all__'

    def get_image_url(self, obj):
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

    