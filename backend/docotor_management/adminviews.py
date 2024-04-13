from django.shortcuts import get_object_or_404, render, redirect, HttpResponse
from DoctorApp.models import DoctorReg, Specialization
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from DoctorApp.serializers import CustomUserSerializer, DoctorRegSerializer,AppointmentSerializer, SpecializationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken
import jwt


def extract_user_id_from_token(token):
    try:
        # Parse the token as an AccessToken object
        access_token = AccessToken(token)
        user_id = access_token.payload.get('user_id')
        return user_id
    except Exception as e:
        # Handle token decoding errors
        print(e)  # For debugging purposes
        return None

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ADMINHOME(request):
    if request.method == "GET":
        token = request.headers.get('Authorization').split(' ')[1]
        user_id = extract_user_id_from_token(token)
        if user_id is None:
            return Response({"error": "Invalid token"}, status=401)
        
        doctor_count = DoctorReg.objects.all().count()  # Ensure you call count() to execute the queryset
        specialization_count = Specialization.objects.all().count()  # Ensure you call count() to execute the queryset
        data = {
            'doctor_count': doctor_count,
            'specialization_count': specialization_count,
        }
        return Response(data)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def SPECIALIZATION(request):
    if request.method == "POST":
        token = request.headers.get('Authorization').split(' ')[1]
        user_id = extract_user_id_from_token(token)
        if user_id is None:
            return Response({"error": "Invalid token"}, status=401)
        specializationname = request.data.get('specializationname')  # Use request.data to access POST data in DRF
        if specializationname:
            specialization = Specialization.objects.create(sname=specializationname)
            specialization.save()
            # Return a DRF Response instead of JsonResponse
            return Response({'message': 'Specialization Added Successfully!!!', 'specialization_id': specialization.id})
        else:
            return Response({'error': 'Specialization name cannot be null'}, status=400)
    else:
        return Response({'error': 'Invalid request method'}, status=400)
       
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def MANAGESPECIALIZATION(request):
   if request.method == "GET": 
        token = request.headers.get('Authorization').split(' ')[1]
        user_id = extract_user_id_from_token(token)
        if user_id is None:
            return Response({"error": "Invalid token"}, status=401)
        specialization = Specialization.objects.all()
        serializer = SpecializationSerializer(specialization, many=True)
        return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])  # Uncomment this line if you're using JWTAuthentication
def DELETE_SPECIALIZATION(request, id):
    if request.method == "DELETE": 
        token = request.headers.get('Authorization').split(' ')[1]
        user_id = extract_user_id_from_token(token)
        if user_id is None:
            return Response({"error": "Invalid token"}, status=401)
        specialization = get_object_or_404(Specialization, id=id)
        specialization.delete()
        return Response({'message': 'Specialization deleted successfully'}, status=200)
    else:
        return Response({'detail': f'Method "{request.method}" not allowed.'}, status=401)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def UPDATE_SPECIALIZATION(request, id):
   if request.method == "PUT": 
    token = request.headers.get('Authorization').split(' ')[1]
    user_id = extract_user_id_from_token(token)
    if user_id is None:
            return Response({"error": "Invalid token"}, status=401)
    specialization = get_object_or_404(Specialization, id=id)
    sname = request.data.get('sname')
    specialization.sname = sname
    specialization.save()
    return Response({'message': 'Specialization updated successfully'}, status=200)
   

@api_view(['POST'])
@permission_classes([AllowAny])
def UPDATE_SPECIALIZATION_DETAILS(request):
    if request.method == 'POST':
        data = request.data
        sep_id = data.get('sep_id')
        sname = data.get('sname')
        if sep_id is not None and sname is not None:
            specialization = get_object_or_404(Specialization, id=sep_id)
            specialization.sname = sname
            specialization.save()
            return Response({'message': 'Specialization detail updated successfully'}, status=200)
        else:
            return Response({'error': 'Please provide specialization ID and name'}, status=400)
    else:
        return Response({'error': 'Invalid request method'}, status=405)   

@api_view(['GET'])
@permission_classes([JWTAuthentication])
def DoctorList(request):
   if request.method == "GET": 
    doctorlist = DoctorReg.objects.all()
    serializer = DoctorRegSerializer(doctorlist, many=True)
    return Response(serializer.data)
