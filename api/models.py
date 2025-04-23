from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone

class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    user_type = models.CharField(max_length=20, choices=[('organizer', 'Organizer'), ('regular', 'Regular')])
    # ⭐ 프로필 이미지
    profile_image = models.ImageField(
        upload_to="profile/",         # MEDIA_ROOT/profile/ 폴더에 저장
        blank=True, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    @property
    def id(self):  # ✅ 이렇게 추가!
        return self.user_id
    
    def __str__(self):
        return self.username

# ✅ 아래 두 줄 추가!!
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']