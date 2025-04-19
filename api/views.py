from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from django.contrib.auth.hashers import make_password
import random
import string
from django.conf import settings
from django.core.mail import send_mail
from .utils import get_redis_connection  # 방금 만든 함수

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


@api_view(["POST"])
def send_email_verification(request):
    email = request.data.get("email")

    if not email:
        return Response({"error": "이메일이 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)

    # 인증 코드 생성 (숫자 6자리)
    code = ''.join(random.choices(string.digits, k=6))

    # Redis에 저장 (5분 유효)
    r = get_redis_connection()
    r.setex(f"email_verify:{email}", 300, code)

    # 메일 발송
    subject = "📧 EventCafe 이메일 인증 코드"
    message = f"이메일 인증 코드: {code}"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]

    try:
        send_mail(subject, message, from_email, recipient_list)
        return Response({"message": "인증 코드가 이메일로 전송되었습니다."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"메일 전송 실패: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
@api_view(["POST"])
def verify_email_code(request):
    email = request.data.get("email")
    code = request.data.get("code")

    if not email or not code:
        return Response({"error": "이메일과 코드가 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)

    r = get_redis_connection()
    saved_code = r.get(f"email_verify:{email}")

    if saved_code is None:
        return Response({"error": "인증 코드가 만료되었거나 존재하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)

    if saved_code != code:
        return Response({"error": "인증 코드가 일치하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"message": "이메일 인증 성공!"}, status=status.HTTP_200_OK)