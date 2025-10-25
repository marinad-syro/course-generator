# main_project/main_project/urls.py

from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("lrn_org.urls")), 
    path("api/", include("api.urls")), 
    path('api/users/', include('users.urls')),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),   
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # This catch-all route is for React Router to handle frontend routing.
    re_path(r'^(?!api/|admin/).*$', TemplateView.as_view(template_name="index.html")),

    path("feedback/", include("feedback.urls")),
]
