from rest_framework import serializers
from .models import Job
from accounts.models import User

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'company', 'title', 'description', 'required_skill', 'salary', 'location', 'created_at']
        read_only_fields = ['id', 'created_at']

class CreateJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['company', 'title', 'description', 'required_skils', 'salary', 'location']
