from django.shortcuts import render

from .models import Profile
# Create your views here.

def index(request):
    return render(request, 'pc_profile/index.html')

def map_view(request):
    return render(request, 'pc_profile/map.html')
