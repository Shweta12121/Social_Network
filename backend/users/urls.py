from django.urls import path
from .views import SignupView, LoginView, ProfileView,PublicProfileView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('user/<int:user_id>/', PublicProfileView.as_view()),
]
