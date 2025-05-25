from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views.dictionary_views import DictionaryTermViewSet

router = DefaultRouter()
router.register(r'dictionary', DictionaryTermViewSet, basename='dictionary')

urlpatterns = [
    path('', include(router.urls)),
]
