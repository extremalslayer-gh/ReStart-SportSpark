from django.urls import path
from . import views

urlpatterns = [
    path('', views.authorization, name='authorization'),
    path('password', views.password, name='password'),
    path('email', views.email, name='email'),
    path('renamepass', views.renamepass, name='renamepass'),
    path('success', views.success, name='success'),
    path('personal', views.personal, name='personal'),
    path('reports', views.reports, name='reports'),
    path('tables', views.tables, name='tables'),
    path('managers', views.managers, name='managers')
]
