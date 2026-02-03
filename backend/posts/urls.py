from django.urls import path
from .views import (PostListCreateView,PostDeleteView,ToggleReactionView,PublicUserPostsView,CommentCreateView, CommentDeleteView)

urlpatterns = [
    path('posts/', PostListCreateView.as_view()),
    path('posts/<int:post_id>/delete/', PostDeleteView.as_view()),

    # ✅ COMMENTS MUST COME FIRST
    path("posts/<int:post_id>/comments/", CommentCreateView.as_view()),

    # 👍 REACTIONS AFTER
    path('posts/<int:post_id>/<str:reaction_type>/', ToggleReactionView.as_view()),

    path("user/<int:user_id>/posts/", PublicUserPostsView.as_view()),
    path("comments/<int:comment_id>/delete/", CommentDeleteView.as_view()),
]
