from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from api.views.post_views import (
    PostCreateView,
    PostListView,
    OpenPostListView,
    ClosedPostListView,
    ReplyCreateView,
    reply_list_view,
    
    ReplyUpdateView
)

urlpatterns = [
       path('create/', PostCreateView.as_view(), name='post-create'),
       path('', PostListView.as_view(), name='post-list'),
       path('open/', OpenPostListView.as_view(), name='open-posts'),
       path('closed/', ClosedPostListView.as_view(), name='closed-posts'),
       path('replies/', ReplyCreateView.as_view(), name='create-reply'),
       path("<int:post_id>/replies/", reply_list_view, name="reply-list"),
       path('replies/<int:pk>/', ReplyUpdateView.as_view(), name='reply-update-or-delete'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
