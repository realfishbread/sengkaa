import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import dotenv  # 이거 설치 안 돼 있으면 `pip install python-dotenv`
dotenv.load_dotenv() 

import django
django.setup()  # 반드시 import 전에 초기화

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from chat.middleware import TokenAuthMiddleware
import chat.routing


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": TokenAuthMiddleware(
        URLRouter(chat.routing.websocket_urlpatterns)
    )
})


