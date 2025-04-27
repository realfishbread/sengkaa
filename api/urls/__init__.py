from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('auth/', include('api.urls.auth_urls')),
    path('profile/', include('api.urls.profile_urls')),
    path('posts/', include('api.urls.post_urls')),
    path('social/', include('api.urls.social_urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
