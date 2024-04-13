from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend


class EmailBackEnd:
    def authenticate(self, request, username=None, password=None):
        UserModel = get_user_model()
        try:
            # Assuming 'username' is the email
            user = UserModel.objects.get(email=username)
            if user.check_password(password):
                return user
            else:
                return None
        except UserModel.DoesNotExist:
            return None
        
# class EmailBackEnd(ModelBackend):
#     def authenticate(self, request, username=None, password=None, **kwargs):
#         UserModel = get_user_model()
#         try:
#             user = UserModel.objects.get(email=username)
#         except UserModel.DoesNotExist:
#             return None
#         else:
#             if user.check_password(password):
#                 return user
#         return None 




# class EmailBackend(ModelBackend):
#     def authenticate(self, request, username=None, password=None):
#         if username is None:
#             username = request.POST.get('email')  # Or request.data.get('email')
#         try:
#             user = self.get_user(username=username)
#         except CustomUser.DoesNotExist:
#             return None
#         if user.check_password(password):
#             return user
        
#         return None
    
 