# serializers/chatroom_serializer.py

from rest_framework import serializers
from api.models import ChatRoom, Message
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
    
    def validate_max_participants(self, value):
        if value < 2 or value > 50:
            raise serializers.ValidationError("참여 인원은 2명 이상 100명 이하만 가능합니다.")
        return value

    
    
    
class MessageSerializer(serializers.ModelSerializer):
    sender_nickname = serializers.CharField(source='sender.nickname', read_only=True)
    sender_profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id',
            'room',
            'sender_nickname',
            'sender_profile_image',  # ✅ 이거 추가!
            'content',
            'timestamp',
        ]

    def get_sender_profile_image(self, obj):
        if obj.sender and hasattr(obj.sender, 'profile_image_url'):
            return obj.sender.profile_image_url
        return None