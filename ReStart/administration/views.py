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
            .all()
        )

        result = []
        for organization in organizations:
            organization_dict = convert_to_dict(organization)
            user = session.query(User).filter(User.organization_id==organization.organization_id).first()
            name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'

            result.append([name] + list(organization_dict.values()))

        df = pd.DataFrame(result, columns=[
            'ФИО', 'Системный идентификатор', 
            'Идентификатор организции', 'Назание организации', 
            '1 класс', '2 класс', '3 класс', 
            '4 класс', '5 класс', '6 класс', 
            '7 класс', '8 класс', '9 класс', 
            '19 класс', '11 класс', 'Всего обучающихся',
            'Время создания', 'Часов в пн', 'Часов в вт', 
            'Часов в ср', 'Часов в чт', 'Часов в пт', 
            'Часов в сб', 'Часов в вс', 'Место проведения занятий',
            'Весь инвентарь', 'Используемый инвентарь', 'Достижения'
        ])

        filename = f'report_{uuid.uuid4()}.xlsx'
        filepath = f'{TEMP_FOLDER}\\{filename}'
        writer = pd.ExcelWriter(filepath)
        df.to_excel(writer)
        writer.close()

        with open(filepath, 'rb') as f:
            data = f.read()
        
        response = HttpResponse(data, content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        os.remove(filepath)
        return response
    except:
        return HttpResponse(status=503)