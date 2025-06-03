# urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from api.views.star_view import get_star_list, stars_by_genre, star_groups_by_genre
import os

urlpatterns = [
    path('stars/', get_star_list), 
    path('by-genre/',stars_by_genre ),
    path('groups/', star_groups_by_genre)
]+ static(settings.STATIC_URL, document_root=os.path.join(settings.BASE_DIR, 'static'))

