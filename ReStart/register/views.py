from django.http import JsonResponse
import json
from ReStart.db_config import Session
from ReStart.settings import TEMP_PASSWORD_LENGTH
from user.models import User
from reports.models import Organization
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import random
import string


# Временная заглушка для отправки email письма с временным паролем
def send_email(email, password):
    print(f'An email was sent to {email}, password {password}')

def generate_password(length):
    return ''.join([random.choice(string.ascii_letters + string.digits) for i in range(length)])

@csrf_exempt
def create_account(request):
    try:
        json_data = json.loads(request.body.decode())
        session = Session()

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
            is_admin=False
        )
        send_email(user.email, temp_password)

        session.add_all([organization, user])
        session.commit()

        return JsonResponse({
            'message': 'Пользователь создан'
        }, status=200)
    except:
        return JsonResponse({
            'message': 'Вы должны отправить JSON с объектами "organization" и "user"'
        }, status=422)