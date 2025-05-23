# urls.py
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from api.views.booking_views import my_booked_venues

urlpatterns = [
    path('my-venues/', my_booked_venues, name='my_booked_venues'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
