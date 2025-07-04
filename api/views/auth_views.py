# Django REST Framework imports
from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core.mail import EmailMultiAlternatives
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from api.serializers.auth_serializers import UserSerializer  # 헷갈
from api.utils import get_redis_connection
from django.views.decorators.csrf import csrf_exempt
from api.models import User
import random
import string

@api_view(["POST"])
@permission_classes([AllowAny])
@csrf_exempt
def register_view(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    user_type = request.data.get("user_type", "regular")  # 기본값: 일반 사용자
    nickname = request.data.get("nickname")

    if not nickname:
        return Response({"error": "닉네임을 입력해주세요."}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({"error": "이미 사용 중인 이메일입니다."}, status=status.HTTP_400_BAD_REQUEST)
    
    # ✅ 이메일 인증 여부 확인
    r = get_redis_connection()
    email_verified = r.get(f"email_verified:{email}")
    if email_verified is None:
        return Response({"error": "이메일 인증이 완료되지 않았습니다."}, status=status.HTTP_400_BAD_REQUEST)

     # ✅ 닉네임 중복 여부 확인
    if User.objects.filter(nickname=nickname).exists():
        return Response({"error": "새로운 닉네임으로 중복 검사를 시도한 후 다시 시도해주세요."}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create(
        username=username,
        nickname=nickname,   # ✅ 추가!
        email=email,
        password=make_password(password),  # 비밀번호 암호화
        user_type=user_type
    )

    serializer = UserSerializer(user)
    return Response({"message": "회원가입 성공", "user": serializer.data}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
@csrf_exempt
def send_email_verification(request):
    email = request.data.get("email")

    if not email:
        return Response({"error": "이메일이 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)

    
    if User.objects.filter(email=email).exists():
        return Response({"error": "이미 가입된 이메일입니다."}, status=status.HTTP_400_BAD_REQUEST)

    # 인증 코드 생성 (숫자 6자리)
    code = ''.join(random.choices(string.digits, k=6))

    # Redis에 저장 (5분 유효)
    r = get_redis_connection()
    r.setex(f"email_verify:{email}", 300, code)

    # ✅ try 블록 시작
    try:
        subject = "📧 EventCafe 이메일 인증 코드"
        text_content = f"이메일 인증 코드: {code}"
        from_email = settings.EMAIL_HOST_USER
        to = [email]
        html_content = f"""
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>🎉 EventCafe에 오신 것을 환영합니다!</h2>
            <p style="font-size: 16px;">아래의 인증 코드를 입력해 주세요:</p>
            <div style="font-size: 28px; font-weight: bold; color: #1E90FF; margin: 20px 0;">
              {code}
            </div>
            <p style="color: gray; font-size: 12px;">* 본 인증 코드는 5분간 유효합니다.</p>
            <br>
            <p style="font-size: 14px;">감사합니다.<br>EventCafe 팀</p>
          </body>
        </html>
        """

        msg = EmailMultiAlternatives(subject, text_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        return Response({"message": "인증 코드가 이메일로 전송되었습니다."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"메일 전송 실패: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([AllowAny])
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
    
    # ✅ 인증 성공 시, 이메일 인증 여부를 Redis에 저장
    r.setex(f"email_verified:{email}", 3600, "true")  # 1시간 유효, 회원가입때 검증할거임.

    return Response({"message": "이메일 인증 성공!"}, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")
    
    
    if not email or not password:
        return Response({"error": "이메일과 비밀번호를 모두 입력해주세요."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "존재하지 않는 이메일입니다."}, status=status.HTTP_404_NOT_FOUND)

    if not check_password(password, user.password):
        return Response({"error": "비밀번호가 일치하지 않습니다."}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return Response({"error": "⛔ 이 계정은 정지되었습니다. 관리자에게 문의해주세요."}, status=status.HTTP_403_FORBIDDEN)

     # ✅ 여기서 안전하게 프로필 이미지 URL 처리
    try:
        profile_url = (
            request.build_absolute_uri(user.profile_image.url)
            if user.profile_image else ""
        )
    except Exception as e:
        print("❌ profile_image.url 접근 중 오류:", e)
        profile_url = ""
    star = user.star if hasattr(user, "star") else None
    
    try:
        image_url = request.build_absolute_uri(star.image.url) if star.image else None
    except Exception as e:
        print("❌ 스타 이미지 접근 오류:", e)
        image_url = None

    # 스타 정보 포함
    

    # 그 다음에 안전하게 접근
    try:
        star_image_url = (
            request.build_absolute_uri(star.image.url)
            if star and star.image else None
        )
    except Exception as e:
        print("❌ 스타 이미지 접근 오류:", e)
        star_image_url = None

    # star_info 정의
    star_info = {
        "id": star.id if star else None,
        "name": star.name if star else None,
        "birthday": star.birthday.isoformat() if star and star.birthday else None,
        "image": star_image_url,
        "group": star.group if star else None,
        "display": star.display if star else None,
    }

    # 토큰 발급
    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "username": user.username,
        "nickname": user.nickname,
        "email": user.email,
        "profile_image": profile_url,  # ✅ 여기만 바뀜!
        "star": star_info,
    }, status=status.HTTP_200_OK)


@api_view(["POST"]) #비밀번호 리셋
@permission_classes([AllowAny])
def send_reset_password_email(request):
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "등록되지 않은 이메일입니다."}, status=404)

    # 인증코드 생성 (혹은 토큰)
    code = ''.join(random.choices(string.digits, k=6))

    # Redis에 인증코드 저장
    r = get_redis_connection()
    r.setex(f"reset_pwd:{email}", 300, code)

    try:
        subject = "🛠️ EventCafe 비밀번호 재설정 인증 코드"
        from_email = settings.EMAIL_HOST_USER
        to = [email]
        text_content = f"비밀번호 재설정 코드: {code}"  # fallback용 일반 텍스트

        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>🔐 EventCafe 비밀번호 재설정 요청</h2>
            <p style="font-size: 16px;">아래의 인증 코드를 입력해 주세요:</p>
            <div style="font-size: 28px; font-weight: bold; color: #E74C3C; margin: 20px 0;">
            {code}
            </div>
            <p style="color: gray; font-size: 12px;">* 본 인증 코드는 5분간 유효합니다.</p>
            <br>
            <p style="font-size: 14px;">감사합니다.<br>EventCafe 팀</p>
        </body>
        </html>
        """

        msg = EmailMultiAlternatives(subject, text_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        return Response({"message": "비밀번호 재설정 코드가 이메일로 전송되었습니다."}, status=200)

    except Exception as e:
        return Response({"error": f"메일 전송 실패: {str(e)}"}, status=500)


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_reset_code(request):
    email = request.data.get("email")
    code = request.data.get("code")

    if not email or not code:
        return Response({"error": "이메일과 인증 코드를 모두 입력해주세요."}, status=400)

    try:
        r = get_redis_connection()
        saved_code = r.get(f"reset_pwd:{email}")

        if saved_code is None:
            return Response({"error": "인증 코드가 존재하지 않거나 만료되었습니다."}, status=400)

        if str(saved_code) != str(code):  # ✅ decode 안 씀
            return Response({"error": "잘못된 인증 코드입니다."}, status=400)

        r.delete(f"reset_pwd:{email}")
        return Response({"message": "인증 성공"}, status=200)

    except Exception as e:
        return Response({"error": f"서버 에러: {str(e)}"}, status=500)


#passwd reset
@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password(request):
    email = request.data.get("email")
    new_password = request.data.get("password")

    if not email or not new_password:
        return Response({"error": "이메일과 새 비밀번호를 입력해주세요."}, status=400)

    try:
        user = User.objects.get(email=email)
        user.password = make_password(new_password)  # ✅ 해시된 비밀번호로 저장
        user.save()
        return Response({"message": "비밀번호가 성공적으로 변경되었습니다."}, status=200)

    except User.DoesNotExist:
        return Response({"error": "해당 이메일로 등록된 사용자가 없습니다."}, status=404)


#nickname checker
@api_view(["POST"])
@permission_classes([AllowAny])  # ✅ 인증 없이 접근 허용!
def check_nickname(request):
    nickname = request.data.get("nickname")
    if not nickname:
        return Response({"error": "닉네임을 입력하세요."}, status=400)

    if User.objects.filter(nickname=nickname).exists():
        return Response({"available": False, "message": "이미 사용 중인 닉네임입니다."})
    else:
        return Response({"available": True, "message": "사용 가능한 닉네임입니다."})
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # 👈 이게 핵심이야!
def verify_token(request):
    return Response({"message": "Token is valid ✅", "user": request.user.nickname})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_for_organizer(request):
    user = request.user

    if user.user_type == 'organizer' and user.organizer_verified:
        return Response({'message': '이미 인증된 사장님입니다.'})

    # ✅ 일반 유저도 여기서 사장 전환 + 인증 요청 가능
    user.user_type = 'organizer'
    user.organizer_verified = False
    user.save()

    return Response({'message': '사장 신청이 접수되었습니다. 관리자 승인 후 사용 가능합니다.'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_organizer_status(request):
    user = request.user
    if user.user_type != 'organizer':
        return Response({'status': '❌ 일반 사용자', 'verified': False})

    return Response({
        'status': '✅ 인증 완료' if user.organizer_verified else '🔒 인증 대기 중',
        'verified': user.organizer_verified
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        if user.id != request.user.id:
            return Response({'error': '본인만 탈퇴할 수 있습니다.'}, status=403)

        # 소프트 삭제 처리
        user.is_deleted = True
        user.nickname = '탈퇴한 사용자'
        user.email = f'deleted_{user.id}@deleted.com'  # 중복 방지
        user.set_unusable_password()  # 로그인을 아예 막음
        user.save()

        return Response({'message': '회원 탈퇴 완료'}, status=200)

    except User.DoesNotExist:
        return Response({'error': '사용자 없음'}, status=404)