from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Post, PostReaction
from .serializers import PostSerializer


class PostListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Post.objects.filter(user=request.user).order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id, user=request.user)
            post.delete()
            return Response({"message": "Post deleted"})
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=404)




class ToggleReactionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id, reaction_type):
        post = Post.objects.get(id=post_id)
        user = request.user

        existing = PostReaction.objects.filter(user=user, post=post).first()

        if existing:
            if existing.reaction == reaction_type:
                # toggle OFF
                existing.delete()
                return Response({"status": "removed"})
            else:
                # switch reaction
                existing.reaction = reaction_type
                existing.save()
                return Response({"status": "updated"})
        else:
            PostReaction.objects.create(
                user=user,
                post=post,
                reaction=reaction_type
            )
            return Response({"status": "added"})