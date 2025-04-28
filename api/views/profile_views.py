from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.serializers.auth_serializers import ProfileImageSerializer
from api.models import User



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user  # 토큰에서 유저 자동으로 찾아줌

    return Response({
        "email": user.email,
        "username": user.username,
        "user_type": user.user_type,
        "created_at": user.created_at,
        "profile_image": request.build_absolute_uri(user.profile_image.url) if user.profile_image else ""
    }, status=200)
    
    
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def upload_profile_image(request):
    serializer = ProfileImageSerializer(
        request.user, data=request.data, partial=True
    )
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


# ✨ 추가: 프로필 수정 API
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    username = request.data.get("username", user.username)
    email = request.data.get("email", user.email)
    profile_image = request.FILES.get("profile_image", user.profile_image)
    bio = request.data.get("bio", user.bio)  # 🌟✨ bio 받기 추가

    user.username = username
    user.email = email
    user.bio = bio  # 🌟 bio 저장 추가
    user.profile_image = profile_image
    user.save()

    return Response({
        "message": "프로필이 수정되었습니다!",
        "username": user.username,
        "email": user.email,
        "profile_image": request.build_absolute_uri(user.profile_image.url) if user.profile_image else "",
        "bio": user.bio,  # 🌟 bio 추가!
    })
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile_detail(request, username):
    try:
        user = User.objects.get(username=username)
        return Response({
            "email": user.email,
            "username": user.username,
            "profile_image": request.build_absolute_uri(user.profile_image.url) if user.profile_image else "",
            "created_at": user.created_at,
            "bio": user.bio,
        })
    except User.DoesNotExist:
        return Response({"error": "사용자가 없습니다."}, status=404)


    