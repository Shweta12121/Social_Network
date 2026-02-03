from rest_framework import serializers
from django.contrib.auth import authenticate
from datetime import date
from .models import User

class SignupSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField(required=False)
    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'college', 'dob', 'profile_pic']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value

    def validate_college(self, value):
        if not value.strip():
            raise serializers.ValidationError("College name is required")
        return value
    def validate_profile_pic(self, image):
        if image.size > 2 * 1024 * 1024:
            raise serializers.ValidationError("Image too large")
        return image
    def validate_dob(self, value):
        if value >= date.today():
            raise serializers.ValidationError("DOB must be in the past")
        return value
    def validate_full_name(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Full name must be at least 3 characters")
        return value

    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            email=data['email'],
            password=data['password']
        )
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        data['user'] = user
        return data
    


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)
    profile_pic = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['id','full_name', 'email', 'college', 'dob', 'profile_pic']
    
    
    def validate_dob(self, value):
        if value >= date.today():
            raise serializers.ValidationError("DOB must be in the past")
        return value


class PublicProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'college', 'dob', 'profile_pic']
