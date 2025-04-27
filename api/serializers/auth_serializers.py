from rest_framework import serializers
from api.models import User

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
     