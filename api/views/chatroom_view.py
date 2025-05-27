from rest_framework.decorators import api_view
from api.serializers.chatroom_serializer import ChatRoomSerializer
from api.models import ChatRoom, User, ChatRoomInvite
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import permission_classes

# views.py
@api_view(['POST'])
def create_chat_room(request):
    serializer = ChatRoomSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def list_chat_rooms(request):
    q = request.GET.get('q', '')
    rooms = ChatRoom.objects.filter(name__icontains=q)
    serializer = ChatRoomSerializer(rooms, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def invite_user_to_room(request, room_id):
    try:
        room = ChatRoom.objects.get(id=room_id)
        invitee_username = request.data.get('username')
        invitee = User.objects.get(username=invitee_username)
        invite = ChatRoomInvite.objects.create(room=room, inviter=request.user, invitee=invitee)
        return Response({"detail": f"{invitee.username} 초대 완료!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respond_to_invite(request, room_id):
    action = request.data.get('action')

    try:
        invite = ChatRoomInvite.objects.get(room__id=room_id, invitee=request.user)
    except ChatRoomInvite.DoesNotExist:
        return Response({"error": "초대가 존재하지 않아요."}, status=404)

    if action == "accept":
        invite.room.members.add(request.user)  # ✅ 방에 참가자로 추가
        invite.is_accepted = True
        invite.save()
        return Response({"detail": "채팅방에 입장했어요!"})

    elif action == "reject":
        invite.delete()
        return Response({"detail": "초대를 거절했어요."})

    else:
        return Response({"error": "action은 'accept' 또는 'reject'여야 해요."}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users(request):
    q = request.GET.get("q", "")
    users = User.objects.filter(username__icontains=q).exclude(id=request.user.id)[:10]
    return Response([
        {"id": u.user_id, "username": u.username}
        for u in users
    ])

