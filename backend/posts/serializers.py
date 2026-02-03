from rest_framework import serializers
from .models import Post, Comment


class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.full_name", read_only=True)
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "text",
            "created_at",
            "user_name",
            "is_owner",
        ]
        extra_kwargs = {
            "text": {
                "required": True,
                "allow_blank": False
            }
        }

    def get_is_owner(self, obj):
        request = self.context.get("request")
        return request and request.user == obj.user


class PostSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    author_name = serializers.CharField(source="user.full_name", read_only=True)
    author_profile_pic = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False)
    image_url = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()


    class Meta:
        model = Post
        fields = [
            'id',
            'image',
            'image_url',
            'description',
            'likes',
            'dislikes',
            'created_at',
            'is_owner',
            'author_name',
            'author_profile_pic',
            "comments",
            "comments_count",
            
        ]
        #read_only_fields = ['likes', 'dislikes', 'created_at']
        
    def get_likes(self, obj):
        return obj.reactions.filter(reaction="like").count()

    def get_dislikes(self, obj):
        return obj.reactions.filter(reaction="dislike").count()

    def get_is_owner(self, obj):
        request = self.context.get("request")
        return request and request.user == obj.user

    def get_author_profile_pic(self, obj):
        request = self.context.get("request")
        if request and obj.user.profile_pic:
            return request.build_absolute_uri(obj.user.profile_pic.url)
        return None
    

    def get_image_url(self, obj):
        request = self.context.get("request")
        if request and obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None
    
    
    def get_comments_count(self, obj):
        return obj.comments.count()


# class CommentSerializer(serializers.ModelSerializer):
#     user_name = serializers.CharField(source="user.full_name", read_only=True)
#     is_owner = serializers.SerializerMethodField()

#     class Meta:
#         model = Comment
#         fields = [
#             "id",
#             "text",
#             "created_at",
#             "user_name",
#             "is_owner",
#         ]

#     def get_is_owner(self, obj):
#         request = self.context.get("request")
#         return request and request.user == obj.user