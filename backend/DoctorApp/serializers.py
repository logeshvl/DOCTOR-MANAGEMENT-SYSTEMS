from rest_framework import serializers
from DoctorApp.models import Specialization,DoctorReg,Appointment,CustomUser,Users
import random
from datetime import date
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from .models import CustomUser

# Define serializers for your models
class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = '__all__'

class DoctorRegSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorReg
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    date_of_appointment = serializers.DateField()  # Add this line to properly parse the date field

    class Meta:
        model = Appointment
        fields = '__all__'

    def create(self, validated_data):
        appointment_number = random.randint(100000000, 999999999)
        validated_data['appointmentnumber'] = appointment_number
        return Appointment.objects.create(**validated_data)
    
    def validate_date_of_appointment(self, value):
        if value <= date.today():
            raise serializers.ValidationError("Please select a date in the future for your appointment")
        return value


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['email', 'password', 'username']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        user = Users.objects.create(**validated_data)  # Use `create` method directly
        return user
 
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
