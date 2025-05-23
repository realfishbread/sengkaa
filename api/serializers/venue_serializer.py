from rest_framework import serializers
from api.serializers.booking_serializer import BookingSerializer
from api.models import Venue
from datetime import date

class VenueDetailSerializer(serializers.ModelSerializer):
    main_image_url = serializers.SerializerMethodField()
    
    bookings = BookingSerializer(many=True, read_only=True)  # ✅ 바뀜

    class Meta:
        model = Venue
        fields = '__all__'  # ✅ 모든 필드 다 보여줌 + 아래에 추가된 필드는 따로 포함됨

    def get_main_image_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.main_image.url) if obj.main_image and request else None
    
    def get_bookings(self, obj):
        return [booking.available_date for booking in obj.bookings.order_by('available_date')]
        
class VenueListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    rentalFee = serializers.IntegerField(source='rental_fee')
    type = serializers.CharField(source='venue_type')
    availableDate = serializers.SerializerMethodField()
    view_count = serializers.IntegerField()

    class Meta:
        model = Venue
        fields = ['id', 'name', 'location', 'image', 'rentalFee', 'availableDate', 'type', 'view_count']

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
        from datetime import date
        return date.today().isoformat()  # 예시 값


