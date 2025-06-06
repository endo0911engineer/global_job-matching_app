from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/jobs/", include('jobs.urls')),
    path("api/companies/", include('companies.urls')),
]
