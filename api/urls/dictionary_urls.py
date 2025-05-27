from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views.dictionary_views import DictionaryTermViewSet

router = DefaultRouter()
router.register(r'', DictionaryTermViewSet, basename='dictionary')  # ✅ 바뀐 부분

urlpatterns = [
    path('', include(router.urls)),
]
