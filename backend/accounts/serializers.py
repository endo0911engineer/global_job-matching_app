from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import EngineerProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "role", "profile", "created_at"]
        read_only_fields = ["id", "created_at"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["id", "name", "email", "password", "role"]
    
    def create(self, validate_data):
        user = User.objects.create_user(**validate_data)
        return user

class EngineerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EngineerProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at']