from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, generics
from .models import User, Post, Reply, SocialAccount
from .serializers import UserSerializer, ReplySerializer
import random
import string
from django.conf import settings
from .utils import get_redis_connection  # 방금 만든 함수
from django.core.mail import EmailMultiAlternatives
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import check_password, make_password
from .serializers import ProfileImageSerializer
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from django.utils import timezone
import requests
from rest_framework import generics
from .serializers import PostSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser

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

    # ✅ 토큰 발급
    if user is not None:
        # ✅ 토큰 생성
        refresh = RefreshToken.for_user(user)
        return Response({
        "refresh": str(refresh),
        "access":  str(refresh.access_token),
        "username": user.username,
        "email":    user.email,
        "profile_image": (
            request.build_absolute_uri(user.profile_image.url)
            if user.profile_image else ""
        )
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "로그인 정보가 올바르지 않습니다."}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(["POST"]) #비밀번호 리셋
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



@api_view(["POST"])
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
        


        

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def reply_list_view(request, post_id):
    replies = Reply.objects.filter(post_id=post_id).order_by("created_at")
    serializer = ReplySerializer(replies, many=True)
    return Response(serializer.data)


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
        })
    except User.DoesNotExist:
        return Response({"error": "사용자가 없습니다."}, status=404)

# ✨ 추가: 프로필 수정 API
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    username = request.data.get("username", user.username)
    email = request.data.get("email", user.email)
    profile_image = request.FILES.get("profile_image", user.profile_image)

    user.username = username
    user.email = email
    user.profile_image = profile_image
    user.save()

    return Response({
        "message": "프로필이 수정되었습니다!",
        "username": user.username,
        "email": user.email,
        "profile_image": request.build_absolute_uri(user.profile_image.url) if user.profile_image else "",
    })
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def follow_toggle(request, username):
    try:
        target_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "사용자가 존재하지 않습니다."}, status=404)

    user = request.user

    if user == target_user:
        return Response({"error": "자기 자신을 팔로우할 수 없습니다."}, status=400)

    follow_relation = Follow.objects.filter(follower=user, following=target_user).first()

    if follow_relation:
        # 이미 팔로우 중이면 언팔로우
        follow_relation.delete()
        return Response({"message": "언팔로우 완료"})
    else:
        # 팔로우
        Follow.objects.create(follower=user, following=target_user)
        return Response({"message": "팔로우 완료"})