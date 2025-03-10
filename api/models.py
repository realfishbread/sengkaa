from django.db import models

class User(models.Model):  
    user_id = models.AutoField(primary_key=True)  # PK 명시
    username = models.CharField(max_length=100, unique=True)  
    email = models.EmailField(unique=True)  
    password = models.CharField(max_length=255)  
    user_type = models.CharField(max_length=20, choices=[('organizer', '주최측'), ('regular', '일반 사용자')], default='regular')
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username
