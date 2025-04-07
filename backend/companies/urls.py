from django.urls import path
from .views import CompanyListView, MyCompanyView

urlpatterns = [
    path('', CompanyListView.as_view(), name='company-list'), #Company一覧取得と作成
    path('me/', MyCompanyView.as_view(), name='my-company'), # Company詳細取得・更新・削除
]