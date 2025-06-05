# permissions.py
from rest_framework.permissions import BasePermission, IsAuthenticated

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        # GET, HEAD, OPTIONS 요청은 허용
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True

        # POST 외의 요청은 작성자만 허용
        return obj.user == request.user

class IsAuthenticatedOrReadOnly(BasePermission):
    """
    인증된 사용자만 쓰기 작업을 할 수 있고, 읽기는 모두 가능
    """
    def has_permission(self, request, view):
        # 읽기 요청은 모두 허용
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
            
        # 쓰기 요청은 인증된 사용자만 허용
        return bool(request.user and request.user.is_authenticated)

    def handle_no_permission(self, request):
        response = super().handle_no_permission(request)
        if response:
            response.data = {
                'detail': response.data.get('detail', ''),
                'requires_auth': True  # 인증이 필요한 API임을 표시
            }
        return response
