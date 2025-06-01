from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db.models import Sum
from api.models import DictionaryTerm
from api.serializers.dictionary_serializer import DictionaryTermSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from api.permissions import IsOwnerOrReadOnly  # ✅ 커스텀 권한 클래스 임포트

class DictionaryTermViewSet(viewsets.ModelViewSet):
    queryset = DictionaryTerm.objects.all()
    serializer_class = DictionaryTermSerializer  # ✅ 전체는 인증 없이 허용
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'check', 'total_views'] or self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = DictionaryTerm.objects.all()
        category = self.request.query_params.get("category")
        search = self.request.query_params.get("search")

        if category and category != "전체":
            queryset = queryset.filter(category=category)
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