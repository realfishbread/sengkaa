from api.models import Booking, User
from rest_framework import serializers



class BookingUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nickname', 'profile_image_url']

class BookingSerializer(serializers.ModelSerializer):
    user = BookingUserSerializer()

    class Meta:
        model = Booking
        fields = ['available_date', 'user']
        
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