from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'username', 'email', 'password', 'user_type', 'created_at', 'updated_at']
        extra_kwargs = {'password': {'write_only': True}}  # 비밀번호는 읽기 불가능하도록 설정

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],  # 이후 해싱 필요
            user_type=validated_data.get('user_type', 'regular')
        )
        return user
