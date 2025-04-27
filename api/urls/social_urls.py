from api.views.kakao_views import kakao_login_callback
from django.urls import path
from django.conf import settings
urlpatterns = [
    
    path("oauth/kakao/callback", kakao_login_callback),
    ] 