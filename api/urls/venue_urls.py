from django.urls import path
from api.views.venue_views import (
    create_venue,
    VenueSearchAPIView,
    venue_detail
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('create/', create_venue, name='create-venue'),
    path('search/', VenueSearchAPIView.as_view(), name='venue-search'),
    path('<int:venue_id>/', venue_detail, name='venue_detail'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)