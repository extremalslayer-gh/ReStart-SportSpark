from django.http import JsonResponse
import json
from ReStart.db_config import Session
from ReStart.settings import TEMP_PASSWORD_LENGTH, NOTIFIER, EMAIL_NOTIFICATION_TEXT
from user.models import User
from reports.models import Organization
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import random
import string
from user.utils import is_logged_in


def generate_password(length):
    return ''.join([random.choice(string.ascii_letters + string.digits) for i in range(length)])

@csrf_exempt
def create_account(request):
    try:
        json_data = json.loads(request.body.decode())
        session = Session()

        if not is_logged_in(request):
            return JsonResponse({
                'message': 'Неавторизованный доступ'
            }, status=403)
        
        caller_user = session.query(User).filter(User.id==request.session['user_id']).first()
        if not caller_user.is_admin:
            return JsonResponse({
                'message': 'Неавторизованный доступ'
            }, status=403)

        same_user = session.query(User).filter(User.email==json_data['user']['email']).exists()
        if session.query(same_user).scalar():
            return JsonResponse({
                'message': 'Пользователь с данным email уже существует'
            }, status=409)

        last_organization = session.query(Organization).order_by(Organization.organization_id.desc()).first()
        organization_id = last_organization.organization_id + 1 if last_organization is not None else 0

        organization = Organization(
            **json_data['organization'], 
            creation_time=datetime.now(),
            organization_id=organization_id
        )

        temp_password = generate_password(TEMP_PASSWORD_LENGTH)

        user = User(
            **json_data['user'],
            password=temp_password,
            organization_id=organization_id,
            is_admin=False,
            temp_password_changed=False
        )

        NOTIFIER.send_notification(user.email, EMAIL_NOTIFICATION_TEXT.format(temp_password))

        session.add_all([organization, user])
        session.commit()

        return JsonResponse({
            'message': 'Пользователь создан'
        }, status=200)
    except:
        return JsonResponse({
            'message': 'Вы должны отправить JSON с объектами "organization" и "user"'
        }, status=422)