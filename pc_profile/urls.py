from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import url
from . import views


app_name='pc_profile'
urlpatterns = [
  path('', views.index, name='main_page'),
  path('map/', views.map_view, name="map_page"),
  # path('detail/', views.detail_view, name="detail_page"),
  path('detail/<int:id>', views.single_detail_view, name="single_detail_view"),
]
