from django.db import models
from django.conf import settings

# Create your models here.

User = settings.AUTH_USER_MODEL

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    image = models.ImageField(upload_to='posts/', blank=True, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.user} ({self.id})"
    

class PostReaction(models.Model):
    LIKE = "like"
    DISLIKE = "dislike"

    REACTION_CHOICES = [
        (LIKE, "Like"),
        (DISLIKE, "Dislike"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="reactions")
    reaction = models.CharField(max_length=10, choices=REACTION_CHOICES)

    class Meta:
        unique_together = ("user", "post")