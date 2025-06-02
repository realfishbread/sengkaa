from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/', include('api.urls.auth_urls')),
    path('profile/', include('api.urls.profile_urls')),
    path('posts/', include('api.urls.post_urls')),
    path('social/', include('api.urls.social_urls')),
    path('star/', include('api.urls.star_urls')),
    path('events/', include('api.urls.birthday_cafe_event_urls')),
    path('reports/', include('api.urls.report_urls')),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('venues/', include('api.urls.venue_urls')),
    path('bookings/', include('api.urls.booking_urls')),
    path('dictionary/', include('api.urls.dictionary_urls')),
    path('chat/', include('api.urls.chat_urls')),
    path('notifications/', include('api.urls.notification_urls')),
    path('main/', include('api.urls.main_urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
