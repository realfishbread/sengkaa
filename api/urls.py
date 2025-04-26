from django.urls import path
from . import views  # ✅ 이 줄 추가해줘야 해!
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
    PostListView,
    OpenPostListView, 
    ClosedPostListView, 
    ReplyCreateView,
    reply_list_view,
    user_profile_detail,
    update_profile,
    follow_toggle
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
       path('posts/open/', OpenPostListView.as_view(), name='open-posts'),
       path('posts/closed/', ClosedPostListView.as_view(), name='closed-posts'),
       path('replies/', ReplyCreateView.as_view(), name='create-reply'),
       path("posts/<int:post_id>/replies/", reply_list_view, name="reply-list"),
       
       path('profile/<str:username>/', views.user_profile_detail),
       path('profile/update/', views.update_profile),
       path('follow/<str:username>/', views.follow_toggle),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

