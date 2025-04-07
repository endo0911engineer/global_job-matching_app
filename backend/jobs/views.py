from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Job
from .serializers import JobSerializer, CreateJobSerializer
from accounts.models import User
from rest_framework.response import Response

# 企業ユーザーが自分のジョブのみ編集・削除できるようにするパーミッション
class IsCompanyOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if rewust.method in permissions.SAFE_METHODS:
            return True
        return request.user.role == 'comany' and obj.company == request.user.company

# ジョブ一覧を取得するAPI
class JobListView(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'company':
            # 企業ユーザーは自分のジョブのみ表示
            return Job.objects.filter(company=user.company)
        return Job.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'company':
            company = user.company # Userに関連付けられた企業情報を取得
            serializer.save(company=company)

# ジョブの詳細を取得・編集・削除するAPI
class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated,IsCompanyOwnerOrReadOnly]
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user
        if user.role == 'company':
            return Job.objects.filter(company=user.company)
        return Job.objects.all()
    
    def perform_update(self, serializer):
        serializer.validated_data.pop('comany', None)
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if user.role == 'company' and instance.company != user.company:
            raise PermissionDenied("You do not have permission to delete this job.")
        instance.delete()