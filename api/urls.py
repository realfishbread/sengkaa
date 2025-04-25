from django.urls import path
from .views import (
    register_view,
    send_email_verification,
    verify_email_code,
    login_view,
    send_reset_password_email,  # ✅ 새로 추가
    verify_reset_code,          # ✅ 새로 추가
    reset_password,              # ✅ 새로 추가
    user_profile,
    PostCreateView, 
    PostListView
)
from django.conf import settings
from django.conf.urls.static import static
from .views import kakao_login_callback

urlpatterns = [
       path('register/', register_view, name="register"),
       path('send-email-verification/', send_email_verification, name="send_email_verification"),
       path('verify-email-code/', verify_email_code),  # ✅ 인증 확인용
       path("login/", login_view),
        # ✅ 비밀번호 재설정 관련 경로 추가
       path('reset-password-request/', send_reset_password_email, name="reset_password_request"),
       path('verify-reset-code/', verify_reset_code, name="verify_reset_code"),
       path('reset-password/', reset_password, name="reset_password"),
       path('profile/', user_profile, name='user_profile'),
       path("oauth/kakao/callback", kakao_login_callback),
       path('posts/create/', PostCreateView.as_view(), name='post-create'),
       path('posts/', PostListView.as_view(), name='post-list'),
     
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

