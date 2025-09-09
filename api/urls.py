from . import views
from django.urls import path

urlpatterns = [
    path('areas/', views.area_list_api),
    path('areas/<int:area_id>/modules/', views.module_list_api),
    path('modules/<int:module_id>/lessons/', views.lesson_list_api),
]