from api.models import Reply, Post
from rest_framework import serializers
from rest_framework.fields import ImageField

class PostSerializer(serializers.ModelSerializer):
    nickname = serializers.CharField(source='user.nickname', read_only=True)
    profile_image = serializers.ImageField(source='user.profile_image', read_only=True)
    image = serializers.ImageField(required=False)  # 저장용
    image_url = serializers.SerializerMethodField()  # 보여줄 용
    is_open = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'nickname', 'profile_image', 'title', 'content', 'image', 'image_url', 'created_at', 'status', 'is_open']
        read_only_fields = ['user']
        
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None
    
    def get_is_open(self, obj):
        return obj.status == 'open'


class ReplySerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Reply
        fields = ['id', 'content', 'user', 'created_at']  # ✅ 깔끔하게
        read_only_fields = ['id', 'user', 'created_at']

    def get_user(self, obj):
        request = self.context.get('request')
        profile_image_url = None
        if obj.user.profile_image and request:
            profile_image_url = request.build_absolute_uri(obj.user.profile_image.url)
        elif obj.user.profile_image:
            profile_image_url = obj.user.profile_image.url

        return {
            "id": obj.user.id,
            "nickname": obj.user.nickname,
            "profile_image": profile_image_url
        }