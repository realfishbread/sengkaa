from api.models import Reply, Post
from rest_framework import serializers

class PostSerializer(serializers.ModelSerializer):
    nickname = serializers.CharField(source='user.nickname', read_only=True)
    profile_image = serializers.ImageField(source='user.profile_image', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'nickname', 'profile_image', 'title', 'content', 'image', 'created_at']
        read_only_fields = ['user']


class ReplySerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Reply
        fields = ['id', 'content', 'user', 'created_at']  # ✅ 깔끔하게
        read_only_fields = ['id', 'user', 'created_at']

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "nickname": obj.user.nickname
        }