from django.shortcuts import render
from django.http import HttpResponse


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
