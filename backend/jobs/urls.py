from django.urls import path
from .views import JobListView, JobDetailView

urlpatterns = [
    path('', JobListView.as_view(), name='job-list'), #ジョブ一覧取得と作成
    path('<uuid:id>/', JobDetailView.as_view(), name='job-detail'), # ジョブ詳細取得・更新・削除
]