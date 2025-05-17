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
    
class BirthdayCafeDetailAPIView(RetrieveAPIView):
    queryset = BirthdayCafe.objects.all()
    serializer_class = BirthdayCafeDetailSerializer
    lookup_field = 'id'