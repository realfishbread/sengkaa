from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from api.models import Post, Reply
from rest_framework.views import APIView

from api.serializers.board_serializers import PostSerializer, ReplySerializer

from django.shortcuts import get_object_or_404






# 📩 저장하기
class PostCreateView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, is_approved=True)
        return Response(serializer.data, status=201)

#게시글 삭제
class PostDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)

        if post.user != request.user:
            return Response({"error": "권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response({"message": "게시글 삭제 완료!"}, status=status.HTTP_204_NO_CONTENT)    
    
    
# 📄 전체 목록 불러오기
class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        status = self.request.query_params.get('status')  # ?status=open
        queryset = Post.objects.all().order_by('-created_at')
        if status:
            queryset = queryset.filter(status=status)
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})  # ✅ 이거 꼭 넣어야 build_absolute_uri 동작함
        return context
    
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
        post_id = self.request.data.get("post")
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            raise NotFound("해당 게시글이 존재하지 않습니다.")
        serializer.save(user=self.request.user, post=post)   


        
#답글 전체 보기 
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def reply_list_view(request, post_id):
    replies = Reply.objects.filter(post_id=post_id).order_by("created_at")
    serializer = ReplySerializer(replies, many=True)
    return Response(serializer.data)

#댓글 삭제
class ReplyUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        reply = get_object_or_404(Reply, pk=pk)

        if reply.user != request.user:
            return Response({"error": "권한이 없습니다."}, status=403)

        serializer = ReplySerializer(reply, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        reply = get_object_or_404(Reply, pk=pk)

        if reply.user != request.user:
            return Response({"error": "권한이 없습니다."}, status=403)

        reply.delete()
        return Response({"message": "댓글 삭제 완료!"}, status=204)
