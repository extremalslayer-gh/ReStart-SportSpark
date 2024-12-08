from django.urls import path
from . import views

urlpatterns = [
    path('get_reports/', views.get_reports),
    path('export_reports/', views.export_reports)
]