from django.urls import path
from api.views import report_post

urlpatterns = [
    path('report-post/', report_post, name='report-post'),
]
