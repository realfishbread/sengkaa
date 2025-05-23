from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from api.models import Post
from api.models import User, Report  # 커스텀 User 모델
from django.utils.html import format_html
from django.urls import reverse


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
    list_display = ['reporter', 'post_title', 'reason', 'created_at']
    search_fields = ['reporter__nickname', 'post__title', 'reason']
    list_filter = ['created_at']
    raw_id_fields = ['reporter', 'post']
    ordering = ['-created_at']

    def post_title(self, obj):
        return obj.post.title
    post_title.short_description = '신고된 글 제목'
    
    def post_content(self, obj):
        return obj.post.content if hasattr(obj.post, 'content') else '(내용 없음)'
    post_content.short_description = '신고된 글 내용'
    
    def linked_post_title(self, obj):
        url = reverse('admin:api_post_change', args=[obj.post.id])  # 모델 등록된 app_label_modelname_change
        return format_html('<a href="{}">{}</a>', url, obj.post.title)
    linked_post_title.short_description = '신고된 글 제목'
    
    @admin.action(description="🗑️ 선택한 신고된 글 삭제하기")
    def delete_reported_posts(self, request, queryset):
        for report in queryset:
            report.post.delete()  # 신고된 글 삭제
        self.message_user(request, f"{queryset.count()}개의 글이 삭제되었습니다.")
        
    @admin.action(description="⛔ 신고된 글의 작성자 정지시키기")
    def deactivate_reported_users(self, request, queryset):
        reported_users = set(report.post.user for report in queryset)
        for user in reported_users:
            user.is_active = False
            user.save()
        self.message_user(request, f"{len(reported_users)}명의 게시글 작성자를 정지시켰습니다.")
    
    