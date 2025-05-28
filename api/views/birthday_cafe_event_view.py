from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from api.models import BirthdayCafe
from api.serializers.birthday_cafe_serializer import BirthdayCafeDetailSerializer, BirthdayCafeListSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from django.db.models import F
import math
from rest_framework.views import APIView
from django.db.models import Count

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def create_birthday_event(request):
    data = request._request.POST.copy()
    files = request._request.FILES

    goods = []
    i = 0
    while f'goods[{i}][name]' in data:
        goods.append({
            'name': data.get(f'goods[{i}][name]'),
            'description': data.get(f'goods[{i}][description]', ''),
            'price': data.get(f'goods[{i}][price]'),
            'image': files.get(f'goods[{i}][image]'),
        })
        i += 1

    payload = {
        'cafe_name': data.get('cafe_name'),
        'description': data.get('description'),
        'road_address': data.get('road_address'),
        'detail_address': data.get('detail_address'),
        'start_date': data.get('start_date'),
        'end_date': data.get('end_date'),
        'genre': data.get('genre'),
        'star': data.get('star'),
        'image': files.get('image'),
        'goods': goods,
    }

    serializer = BirthdayCafeDetailSerializer(data=payload, context={'request': request})
    if serializer.is_valid():
        serializer.save(user=request.user)  # ✅ 핵심!
        return Response({"message": "이벤트 등록 성공", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class BirthdayCafeSearchAPIView(ListAPIView):
    serializer_class = BirthdayCafeListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = BirthdayCafe.objects.all()

        keyword = self.request.query_params.get('keyword')
        genre = self.request.query_params.get('genre')
        star_id = self.request.query_params.get('star_id')
        star_genre = self.request.query_params.get('star_genre')  # ⭐️ 장르 필터
        start_date = self.request.query_params.get('startDate')
        end_date = self.request.query_params.get('endDate')
        sort = self.request.query_params.get('sort')

        if keyword:
            queryset = queryset.filter(cafe_name__icontains=keyword)

        if genre:
            queryset = queryset.filter(genre=genre)

        if star_id:
            queryset = queryset.filter(star__id=star_id)

        if star_genre:
            queryset = queryset.filter(star__genre__name__iexact=star_genre)  # ⭐️ 장르 이름으로 필터

        if start_date:
            queryset = queryset.filter(start_date__gte=start_date)

        if end_date:
            queryset = queryset.filter(end_date__lte=end_date)

        if sort == 'latest':
            queryset = queryset.order_by('-created_at')
        elif sort == 'likes':
            queryset = list(queryset)
            queryset.sort(key=lambda x: x.liked_events.count(), reverse=True)
        elif sort == 'views':
            queryset = queryset.order_by('-view_count')

        return queryset

    
class BirthdayCafeDetailAPIView(RetrieveAPIView):
    queryset = BirthdayCafe.objects.all()
    serializer_class = BirthdayCafeDetailSerializer
    lookup_field = 'id'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count += 1  # ✅ 조회수 증가
        instance.save(update_fields=['view_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # 찜한 생일 카페
def toggle_like_cafe(request, cafe_id):
    try:
        cafe = BirthdayCafe.objects.get(id=cafe_id)
    except BirthdayCafe.DoesNotExist:
        return Response({"error": "해당 카페가 존재하지 않습니다."}, status=404)

    user = request.user

    if user in cafe.liked_events.all():  # ✅ 여기!
        cafe.liked_events.remove(user)
        return Response({"message": "찜 취소"}, status=200)
    else:
        cafe.liked_events.add(user)
        return Response({"message": "찜 추가"}, status=200)
    
    
    
@api_view(['GET'])
def nearby_birthday_cafes(request):
    lat = float(request.query_params.get('lat', 0))
    lng = float(request.query_params.get('lng', 0))
    radius_km = float(request.query_params.get('radius', 5))  # km 단위

    def haversine(lat1, lng1, lat2, lng2):
        R = 6371
        d_lat = math.radians(lat2 - lat1)
        d_lng = math.radians(lng2 - lng1)
        a = (math.sin(d_lat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(d_lng / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    cafes = BirthdayCafe.objects.exclude(latitude=None).exclude(longitude=None)
    nearby = [cafe for cafe in cafes if haversine(lat, lng, cafe.latitude, cafe.longitude) <= radius_km]

    serializer = BirthdayCafeListSerializer(nearby, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def liked_birthday_cafes(request):
    user = request.user
    liked_events = user.liked_cafes.all()  # ✅ related_name='liked_cafes'
    serializer = BirthdayCafeListSerializer(
        liked_events, many=True, context={'request': request}
    )
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calendar_liked_cafes(request):
    user = request.user
    liked_events = user.liked_cafes.all()

    # 달력용 간단한 형태로 가공
    calendar_data = []
    for cafe in liked_events:
        calendar_data.append({
            "id": cafe.id,
            "title": cafe.cafe_name,
            "start": str(cafe.start_date),
            "end": str(cafe.end_date),
        })

    return Response(calendar_data)