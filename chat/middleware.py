# chat/middleware.py

from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from api.models import User  # 너의 User 모델로 바꿔줘

@database_sync_to_async
def get_user(token):
    try:
        access_token = AccessToken(token)
        user_id = access_token["user_id"]
        return User.objects.get(user_id=user_id)  # ⭐ user_id 기준
    except Exception as e:
        print("❌ get_user 실패:", str(e))
        return AnonymousUser()


class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope["query_string"].decode()
        token = parse_qs(query_string).get("token", [None])[0]

        print("🔑 받은 token:", token)

        if token:
            user = await get_user(token)  # ⭐ 바로 token 넘김
            print("✅ 유저 객체:", user)
            scope["user"] = user or AnonymousUser()
        else:
            print("❗ 토큰 없음")
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
