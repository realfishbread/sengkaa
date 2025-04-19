from django.urls import path
from .views import register_view
from .views import send_email_verification
from .views import send_email_verification, verify_email_code

urlpatterns = [
       path('register/', register_view, name="register"),
       path('send-email-verification/', send_email_verification, name="send_email_verification"),
       path('verify-email-code/', verify_email_code),  # ✅ 인증 확인용
]

