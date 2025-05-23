from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
import os

urlpatterns = [
    path('auth/', include('api.urls.auth_urls')),
    path('profile/', include('api.urls.profile_urls')),
    path('posts/', include('api.urls.post_urls')),
    path('social/', include('api.urls.social_urls')),  # 소셜 로그인
    path('events/', include('api.urls.event_urls')),
    path('reports/', include('api.urls.report_urls')),
    path('star/', include('api.urls.star_urls')),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('venues/', include('api.urls.venue_urls')),
    path('booking/', include('api.urls.booking_urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=os.path.join(settings.BASE_DIR, 'static'))