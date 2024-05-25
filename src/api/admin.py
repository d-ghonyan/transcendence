from django.contrib import admin
from models import  User
# Register your models here.
class ProfileAdmin:
    readonly_fields: ("id", )

admin.site.register(User, ProfileAdmin)
admin.site.register(User)