# project/urls.py
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
# ✅ 함수 뷰니까 이렇게 임포트
from api.views.birthday_cafe_event_view import (create_birthday_event, BirthdayCafeSearchAPIView, BirthdayCafeDetailAPIView)


urlpatterns = [
    path('create/', create_birthday_event, name='create_birthday_event'),   # ✅ 이거 있어야 작동!
    path('birthday-cafes/search/', BirthdayCafeSearchAPIView.as_view(), name='birthday-cafe-search'),
    path('birthday-cafes/<int:id>/', BirthdayCafeDetailAPIView.as_view(), name='birthday-cafe-detail'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

