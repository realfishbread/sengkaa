from django.urls import path
from api.views.report_view import report_post
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('report-post/', report_post, name='report-post'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
