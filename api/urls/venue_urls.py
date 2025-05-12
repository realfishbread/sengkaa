from django.urls import path
from api.views.venue_views import create_venue

urlpatterns = [
    path('create/', create_venue, name='create-venue'),
]