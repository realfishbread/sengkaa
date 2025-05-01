# project/urls.py
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('events/', include('app.birthday_cafe_event_urls')),  # ✅ 이거 있어야 작동!
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

