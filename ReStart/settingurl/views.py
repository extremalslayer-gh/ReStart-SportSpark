from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

def authorization(request):
    return render(request, 'settingurl/authorization.html')


def password(request):
    return render(request, 'settingurl/password.html')


def email(request):
    return render(request, 'settingurl/email.html')


def renamepass(request):
    return render(request, 'settingurl/renamepass.html')


def success(request):
    return render(request, 'settingurl/success.html')


def personal(request):
    return render(request, 'settingurl/personal.html')


def reports(request):
    return render(request, 'settingurl/reports.html')


def tables(request):
    return render(request, 'settingurl/tables.html')


def managers(request):
    return render(request, 'settingurl/managers.html')


def personalmanage(request):
    return render(request, 'settingurl/personalmanage.html')


def recentrep(request):
    return render(request, 'settingurl/recentrep.html')


def block1general(request):
    return render(request, 'settingurl/block1general.html')


def block1_2(request):
    return render(request, 'settingurl/block1_2.html')


def block1_3(request):
    return render(request, 'settingurl/block1_3.html')


def block_student(request):
    return render(request, 'settingurl/block_student.html')


def block_russian(request):
    return render(request, 'settingurl/block_russian.html')


def block_35(request):
    return render(request, 'settingurl/block_35.html')


def block_russian2(request):
    return render(request, 'settingurl/block_russian2.html')


def registration(request):
    return render(request, 'settingurl/registration.html')


def achievements(request):
    return render(request, 'settingurl/achievements.html')


def treasonreport(request):
    return render(request, 'settingurl/treasonreport.html')


def sentreport(request):
    return render(request, 'settingurl/sentreport.html')


def block1general_edit(request):
    return render(request, 'settingurl/block1general_edit.html')


def block1_2_edit(request):
    return render(request, 'settingurl/block1_2_edit.html')


def block_student_edit(request):
    return render(request, 'settingurl/block_student_edit.html')


def block_russian_edit(request):
    return render(request, 'settingurl/block_russian_edit.html')


def block_35_edit(request):
    return render(request, 'settingurl/block_35_edit.html')


def block_russian2_edit(request):
    return render(request, 'settingurl/block_russian2_edit.html')