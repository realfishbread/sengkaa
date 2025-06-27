from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from api.models import Star
from api.serializers.star_serializer import StarSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def get_star_list(request):
    genre = request.query_params.get('genre')  # 예: ?genre=1 또는 ?genre=idol
    if genre:
        try:
            # 숫자로 들어온 경우 (id 기반 필터링)
            genre_ids = genre.split(',')  # <- 이렇게 받아서
            stars = Star.objects.filter(genre__id__in=genre_ids)
        except ValueError:
            # 문자열로 들어온 경우 (장르 이름 기반 필터링)
            stars = Star.objects.filter(genre__name=genre)
    else:
        stars = Star.objects.all()

    serializer = StarSerializer(stars, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def stars_by_genre(request):
    genre_id = request.query_params.get('genre_id')
    stars = Star.objects.filter(genre__id=genre_id).values('id', 'name', 'group')
    return Response(list(stars))


@api_view(['GET'])
@permission_classes([AllowAny])
def star_groups_by_genre(request):
    genre_id = request.query_params.get('genre_id')
    if not genre_id:
        return Response({"error": "genre_id is required"}, status=400)

    # 쉼표가 있든 없든 안전하게 리스트화
    genre_ids = [gid.strip() for gid in genre_id.split(',') if gid.strip().isdigit()]

    if not genre_ids:
        return Response({"error": "No valid genre_id"}, status=400)

    group_names = (
        Star.objects.filter(genre__id__in=genre_ids)
        .exclude(group__isnull=True)
        .exclude(group__exact="")
        .values_list("group", flat=True)
        .distinct()
    )

    return Response(sorted(group_names))