# main_project/main_project/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("lrn_org.urls")), 
    path("api/", include("api.urls")), 
    path('api/users/', include('users.urls')),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),   # login
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
