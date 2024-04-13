from django.contrib import admin
from .models import CustomUser, Specialization, DoctorReg, Appointment, Users

# Register your models here.
class UserModel(admin.ModelAdmin):
    list_display = ['username', 'email', 'user_type']

admin.site.register(CustomUser, UserModel)
admin.site.register(Specialization)
admin.site.register(DoctorReg)
admin.site.register(Appointment)
admin.site.register(Users)
