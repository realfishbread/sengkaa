from django.db import models
from django.utils import timezone

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Group, Permission

class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)  # ✅ 실제 PK 컬럼
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    user_type = models.CharField(max_length=20, choices=[('organizer', 'Organizer'), ('regular', 'Regular')])
    profile_image = models.ImageField(upload_to="profile/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

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

    @property
    def id(self):  # ✅ Django가 기대하는 id 속성 생성
        return self.user_id

    def __str__(self):
        return self.username

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
