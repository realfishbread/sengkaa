from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from api.serializers.auth_serializers import UserSerializer
from api.models import User



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user  # 토큰에서 유저 자동으로 찾아줌

    return Response({
        "email": user.email,
        "nickname": user.nickname,
        "user_type": user.user_type,
        "created_at": user.created_at,
        "profile_image": request.build_absolute_uri(user.profile_image.url) if user.profile_image else ""
    }, status=200)
    
    
# ✨ 추가: 프로필 수정 API
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])  # ✅ 추가
def update_profile(request):
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True, context={"request": request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)  # 🔥 profile_image_url 자동 생성 포함
    return Response(serializer.errors, status=400)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile_detail(request, nickname):
    try:
        user = User.objects.get(nickname=nickname)
        return Response({
            "email": user.email,
            "nickname": user.nickname,
            "profile_image": request.build_absolute_uri(user.profile_image.url) if user.profile_image else "",
            "created_at": user.created_at,
            "bio": user.bio,
        })
    except User.DoesNotExist:
        return Response({"error": "사용자가 없습니다."}, status=404)


    