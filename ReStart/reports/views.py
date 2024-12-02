from django.http import JsonResponse
import json
from ReStart.db_config import Session
from user.models import User
from reports.models import Organization, Sports, Event
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
        organization = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                  .order_by(Organization.creation_time.desc()).first()
        
        organization.modify_from_dict(json_data['organization'])
        sports_list = []
        for sports in json_data['sports']:
            sports_list.append(Sports(**sports, organization_id=organization.organization_id))
        
        event_list = []
        for event in json_data['events']:
            event_without_document = {k: event[k] for k in event if k not in ('document', 'date')}
            event_list.append(Event(**event_without_document, 
                                    date=datetime.strptime(event['date'], '%d.%m.%Y'),
                                    document=base64.b64decode(event['document']),
                                    organization_id=organization.organization_id))

        session.add_all([*sports_list, *event_list])
        session.commit()        
        return JsonResponse({
            'message': 'Информация отправлена'
        }, status=200)
    except:
        return JsonResponse({
            'message': 'Вы должны отправить JSON с объектом "organization", массив "sports" и массив "events"'
        }, status=422)