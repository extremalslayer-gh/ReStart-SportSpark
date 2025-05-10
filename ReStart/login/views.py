from django.http import JsonResponse
import json
from ReStart.db_config import Session
from user.models import User
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def authenticate(request):
    json_data = json.loads(request.body.decode())
    session = Session()

    user = session.query(User).filter_by(email=json_data['email']).first()
    if user is None or not user.verify_password(json_data['password']):
        return JsonResponse({
            'message': 'Неверный email или пароль'
        }, status=403)
    
    if user.is_banned:
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)

    request.session['user_id'] = user.id

    return JsonResponse({
        'message': 'Успешный вход'
    }, status=200)