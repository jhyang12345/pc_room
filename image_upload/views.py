from django.shortcuts import render
from django.core.files.storage import FileSystemStorage

# Create your views here.
def simple_upload(request):
    print(request)
    if request.method == 'POST' and request.FILES['snapshot']:
        print(request.FILES)
        image = request.FILES['snapshot']
        fs = FileSystemStorage()
        filename = fs.save(image.name, image)
        uploaded_file_url = fs.url(filename)

        handle_request(request)

        return render(request, 'image_upload/simple_upload.html', {
            'uploaded_file_url': uploaded_file_url
        })
    elif request.method == 'GET':
        print("Getting")
        response = render(request, 'image_upload/simple_upload.html')
        response.set_cookie('cookie_value', "Approved")
        return response
    return render(request, 'image_upload/simple_upload.html')


def handle_request(request):
    print(request.COOKIES)
