from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.ReadOnlyField(source='job.title')
    user_name = serializers.ReadOnlyField(source='user.name')

    class Meta:
        model = Application
        fields = ['id', 'job', 'job_title', 'user', 'user_name', 'status', 'message', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
