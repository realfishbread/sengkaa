# urls.py
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from api.views.booking_views import my_booked_venues, reserved_dates, toss_payment_verify, create_payment_request, toss_payment_success_page

urlpatterns = [
    path('my-venues/', my_booked_venues, name='my_booked_venues'),
    path('reserved-dates/<int:venue_id>/', reserved_dates, name='reserved_dates'),
    path('payment/create/', create_payment_request, name='create_payment_request'),
    path('payment/success/page/', toss_payment_success_page, name='toss_success_page'),
    path('payment/success/', toss_payment_verify, name='toss-payment-success'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
