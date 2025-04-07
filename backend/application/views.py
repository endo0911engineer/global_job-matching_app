from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Application
from .serializers import ApplicationSerializer

class ApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(user=self.request.user)

# 企業ユーザー向けの自社の求人に対する応募一覧
class CompanyApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role != 'company':
            return PermissionDenied("企業ユーザーのみが操作可能です。")
        
        return Application.objects.filter(job__company=user.company).select_related('user', 'job')

# 企業ユーザー向けの応募詳細の取得・ステータス更新
class CompanyAplicationDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role != User.COMPANY:
            raise PermissionDenied("企業ユーザーのみが操作可能です。")
        
        return Application.objects.filter(job__company=user.company)