from django.db import models
from django.contrib import admin
from django.utils import timezone
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Group, Permission
import random
from django.contrib.auth.models import BaseUserManager
from django.db.models.signals import pre_save
from django.dispatch import receiver
from .utils import geocode_kakao
import uuid


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("이메일은 필수입니다.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # 🔐 비밀번호 해시처리
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('슈퍼유저는 is_staff=True 여야 합니다.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('슈퍼유저는 is_superuser=True 여야 합니다.')

        return self.create_user(email, password, **extra_fields)

    def get_by_natural_key(self, email):
        return self.get(email=email)

class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)  # ✅ 실제 PK 컬럼
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    nickname = models.CharField(max_length=12, unique=True, null=True, blank=True)
  # 사람들에게 보여지는 이름 (⭐필수⭐)
    user_type = models.CharField(max_length=20, choices=[('organizer', 'Organizer'), ('regular', 'Regular')])
    profile_image = models.ImageField(upload_to="profile/", blank=True, null=True)
    profile_image_url = models.TextField(blank=True, null=True)  # 🔥 추가
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    bio = models.TextField(blank=True, null=True)  # 🌟✨ bio 필드 추가!
    # 🔥 문제 해결 핵심: related_name 수정
    groups = models.ManyToManyField(
        Group,
        related_name='customuser_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_permissions',
        blank=True
    )
    
    star = models.ForeignKey(  # ⭐ 최애 스타 추가
        'api.Star',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='fans'
    )
    objects = CustomUserManager()

    @property
    def id(self):  # ✅ Django가 기대하는 id 속성 생성
        return self.user_id

    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        if not self.nickname:
            while True:
                random_number = random.randint(100000, 9999999)  # 6~7자리 랜덤 숫자
                temp_nickname = f"user{random_number}"
                if not User.objects.filter(nickname=temp_nickname).exists():
                    self.nickname = temp_nickname
                    break
        super().save(*args, **kwargs)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'nickname']  # ⭐ nickname도 필수 필드에 넣기
    class Meta:
        swappable = 'AUTH_USER_MODEL'  # 🔥 이거 추가
    
    
class Post(models.Model):
    status = models.CharField(
        max_length=10,
        choices=[('open', '모집중'), ('closed', '모집완료')],
        default='open'
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to="post_images/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    is_approved = models.BooleanField(default=True)  

    def __str__(self):
        return f"{self.user.nickname} - {self.title}"
    
class Reply(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    parent = models.ForeignKey(  # 🔥 이 줄 추가!
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='children'
    )

    def __str__(self):
        return self.content[:20]
    
class SocialAccount(models.Model):
    SOCIAL_CHOICES = [
        ('kakao', '카카오'),
        ('naver', '네이버'),
        ('google', '구글'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_accounts')
    provider = models.CharField(max_length=20, choices=SOCIAL_CHOICES)
    uid = models.CharField(max_length=255)  # 카카오 id 등
    connected_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'provider')  # 중복 연동 방지
        
        
        
class Follow(models.Model):
    follower = models.ForeignKey(User, related_name='following_set', on_delete=models.CASCADE)
    following = models.ForeignKey(User, related_name='follower_set', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')  # 중복 팔로우 방지!

    def __str__(self):
        return f"{self.follower.nickname} → {self.following.nickname}"
    
    



class Genre(models.Model):
    name = models.CharField(max_length=50, unique=True)  # 'idol', 'youtuber', ...

    def __str__(self):
        return self.name

class Star(models.Model):
    name = models.CharField(max_length=100)
    group = models.CharField(max_length=100, blank=True)
    display = models.CharField(max_length=200)
    image = models.URLField(max_length=500, blank=True, null=True)  # ← null=True 추가
    birthday = models.DateField(null=True, blank=True)
    keywords = models.JSONField(default=list, blank=True)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)  # 🔥 외래키 연결
    
    def __str__(self):
        return self.name

class BirthdayCafe(models.Model):
    cafe_name = models.CharField(max_length=200)
    description = models.TextField()
    genre = models.CharField(max_length=50)
    star = models.ForeignKey(Star, on_delete=models.SET_NULL, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    road_address = models.CharField(max_length=200)
    detail_address = models.CharField(max_length=200)
    image = models.ImageField(upload_to='event_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')  # ✅ 추가!
    liked_events = models.ManyToManyField(User, related_name='liked_cafes', blank=True)
    view_count = models.PositiveIntegerField(default=0)  # ✅ 조회수 추가
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.cafe_name
    
class Goods(models.Model):
    event = models.ForeignKey('BirthdayCafe', on_delete=models.CASCADE, related_name='goods')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.PositiveIntegerField()
    image = models.ImageField(upload_to='goods/', null=True, blank=True)

    def __str__(self):
        return self.name
    
    
class Report(models.Model):
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports_made')  # 신고한 사람
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='reports')  # 신고 대상 게시글
    reason = models.TextField()  # 신고 사유
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reporter} → {self.post} ({self.created_at.date()})"
    


class Venue(models.Model):
    VENUE_TYPE_CHOICES = [
        ('카페', '카페'),
        ('음식점', '음식점'),
        ('전시회', '전시회'),
        ('포토부스', '포토부스'),
        ('파티룸', '파티룸'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='venues')
    name = models.CharField(max_length=255)
    venue_type = models.CharField(max_length=20, choices=VENUE_TYPE_CHOICES)
    road_address = models.CharField(max_length=255)
    detail_address = models.CharField(max_length=255)
    main_image = models.ImageField(upload_to='venue_images/')
    rental_fee = models.PositiveIntegerField()
    deposit = models.PositiveIntegerField()
    operating_info = models.TextField(blank=True)
    operating_hours = models.CharField(max_length=255)
    benefits_image = models.ImageField(upload_to='benefit_images/', null=True, blank=True)
    description = models.TextField(blank=True)
    sns_type = models.CharField(max_length=50, blank=True)
    sns_account = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    view_count = models.PositiveIntegerField(default=0)  # ✅ 조회수 추가

    def __str__(self):
        return self.name
    
    
class Booking(models.Model):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='bookings')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='venue_bookings')  # ✅ 추가
    available_date = models.DateField()
    is_paid = models.BooleanField(default=False)  # 결제 완료 여부
    

class DictionaryTerm(models.Model):
    term = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    likes = models.PositiveIntegerField(default=0)
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    

class DictionaryDefinition(models.Model):
    term = models.ForeignKey(DictionaryTerm, related_name="definitions", on_delete=models.CASCADE)
    definition = models.TextField()
    example = models.TextField(blank=True, null=True)

class ChatRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User, related_name="api_chat_rooms")

class ChatRoomInvite(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    inviter = models.ForeignKey(User, related_name="sent_invites", on_delete=models.CASCADE)
    invitee = models.ForeignKey(User, related_name="received_invites", on_delete=models.CASCADE)
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.nickname} 알림: {self.message}"


@receiver(pre_save, sender=BirthdayCafe)
def set_coordinates(sender, instance, **kwargs):
    if (not instance.latitude or not instance.longitude) and instance.road_address and instance.detail_address:
        full_address = f"{instance.road_address} {instance.detail_address}"
        lat, lng = geocode_kakao(full_address)
        if lat and lng:
            instance.latitude = lat
            instance.longitude = lng
            
            
            
