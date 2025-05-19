from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import redirect, render
from urllib.parse import urlencode


from api.models import User

from django.conf import settings
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string

import requests


def is_app_user(request):
    user_agent = request.META.get("HTTP_USER_AGENT", "").lower()
    return "expo" in user_agent or "eventcafeapp" in user_agent or "okhttp" in user_agent


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

    kakao_id = user_info.get("id")  # ✅ 카카오 고유 ID
    nickname = user_info["properties"].get("nickname", "")
    profile_image = user_info["properties"].get("profile_image", "")

    if not kakao_id or not nickname:
        return Response({"error": "카카오 정보가 부족합니다."}, status=400)

    # 3. 고유한 username 생성 (중복 방지)
    username = f"kakao_{kakao_id}"

    # 4. 유저 찾기 or 생성
    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            "nickname": nickname,  # 🔥 여기에 nickname 저장
            "email": f"{username}@kakao.com",  # 이메일 없지만 대체용
            "password": make_password(get_random_string(10)),
            "user_type": "regular",
            "profile_image_url": profile_image,
            "created_at": timezone.now(),
            "updated_at": timezone.now(),
        }
    )

    # 5. JWT 발급
    refresh = RefreshToken.for_user(user)

        # 6. 쿼리 스트링 생성 후 프론트로 리디렉션
    query_params = urlencode({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "nickname": user.nickname,
            "profile_image": profile_image,
        })

    if is_app_user(request):
        return redirect(f"https://eventcafe.site/kakao/app-redirect.html?{query_params}")
    else:
        return redirect(f"https://eventcafe.site/oauth/kakao/redirect?{query_params}")
    
    
def kakao_app_redirect(request):
    return render(request, 'kakao/app-redirect.html')