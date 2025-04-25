from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'user', 'is_approved', 'created_at']
    list_filter = ['is_approved']
    search_fields = ['title', 'content']
    actions = ['approve_selected_posts']

    def approve_selected_posts(self, request, queryset):
        queryset.update(is_approved=True)
    approve_selected_posts.short_description = "✔️ 선택한 글 승인하기"