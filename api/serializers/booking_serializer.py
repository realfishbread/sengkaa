from api.models import Booking, User
from rest_framework import serializers


# 예약한 사람 정보 (id, nickname, 프로필 이미지)
class BookingUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nickname', 'profile_image_url']

# 특정 날짜에 누가 예약했는지 보여줄 때
class BookingSerializer(serializers.ModelSerializer):
    user = BookingUserSerializer()

    class Meta:
        model = Booking
        fields = ['available_date', 'user']
        
# 내가 예약한 venue + 날짜 정보를 보여줄 때
class MyBookedVenueSerializer(serializers.ModelSerializer):
    venue = serializers.SerializerMethodField()
    available_date = serializers.DateField()

    class Meta:
        model = Booking
        fields = ['available_date', 'venue']

    def get_venue(self, obj):
        return {
            "id": obj.venue.id,
            "name": obj.venue.name,
            "image": self.context['request'].build_absolute_uri(obj.venue.main_image.url) if obj.venue.main_image else None,
            "location": f"{obj.venue.road_address} {obj.venue.detail_address}",
            "rental_fee": obj.venue.rental_fee,
        }