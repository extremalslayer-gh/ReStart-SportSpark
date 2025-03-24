from django.urls import path
from . import views

urlpatterns = [
    path('change_password/', views.change_password),
    path('change_profile_image/', views.change_profile_image),
]