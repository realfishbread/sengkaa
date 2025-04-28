# urls/auth_urls.py

from django.urls import path
from api.views.auth_views import (
    register_view,
    login_view,
    send_email_verification,
    verify_email_code,
    send_reset_password_email,
    verify_reset_code,
    reset_password,
    check_nickname
)
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('register/', register_view, name="register"),
    path('login/', login_view, name="login"),
    path('send-email-verification/', send_email_verification, name="send_email_verification"),
    path('verify-email-code/', verify_email_code, name="verify_email_code"),
    path('reset-password-request/', send_reset_password_email, name="reset_password_request"),
    path('verify-reset-code/', verify_reset_code, name="verify_reset_code"),
    path('reset-password/', reset_password, name="reset_password"),
    path('check-nickname/', check_nickname, name="check_nickname"),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
