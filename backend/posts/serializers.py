from rest_framework import serializers
from .models import Post, PostReaction

class PostSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'image',
            'description',
            'likes',
            'dislikes',
            'created_at',
        ]
        read_only_fields = ['likes', 'dislikes', 'created_at']
        
    def get_likes(self, obj):
        return obj.reactions.filter(reaction="like").count()

    def get_dislikes(self, obj):
        return obj.reactions.filter(reaction="dislike").count()
