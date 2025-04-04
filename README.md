# ReStart-SportSpark
- Проект направлен на создание веб-сервиса для сбора и анализа данных о деятельности школьных спортивных клубов (ШСК). 
- Сервис позволит руководителям ШСК заполнять и редактировать отчеты, а также предоставит заказчику возможность просматривать все отчеты в единой базе данных с функцией фильтрации.
- Веб-сервис будет иметь удобный интерфейс для ввода информации о работе ШСК

# Стек
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white) ![SQLAlchemy](https://img.shields.io/badge/sqlalchemy-%23CB3032.svg?style=for-the-badge&logo=sqlalchemy&logoColor=white)

# Структура проекта



```text
ReStart/
└── administration - функционал администрирования
└── login - функционал входа в систему
└── register - функционал регистрации новых пользователей
└── reports - функционал создания, просмотра и редактирования отчетов
└── user - функционал управления аккаунтом пользователя
└── settingurl/
    ├── static/
    |    └── settingurl/
    |        ├── css/
    |        |    ├── authorization.css - Стили для вкладки авторизации.
    |        |    ├── block1_2.css - Стили для заполнения отчёта: Вкладка Физкультурные мероприятия и спортивные мероприятия.
    |        |    ├── block1_3.css - Стили для заполнения отчёта: Вкладка Материально-техническое обеспечение.
    |        |    ├── block1general.css - Стили для заполнения отчёта: Вкладка расписания занятий школьного спортивного клуба.
    |        |    ├── block_35.css - Стили для заполнения отчёта: Вкладка участие школьного спортивного клуба.
    |        |    ├── block_russian.css - Стили для заполнения отчёта: Вкладка участие школьного спортивного клуба в всероссийских физкультурных мероприятиях.
    |        |    ├── block_russian2.css - Стили для заполнения отчёта: Вкладка участие школьного спортивного клуба в региональных физкультурных мероприятиях.
    |        |    ├── block_student.css - Стили для заполнения отчёта: Вкладка численность обучающихся.
    |        |    ├── email.css - Стили для Вкладки: Отправка кода на почту с бросом пороля.
    |        |    ├── managers.css - Стили для вкладки руководителей школьных спортивных клубов.
    |        |    ├── password.css - Стили для вкладки сброса пароля.
    |        |    ├── personal.css - Стили для вкладки профиль администрации.
    |        |    ├── personalmanage.css - Стили для вкладки профиль руководителя.
    |        |    ├── recentrep.css - Стили для вкладки просмотр отчётов руководителю.
    |        |    ├── registration.css - Стили для вкладки с регистрацией
    |        |    ├── renamepass.css - Стили для вкладки с изменением пароля.
    |        |    ├── reports.css - Стили для вкладки отчётов у админа.
    |        |    ├── success.css - Стили для вкладки подтверждение успешной смены пароля.
    |        |    └── tables.css - Стили для вкладки таблицы с руководителями.
    |        └─── js/
    |             ├── block1_2.js - Переход по кнопки с сохранением и отправкой данных
    |             ├── block1_3.js - Переход по кнопки с сохранением и отправкой данных
    |             ├── block1general.js - Сохранение расписания по дням
    |             ├── block_35.js - Сохранение мероприятий в формате объекта
    |             ├── block_russian.js - В зависимости от мероприятия получаем данные
    |             ├── block_russian2.js - Скрипт для отправки отчёта
    |             ├── block_student.js - Скрипт для отправки и сохранения данных в Базу данных
    |             ├── managers.js - Подтверждение снятия доступа у руководителя
    |             ├── personal.js - Загрузка изображения
    |             ├── personalmanage.js - Кнопка загрузки файлов
    |             ├── profile.js - Установка аватара
    |             ├── registration.js - Подтверждение регистрации
    |             └── tables.js - Скрипт для скачивания таблицы
    └── templates/
        └─── settingurl/
             ├── authorization.html - Вкладка авторизации.
             ├── block1_2.html - Заполнение отчёта: Вкладка Физкультурные мероприятия и спортивные мероприятия.
             ├── block1_3.html - Заполнение отчёта: Вкладка Материально-техническое обеспечение.
             ├── block1general.html - Заполнение отчёта: Вкладка расписания занятий школьного спортивного клуба.
             ├── block_35.html - Заполнение отчёта: Вкладка участие школьного спортивного клуба.
             ├── block_russian.html - Заполнение отчёта: Вкладка участие школьного спортивного клуба в всероссийских физкультурных мероприятиях.
             ├── block_russian2.html - Заполнение отчёта: Вкладка участие школьного спортивного клуба в региональных физкультурных мероприятиях.
             ├── block_student.html - Заполнение отчёта: Вкладка численность обучающихся.
             ├── email.html - Отправка кода на почту с бросом пороля.
             ├── managers.html - Вкладка руководителей школьных спортивных клубов.
             ├── password.html - Вкладка сброса пароля.
             ├── personal.html - Профиль администрации.
             ├── personalmanage.html - Профиль руководителя.
             ├── recentrep.html - Просмотр отчётов руководителю.
             ├── registration.html - Вкладка с регистрацией
             ├── renamepass.html - Вкладка с изменением пароля.
             ├── reports.html - Вкладка отчётов у админа.
             ├── success.html - Подтверждение успешной смены пароля.
             └── tables.html - Таблица с руководителями.
```



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

# Деплой продукта
### Продукт на этапе разработки размещен по следующему адресу:
https://restartdev.pythonanywhere.com/


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
