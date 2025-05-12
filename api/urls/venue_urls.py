from django.urls import path
from api.views.venue_views import create_venue
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('create/', create_venue, name='create-venue'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)