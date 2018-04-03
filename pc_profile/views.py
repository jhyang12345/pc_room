from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.utils import timezone
import urllib
from PIL import Image
import json
import logging

from .models import Profile, ProfileImage
# Create your views here.

from .forms import ReportForm

logger = logging.getLogger(__name__)

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
    image_dict = {}
    for profile in supported_profiles:
        image_dict[profile.id] = []
        image_list = ProfileImage.objects.filter(profile=profile).order_by('index')
        if(image_list.count()):
            for image in image_list:
                image_dict[profile.id].append(image.image_thumbnail)

    context = {
        'supported_profiles': supported_profiles,
        'image_dict': image_dict,
    }
    return render(request, 'pc_profile/map.html', context)

def about_view(request):
    return render(request, 'pc_profile/about.html')

def report_view(request):
    if request.method == 'POST':
        form = ReportForm(request.POST)
        if form.is_valid():
            report = form.save(commit=False)
            report.report_date = timezone.now()

            if(report.report_title.strip() == ""):
                report.report_title = "제목 없음"

            report.save()
            print("Report successfully saved!")
            return report_success(request)
    else:
        form = ReportForm()

    return render(request, 'pc_profile/report.html', {'form': form})

def report_success(request):
    return render(request, 'pc_profile/report_success.html')

def single_detail_view(request, id):
    profile = Profile.objects.get(id=id)
    profile_image_list = ProfileImage.objects.filter(profile=profile).order_by('index')
    image_list = [x.image for x in profile_image_list]
    thumbnail_list = [x.image_thumbnail for x in profile_image_list]
    context = {
        'profile_id': profile.id,
        'pc_title': profile.pc_title.strip(),
        'pc_subtitle': profile.pc_subtitle.strip(),
        'address': profile.address.strip(),
        'phone_number': profile.phone_number.strip(),
        'phone_address': profile.phone_address.strip(),
        'pc_specs': profile.pc_specs.strip(),
        'owners_words': profile.owners_words.strip(),
        'total_seats': profile.total_seats.strip(),
        "empty_seats": profile.empty_seats,
        "two_empty_seats": profile.two_empty_seats,
        "largest_empty_seats": profile.largest_empty_seats,
        "image_list": image_list,
        "thumbnail_list": thumbnail_list,
    }
    logger.error("Detail view called: %d", id)
    print("Detail view called!")
    return render(request, 'pc_profile/detail.html', context)

def search_results_view(request):
    query_value = request.GET.get('q', '')

    # decode uri encoded query_value
    query_value = urllib.parse.unquote(query_value)

    return render(request, 'pc_profile/results.html')

def get_current_grid(request, id):
    try:
        profile = Profile.objects.get(id=id)
        data = {
            "grid": profile.grid_shape.strip(),
            "two_empty_seats": profile.two_empty_seats,
            "largest_empty_seats": profile.largest_empty_seats,
            "empty_seats": profile.empty_seats,
        }
        return JsonResponse(data)
    except Exception as e:
        print("Failed to handle AJAX Request", e)
        return JsonResponse({})

    return render(request, 'pc_profile/detail.html')
#
# def get_image(request, path):
#     print(path)
#     path = 'media/profile_images/' + path
#     return Image.open(path)
