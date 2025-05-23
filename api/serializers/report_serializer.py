from rest_framework import serializers
from api.models import Report, Post

class ReportSerializer(serializers.ModelSerializer):
    post_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Report
        fields = ['post_id', 'reason']

    def create(self, validated_data):
        post_id = validated_data.pop('post_id')
        post = Post.objects.get(id=post_id)
        return Report.objects.create(post=post, **validated_data)
