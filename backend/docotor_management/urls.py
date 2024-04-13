"""
URL configuration for docotor_management project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views, adminviews, docviews, userviews 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('Admin/AdminHome', adminviews.ADMINHOME, name='admin_home'),
    path('Admin/Specialization', adminviews.SPECIALIZATION, name='add_specializations'),
    path('Admin/DoctorList', adminviews.DoctorList, name='viewdoctorlist'),
    path('Admin/ManageSpecialization', adminviews.MANAGESPECIALIZATION, name='manage_specilizations'),
    path('Admin/DeleteSpecialization/<str:id>', adminviews.DELETE_SPECIALIZATION, name='delete_specilizations'),
    path('UpdateSpecialization/<str:id>', adminviews.UPDATE_SPECIALIZATION, name='update_specilizations'),
    path('UPDATE_Specialization_DETAILS', adminviews.UPDATE_SPECIALIZATION_DETAILS, name='update_specilizations_details'),


    path('docsignup/', docviews.DOCSIGNUP, name='docsignup'),
    path('Doctor/DocHome', docviews.DOCTORHOME, name='doctor_home'),
    path('Doctor/ViewAppointment', docviews.View_Appointment, name='view_appointment'),
    path('DoctorPatientAppointmentDetails/<id>', docviews.patient_appointment_Details, name='patientappointmentdetails'),
    path('AppointmentDetailsRemark/Update', docviews.update_appointment_details, name='patient_appointment_details_remark'),
    path('DoctorPatientApprovedAppointment/', docviews.Patient_approved_appointment, name='patientapprovedappointment'),
    path('DoctorPatientCancelledAppointment', docviews.Patient_Cancelled_Appointment, name='patientcancelledappointment'),
    path('DoctorPatientNewAppointment', docviews.Patient_New_Appointment, name='patientnewappointment'),
    path('PatientAppointmentPrescription', docviews.Patient_Appointment_Prescription, name='patientappointmentprescription'),
    path('PatientAppointmentCompleted', docviews.Patient_Appointment_Completed, name='patientappointmentcompleted'),
    path('SearchAppointment', docviews.Search_Appointments, name='search_appointment'),

    path('doLogin/', views.doLogin, name='doLogin'),
    path('usersignup/',userviews.user_registration, name='usersignup'),
    path('userlogin/', userviews.user_login, name='userlogin'), 

    path('userappointment/',userviews.create_appointment, name='appointment'),
    path('User_SearchAppointment', userviews.User_Search_Appointments, name='user_search_appointment'),
    path('ViewAppointmentDetails/<str:id>/', userviews.View_Appointment_Details, name='viewappointmentdetails'),

    # reset_password
    path('password_reset/',auth_views.PasswordResetView.as_view(),name='password_reset'),
    path('password_reset/done/',auth_views.PasswordResetDoneView.as_view(),name='password_reset_done'),
    path('reset/<uidb64>/<token>/',auth_views.PasswordResetConfirmView.as_view(),name='password_reset_confirm'),
    path('reset/done/',auth_views.PasswordResetCompleteView.as_view(),name='password_reset_complete'),
]