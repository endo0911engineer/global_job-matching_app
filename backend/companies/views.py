from rest_framework import generics, permissions
from .models import Company
from .serializers import CompanySerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, BasePermission

# 企業情報の所有者のみが更新できるようにするためのカスタムパーミッション
class IsCompanyOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.role == "company" and request.user.company == obj

# 企業の一覧・作成API
class CompanyListView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]


# 自社情報取得API
class MyCompanyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company = request.user.company
        if not compamy:
            return Response({"error": "No company associated with this user."}, status=404)
        serializer = CompanySerializer(company)
        return Response(serializer.data)  
    
    def put(self, request):
        company = request.user.company
        if not company:
            return Response({"error": "No company associated with this user."}, status=404)
        serializer = CompanySerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request):
        company = request.user.company
        if not company:
            return Response({"error": "No comany associated with this user."}, status=404)
        company.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
