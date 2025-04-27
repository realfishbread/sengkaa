from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from rest_framework_simplejwt.tokens import RefreshToken

from api.models import User

from django.conf import settings
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string

import requests



@api_view(["GET"])
@permission_classes([AllowAny])
def kakao_login_callback(request):
    code = request.GET.get("code")
    if not code:
        return Response({"error": "인가 코드가 없습니다."}, status=400)

    # 1. 카카오에서 토큰 발급
    token_response = requests.post(
        "https://kauth.kakao.com/oauth/token",
        data={
            "grant_type": "authorization_code",
            "client_id": settings.KAKAO_REST_API_KEY,
            "redirect_uri": settings.KAKAO_REDIRECT_URI,
            "code": code,
        }
    )
    access_token = token_response.json().get("access_token")
    if not access_token:
        return Response({"error": "토큰 발급 실패"}, status=400)

    # 2. 사용자 정보 요청
    user_response = requests.get(
        "https://kapi.kakao.com/v2/user/me",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    user_info = user_response.json()
    kakao_email = user_info["kakao_account"].get("email", "")
    nickname = user_info["properties"].get("nickname", "")
    profile_image_url = user_info["properties"].get("profile_image", "")

    if not kakao_email:
        return Response({"error": "카카오 계정에 이메일이 없습니다."}, status=400)

    # 3. 유저 찾기 or 생성
    user, created = User.objects.get_or_create(
        email=kakao_email,
        defaults={
            "username": nickname,
            "password": make_password(get_random_string(10)),
            "user_type": "regular",
            "created_at": timezone.now(),
            "updated_at": timezone.now(),
            "profile_image_url": profile_image_url,  # ✅ 여기에 URL 저장
        }
    )

    # 4. JWT 발급
    refresh = RefreshToken.for_user(user)

    # 5. 프로필 이미지 응답에 넣기 (URL 우선, 없으면 로컬 이미지)
    profile_image = user.profile_image_url or (
        request.build_absolute_uri(user.profile_image.url) if user.profile_image else ""
    )

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "username": user.username,
        "email": user.email,
        "profile_image": profile_image,
    })
    
    