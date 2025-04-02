# ReStart-SportSpark
Проект направлен на создание веб-сервиса для сбора и анализа данных о деятельности школьных спортивных клубов (ШСК). Сервис позволит руководителям ШСК заполнять и редактировать отчеты, а также предоставит заказчику возможность просматривать все отчеты в единой базе данных с функцией фильтрации. Веб-сервис будет иметь удобный интерфейс для ввода информации о работе ШСК

# Структура проекта

- ReStart/administration - функционал администрирования
- ReStart/login - функционал входа в систему
- ReStart/register - функционал регистрации новых пользователей
- ReStart/reports - функционал создания, просмотра и редактирования отчетов
- ReStart/user - функционал управления аккаунтом пользователя

# Конфигурационые файлы

- ReStart/ReStart/db_config.py - настройки БД
- ReStart/ReStart/settings.py - общие настройки

# Установка и запуск
```console
cd ReStart
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

# API

Данные передаются и возвращаются с сервера в виде JSON.

## /admin/

### Получение отчетов

**POST** `/admin/get_reports/`

#### Параметры

- `page` (обязательный, число) - номер запрашиваемой страницы, стандартно отчеты разбиваются по 30 штук на страницу. Отсчет страниц начинается с нуля

#### Ответ сервера

```json
{
    "user_name": Имя пользователя,
    "organization": {
        "id": id организации(системный, уникальный),
        "organization_id": id организации(не уникальный, используется для отслеживания изменений),
        "name": Название организации,
        "students_grade_1": Кол-во учащихся(1 класс),
        "students_grade_2": Кол-во учащихся(2 класс),
        "students_grade_3": Кол-во учащихся(3 класс),
        "students_grade_4": Кол-во учащихся(4 класс),
        "students_grade_5": Кол-во учащихся(5 класс),
        "students_grade_6": Кол-во учащихся(6 класс),
        "students_grade_7": Кол-во учащихся(7 класс),
        "students_grade_8": Кол-во учащихся(8 класс),
        "students_grade_9": Кол-во учащихся(9 класс),
        "students_grade_10": Кол-во учащихся(10 класс),
        "students_grade_11": Кол-во учащихся(11 класс),
        "students_total": Общее кол-во учащихся,
        "students_organization": Общее кол-во учащихся(в организации),
        "creation_time": Дата создания отчета,
        "hours_mon": Кол-во часов в пн,
        "hours_tue": Кол-во часов в вт,
        "hours_wed": Кол-во часов в ср,
        "hours_thu": Кол-во часов в чт,
        "hours_fri": Кол-во часов в пт,
        "hours_sat": Кол-во часов в сб,
        "hours_sun": Кол-во часов в вс,
        "achievements": Достижения (W.I.P.),
    },
}
```

---

### Экспорт отчетов

**GET** `/admin/export_reports/`

#### Ответ сервера

Excel файл, Content-type=application/vnd.ms-excel

---

### Получение пользователей

**GET** `/admin/get_users/`

#### Ответ сервера

```json
[
    {
        "id": Id пользователя,
        "first_name": Имя,
        "second_name": Фамилия,
        "last_name": Отчество,
        "email": Email,
        "organization_id": Id организации,
        "municipality_name": Муниципальное образование,
        "is_admin": Является ли админом,
        "is_banned": Оключен ли пользователю доступ,
        "occupation": Должность,
        "temp_password_changed": Изменен ли временный пароль
    },
    ...
]
```

---

### Изменение доступа пользователю

**POST** `/admin/set_user_ban/`

### Параметры

 - `id` - id пользователя
 - `ban` - true/false заблокировать/разблокировать соответственно

#### Ответ сервера

```json
{
    "message": "Доступ обновлен"
}
```

---

### Изменение профиля пользователя

**POST** `/admin/edit_user/`

### Параметры
\* - необязательные параметры

 - `id` - id пользователя
 - *`first_name` - Новое имя пользователя
 - *`second_name` - Новая фамилия пользователя
 - *`last_name` - Новое отчество пользователя
 - *`occupation` - Новая должность пользователя
 - *`profile_image` - Новая аватарка пользователя

#### Ответ сервера

```json
{
    "message": "Профиль обновлен"
}
```

---

### Подтверждение действия паролем(со стороны сервера)

**POST** `/admin/verify_password/`

### Параметры

 - `password` - пароль

#### Ответ сервера

```json
{
    "message": "Доступ разрешен"
}
```

## /login/

### Аутентификация

**POST** `/login/authenticate/`

### Параметры

 - `email` - email
 - `password` - пароль

#### Ответ сервера

```json
{
    "message": "Успешный вход"
}
```
P.S. В ответе приходит cookie `sessionid`, она регулирует доступ

## /register/

### Создание нового пользователя

**POST** `/register/create_account/`

### Параметры

```json
{
    "organization": { 
        "name": Название организации
    },
    "user": {
        "first_name": Имя,
        "second_name": Фамилия,
        "last_name": Отчество,
        "email": email,
        "municipality_name": Муниципальное образование,
        "occupation": Должность
    }
}
```

### Ответ сервера

```json
{
    "message": "Пользователь создан"
}
```

## /reports/

### Создание отчета

**POST** `/reports/create_report/`

### Параметры
... - поле ранее описано в документации
```json
{
  "organization": {
    "students_grade_1": ...,
    "students_grade_2": ...,
    "students_grade_3": ...,
    "students_grade_4": ...,
    "students_grade_5": ...,
    "students_grade_6": ...,
    "students_grade_7": ...,
    "students_grade_8": ...,
    "students_grade_9": ...,
    "students_grade_10": ...,
    "students_grade_11": ...,
    "students_total": ...,
    "students_organization": ...,
    "hours_mon": ...,
    "hours_tue": ...,
    "hours_wed": ...,
    "hours_thu": ...,
    "hours_fri": ...,
    "hours_sat": ...,
    "hours_sun": ...,
    "achievements": ...
  },
  "sports": [
    {,
      "name": Название спорта,
      "student_count": Кол-во учащихся,
      "location": Место проведения,
      "inventory": Ивентарь
    },
    {
      "name": ...,
      "student_count": ...,
      "location": ...
    }
  ],
  "events": [
    {
      "name": Название мероприятия,
      "student_count_all": Всего участников,
      "student_count_organization": Кол-во участников от организации,
      "is_official": Оффициальное ли мероприятие,
      "official_type": Если оффициальное, то тип(Муниципальное, Городское и т.д.),
      "official_location": Если оффициальное, место проведения,
      "official_organizer": Если оффициальное, то организатор,
      "official_regulations": base64 файла оффициального документа,
      "date": дата в формате dd.mm.yyyy
    },
    {
      "name": ...,
      "student_count_all": ...,
      "student_count_organization": ...,
      "is_official": ...,
      "date": ...
    }
  ]
}
```

#### Ответ сервера

```json
{
    "message": "Информация отправлена"
}
```

---

### Получение своего отчета

**POST** `/reports/get_report/`

#### Ответ сервера

```json
{
    "organization": {
        "students_grade_1": ...,
        "students_grade_2": ...,
        "students_grade_3": ...,
        "students_grade_4": ...,
        "students_grade_5": ...,
        "students_grade_6": ...,
        "students_grade_7": ...,
        "students_grade_8": ...,
        "students_grade_9": ...,
        "students_grade_10": ...,
        "students_grade_11": ...,
        "students_total": ...,
        "students_organization": ...,
        "hours_mon": ...,
        "hours_tue": ...,
        "hours_wed": ...,
        "hours_thu": ...,
        "hours_fri": ...,
        "hours_sat": ...,
        "hours_sun": ...,
        "achievements": ...
    },
    "sports": [
        {
            "name": ...,
            "student_count": ...,
            "location": ...,
            "inventory": ...
        },
        {
            "name": ...,
            "student_count": ...,
            "location": ...
        }],
    "events": [
        {
            "name": ...,
            "student_count_all": ...,
            "student_count_organization": ...,
            "is_official": ...,
            "official_type": ...,
            "official_location": ...,
            "official_organizer": ...,
            "official_regulations": ...,
            "date": ...
        },
        {
            "name": ...,
            "student_count_all": ...,
            "student_count_organization": ...,
            "is_official": ...,
            "date": ...
        }
    ],
}
```

---

### Редактирование отчета

**POST** `/reports/edit_report/`

#### Параметры
\* - необязательные параметры

Для поля `organization` нужно указывать только *новые* данные, поля `sports` и `events` нужно отправлять полностью заполненные, либо не отправлять(если их нет)

```json
{
    "organization": {
        *"students_grade_1": ...,
        *"students_grade_2": ...,
        *"students_grade_3": ...,
        *"students_grade_4": ...,
        *"students_grade_5": ...,
        *"students_grade_6": ...,
        *"students_grade_7": ...,
        *"students_grade_8": ...,
        *"students_grade_9": ...,
        *"students_grade_10": ...,
        *"students_grade_11": ...,
        *"students_total": ...,
        *"students_organization": ...,
        *"hours_mon": ...,
        *"hours_tue": ...,
        *"hours_wed": ...,
        *"hours_thu": ...,
        *"hours_fri": ...,
        *"hours_sat": ...,
        *"hours_sun": ...,
        *"achievements": ...
    },
    "sports": [
        *{
            "name": ...,
            "student_count": ...,
            "location": ...,
            "inventory": ...
        },
        *{
            "name": ...,
            "student_count": ...,
            "location": ...
        }],
    "events": [
        *{
            "name": ...,
            "student_count_all": ...,
            "student_count_organization": ...,
            "is_official": ...,
            "official_type": ...,
            "official_location": ...,
            "official_organizer": ...,
            "official_regulations": ...,
            "date": ...
        },
        *{
            "name": ...,
            "student_count_all": ...,
            "student_count_organization": ...,
            "is_official": ...,
            "date": ...
        }
    ],
}
```

#### Ответ сервера

```json
{
    "message": "Информация отправлена"
}
```

## /user/

### Изменение пароля

**POST** `/user/change_password/`

### Параметры

 - `old_password` - старый пароль
 - `new_password` - новый пароль

### Ответ сервера

```json
{
    "message": "Пароль изменен успешно"
}
```

---

### Изменение аватарки

**POST** `/user/change_profile_image/`

### Параметры

 - `profile_image` - base64 новой аватарки

### Ответ сервера

```json
{
    "message": "Картинка изменена"
}
```

---

### Получение своего профиля

**GET** `/user/get_profile/`

### Ответ сервера

```json
{
    "id": Id пользователя,
    "first_name": Имя,
    "second_name": Фамилия,
    "last_name": Отчество,
    "email": email,
    "organization_id": Id организации,
    "municipality_name": Муниципальное образование,
    "is_admin": Является ли администратором,
    "occupation": Должность,
    "is_banned": Забанен ли,
    "temp_password_changed": Сменил ли временный пароль,
    "profile_image": base64 аватарки
}
```