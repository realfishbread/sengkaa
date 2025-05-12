from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from api.models import Venue
from api.serializers.venue_serializer import VenueSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_venue(request):
    serializer = VenueSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)  # 유저 저장
        return Response({'message': '장소가 등록되었습니다!', 'data': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
