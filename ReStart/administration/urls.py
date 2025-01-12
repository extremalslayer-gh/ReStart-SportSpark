from django.urls import path
from . import views

urlpatterns = [
    path('get_reports/', views.get_reports),
    path('export_reports/', views.export_reports),
    path('get_users/', views.get_users),
    path('set_user_ban/', views.set_user_ban),
    path('verify_password/', views.verify_password),
]