from rest_framework.permissions import BasePermission
from .models import Users


class IsUserAuthenticated(BasePermission):
    """
    Allows access only to Users authenticated users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and isinstance(request.user, Users)

class IsAdminUser(BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 1

class IsDoctorUser(BasePermission):
    """
    Allows access only to doctor users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 2