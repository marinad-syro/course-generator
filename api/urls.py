from . import views
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('areas/', views.area_list_api),
    path('areas/<int:area_id>/modules/', views.module_list_api),
    path('modules/<int:module_id>/lessons/', views.lesson_list_api),
    path('lessons/<int:lesson_id>/', views.lesson_detail_api),
    path("generate-pathway/", views.generate_pathway, name="generate_pathway"),
    path("generate-lesson-content/<int:lesson_id>/", views.generate_lesson_content, name="generate_lesson_content"),
]

urlpatterns = format_suffix_patterns(urlpatterns)