import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async

User = get_user_model()

@database_sync_to_async
def get_user(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user = User.objects.get(id=payload["user_id"])
        return user
    except Exception:
        return None

class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return TokenAuthMiddlewareInstance(scope, self)

class TokenAuthMiddlewareInstance:
    def __init__(self, scope, middleware):
        self.scope = scope
        self.middleware = middleware

    async def __call__(self, receive, send):
        query_string = self.scope["query_string"].decode()
        token = None

        if "token=" in query_string:
            token = query_string.split("token=")[-1]

        self.scope["user"] = await get_user(token)
        inner = self.middleware.inner(self.scope)
        return await inner(receive, send)
