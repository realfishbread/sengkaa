from rest_framework import serializers
from api.models import Star

class StarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Star
        fields = '__all__'