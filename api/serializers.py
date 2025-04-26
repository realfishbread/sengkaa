from rest_framework import serializers
# api/serializers.py 상단에 추가해줘
from .models import User, Post, Reply  # ✅ Post도 함께 import!

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'username', 'email', 'password', 'user_type', 'created_at', 'updated_at', 'profile_image']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            user_type=validated_data.get('user_type', 'regular')
        )
        user.set_password(validated_data['password'])  # ✅ 비밀번호 해싱!
        user.save()
        return user
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == "password":
                instance.set_password(value)  # 비밀번호는 해싱
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance

class ProfileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ["profile_image"]
        

class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_image = serializers.ImageField(source='user.profile_image', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'username', 'profile_image', 'title', 'content', 'image', 'created_at']
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
            "username": obj.user.username
        }