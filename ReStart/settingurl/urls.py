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
    path('managers', views.managers, name='managers'),
    path('personalmanage', views.personalmanage, name='personalmanage'),
    path('recentrep', views.recentrep, name='recentrep'),
    path('block1general', views.block1general, name='block1general'),
    path('block1_2', views.block1_2, name='block1_2'),
    path('block1_3', views.block1_3, name='block1_3'),
    path('block_student', views.block_student, name='block_student'),
    path('block_russian', views.block_russian, name='block_russian'),
    path('block_35', views.block_35, name='block_35'),
    path('block_russian2', views.block_russian2, name='block_russian2'),
    path('registration', views.registration, name='registration'),
    path('achievements', views.achievements, name='achievements'),
    path('treasonreport', views.treasonreport, name='treasonreport'),
    path('sentreport', views.sentreport, name='sentreport'),
    path('block1general_edit', views.block1general_edit, name='block1general_edit'),
    path('block1_2_edit', views.block1_2_edit, name='block1_2_edit'),
    path('block_student_edit', views.block_student_edit, name='block_student_edit'),
    path('block_russian_edit', views.block_russian_edit, name='block_russian_edit'),
    path('block_35_edit', views.block_35_edit, name='block_35_edit'),
    path('block_russian2_edit', views.block_russian2_edit, name='block_russian2_edit')
]
