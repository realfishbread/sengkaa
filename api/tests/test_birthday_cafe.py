from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from api.models import BirthdayCafe, User
from datetime import date

class NearbyBirthdayCafeTests(APITestCase):
    def setUp(self):
        # 테스트 유저 생성
        self.user = User.objects.create_user(
            email='test@test.com',
            password='testpass123',
            username='testuser'
        )
        
        # 테스트 데이터 생성 - 강남역 근처 카페들
        self.cafe1 = BirthdayCafe.objects.create(
            cafe_name="강남역 카페1",
            description="테스트 카페1",
            genre="idol",
            start_date=date.today(),
            end_date=date.today(),
            road_address="서울 강남구 강남대로 396",
            detail_address="강남역 1번 출구",
            latitude=37.498095,  # 강남역 좌표
            longitude=127.027610,
            user=self.user
        )
        
        self.cafe2 = BirthdayCafe.objects.create(
            cafe_name="강남역 카페2",
            description="테스트 카페2",
            genre="idol",
            start_date=date.today(),
            end_date=date.today(),
            road_address="서울 강남구 강남대로 398",
            detail_address="강남역 2번 출구",
            latitude=37.497912,  # 강남역 근처 좌표
            longitude=127.027742,
            user=self.user
        )
        
        # 멀리 있는 카페 (잠실역)
        self.cafe3 = BirthdayCafe.objects.create(
            cafe_name="잠실역 카페",
            description="테스트 카페3",
            genre="idol",
            start_date=date.today(),
            end_date=date.today(),
            road_address="서울 송파구 올림픽로 265",
            detail_address="잠실역 1번 출구",
            latitude=37.513251,  # 잠실역 좌표
            longitude=127.099935,
            user=self.user
        )

    def test_nearby_cafes_found(self):
        """강남역 근처 2km 반경 내의 카페를 잘 찾는지 테스트"""
        url = reverse('nearby_birthday_cafes')
        response = self.client.get(url, {
            'lat': 37.498095,  # 강남역 좌표
            'lng': 127.027610,
            'radius': 2  # 2km 반경
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)  # 강남역 근처 2개 카페만 나와야 함
        
        # 거리순 정렬 확인
        self.assertEqual(response.data['results'][0]['cafe_name'], "강남역 카페1")
        self.assertEqual(response.data['results'][1]['cafe_name'], "강남역 카페2")

    def test_no_cafes_found(self):
        """아무 카페도 없는 지역 테스트"""
        url = reverse('nearby_birthday_cafes')
        response = self.client.get(url, {
            'lat': 33.499,  # 제주도 어딘가
            'lng': 126.531,
            'radius': 1
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)

    def test_pagination(self):
        """페이지네이션 테스트"""
        # 추가로 18개 카페 더 생성 (총 20개가 되도록)
        for i in range(18):
            BirthdayCafe.objects.create(
                cafe_name=f"강남역 카페{i+4}",
                description=f"테스트 카페{i+4}",
                genre="idol",
                start_date=date.today(),
                end_date=date.today(),
                road_address=f"서울 강남구 강남대로 {400+i}",
                detail_address=f"강남역 {i+4}번 출구",
                latitude=37.498095 + (i * 0.0001),  # 약간씩 다른 위치
                longitude=127.027610 + (i * 0.0001),
                user=self.user
            )

        url = reverse('nearby_birthday_cafes')
        response = self.client.get(url, {
            'lat': 37.498095,
            'lng': 127.027610,
            'radius': 5,
            'page_size': 10  # 한 페이지당 10개씩
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 10)  # 첫 페이지 10개
        self.assertIsNotNone(response.data['next'])  # 다음 페이지 링크 존재
        self.assertIsNone(response.data['previous'])  # 이전 페이지 링크 없음

    def test_invalid_coordinates(self):
        """잘못된 좌표값 테스트"""
        url = reverse('nearby_birthday_cafes')
        response = self.client.get(url, {
            'lat': 'invalid',
            'lng': 'invalid',
            'radius': 1
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 