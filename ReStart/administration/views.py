from django.http import JsonResponse, HttpResponse
import json
from ReStart.db_config import Session
from ReStart.settings import PAGE_ENTRY_COUNT, TEMP_FOLDER
from user.models import User
from reports.models import Organization, convert_to_dict
from django.views.decorators.csrf import csrf_exempt
from user.utils import is_logged_in
from sqlalchemy import func
import pandas as pd
import uuid
import os
from administration.utils import *


@csrf_exempt
def get_reports(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)

    try:
        session = Session()
        json_data = json.loads(request.body.decode())
        
        caller_user = session.query(User).filter(User.id==request.session['user_id']).first()
        if not caller_user.is_admin:
            return JsonResponse({
                'message': 'Неавторизованный доступ'
            }, status=403)

        subquery = (
            session.query(
                Organization.organization_id,
                func.max(Organization.creation_time).label('max_creation_time')
            )
            .group_by(Organization.organization_id)
            .subquery()
        )

        organizations = (
            session.query(Organization)
            .join(subquery, (Organization.organization_id == subquery.c.organization_id) & (Organization.creation_time == subquery.c.max_creation_time))
            .limit(PAGE_ENTRY_COUNT)
            .offset(json_data['page'] * PAGE_ENTRY_COUNT)
            .all()
        )

        result = {
            'reports': []
        }
        for organization in organizations:
            organization_dict = convert_to_dict(organization)
            user = session.query(User).filter(User.organization_id==organization.organization_id).first()
            name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'

            result['reports'].append({
                'user_name': name,
                'organization': organization_dict
            })

        return JsonResponse(result, status=200)
    except:
        return JsonResponse({
            'message': 'Вы должны отправить JSON со значением page(начиная с нуля)'
        }, status=422)

@csrf_exempt
def export_reports(request):
    if not is_logged_in(request):
        return HttpResponse(status=403)

    try:
        session = Session()
        
        caller_user = session.query(User).filter(User.id==request.session['user_id']).first()
        if not caller_user.is_admin:
            return HttpResponse(status=403)

        filename = f'report_{uuid.uuid4()}.xlsx'
        filepath = f'{TEMP_FOLDER}\\{filename}'
        writer = pd.ExcelWriter(filepath, engine='xlsxwriter')
        export_to_excel_common(session, writer)
        export_to_excel_schedule(session, writer)
        export_to_excel_student_count(session, writer)
        export_to_excel_sports(session, writer)
        export_to_excel_events_official(session, writer)
        export_to_excel_events(session, writer)
        for sheet_name in writer.sheets.keys():
            writer.sheets[sheet_name].autofit()
        writer.close()

        with open(filepath, 'rb') as f:
            data = f.read()
        
        response = HttpResponse(data, content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        os.remove(filepath)
        return response
    except:
        return HttpResponse(status=503)

@csrf_exempt
def get_users(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)

    try:
        session = Session()
        
        caller_user = session.query(User).filter(User.id==request.session['user_id']).first()
        if not caller_user.is_admin:
            return JsonResponse({
                'message': 'Неавторизованный доступ'
            }, status=403)

        result = {
            'users': []
        }

        users = session.query(User).filter(User.is_admin==False).all()
        for user in users:
            user_dict = user.convert_to_dict()
            result['users'].append(user_dict)

        return JsonResponse(result, status=200)
    except:
        return JsonResponse({
            'message': 'Ошибка'
        }, status=503)

@csrf_exempt
def set_user_ban(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)

    try:
        session = Session()
        json_data = json.loads(request.body.decode())
        
        caller_user = session.query(User).filter(User.id==request.session['user_id']).first()
        if not caller_user.is_admin:
            return JsonResponse({
                'message': 'Неавторизованный доступ'
            }, status=403)

        user = session.query(User).filter(User.id==json_data['id']).first()
        if user is None:
            return JsonResponse({
                'message': 'Пользователь не найден'
            }, status=404)

        user.is_banned = json_data['ban']
        session.commit()

        return JsonResponse({
            'message': 'Доступ обновлен'
        }, status=200)
    except:
        return JsonResponse({
            'message': 'Вы должны отправить JSON со значениями "id" и "ban"'
        }, status=422)