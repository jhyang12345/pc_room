from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from pc_profile.models import Profile
import os, time, datetime
from pc_room.util import make_filename
from picture_reader.first_time_generator import generate_first_time
from picture_reader.read_profiles import read_data
from picture_reader.CafeProfile import CafeProfile

# Profile attributes
# profile_name
# password
# added_date
# supported
# grid_shape
# grid_data

# Create your views here.
def simple_upload(request):
    print(request)
    if request.method == 'POST' and request.FILES['snapshot']:
        print(request.FILES)
        image = request.FILES['snapshot']

        profile = handle_request(request)

        passkey = profile.password

        image_name, image_type = os.path.splitext(image.name)
        print(image_name, image_type)
        now = datetime.datetime.now()
        if(profile):
            # create profile if it doesn't exist
            if(read_data(pc_name=profile.profile_name)):
                c = CafeProfile(name=profile.profile_name, id=profile.id)
                c.save_profile()

            file_path = os.path.join("media", passkey, "raw_images")
            root_path = os.path.join("media", passkey)
            fs = FileSystemStorage(location=file_path)
            image_name = make_filename(now) + image_type
            filename = fs.save(image_name, image)
            uploaded_file_url = fs.url(filename)
            generate_first_time(os.path.join(file_path, image_name), profile.profile_name, root_path=root_path)
            print(os.path.join(file_path, image_name))
            return render(request, 'image_upload/simple_upload.html', {
                'uploaded_file_url': uploaded_file_url
            })
        else:
            return "Failed"

    elif request.method == 'GET':
        print("Getting")
        response = render(request, 'image_upload/simple_upload.html')
        response.set_cookie('cookie_value', "Approved")
        return response
    return render(request, 'image_upload/simple_upload.html')


def handle_request(request):
    print(request.COOKIES)
    passkey = request.COOKIES["passkey"]
    try:
        profile = Profile.objects.get(password=passkey)
        return profile
        print("Profile Found!")
    except Exception as e:
        print("Profile not found!")
        return False
