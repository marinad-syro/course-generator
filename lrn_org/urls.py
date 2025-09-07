

from django.urls import path, include
from . import views


urlpatterns = [
    path("", views.home_page, name="home"), 
    path("areas/", views.area_list, name="area_list"),
    path("areas/<int:area_id>/modules/", views.module_list, name="module_list"),
    path("modules/<int:module_id>/lessons/", views.lesson_list, name="lesson_list"),
    path("areas/add/", views.add_area, name="add_area"),
    path("modules/add/", views.add_module, name="add_module"),
    path("lessons/add/", views.add_lesson, name="add_lesson"),
    path("lessons/<int:lesson_id>/", views.see_lesson, name="see_lesson"),
]

