from rest_framework import serializers
from api.models import Report

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'post', 'reason', 'created_at']
        read_only_fields = ['id', 'created_at']
