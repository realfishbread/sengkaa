import json
from channels.generic.websocket import AsyncWebsocketConsumer

from api.models import ChatRoom, Message
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        user = self.scope["user"]

        if not user.is_authenticated:
            await self.close()
            return
        
        


        # 그룹에 참가
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()


         # 🔥 이전 메시지 30개 불러오기 (최신순)
        room = await sync_to_async(ChatRoom.objects.get)(id=self.room_name)
        messages = await sync_to_async(
            lambda: list(
                room.messages.order_by("-timestamp")[:30].values(
                    "content", "sender__nickname", "timestamp", "is_system"
                )
            )
        )()

        # 메시지를 시간 순으로 다시 정렬
        messages.reverse()

        await self.send(text_data=json.dumps({
            "type": "initial_messages",
            "messages": [
                {
                    "content": m["content"],
                    "sender": m["sender__nickname"],
                    "timestamp": str(m["timestamp"]),
                    "is_system": m["is_system"]
                } for m in messages
            ]
        }))

        

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]

        # 🔥 현재 유저 정보 (로그인한 유저)
        user = self.scope["user"]

        try:
            data = json.loads(text_data)
            message = data["message"]
        except (KeyError, json.JSONDecodeError) as e:
            await self.send(text_data=json.dumps({"error": "잘못된 메시지 형식입니다."}))
            await self.close()
            return
            
        # 🔥 방 객체 가져오기 (room_name은 UUID)
        try:
            room = await sync_to_async(ChatRoom.objects.get)(id=self.room_name)
        except ChatRoom.DoesNotExist:
            await self.send(text_data=json.dumps({"error": "채팅방이 존재하지 않아요."}))
            return

        # 메시지 저장 후 반환값 받아오기
        msg = await sync_to_async(Message.objects.create)(
            room=room,
            sender=user,
            content=message
        )

        # group_send에 timestamp도 추가
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": user.nickname,
                "timestamp": str(msg.timestamp),
                "is_system": False
            }
        )


    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
            "timestamp": event["timestamp"],
            "is_system": event.get("is_system", False)
        }))