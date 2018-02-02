from django.shortcuts import render

from .models import Profile
# Create your views here.

def index(request):
    supported_profiles = Profile.objects.filter(supported=True)
    servicing_number = supported_profiles.count()
    context = {
        'servicing_number': servicing_number,
        'supported_profiles': supported_profiles,

    }
    return render(request, 'pc_profile/index.html', context)

def map_view(request):
    supported_profiles = Profile.objects.filter(supported=True)
    context = {
        'supported_profiles': supported_profiles,
    }
    return render(request, 'pc_profile/map.html', context)

def detail_view(request):
    return render(request, 'pc_profile/detail.html')
