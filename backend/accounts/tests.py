from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class AuthTests(APITestCase):

    def setUp(self):
        """テスト用のユーザーを作成"""
        self.user = User.objects.create_user(
            email="test@example.com", 
            name="Test User",
            password="testpass"
        )
        self.login_url = "/api/accounts/login/"
        self.register_url = "/api/accounts/register/"
        self.logout_url = "/api/accounts/logout/"
        self.user_url = "/api/accounts/user/"
        self.token_refresh_url = "/api/accounts/token/refresh/"

    def test_register_user(self):
        """ユーザー登録APIが正常に動作するかテスト"""
        data = {"email": "newuser@example.com", 'name': 'Test User', "password": "newpassword"}
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_user(self):
        """ユーザーが正しくログインできるかをテスト"""
        data = {"email": "test@example.com", "password": "testpass"}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data) 

    def test_get_user_info(self):
        """ログインしたユーザーが自分の情報を取得できるかテスト"""
        self.client.force_authenticate(user=self.user)  
        response = self.client.get(self.user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)

    def test_logout_user(self):
        """ユーザーがログアウトできるかをテスト"""
        # ログイン
        login_data = {"email": "test@example.com", "password": "testpass"}
        login_response = self.client.post(self.login_url, login_data)
        print("ログイン応答:", login_response.data)  # トークンを確認

        # ログアウト
        refresh_token = login_response.data.get("refresh")
        logout_response = self.client.post(
            self.logout_url,
            {"refresh": refresh_token},
            format='json'  # 明示的にJSONを指定
        )
        print("ログアウト応答:", logout_response.data)  # エラー内容を確認

        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)