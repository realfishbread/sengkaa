# serializers/chatroom_serializer.py

from rest_framework import serializers
from api.models import ChatRoom
from django.contrib.auth import get_user_model
from api.models import Message


User = get_user_model()

class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nickname']

class ChatRoomSerializer(serializers.ModelSerializer):
    current_participants = serializers.SerializerMethodField()
    max_participants = serializers.IntegerField()

    participants = serializers.SlugRelatedField(
        many=True,
        queryset=User.objects.all(),
        slug_field='nickname',  # ✅ nickname으로 serialize/deserialize
        required=False
    )

    current_participants = serializers.SerializerMethodField()  # ← 있으면 같이 넣어주기

    
    class Meta:
        model = ChatRoom
        fields = [  # ✅ 여기 participants 반드시 포함!
            'id',
            'name',
            'participants',
            'max_participants',
            'current_participants'
        ]
        extra_kwargs = {
            'participants': {'required': False}
        }

    def get_current_participants(self, obj):
        return obj.participants.count()

    def create(self, validated_data):
        participants = validated_data.pop('participants', [])
        room = ChatRoom.objects.create(**validated_data)

        current_user = self.context["request"].user
        room.participants.add(current_user)
        
        for participant in participants:
            if participant != current_user:
                room.participants.add(participant)

        return room
    
    
    
    
    

class MessageSerializer(serializers.ModelSerializer):
    sender_nickname = serializers.CharField(source='sender.nickname', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'room', 'sender', 'sender_nickname', 'content', 'timestamp']