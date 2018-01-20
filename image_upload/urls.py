from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import url
from . import views


app_name='image_upload'
urlpatterns = [
  path('simple/', views.simple_upload, name='simple_upload'),
  url(r'^uploads/simple/$', views.simple_upload, name='simple_upload'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
