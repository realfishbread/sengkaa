from django.urls import path
from api.views.main_views import (
    MainBannerListView,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('banners/', MainBannerListView.as_view(), name='main-banner-list')
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
