from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from django.contrib.auth.hashers import make_password

@api_view(["POST"])
def register_view(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    user_type = request.data.get("user_type", "regular")  # 기본값: 일반 사용자

    if User.objects.filter(username=username).exists():
        return Response({"error": "이미 존재하는 사용자입니다."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "이미 사용 중인 이메일입니다."}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create(
        username=username,
        email=email,
        password=make_password(password),  # 비밀번호 암호화
        user_type=user_type
    )

    serializer = UserSerializer(user)
    return Response({"message": "회원가입 성공", "user": serializer.data}, status=status.HTTP_201_CREATED)
