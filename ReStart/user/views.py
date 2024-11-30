from django.http import JsonResponse
import json
from ReStart.db_config import Session
from user.models import User
from django.views.decorators.csrf import csrf_exempt


def is_logged_in(request):
    return 'user_id' in request.session

@csrf_exempt
def change_password(request):
    if not is_logged_in(request):
        return JsonResponse({
            'message': 'Доступ запрещен'
        }, status=403)

    try:
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
    except:
        return JsonResponse({
            'message': 'Вы должны отправить JSON со значениями "old_password" и "new_password" или "new_password" если это первая смена пароля'
        }, status=422)