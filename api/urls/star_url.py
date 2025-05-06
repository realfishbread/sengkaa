# urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from api.views.star_view import get_star_list
import os

urlpatterns = [
    path('stars/', get_star_list),  # /api/stars/
]+ static(settings.STATIC_URL, document_root=os.path.join(settings.BASE_DIR, 'static'))

