# urls.py
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from api.views.chatroom_view import (
    create_chat_room,
    list_chat_rooms,
    invite_user_to_room,
    respond_to_invite,
    search_users,
    get_chat_messages,
    mark_messages_as_read
)


# urls.py
urlpatterns = [
    path('create/', create_chat_room),
    path('list/', list_chat_rooms),
    path('rooms/<uuid:room_id>/invite/', invite_user_to_room),
    path('rooms/<uuid:room_id>/respond/', respond_to_invite),
    path('search/', search_users),  # Assuming search is handled by the same view
    path('rooms/<uuid:room_id>/messages/', get_chat_messages),
    path("rooms/<uuid:room_id>/mark-read/", mark_messages_as_read),
]
