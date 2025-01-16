from django.http import JsonResponse
import json
from ReStart.db_config import Session
from user.models import User
from reports.models import Organization, Sports, Event, convert_to_dict
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import base64
from user.utils import is_logged_in


@csrf_exempt
def create_report(request):
    try:
        json_data = json.loads(request.body.decode())
        session = Session()
        if not is_logged_in(request):
            return JsonResponse({
                'message': 'Доступ запрещен'
            }, status=403)
       
        user = session.query(User).filter_by(id=request.session['user_id']).first()
        if user.is_banned:
            return JsonResponse({
                'message': 'Доступ запрещен'
            }, status=403)

        organization = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                  .order_by(Organization.creation_time.desc()).first()
        
        organization.modify_from_dict(json_data['organization'])
        sports_list = []
        for sports in json_data['sports']:
            sports_list.append(Sports(**sports, organization_id=organization.id))
        
        event_list = []
        for event in json_data['events']:
            event_without_document = {k: event[k] for k in event if k not in ('document', 'official_regulations', 'date')}
            event_list.append(Event(**event_without_document, 
                                    date=datetime.strptime(event['date'], '%d.%m.%Y'),
                                    official_regulations=base64.b64decode(event['official_regulations']) if event['is_official'] else None,
                                    #document=base64.b64decode(event['document']),
                                    organization_id=organization.id))

        session.add_all([*sports_list, *event_list])
        session.commit()        
        return JsonResponse({
            'message': 'Информация отправлена'
        }, status=200)
    except:
        return JsonResponse({
            'message': 'Вы должны отправить JSON с объектом "organization", массив "sports" и массив "events"'
        }, status=422)

@csrf_exempt
def get_report(request):
    try:
        session = Session()
        if not is_logged_in(request):
            return JsonResponse({
                'message': 'Доступ запрещен'
            }, status=403)
        
        user = session.query(User).filter_by(id=request.session['user_id']).first()
        if user.is_banned:
            return JsonResponse({
                'message': 'Доступ запрещен'
            }, status=403)
        organization = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                  .order_by(Organization.creation_time.desc()).first()
        
        sports = session.query(Sports).filter(Sports.organization_id==organization.id).all()
        events = session.query(Event).filter(Event.organization_id==organization.id).all()
        
        return JsonResponse({
            'organization': convert_to_dict(organization),
            'sports': [convert_to_dict(el) for el in sports],
            'events': [convert_to_dict(el) for el in events],
        }, status=200)
    except:
        return JsonResponse({
            'message': 'Ошибка сервера'
        }, status=503)

@csrf_exempt
def edit_report(request):
    try:
        json_data = json.loads(request.body.decode())
        session = Session()
        if not is_logged_in(request):
            return JsonResponse({
                'message': 'Доступ запрещен'
            }, status=403)
        
        user = session.query(User).filter_by(id=request.session['user_id']).first()
        if user.is_banned:
            return JsonResponse({
                'message': 'Доступ запрещен'
            }, status=403)
        organization = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                  .order_by(Organization.creation_time.desc()).first()
        
        organization_dict = convert_to_dict(organization)
        organization_dict = { k: v for k, v in organization_dict.items() if k not in ['id', 'creation_time'] }
        modified_organization = Organization(**organization_dict, creation_time=datetime.now())
        json_data['organization'] = { k: v for k, v in json_data['organization'].items() if k not in ['id', 'creation_time'] }
        modified_organization.modify_from_dict(json_data['organization'])
        sports_list = []
        for sports in json_data['sports']:
            sports_list.append(Sports(**sports, organization_id=modified_organization.id))
        
        event_list = []
        for event in json_data['events']:
            event_without_document = {k: event[k] for k in event if k not in ('document', 'official_regulations', 'date')}
            event_list.append(Event(**event_without_document, 
                                    date=datetime.strptime(event['date'], '%d.%m.%Y'),
                                    official_regulations=base64.b64decode(event['official_regulations']) if event['is_official'] else None,
                                    #document=base64.b64decode(event['document']),
                                    organization_id=modified_organization.id))

        session.add_all([modified_organization, *sports_list, *event_list])
        session.commit()        
        return JsonResponse({
            'message': 'Информация отправлена'
        }, status=200)
    except:
        return JsonResponse({
            'message': 'Вы должны отправить JSON с объектом "organization", массив "sports" и массив "events"'
        }, status=422)