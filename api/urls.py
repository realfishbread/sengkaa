from django.urls import path
from .views import RegisterUserView  # ✅ views.py에서 가져옴

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
]
