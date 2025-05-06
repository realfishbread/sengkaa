from rest_framework import serializers
from api.models import User

class UserSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['user_id', 'username', 'nickname', 'email', 'password', 'user_type', 'created_at', 'updated_at', 'profile_image', 'profile_image_url', 'bio']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            nickname=validated_data['nickname'],
            email=validated_data['email'],
            user_type=validated_data.get('user_type', 'regular')
        )
        user.set_password(validated_data['password'])  # ✅ 비밀번호 해싱!
        user.save()
        return user
    
    def update(self, instance, validated_data):
        profile_image = validated_data.get('profile_image', None)

        for attr, value in validated_data.items():
            if attr == "password":
                instance.set_password(value)
            else:
                setattr(instance, attr, value)

        if profile_image:
            instance.profile_image_url = instance.profile_image.url

        instance.save()
        return instance
    def get_profile_image_url(self, obj):
        request = self.context.get('request')
        if obj.profile_image and request:
            return request.build_absolute_uri(obj.profile_image.url)
        return None

