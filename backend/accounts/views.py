from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .models import EngineerProfile
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, RegisterSerializer, EngineerProfileSerializer

User = get_user_model()

# ユーザー登録 API
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

# ユーザー情報取得API
class UserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# ログアウトAPI(JWT トークン無効化)
class LogoutView(generics.GenericAPIView):
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.denylist()
            return Response({"message": "Logged out successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=400)


# ユーザー情報取得・ユーザー情報更新API
class EngineerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = EngineerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = EngineerProfile.objects.get_or_create(user=self.request.user)
        return profile
    
    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
