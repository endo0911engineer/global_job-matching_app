from django.urls import path
from .views import RegisterView, UserView, LogoutView, EngineerProfileView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", TokenObtainPairView.as_view(), name="login"),  # JWT 認証
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("user/", UserView.as_view(), name="user"),
    path("logout/", LogoutView.as_view(), name="logout"),
    psth("engineer-profile/", EngineerProfileView.as_view(), name='engineer-profile'),
]