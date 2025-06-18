from django.urls import path
from . import views

urlpatterns = [
    path('get_reports/', views.get_reports),
    path('export_reports/', views.export_reports),
    path('get_users/', views.get_users),
    path('set_user_ban/', views.set_user_ban),
    path('edit_user/', views.edit_user),
    path('verify_password/', views.verify_password),
    path('download_official_regulations/', views.download_official_regulations),
    path('download_achievements/', views.download_achievements),
    path('add_custom_sports/', views.add_custom_sports),
    path('delete_custom_sports/', views.delete_custom_sports),
    path('get_custom_sports/', views.get_custom_sports),
    path('add_custom_event/', views.add_custom_event),
    path('delete_custom_event/', views.delete_custom_event),
    path('get_custom_events/', views.get_custom_events),
]