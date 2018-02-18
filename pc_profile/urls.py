from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import url
from . import views


app_name='pc_profile'
urlpatterns = [
  path('', views.index, name='main_page'),
  path('map/', views.map_view, name="map_page"),
  path('about/', views.about_view, name="about_page"),
  path('report/', views.report_view, name="report_page"),
  # detail page only exists with id
  path('detail/<int:id>', views.single_detail_view, name="single_detail_view"),
  # AJAX function
  path('current-grid/<int:id>', views.get_current_grid, name="get_current_grid"),
]
