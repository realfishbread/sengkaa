from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from api.models import BirthdayCafe
from api.serializers.birthday_cafe_serializer import BirthdayCafeDetailSerializer, BirthdayCafeListSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny

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
        start_date = self.request.query_params.get('startDate')
        end_date = self.request.query_params.get('endDate')

        if keyword:
            queryset = queryset.filter(cafe_name__icontains=keyword)

        if genre:
            queryset = queryset.filter(genre=genre)

        if start_date:
            queryset = queryset.filter(start_date__gte=start_date)

        if end_date:
            queryset = queryset.filter(end_date__lte=end_date)

        return queryset
    def get_serializer_context(self):
        return {'request': self.request}  # 🔥 사용자 정보 포함 (is_liked 계산용)
    
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