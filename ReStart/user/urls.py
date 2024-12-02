from django.urls import path
from . import views
from ReStart.db_config import Session, PASSWORD
from user.models import User

urlpatterns = [
    path('change_password/', views.change_password),
]