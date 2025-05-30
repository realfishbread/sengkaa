from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from api.models import Venue
from api.serializers.venue_serializer import VenueDetailSerializer, VenueListSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_venue(request):
    serializer = VenueDetailSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        serializer.save()  # 유저 저장
        return Response({'message': '장소가 등록되었습니다!', 'data': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([AllowAny])
class VenueSearchAPIView(ListAPIView):
    serializer_class = VenueListSerializer
    permission_classes = [AllowAny]  # ⬅️ 명시적으로 모든 사용자 허용

    def get_queryset(self):
        queryset = Venue.objects.all()
        keyword = self.request.query_params.get('keyword')
        venue_type = self.request.query_params.get('type')
        sort = self.request.query_params.get('sort')  # 👈 추가
        start_date = self.request.query_params.get('start_date')  # 👈 나중에 예약 모델 있으면 필터
        end_date = self.request.query_params.get('end_date')

        if keyword:
            queryset = queryset.filter(name__icontains=keyword)

        if venue_type:
            queryset = queryset.filter(venue_type=venue_type)

        if sort == 'latest':
            queryset = queryset.order_by('-created_at')
        elif sort == 'price_asc':
            queryset = queryset.order_by('rental_fee')
        elif sort == 'price_desc':
            queryset = queryset.order_by('-rental_fee')
        elif sort == 'view_desc':  # ✅ 추가된 정렬 옵션
            queryset = queryset.order_by('-view_count')

        return queryset
    
@api_view(['GET'])
@permission_classes([AllowAny])
def venue_detail(request, venue_id):
    try:
        venue = Venue.objects.get(id=venue_id)
        venue.view_count += 1  # ✅ 조회수 증가
        venue.save(update_fields=['view_count'])
    except Venue.DoesNotExist:
        return Response({"error": "존재하지 않는 대관 장소입니다."}, status=404)

    serializer = VenueDetailSerializer(venue, context={'request': request})
    return Response(serializer.data)