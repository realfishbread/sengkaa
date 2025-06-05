from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db.models import Sum
from api.models import DictionaryTerm
from api.serializers.dictionary_serializer import DictionaryTermSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from api.permissions import IsOwnerOrReadOnly  # ✅ 커스텀 권한 클래스 임포트
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from api.models import Star, Genre  # Star 모델 import
from collections import defaultdict

class DictionaryTermViewSet(viewsets.ModelViewSet):
    queryset = DictionaryTerm.objects.all()
    serializer_class = DictionaryTermSerializer  # ✅ 전체는 인증 없이 허용
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'check', 'total_views'] or self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticatedOrReadOnly()]

    def get_queryset(self):
        queryset = DictionaryTerm.objects.all()
        genre = self.request.query_params.get("genre")  # ✅ category → genre로 바꿈
        search = self.request.query_params.get("search")

        if genre and genre != "전체":
            queryset = queryset.filter(star_group__genre__name=genre).distinct()

        if search:
            queryset = queryset.filter(term__icontains=search)

        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # ✅ POST 요청인 like만 인증 필요하게 설정
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        term = self.get_object()
        term.likes += 1
        term.save()
        return Response({"likes": term.likes}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def check(self, request):
        term = request.query_params.get("term", "")
        exists = DictionaryTerm.objects.filter(term=term).exists()
        return Response({"exists": exists})

    @action(detail=False, methods=["get"])
    def total_views(self, request):
        total = DictionaryTerm.objects.aggregate(total_views=Sum("views"))["total_views"] or 0
        return Response({"total_views": total})
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"], url_path="grouped-by-star-group")
    def grouped_by_star_group(self, request):
        terms = DictionaryTerm.objects.prefetch_related('star_group')
        grouped = defaultdict(list)
        genre_id = request.query_params.get("genre_id")
        if genre_id:
            terms = terms.filter(genre__id=genre_id)

        for term in terms:
            for star in term.star_group.all():
                if star.group:  # 그룹명이 존재할 때만
                    grouped[star.group].append({
                        "id": term.id,
                        "term": term.term,
                        "likes": term.likes,
                        "views": term.views,
                    })

        return Response(grouped)
    
    @action(detail=False, methods=["get"], url_path="terms-by-genre")
    def get_terms_by_genre(self, request):
        genre_id = request.query_params.get("genre_id")
        try:
            genre = Genre.objects.get(id=genre_id)
            terms = DictionaryTerm.objects.filter(genre=genre)
            serializer = DictionaryTermSerializer(terms, many=True)
            return Response(serializer.data)
        except Genre.DoesNotExist:
            return Response({'error': '장르가 존재하지 않음'}, status=404)
        
    @action(detail=False, methods=["get"], url_path="star-groups")
    def star_groups_by_genre(self, request):
        genre_id = request.query_params.get("genre_id")
        if not genre_id:
            return Response({"error": "genre_id is required"}, status=400)

        terms = DictionaryTerm.objects.filter(genre__id=genre_id).prefetch_related('star_group')

        star_group_names = set()
        for term in terms:
            for star in term.star_group.all():
                if star.group:
                    star_group_names.add(star.group)

        return Response(sorted(star_group_names))
    
    