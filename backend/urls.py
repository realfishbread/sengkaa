from django.contrib import admin
from django.urls import path, include  # ✅ include 추가!

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('api.urls')),  # ✅ api.urls 포함
]