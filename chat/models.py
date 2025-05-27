

# Create your models here.
from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()  # 👈 api.models.User를 자동으로 가져와줌

class ChatRoom(models.Model):
    participants = models.ManyToManyField(User, related_name="chat_chat_rooms")  # ✅ 변경
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ChatRoom {self.id}"

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.username} at {self.timestamp}"

