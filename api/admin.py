from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from api.models import Post
from api.models import User, Report,Star, MainBanner, Venue  # 커스텀 User 모델
from django.utils.html import format_html
from django.urls import reverse
from django.utils.html import format_html
from django.contrib import messages



@admin.action(description="✅ 선택한 유저 사장 인증 승인")
def approve_organizers(modeladmin, request, queryset):
    updated = queryset.update(organizer_verified='approved')
    modeladmin.message_user(request, f"{updated}명의 유저가 인증되었습니다.", messages.SUCCESS)

@admin.action(description="❌ 선택한 유저 사장 인증 거절")
def reject_organizers(modeladmin, request, queryset):
    updated = queryset.update(organizer_verified='rejected')
    modeladmin.message_user(request, f"{updated}명의 유저가 거절되었습니다.", messages.ERROR)

@admin.action(description="⏳ 선택한 유저 인증 대기 상태로 변경")
def pending_organizers(modeladmin, request, queryset):
    updated = queryset.update(organizer_verified='pending')
    modeladmin.message_user(request, f"{updated}명의 유저가 인증 대기 상태로 변경되었습니다.", messages.WARNING)

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    model = User
    list_display = ['email', 'username', 'nickname', 'user_type', 'organizer_verified', 'is_staff', 'is_superuser']
    search_fields = ['email', 'username', 'nickname']
    list_editable = ['organizer_verified']  # ✅ 이 줄 추가
    list_filter = ['organizer_verified']
    ordering = ['email']
    actions = [approve_organizers, reject_organizers, pending_organizers]

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('개인 정보', {'fields': ('username', 'nickname', 'profile_image')}),
        ('권한', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('사장 인증', {'fields': ('user_type', 'organizer_verified')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'username', 'nickname', 'user_type'),
        }),
    )

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
    list_display = ['reporter', 'linked_post_title', 'reason', 'created_at']
    search_fields = ['reporter__nickname', 'post__title', 'reason']
    list_filter = ['created_at']
    raw_id_fields = ['reporter', 'post']
    ordering = ['-created_at']

    actions = ['delete_reported_posts', 'deactivate_reported_users', 'restore_reported_users']


    def linked_post_title(self, obj):
        url = reverse('admin:api_post_change', args=[obj.post.id])
        return format_html('<a href="{}">{}</a>', url, obj.post.title)
    linked_post_title.short_description = '신고된 글 제목'

    @admin.action(description="🗑️ 선택한 신고된 글 삭제하기")
    def delete_reported_posts(self, request, queryset):
        for report in queryset:
            report.post.delete()
        self.message_user(request, f"{queryset.count()}개의 글이 삭제되었습니다.")

    @admin.action(description="⛔ 신고된 글의 작성자 정지시키기")
    def deactivate_reported_users(self, request, queryset):
        reported_users = set(report.post.user for report in queryset)
        for user in reported_users:
            user.is_active = False
            user.save()
        self.message_user(request, f"{len(reported_users)}명의 게시글 작성자를 정지시켰습니다.")

    @admin.action(description="✅ 정지된 사용자 다시 활성화하기")
    def restore_reported_users(self, request, queryset):
        reported_users = set(report.post.user for report in queryset)
        for user in reported_users:
            if not user.is_active:
                user.is_active = True
                user.save()
        self.message_user(request, f"{len(reported_users)}명의 사용자를 다시 활성화했습니다.")
    

@admin.register(Star)
class StarAdmin(admin.ModelAdmin):
    list_display = ('name', 'group', 'image_preview')  # 리스트 페이지에도 미리보기
    readonly_fields = ('image_preview',)  # 상세 페이지에서도 미리보기 가능

    def image_preview(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return format_html(
                '<img src="{}" width="150" style="object-fit: contain; border: 1px solid #ccc;" />',
                obj.image.url
            )
        return "No image"

    image_preview.short_description = "미리보기"



@admin.register(MainBanner)
class MainBannerAdmin(admin.ModelAdmin):
    list_display = ['caption', 'priority', 'is_active', 'created_at']
    list_editable = ['priority', 'is_active']
    list_filter = ['is_active']
    ordering = ['priority', '-created_at']


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'organizer_verified_status', 'business_license_link']  # ✅ 추가
    readonly_fields = ['business_license_link']  # ✅ 상세페이지에서도 보기
    list_filter = ['owner__organizer_verified', 'business_license']

    def organizer_verified_status(self, obj):
        return obj.owner.organizer_verified if obj.owner else False
    organizer_verified_status.boolean = True
    organizer_verified_status.short_description = '사장 인증됨?'

    def business_license_link(self, obj):
        if obj.business_license:
            return format_html('<a href="{}" target="_blank">📄 다운로드</a>', obj.business_license.url)
        return "없음"
    business_license_link.short_description = '사업자등록증'



