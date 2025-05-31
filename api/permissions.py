# permissions.py
from rest_framework.permissions import BasePermission

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        # GET, HEAD, OPTIONS 요청은 허용
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True

        # POST 외의 요청은 작성자만 허용
        return obj.user == request.user
