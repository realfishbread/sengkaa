from django.urls import path
from api.views.notification_views import (
    get_unread_notification_count,
    get_notification_list,
    mark_all_notifications_as_read,
    delete_notification
)

urlpatterns = [
    path('unread-count/', get_unread_notification_count),
    path('', get_notification_list),
    path('mark-all-read/', mark_all_notifications_as_read),
    path('<int:pk>/', delete_notification),
]
