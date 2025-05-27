from django.urls import path
from api.views.notification_views import (
    get_unread_notification_count,
    get_notification_list,
    mark_all_notifications_as_read,
)

urlpatterns = [
    path('notifications/unread-count/', get_unread_notification_count),
    path('notifications/', get_notification_list),
    path('notifications/mark-all-read/', mark_all_notifications_as_read),
]
