from django.urls import path
from . import views

urlpatterns = [
    path('create_report/', views.create_report),
    path('get_report/', views.get_report),
    path('edit_report/', views.edit_report),
]
