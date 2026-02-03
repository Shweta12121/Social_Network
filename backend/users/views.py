from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import SignupSerializer, LoginSerializer,ProfileSerializer, PublicProfileSerializer


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)

        if not serializer.is_valid():
            print(serializer.errors)
            return Response(serializer.errors, status=400)

        serializer.save()
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'email': user.email,
            'full_name': user.full_name,
        })

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class PublicProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, is_active=True)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)

        serializer = PublicProfileSerializer(user)
        return Response(serializer.data)