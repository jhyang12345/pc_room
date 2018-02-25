from django.contrib import admin

from .models import Profile, ProfileImageGuide, Report, ProfileImage
# Register your models here.
admin.site.register(Profile)
admin.site.register(ProfileImageGuide)
admin.site.register(Report)
admin.site.register(ProfileImage)
