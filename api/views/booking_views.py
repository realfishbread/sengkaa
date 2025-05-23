from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.serializers.booking_serializer import MyBookedVenueSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_booked_venues(request):
    bookings = request.user.venue_bookings.select_related('venue').order_by('available_date')
    serializer = MyBookedVenueSerializer(bookings, many=True, context={'request': request})
    return Response(serializer.data)
