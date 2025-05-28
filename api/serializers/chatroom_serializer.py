# serializers/chatroom_serializer.py

from rest_framework import serializers
from api.models import ChatRoom
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nickname']

class ChatRoomSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        required=False  # ⭐ 필수 아님으로 설정
    )

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'members']
        extra_kwargs = {
            'members': {'required': False}  # ✅ 필수 아님으로 설정
        }

    def create(self, validated_data):
        members = validated_data.pop('members', [])
        room = ChatRoom.objects.create(**validated_data)

        current_user = self.context["request"].user
        room.members.add(current_user)
        
        for member in members:
            if member != current_user:  # ✅ 중복 방지!
                room.members.add(member)

        return room