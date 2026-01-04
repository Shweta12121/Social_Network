from django.urls import path
from .views import (
    PostListCreateView,
    PostDeleteView,
    ToggleReactionView,
)

urlpatterns = [
    path('posts/', PostListCreateView.as_view()),
    path('posts/<int:post_id>/delete/', PostDeleteView.as_view()),
    path('posts/<int:post_id>/<str:reaction_type>/', ToggleReactionView.as_view()),
]
