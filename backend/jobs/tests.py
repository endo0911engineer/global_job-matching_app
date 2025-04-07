from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from accounts.models import User, Company
from jobs.models import Job

class JobAPITestCase(APITestCase):
    def setUp(self):
        # 企業情報作成
        self.company = Company.objects.create(name="Test Company")

        # 企業ユーザー作成
        self.company_user = User.objects.create_user(
            email="company@example.com",
            name="Company User",
            password="testpass",
            role="company",
            company=self.company,
        )

        # 他の企業とユーザー
        self.other_company = Company.objects.create(name="Other Company")
        self.other_user = User.objects.create_user(
            email="other@example.com",
            name="Other User",
            password="testpass",
            role="company",
            company=self.other_company,
        )

        # 自社ジョブ
        self.job = Job.objects.create(
            title="Engineer Job",
            description="Do engineering",
            company=self.company,
        )

        self.job_list_url = reverse("job-list") 
        self.job_detail_url = reverse("job-detail", kwargs={"id": self.job.id}) 

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_company_can_view_own_jobs(self):
        self.authenticate(self.company_user)
        response = self.client.get(self.job_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], self.job.title)

    def test_company_can_create_job(self):
        self.authenticate(self.company_user)
        data = {
            "title": "New Job",
            "description": "New job description"
        }
        response = self.client.post(self.job_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["company"], str(self.company.id))

    def test_company_can_update_own_job(self):
        self.authenticate(self.company_user)
        update_data = {
            "title": "Updated Title",
            "description": "Updated Description"
        }
        response = self.client.put(self.job_detail_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated Title")

    def test_company_cannot_update_other_company_job(self):
        self.authenticate(self.other_user)
        update_data = {
            "title": "Hack Title",
            "description": "Hack Description"
        }
        response = self.client.put(self.job_detail_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_company_can_delete_own_job(self):
        self.authenticate(self.company_user)
        response = self.client.delete(self.job_detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_company_cannot_delete_other_company_job(self):
        self.authenticate(self.other_user)
        response = self.client.delete(self.job_detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
