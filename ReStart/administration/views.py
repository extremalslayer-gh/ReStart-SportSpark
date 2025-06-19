from django.http import JsonResponse, HttpResponse
import json
from sqlalchemy.event.base import Events
from ReStart.db_config import Session
from ReStart.settings import PAGE_ENTRY_COUNT, TEMP_FOLDER
from user.models import User
from reports.models import Organization, convert_to_dict, CustomSports, CustomEvent
from django.views.decorators.csrf import csrf_exempt
from user.utils import is_logged_in
from sqlalchemy import func
import pandas as pd
import pandas.io.formats.excel
import uuid
import os
from administration.utils import *
import datetime


@csrf_exempt
def get_reports(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)
    
    session = Session()
    json_data = json.loads(request.body.decode())
    
    caller_user = session.query(User).filter(User.id==request.session['user_id']).first()
    if not caller_user.is_admin:
        return JsonResponse({
            'message': 'Неавторизованный доступ'
        }, status=403)

    #subquery = (
    #    session.query(
    #        Organization.organization_id,
    #        func.max(Organization.creation_time).label('max_creation_time')
    #    )
    #    .group_by(Organization.organization_id)
    #    .subquery()
    #)

    #organizations = (
    #    session.query(Organization)
    #    .join(subquery, (Organization.organization_id == subquery.c.organization_id) & (Organization.creation_time == subquery.c.max_creation_time))
    #    .limit(PAGE_ENTRY_COUNT)
    #    .offset(json_data['page'] * PAGE_ENTRY_COUNT)
    #    .all()
    #)

    organizations = session.query(Organization)
    
    if 'filters' in json_data:
        filter_params_simple = ['students_total', 'students_organization', 'name']
        for i in range(1, 12):
            filter_params_simple.append(f'students_grade_{i}')

        for param in filter_params_simple:
            if param in json_data['filters']:
                organizations = organizations.filter(Organization.__table__.c[param].in_(json_data['filters'][param]))
        
        if 'creation_time' in json_data['filters']:
            creation_time_allowed = list(map(lambda x: datetime.datetime.strptime(x, '%d.%m.%Y'), json_data['filters']['creation_time']))
            organizations = organizations.filter(Organization.__table__.c['creation_time'].in_(creation_time_allowed))

    organizations = (organizations.limit(PAGE_ENTRY_COUNT)
                                .offset(json_data['page'] * PAGE_ENTRY_COUNT)
                                .all())

    result = {
        'reports': []
    }
    for organization in organizations:
        organization_dict = convert_to_dict(organization)
        user = session.query(User).filter(User.organization_id==organization.organization_id).first()
        user_name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'

        postfilter_passed = True

        if 'filters' in json_data:
            if 'municipality_name' in json_data['filters']:
                if user.municipality_name not in json_data['filters']['municipality_name']:
                    postfilter_passed = False
            if 'user_name' in json_data['filters']:
                if user_name not in json_data['filters']['user_name']:
                    postfilter_passed = False

        if postfilter_passed:
            result['reports'].append({
                'user_name': user_name,
                'municipality_name': user.municipality_name,
                'organization': { k: v for k, v in organization_dict.items() if k != 'achievements' }
            })

    return JsonResponse(result, status=200)

@csrf_exempt
def export_reports(request):
    if not is_logged_in(request):
        return HttpResponse(status=403)

    session = Session()
    #json_data = json.loads(request.body.decode())
    json_data = json.loads(request.GET.get('filters', '{}'))
    json_data = {'filters': json_data}
    caller_user = session.query(User).filter(User.id==request.session['user_id']).first()
    if not caller_user.is_admin:
        return HttpResponse(status=403)

    now = datetime.datetime.now()
    formatted_date = now.strftime('%d.%m.%Y')
    filename = f'Report_{formatted_date}.xlsx'
    filepath = f'{TEMP_FOLDER}\\{filename}'
    writer = pd.ExcelWriter(filepath, engine='xlsxwriter')
    
    pandas.io.formats.excel.ExcelFormatter.header_style = None

    df_common = export_to_excel_common(session, writer, json_data)
    df_schedule = export_to_excel_schedule(session, writer, json_data)
    df_student_count = export_to_excel_student_count(session, writer, json_data)
    df_sports = export_to_excel_sports(session, writer, json_data)
    df_events_official = export_to_excel_events_official(session, writer, json_data)
    df_events = export_to_excel_events(session, writer, json_data)
    for sheet_name in writer.sheets.keys():
        writer.sheets[sheet_name].autofit()

    common_sheet = apply_basic_styles(writer, 'Общий', df_common)
    schedule_sheet = apply_basic_styles(writer, 'Расписание занятий', df_schedule)
    student_count_sheet = apply_basic_styles(writer, 'Численность обучающихся', df_student_count)
    sports_sheet = apply_basic_styles(writer, 'Виды спорта ШСК', df_sports)
    events_official_sheet = apply_basic_styles(writer, 'Соревнования', df_events_official)
    events_sheet = apply_basic_styles(writer, 'Мероприятия в рамках ШСК', df_events)

    apply_common_styles(df_common, common_sheet)
    apply_schedule_styles(df_schedule, schedule_sheet)
    apply_student_count_styles(df_student_count, student_count_sheet)
    apply_sports_styles(df_sports, sports_sheet)
    apply_events_official_styles(df_events_official, events_official_sheet)
    apply_events_styles(df_events, events_sheet)

    writer.close()

    with open(filepath, 'rb') as f:
        data = f.read()
    
    response = HttpResponse(data, content_type='application/vnd.ms-excel')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    os.remove(filepath)
    return response

@csrf_exempt
def get_users(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)

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
        organization = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                .order_by(Organization.creation_time.desc()).first()
        user_dict = user.convert_to_dict()
        user_dict['organization_name'] = organization.name
        result['users'].append(user_dict)

    return JsonResponse(result, status=200)

@csrf_exempt
def set_user_ban(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)

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

@csrf_exempt
def edit_user(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)

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

    if 'first_name' in json_data.keys():
        user.first_name = json_data['first_name']
    if 'second_name' in json_data.keys():
        user.second_name = json_data['second_name']
    if 'last_name' in json_data.keys():
        user.last_name = json_data['last_name']
    if 'occupation' in json_data.keys():
        user.occupation = json_data['occupation']
    if 'profile_image' in json_data.keys():
        user.profile_image = json_data['profile_image']
    if 'municipality_name' in json_data.keys():
        user.municipality_name = json_data['municipality_name']
    if 'organization_name' in json_data.keys():
        user_reports = session.query(Organization).filter(Organization.organization_id==user.organization_id).all()
        for report in user_reports:
            report.name = json_data['organization_name']


    session.commit()

    return JsonResponse({
        'message': 'Профиль обновлен'
    }, status=200)

@csrf_exempt
def verify_password(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)

    
    session = Session()
    json_data = json.loads(request.body.decode())
    
    caller_user = session.query(User).filter(User.id==request.session['user_id']).first()
    if not caller_user.is_admin:
        return JsonResponse({
            'message': 'Неавторизованный доступ'
        }, status=403)

    if not caller_user.verify_password(json_data['password']):
        return JsonResponse({
            'message': 'Неверный пароль'
        }, status=403)

    return JsonResponse({
        'message': 'Доступ разрешен'
    }, status=200)

@csrf_exempt
def download_official_regulations(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)
    
    session = Session()
    event_id = request.GET.get('id', None)
    
    if event_id is None:
        return JsonResponse({
            'message': 'Неверный параметр "id"'
        }, status=200)
    
    event_id = int(event_id)
    event = session.query(Event).filter(Event.id==event_id).first()

    if event is None:
        return JsonResponse({
            'message': 'Неверный параметр "id"'
        }, status=200)

    return HttpResponse(event.official_regulations, content_type='application/msword')

@csrf_exempt
def download_achievements(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)
    
    session = Session()
    org_id = request.GET.get('id', None)
    if org_id is None:
        return JsonResponse({
            'message': 'Неверный параметр "id"'
        }, status=200)
    
    org_id = int(org_id)
    organization = session.query(Organization).filter(Organization.id==org_id).first()

    if organization is None:
        return JsonResponse({
            'message': 'Неверный параметр "id"'
        }, status=200)

    return HttpResponse(organization.achievements, content_type='application/x-zip-compressed')

@csrf_exempt
def add_custom_sports(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)
    
    session = Session()
    json_data = json.loads(request.body.decode())
    
    caller_user = session.query(User).filter(User.id==request.session['user_id']).first()
    if not caller_user.is_admin:
        return JsonResponse({
            'message': 'Неавторизованный доступ'
        }, status=403)
    
    sports = CustomSports(name=json_data['name'])
    session.add(sports)
    session.commit()

    return JsonResponse({
        'message': 'Вид спорта успешно добавлен'
    }, status=200)

@csrf_exempt
def delete_custom_sports(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)
    
    session = Session()
    json_data = json.loads(request.body.decode())
    
    caller_user = session.query(User).filter(User.id==request.session['user_id']).first()
    if not caller_user.is_admin:
        return JsonResponse({
            'message': 'Неавторизованный доступ'
        }, status=403)
    
    sports = session.query(CustomSports).filter(CustomSports.id==json_data['id']).first()
    if sports is None:
        return JsonResponse({
            'message': 'Объект не найден'
        }, status=404)
    session.delete(sports)
    session.commit()

    return JsonResponse({
        'message': 'Данные отправлены'
    }, status=200)

@csrf_exempt
def get_custom_sports(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)
    
    session = Session()
    
    sports = session.query(CustomSports).all()

    result = {'sports': []}
    for el in sports:
        result['sports'].append({
            'id': el.id,
            'name': el.name
        })

    return JsonResponse(result, status=200)

@csrf_exempt
def add_custom_event(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)
    
    session = Session()
    json_data = json.loads(request.body.decode())
    
    caller_user = session.query(User).filter(User.id==request.session['user_id']).first()
    if not caller_user.is_admin:
        return JsonResponse({
            'message': 'Неавторизованный доступ'
        }, status=403)
    
    event = CustomEvent(name=json_data['name'], event_type=json_data['event_type'])
    session.add(event)
    session.commit()

    return JsonResponse({
        'message': 'Мероприятие успешно добавлено'
    }, status=200)

@csrf_exempt
def delete_custom_event(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)
    
    session = Session()
    json_data = json.loads(request.body.decode())
    
    caller_user = session.query(User).filter(User.id==request.session['user_id']).first()
    if not caller_user.is_admin:
        return JsonResponse({
            'message': 'Неавторизованный доступ'
        }, status=403)
    
    event = session.query(CustomEvent).filter(CustomEvent.id==json_data['id']).first()
    if event is None:
        return JsonResponse({
            'message': 'Объект не найден'
        }, status=404)
    session.delete(event)
    session.commit()

    return JsonResponse({
        'message': 'Данные отправлены'
    }, status=200)

@csrf_exempt
def get_custom_events(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)
    
    session = Session()
    
    events = session.query(CustomEvent).all()

    result = {'events': []}
    for el in events:
        result['events'].append({
            'id': el.id,
            'name': el.name,
            'event_type': el.event_type
        })

    return JsonResponse(result, status=200)