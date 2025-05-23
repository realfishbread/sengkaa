from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from api.models import Post
from api.models import User, Report  # 커스텀 User 모델


@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    model = User
    list_display = ['email', 'username', 'nickname', 'is_staff', 'is_superuser']
    search_fields = ['email', 'username', 'nickname']
    ordering = ['email']

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'user', 'is_approved', 'created_at']
    list_filter = ['is_approved']
    search_fields = ['title', 'content']
    actions = ['approve_selected_posts']

    def approve_selected_posts(self, request, queryset):
        queryset.update(is_approved=True)
    approve_selected_posts.short_description = "✔️ 선택한 글 승인하기"

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['reporter', 'post', 'reason', 'created_at']
    search_fields = ['reporter__nickname', 'post__title', 'reason']
    list_filter = ['created_at']
