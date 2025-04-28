from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from api.views.profile_views import (
    user_profile,
    user_profile_detail,
    update_profile,
)

urlpatterns = [
    path('', user_profile, name='user_profile'),  # 기본 프로필
    path('<str:nickname>/', user_profile_detail, name='user_profile_detail'),  # 특정 유저 프로필
    path('update/', update_profile, name='update_profile'),  # 프로필 수정
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
