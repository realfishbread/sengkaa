from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
# 모델
from api.models import Post, Reply

# 시리얼라이저
from api.serializers.board_serializers import PostSerializer, ReplySerializer







# 📩 저장하기
class PostCreateView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, is_approved=True)
# 📄 전체 목록 불러오기
class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        status = self.request.query_params.get('status')  # ?status=open
        queryset = Post.objects.all().order_by('-created_at')
        if status:
            queryset = queryset.filter(status=status)
        return queryset
# 모집중인 것만 불러오기
class OpenPostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(status='open').order_by('-created_at')

# 📄 모집완료 글 목록
class ClosedPostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(status='closed').order_by('-created_at')

# 게시글에 답글 기능
class ReplyCreateView(generics.CreateAPIView):
    serializer_class = ReplySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)        
        
#답글 전체 보기 
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def reply_list_view(request, post_id):
    replies = Reply.objects.filter(post_id=post_id).order_by("created_at")
    serializer = ReplySerializer(replies, many=True)
    return Response(serializer.data)

