from django.shortcuts import render,redirect,HttpResponse
from DoctorApp.models import Users,CustomUser,DoctorReg,Specialization,Appointment
import random
from datetime import datetime
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from DoctorApp.serializers import AppointmentSerializer,UserRegistrationSerializer 
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from DoctorApp.EmailBackEnd import EmailBackEnd
from django.contrib.auth import login
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from DoctorApp.Permission import IsUserAuthenticated
from django.http import HttpResponseNotFound



    
@api_view(['POST'])
def user_registration(request):
    if request.method == 'POST':
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': 'User registered successfully'})
        else:
            errors = serializer.errors
            return JsonResponse({'message': errors}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

@csrf_exempt
@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            # Log the error
            print(f"User with email '{email}' does not exist.")
            return JsonResponse({'error': 'User with this email does not exist.'}, status=400)

        if check_password(password, user.password):
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            # Log the error
            print(f"Invalid password for user with email '{email}'.")
            return JsonResponse({'error': 'Invalid password for this user.'}, status=400)
    else:
        # Log the error
        print("Invalid request method.")
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def create_appointment(request):
    if request.method == "POST":
        appointment_serializer = AppointmentSerializer(data=request.data)
        if appointment_serializer.is_valid():
            # Validate and save the appointment data
            appointment_serializer.save()
            # Display a success message
            messages.success(request, "Your Appointment Request Has Been Sent. We Will Contact You Soon")
            return JsonResponse({'sucess': 'appointment added'})
        else:
            # If the data is not valid, return the errors
            return JsonResponse(appointment_serializer.errors, status=400)

    # If the request method is not POST, return an error
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@api_view(['GET'])
@permission_classes([AllowAny])
def User_Search_Appointments(request):
    if request.method == "GET":
        query = request.GET.get('query', '')
        if query:
            # Filter records where fullname or Appointment Number contains the query
            appointments = Appointment.objects.filter(fullname__icontains=query) | Appointment.objects.filter(appointmentnumber__icontains=query)

            # Serialize the queryset of appointments
            serializer = AppointmentSerializer(appointments, many=True)

            # Return the serialized data along with search information
            data = {
                'search_query': query,
                'appointments': serializer.data
            }
            messages.info(request, "Search against " + query)
            return JsonResponse(data, safe=False)  # Safe is set to False to allow serialization of non-dict objects
        else:
            return HttpResponseNotFound('No records found') 

@api_view(['GET'])
def View_Appointment_Details(request, id):
    try:
        patientdetails = Appointment.objects.get(id=id)
        data = {
            'appointmentnumber': patientdetails.appointmentnumber,
            'fullname': patientdetails.fullname,
            'mobilenumber': patientdetails.mobilenumber,
            'email': patientdetails.email,
            'date_of_appointment': patientdetails.date_of_appointment,
            'time_of_appointment': patientdetails.time_of_appointment,
            'additional_msg': patientdetails.additional_msg,
            'remark': patientdetails.remark,
            'status': patientdetails.status,
            'prescription': patientdetails.prescription,
            'recommendedtest': patientdetails.recommendedtest,
            'created_at': patientdetails.created_at,
            'updated_at': patientdetails.updated_at
        }
        return JsonResponse(data)
    except Appointment.DoesNotExist:
        return JsonResponse({'error': 'Appointment not found'}, status=404)