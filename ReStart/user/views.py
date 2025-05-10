from django.http import JsonResponse
import json
from ReStart.db_config import Session
from user.models import User
from django.views.decorators.csrf import csrf_exempt
from user.utils import is_logged_in


@csrf_exempt
def change_password(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)

    session = Session()
    json_data = json.loads(request.body.decode())
    
    user = session.query(User).filter(User.id==request.session['user_id']).first()
    
    if user.temp_password_changed and not user.verify_password(json_data['old_password']):
        return JsonResponse({
            'message': 'Старый пароль введен неверно'
        }, status=403)
    
    user.password = json_data['new_password']
    user.temp_password_changed = True
    session.commit()

    return JsonResponse({
        'message': 'Пароль изменен успешно'
    }, status=200)

@csrf_exempt
def change_profile_image(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)

    session = Session()
    json_data = json.loads(request.body.decode())
    user = session.query(User).filter(User.id==request.session['user_id']).first()
    
    user.profile_image = json_data['profile_image']
    session.commit()

    return JsonResponse({
        'message': 'Картинка изменена'
    }, status=200)

@csrf_exempt
def get_profile(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)

    session = Session()
    user = session.query(User).filter(User.id==request.session['user_id']).first()
    return JsonResponse(user.convert_to_dict(), status=200)