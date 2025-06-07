from rest_framework import serializers
from api.serializers.booking_serializer import BookingSerializer
from api.serializers.auth_serializers import UserSerializer
from api.models import Venue, User
from datetime import date

class VenueDetailSerializer(serializers.ModelSerializer):
    main_image_url = serializers.SerializerMethodField()
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    organizer_verified = serializers.SerializerMethodField()  # ✅ 추가
    bookings = BookingSerializer(many=True, read_only=True)  # ✅ 바뀜
    owner = UserSerializer(read_only=True)  # ✅ 이 줄이 필요해

    class Meta:
        model = Venue
        fields = '__all__'  # ✅ 모든 필드 다 보여줌 + 아래에 추가된 필드는 따로 포함됨
        read_only_fields = ['owner']

    def get_main_image_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.main_image.url) if obj.main_image and request else None
    
    def get_bookings(self, obj):
        return [booking.available_date for booking in obj.bookings.order_by('available_date')]

    def get_organizer_verified(self, obj):
        return obj.owner.organizer_verified if obj.owner else False

class VenueListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    rentalFee = serializers.IntegerField(source='rental_fee')
    type = serializers.CharField(source='venue_type')
    availableDate = serializers.SerializerMethodField()
    view_count = serializers.IntegerField()

    class Meta:
        model = Venue
        fields = '__all__'

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


