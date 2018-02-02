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

def single_detail_view(request, id):
    profile = Profile.objects.get(id=id)
    context = {
        'pc_title': profile.pc_title.strip(),
        'pc_subtitle': profile.pc_subtitle.strip(),
        'address': profile.address.strip(),
        'phone_number': profile.phone_number.strip(),
        'phone_address': profile.phone_address.strip(),
        'pc_specs': profile.pc_specs.strip(),
        'owners_words': profile.owners_words.strip(),
        'total_seats': profile.total_seats.strip(),
    }
    return render(request, 'pc_profile/detail.html', context)
