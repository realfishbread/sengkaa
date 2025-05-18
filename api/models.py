from django.db import models
from django.utils import timezone
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Group, Permission
import random


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
    post = models.ForeignKey(Post, related_name='replies', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
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
    image = models.URLField(max_length=500, blank=True)
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

    def __str__(self):
        return self.name
    
    
class Booking(models.Model):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='bookings')
    available_date = models.DateField()