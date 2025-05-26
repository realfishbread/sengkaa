from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.serializers.booking_serializer import MyBookedVenueSerializer
from api.models import Booking, Venue
import base64
import requests
from rest_framework.permissions import AllowAny
from django.conf import settings

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_booked_venues(request):
    my_bookings = Booking.objects.filter(user=request.user, is_paid=True)
    serializer = MyBookedVenueSerializer(my_bookings, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])  # 필요 시 AllowAny로 변경 가능
def reserved_dates(request, venue_id):
    bookings = Booking.objects.filter(
        venue_id=venue_id,
        is_paid=True
    ).values_list('available_date', flat=True)

    # 날짜 객체 → 문자열로 변환
    date_list = [d.isoformat() for d in bookings]

    return Response(date_list)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_request(request):
    user = request.user
    venue_id = request.data.get('venue_id')
    amount = request.data.get('amount')
    date_str = request.data.get('date')  # 🧠 날짜는 반드시 전달받아야 함

    # 🧼 유효성 검사
    if not venue_id or not amount or not date_str:
        return Response({'error': 'venue_id, amount, date는 필수입니다.'}, status=400)

    try:
        venue = Venue.objects.get(id=venue_id)
    except Venue.DoesNotExist:
        return Response({'error': '존재하지 않는 장소입니다.'}, status=404)

    # 🎯 결제용 orderId 생성 (💡 예약 중복 확인 및 검증 시에도 사용)
    order_id = f"venue-{venue.id}-user-{user.id}-{date_str}"

    # 🎁 클라이언트에게 필요한 정보 전달
    return Response({
        "orderId": order_id,
        "clientKey": settings.TOSS_CLIENT_KEY,
        "amount": int(amount)
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toss_payment_verify(request):
    paymentKey = request.data.get('paymentKey')
    orderId = request.data.get('orderId')
    amount = request.data.get('amount')

    if not paymentKey or not orderId or not amount:
        return Response({'error': '필수 값 누락'}, status=400)

    url = 'https://api.tosspayments.com/v1/payments/confirm'
    auth_header = base64.b64encode(f"{settings.TOSS_SECRET_KEY}:".encode()).decode()
    headers = {
        'Authorization': f'Basic {auth_header}',
        'Content-Type': 'application/json'
    }
    payload = {
        'paymentKey': paymentKey,
        'orderId': orderId,
        'amount': int(amount)
    }

    res = requests.post(url, headers=headers, json=payload)
    if res.status_code != 200:
        return Response({'error': 'Toss 결제 검증 실패'}, status=400)

    # ✅ orderId 파싱
    _, venue_id, _, _, date = orderId.split('-')
    venue = Venue.objects.get(id=venue_id)

    if Booking.objects.filter(venue=venue, available_date=date, is_paid=True).exists():
        return Response({'error': '이미 예약됨'}, status=400)

    Booking.objects.create(
        venue=venue,
        user=request.user,
        available_date=date,
        is_paid=True
    )

    return Response({'message': '예약 완료'})


