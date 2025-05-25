from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from api.models import DictionaryTerm
from api.serializers.dictionary_serializer import DictionaryTermSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

class DictionaryTermViewSet(viewsets.ModelViewSet):
    queryset = DictionaryTerm.objects.all()
    serializer_class = DictionaryTermSerializer

    # 검색 & 태그(카테고리) 필터
    def get_queryset(self):
        queryset = DictionaryTerm.objects.all()
        category = self.request.query_params.get("category")
        search = self.request.query_params.get("search")

        if category and category != "전체":
            queryset = queryset.filter(category=category)
        if search:
            queryset = queryset.filter(term__icontains=search)

        return queryset

    # ✅ 조회 시 자동 조회수 증가
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # ✅ 좋아요 증가용 커스텀 액션
    @permission_classes([IsAuthenticated])
    @action(detail=True, methods=["post"])
    def like(self, request, pk=None):
        term = self.get_object()
        term.likes += 1
        term.save()
        return Response({"likes": term.likes}, status=status.HTTP_200_OK)

    # ✅ 용어 중복 확인
    @permission_classes([IsAuthenticated])
    @action(detail=False, methods=["get"])
    def check(self, request):
        term = request.query_params.get("term", "")
        exists = DictionaryTerm.objects.filter(term=term).exists()
        return Response({"exists": exists})

    # ✅ 전체 조회수 합산 반환
    @permission_classes([IsAuthenticated])
    @action(detail=False, methods=["get"])
    def total_views(self, request):
        total = DictionaryTerm.objects.aggregate(total_views=Sum("views"))["total_views"] or 0
        return Response({"total_views": total})
