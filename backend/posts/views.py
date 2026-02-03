from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status
from .models import Post, PostReaction,Comment
from .serializers import PostSerializer,CommentSerializer


class PostListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Post.objects.all().order_by('-created_at')
        serializer = PostSerializer(posts, many=True, context={"request": request})
        return Response(serializer.data)

    def post(self, request):
        serializer = PostSerializer(data=request.data, context={"request": request})
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
        if reaction_type not in ["like", "dislike"]:
            return Response(
                {"error": "Invalid reaction type"},
                status=status.HTTP_400_BAD_REQUEST
            )

        post = Post.objects.get(id=post_id)
        user = request.user

        existing = PostReaction.objects.filter(user=user, post=post).first()

        if existing:
            if existing.reaction == reaction_type:
                
                existing.delete()
                action = "removed"
            else:
                
                existing.reaction = reaction_type
                existing.save()
                action = "updated"
        else:
            PostReaction.objects.create(
                user=user,
                post=post,
                reaction=reaction_type
            )
            action = "added"

        return Response({
            "status": action,
            "likes": post.reactions.filter(reaction="like").count(),
            "dislikes": post.reactions.filter(reaction="dislike").count(),
        })

class PublicUserPostsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        posts = Post.objects.filter(user_id=user_id).order_by("-created_at")
        serializer = PostSerializer(
            posts,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)
    



class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        print("REQUEST DATA:", request.data)
        post = Post.objects.get(id=post_id)

        serializer = CommentSerializer(
            data=request.data,
            context={"request": request}
        )
        

        if serializer.is_valid():
            serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=201)
        
        print("SERIALIZER ERRORS:", serializer.errors)
        return Response(serializer.errors, status=400)
    

class CommentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, comment_id):
        try:
            comment = Comment.objects.get(
                id=comment_id,
                user=request.user
            )
            comment.delete()
            return Response({"message": "Comment deleted"})
        except Comment.DoesNotExist:
            return Response({"error": "Not allowed"}, status=403)
