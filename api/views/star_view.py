from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from api.models import Star
from api.serializers import StarSerializer

@api_view(['GET'])
@permission_classes([AllowAny])  # 로그인 필요 없게
def get_star_list(request):
    genre = request.query_params.get('genre')  # ?genre=idol 같은 필터
    if genre:
        stars = Star.objects.filter(genre=genre)
    else:
        stars = Star.objects.all()
    serializer = StarSerializer(stars, many=True)
    return Response(serializer.data)
