from django.contrib.auth.decorators import login_required
from django.core.serializers import serialize
from DoctorApp.models import DoctorReg,Specialization,CustomUser,Appointment
from django.contrib import messages
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes,authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from DoctorApp.serializers import CustomUserSerializer, DoctorRegSerializer,AppointmentSerializer
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from docotor_management.settings import EMAIL_HOST_USER
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login
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
    
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def DOCSIGNUP(request):
    if request.method == "POST":
        serializer = CustomUserSerializer(data=request.data)  # Use CustomUserSerializer
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(request.data.get('password'))
            user.save()
            doctor_data = {
                'admin': user.id,
                'mobilenumber': request.data.get('mobno'),
                'specialization_id': request.data.get('specialization_id')
            }
            doctor_serializer = DoctorRegSerializer(data=doctor_data)  # Use DoctorRegSerializer
            if doctor_serializer.is_valid():
                doctor_serializer.save()
                messages.success(request, 'Signup Successfully')
                return JsonResponse({'message': 'signup successful'}, status=200)
            else:
                if request.data.get('user_type') == 1:
                    # Exclude validation errors related to specialization_id
                    doctor_serializer.errors.pop('specialization_id', None)
                    return JsonResponse({'message': 'signup successful'}, status=200)
                else:
                    return JsonResponse(doctor_serializer.errors, status=400)
        else:
            return JsonResponse(serializer.errors, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
 
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def DOCTORHOME(request):
    if request.method == 'GET':
        try:  
            token = request.headers.get('Authorization').split(' ')[1]
            user_id = extract_user_id_from_token(token)
            doctor_reg = DoctorReg.objects.get(admin=user_id)
            allaptcount = Appointment.objects.filter(doctor_id=doctor_reg).count()
            newaptcount = Appointment.objects.filter(status='0', doctor_id=doctor_reg).count()
            appaptcount = Appointment.objects.filter(status='Approved', doctor_id=doctor_reg).count()
            canaptcount = Appointment.objects.filter(status='Cancelled', doctor_id=doctor_reg).count()
            comaptcount = Appointment.objects.filter(status='Completed', doctor_id=doctor_reg).count()
    
            data = {
                'newaptcount': newaptcount,
                'allaptcount': allaptcount,
                'appaptcount': appaptcount,
                'canaptcount': canaptcount,
                'comaptcount': comaptcount
            }
            return JsonResponse(data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    return JsonResponse(data)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def View_Appointment(request):
    if request.method == 'GET':
        try:
            # Get the token from the request headers
            token = request.headers.get('Authorization').split(' ')[1]
            # Extract user ID from the token
            user_id = extract_user_id_from_token(token)
            if user_id is not None:
                # Token is valid, continue with your logic here
                doctor_reg = DoctorReg.objects.get(admin=user_id)
                view_appointment = Appointment.objects.filter(doctor_id=doctor_reg)
                
                # Prepare data to return
                appointment_data = [{'id': appointment.id, 'name':appointment.fullname,'date': appointment.date_of_appointment,'time':appointment.time_of_appointment,'status':appointment.status} for appointment in view_appointment]
                return Response({'appointments': appointment_data}, status=200)
            else:
                # Token is invalid or missing
                return Response({'error': 'Invalid or missing token'}, status=401)
        except DoctorReg.DoesNotExist:
            return Response({'error': 'Doctor registration not found'}, status=404)
        except Exception as e:
            # Handle other exceptions gracefully
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'error': 'Invalid request method'}, status=405)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def patient_appointment_Details(request, id):
    if request.method == 'GET':
        # Retrieve appointment associated with the given ID
        appointment = Appointment.objects.filter(id=id).first()

        if appointment:
            serialized_data = {
                'id': appointment.id,
                'appointmentnumber': appointment.appointmentnumber,
                'fullname': appointment.fullname,
                'mobilenumber': appointment.mobilenumber,
                'email': appointment.email,
                'date_of_appointment': appointment.date_of_appointment,
                'time_of_appointment': appointment.time_of_appointment,
                'doctor_id': appointment.doctor_id_id,  # Extracting the ID of the doctor
                'additional_msg': appointment.additional_msg,
                'remark': appointment.remark,
                'status': appointment.status,
                'prescription': appointment.prescription,
                'recommendedtest': appointment.recommendedtest,
                'created_at': appointment.created_at,
                'updated_at': appointment.updated_at
            }
            return JsonResponse({'patientdetails': serialized_data})
        else:
            return JsonResponse({'error': 'Appointment not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])  # Consider adding appropriate permissions
def update_appointment_details(request):
    if request.method == 'POST':
        # Extract data from the request
        appointment_id = request.data.get('appointment_id')
        remark = request.data.get('remark')
        status = request.data.get('status')

        # Retrieve the appointment instance
        appointment = get_object_or_404(Appointment, id=appointment_id)

        # Update appointment details
        appointment.remark = remark
        appointment.status = status
        appointment.save()

        # Send email notification to the patient
        patient_email = appointment.email
        subject = 'Appointment Status Update'
        message = f'Your appointment status has been updated.\n\nStatus: {status}\nRemark: {remark}'
        from_email = EMAIL_HOST_USER
        recipient_list = [patient_email]

        try:
            send_mail(subject, message, from_email, recipient_list)
            return JsonResponse({'message': 'Appointment details updated successfully and email sent'})
        except Exception as e:
            return JsonResponse({'error': f'Failed to send email: {e}'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)   
    
    

@api_view(['GET'])
@permission_classes([AllowAny])
def Patient_approved_appointment(request):
    if request.method == 'GET':
        doctor_admin = request.user
        doctor_reg = DoctorReg.objects.get(admin=doctor_admin)
        patient_details = Appointment.objects.filter(status='Approved', doctor_id=doctor_reg)

        # Serialize the data
        serialized_data = []
        for appointment in patient_details:
            serialized_data.append({
                'id': appointment.id,
                'appointment_number': appointment.appointmentnumber,
                'fullname': appointment.fullname,
                'mobilenumber': appointment.mobilenumber,
                'email': appointment.email,
                'date_of_appointment': appointment.date_of_appointment,
                'time_of_appointment': appointment.time_of_appointment,
                'additional_msg': appointment.additional_msg,
                'remark': appointment.remark,
                'status': appointment.status,
                'prescription': appointment.prescription,
                'recommendedtest': appointment.recommendedtest,
                'created_at': appointment.created_at,
                'updated_at': appointment.updated_at
            })

        return JsonResponse({'appointments': serialized_data})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def Patient_Cancelled_Appointment(request):
    if request.method == 'GET':
        try:
            token = request.headers.get('Authorization').split(' ')[1]
            user_id = extract_user_id_from_token(token)
            doctor_reg = DoctorReg.objects.get(admin=user_id)
            patientdetails = Appointment.objects.filter(status='Cancelled', doctor_id=doctor_reg)
            
            # Check if there are any cancelled appointments
            serialized_data = []
            for appointment in patientdetails:
             serialized_data.append({
                'id': appointment.id,
                'appointment_number': appointment.appointmentnumber,
                'fullname': appointment.fullname,
                'mobilenumber': appointment.mobilenumber,
                'email': appointment.email,
                'date_of_appointment': appointment.date_of_appointment,
                'time_of_appointment': appointment.time_of_appointment,
                'additional_msg': appointment.additional_msg,
                'remark': appointment.remark,
                'status': appointment.status,
                'prescription': appointment.prescription,
                'recommendedtest': appointment.recommendedtest,
                'created_at': appointment.created_at,
                'updated_at': appointment.updated_at
            })
            
            return JsonResponse({'patientdetails': serialized_data})
        except DoctorReg.DoesNotExist:
            return JsonResponse({'error': 'Doctor registration not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
 
@api_view(['GET'])
@authentication_classes([JWTAuthentication])   
def Patient_New_Appointment(request):
    if request.method == 'GET':
        try:
            token = request.headers.get('Authorization').split(' ')[1]
            user_id = extract_user_id_from_token(token)
            doctor_reg = DoctorReg.objects.get(admin=user_id)
            patientdetails = Appointment.objects.filter(status='0', doctor_id=doctor_reg)
            
            # Manually serialize the data
            serialized_data = [{
                'id': appointment.id,
                'appointmentnumber': appointment.appointmentnumber,
                'fullname': appointment.fullname,
                'mobilenumber': appointment.mobilenumber,
                'email': appointment.email,
                'date_of_appointment': appointment.date_of_appointment,
                'time_of_appointment': appointment.time_of_appointment,
                'doctor_id': appointment.doctor_id_id,  # Extracting the ID of the doctor
                'additional_msg': appointment.additional_msg,
                'remark': appointment.remark,
                'status': appointment.status,
                'prescription': appointment.prescription,
                'recommendedtest': appointment.recommendedtest,
                'created_at': appointment.created_at,
                'updated_at': appointment.updated_at
            } for appointment in patientdetails]
            
            return JsonResponse({'patientdetails': serialized_data})
        
        except DoctorReg.DoesNotExist:
            return JsonResponse({'error': 'Doctor registration not found'}, status=404)
        except Appointment.DoesNotExist:
            return JsonResponse({'error': 'No status appointments found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def Patient_Appointment_Prescription(request):
    if request.method == 'POST':
        try:
            token = request.headers.get('Authorization').split(' ')[1]
            user_id = extract_user_id_from_token(token)  
            doctor_reg = DoctorReg.objects.get(admin=user_id)
            
            # Filter appointments for the doctor with status '0' (or any other desired status)
            appointments = Appointment.objects.filter(status='Approved', doctor_id=doctor_reg)

            for appointment in appointments:
                prescription = request.data.get('prescription')
                recommendedtest = request.data.get('recommendedtest')
                status = request.data.get('status')

                # Update appointment details
                appointment.prescription = prescription
                appointment.recommendedtest = recommendedtest
                appointment.status = status
                appointment.save()

            return JsonResponse({'message': 'Appointments details updated successfully'})
        
        except DoctorReg.DoesNotExist:
            return JsonResponse({'error': 'Doctor registration not found'}, status=404)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])  
def Patient_Appointment_Completed(request):
    if request.method == 'GET':
        # Assuming JWT authentication is already applied
        token = request.headers.get('Authorization').split(' ')[1]
        user_id = extract_user_id_from_token(token)
        doctor_reg = DoctorReg.objects.get(admin=user_id)
        patientdetails = Appointment.objects.filter(status='Completed', doctor_id=doctor_reg)

        # Manually serialize the data
        serialized_data = [{
            'id': appointment.id,
            'appointmentnumber': appointment.appointmentnumber,
            'fullname': appointment.fullname,
            'mobilenumber': appointment.mobilenumber,
            'email': appointment.email,
            'date_of_appointment': appointment.date_of_appointment,
            'time_of_appointment': appointment.time_of_appointment,
            'doctor_id': appointment.doctor_id_id,
            'additional_msg': appointment.additional_msg,
            'remark': appointment.remark,
            'status': appointment.status,
            'prescription': appointment.prescription,
            'recommendedtest': appointment.recommendedtest,
            'created_at': appointment.created_at,
            'updated_at': appointment.updated_at
        } for appointment in patientdetails]

        return JsonResponse({'patientdetails': serialized_data})

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    

@api_view(['GET'])
@authentication_classes([JWTAuthentication])   
def Search_Appointments(request):
    if request.method == "GET":
        try:
            token = request.headers.get('Authorization').split(' ')[1]
            user_id = extract_user_id_from_token(token)
            doctor_reg = DoctorReg.objects.get(admin=user_id)

            query = request.GET.get('query', '')
            if query:
                # Filter records where fullname or Appointment Number contains the query
                appointments =  Appointment.objects.filter(fullname__icontains=query) | Appointment.objects.filter(appointmentnumber__icontains=query) & Appointment.objects.filter(doctor_id=doctor_reg)

                messages.success(request, "Search against " + query)
                # Serialize appointments data if needed
                serialized_appointments = [{
                    'appointmentnumber': appointment.appointmentnumber,
                    'fullname': appointment.fullname,
                    # Include other fields as needed
                } for appointment in appointments]
                return JsonResponse({'appointments': serialized_appointments, 'query': query})
            else:
                print("No Record Found")
                return JsonResponse({'error': 'No records found for the provided query'}, status=404)
        except DoctorReg.DoesNotExist:
            return JsonResponse({'error': 'Doctor registration not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)