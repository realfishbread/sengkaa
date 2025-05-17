from rest_framework import serializers
from api.models import Venue
from datetime import date

class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
        
class VenueListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    rentalFee = serializers.IntegerField(source='rental_fee')
    type = serializers.CharField(source='venue_type')
    availableDate = serializers.SerializerMethodField()

    class Meta:
        model = Venue
        fields = ['id', 'name', 'location', 'image', 'rentalFee', 'availableDate', 'type']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.main_image and request:
            return request.build_absolute_uri(obj.main_image.url)
        elif obj.main_image:
            return obj.main_image.url
        return None

    def get_location(self, obj):
        return f"{obj.road_address} {obj.detail_address}"

    def get_availableDate(self, obj):
        # 🚨 나중에 실제 예약 가능한 날짜 모델과 연결해서 바꿔야 함
        return date.today().isoformat()