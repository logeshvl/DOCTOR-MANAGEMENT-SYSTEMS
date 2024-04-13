from django.shortcuts import render,redirect,HttpResponse
from django.contrib.auth import  authenticate,login
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from DoctorApp.models import CustomUser,DoctorReg
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.backends import ModelBackend
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import authenticate
from DoctorApp.EmailBackEnd import EmailBackEnd # Adjust import path if needed
from django.http import JsonResponse
from rest_framework import status



 
@csrf_exempt
@api_view(['POST'])
def doLogin(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')

        user = EmailBackEnd().authenticate(request, username=email, password=password)
        if user:
            login(request, user)
            user_type = user.user_type
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            user_id = user.id
            username = user.username

            if user_type == 1:
                # Admin login
                return JsonResponse({
                    'username': username,
                    'user_type': user_type,
                    'access_token': access_token,
                    'refresh_token': refresh_token,
                })
            elif user_type == 2:
                # Doctor login
                doctor = DoctorReg.objects.get(admin=user)
                return JsonResponse({
                    'username': username,
                    'user_type': user_type,
                    'access_token': access_token,
                    'refresh_token': refresh_token,
                })
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

