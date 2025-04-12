import pandas as pd
from reports.models import Organization, Sports, Event
from user.models import User
# Пакет не обновлен в pip, ставить с гитхаба
# pip install "XlsxPandasFormatter @ git+https://github.com/webermarcolivier/xlsxpandasformatter.git"
from xlsxpandasformatter import FormattedWorksheet

def export_to_excel_common(session, writer):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        report_first = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                  .order_by(Organization.creation_time.asc()).first()
        report_changed = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                    .order_by(Organization.creation_time.desc()).first()
        latest_unofficial_event =  session.query(Event).filter(Event.organization_id.like(report_changed.id), Event.is_official.is_(False))\
                                                       .order_by(Event.date.desc()).first()
        latest_official_event =  session.query(Event).filter(Event.organization_id.like(report_changed.id), Event.is_official.is_(True))\
                                                     .order_by(Event.date.desc()).first()
        sports_list = session.query(Sports).filter(Sports.organization_id==report_changed.id)
        for sports in sports_list:
            name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'
            hours_total = sum([report_changed.hours_mon, report_changed.hours_tue, 
                            report_changed.hours_wed, report_changed.hours_thu, 
                            report_changed.hours_fri, report_changed.hours_sat, 
                            report_changed.hours_sun])

            result.append([
                user.municipality_name, report_changed.name, name,
                report_first.creation_time, report_changed.creation_time, sports.name, sports.student_count,
                sports.location, sports.inventory,
                report_changed.hours_mon, report_changed.hours_tue, report_changed.hours_wed, report_changed.hours_thu, report_changed.hours_fri, report_changed.hours_sat, report_changed.hours_sun,
                hours_total, report_changed.students_total, report_changed.students_organization,
                report_changed.students_grade_1, report_changed.students_grade_2, report_changed.students_grade_3, report_changed.students_grade_4, report_changed.students_grade_5, report_changed.students_grade_6, report_changed.students_grade_7, report_changed.students_grade_8, report_changed.students_grade_9, report_changed.students_grade_10, report_changed.students_grade_11,
                latest_unofficial_event.name if latest_unofficial_event is not None else '-', latest_unofficial_event.student_count_all if latest_unofficial_event is not None else '-', latest_unofficial_event.date if latest_unofficial_event is not None else '-',
                latest_unofficial_event.student_count_organization if latest_unofficial_event is not None else '-', latest_official_event.name if latest_official_event is not None else '-',
                latest_official_event.student_count_all if latest_official_event is not None else '-', latest_official_event.date if latest_official_event is not None else '-', latest_official_event.official_type if latest_official_event is not None else '-',
                latest_official_event.official_location if latest_official_event is not None else '-', latest_official_event.official_organizer if latest_official_event is not None else '-', 'Файл', 'Файл'
            ])
            
    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'ФИО Руководителя',
        'Дата направления отчёта', 'Дата внесения правок', 'Деятельность ШСК', 'Численность занимающихся', 
        'Место проведения', 'Инвентарь: количество',
        'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье',
        'Всего часов', 'Численность обучающихся', 'Из них участники школьного спортивного клуба',
        '1 класс', '2 класс', '3 класс', '4 класс',	'5 класс',	'6 класс',	'7 класс',	'8 класс',	'9 класс', '10 класс', '11 класс',
        'Физкультурные мероприятия и спортивные мероприятия, проходящие в рамках деятельности школьного спортивного клуба',
        'Кол-во участников из числа обучающихся образовательной организации', 'Дата проведения мероприятия',
        'Кол-во участников, состоящих в школьном спортивном клубе', 
        'Участие школьного спортивного клуба в официальных всероссийских/региональных/муниципальных физкультурных мероприятиях и спортивных мероприятиях',
        'Кол-во участников', 'Дата проведения мероприятия', 'Уровень проводимого мероприятия', 
        'Место проведения', 'Организатор', 'Положение', 'Достижения ШСК'
    ])
    df.to_excel(writer, sheet_name='Общий', index=False)
    return df

def export_to_excel_schedule(session, writer):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'
        report_changed = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                    .order_by(Organization.creation_time.desc()).first()
        result.append([
            user.municipality_name, report_changed.name, name, 
            report_changed.hours_mon, report_changed.hours_tue, 
            report_changed.hours_wed, report_changed.hours_thu, 
            report_changed.hours_fri, report_changed.hours_sat, 
            report_changed.hours_sun
        ])

    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'ФИО Руководителя',
        'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'
    ])
    df.to_excel(writer, sheet_name='Расписание занятий', index=False)
    return df

def export_to_excel_student_count(session, writer):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'
        report_changed = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                    .order_by(Organization.creation_time.desc()).first()
        result.append([
            user.municipality_name, report_changed.name, name,
            report_changed.students_total, report_changed.students_organization,
            report_changed.students_grade_1, report_changed.students_grade_2, 
            report_changed.students_grade_3, report_changed.students_grade_4, report_changed.students_grade_5, 
            report_changed.students_grade_6, report_changed.students_grade_7, report_changed.students_grade_8, 
            report_changed.students_grade_9, report_changed.students_grade_10, report_changed.students_grade_11
        ])

    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'ФИО руководителя',
        'Всего', 'На базе ШСК',
        '1 класс', '2 класс', '3 класс', '4 класс', '5 класс', '6 класс', '7 класс',
        '8 класс', '9 класс', '10 класс', '11 класс'
    ])
    df.to_excel(writer, sheet_name='Численность обучающихся', index=False)
    return df

def export_to_excel_sports(session, writer):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'
        report_changed = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                    .order_by(Organization.creation_time.desc()).first()
        sports_list = session.query(Sports).filter(Sports.organization_id==report_changed.id).all()
        for sports in sports_list:
            result.append([
                user.municipality_name, report_changed.name, name, sports.name, 
                sports.student_count, sports.location, sports.inventory
            ])

    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'ФИО руководителя', 'Вид спорта', 
        'Кол-во занимающихся', 'Место проведения', 'Инвентарь: количество'
    ])
    df.to_excel(writer, sheet_name='Виды спорта ШСК', index=False)
    return df

def export_to_excel_events_official(session, writer):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'
        report_changed = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                    .order_by(Organization.creation_time.desc()).first()
        events =  session.query(Event).filter(Event.organization_id.like(report_changed.id), Event.is_official.is_(True))
        for event in events:
            result.append([
                user.municipality_name, report_changed.name, name, event.name, 
                event.student_count_all, event.date,
                event.official_type, event.official_location, event.official_organizer, 
                'Файл', 'Файл'
            ])

    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'ФИО руководителя', 'Название', 
        'Кол-во участвующих', 'Дата проведения', 
        'Тип', 'Место проведения', 'Организатор', 
        'Положение', 'Достижения школьного спортивного клуба'
    ])
    df.to_excel(writer, sheet_name='Соревнования', index=False)
    return df

def export_to_excel_events(session, writer):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'
        report_changed = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                    .order_by(Organization.creation_time.desc()).first()
        events =  session.query(Event).filter(Event.organization_id.like(report_changed.id), Event.is_official.is_(False))
        for event in events:
            result.append([
                user.municipality_name, report_changed.name, name,
                event.name, event.student_count_all, event.date,
                event.student_count_organization
            ])

    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'ФИО руководителя', 
        'Название',  'Кол-во участников образовательной организации', 'Дата проведения', 
        'Кол-во участников ШСК'
    ])

    df.to_excel(writer, sheet_name='Мероприятия в рамках ШСК', index=False)
    return df

def apply_basic_styles(writer, sheet_name, df):
    header_format = {
        'bold': True, 
        'font_name': 'Roboto', 
        'font_size': 14, 
        'align': 'center', 
        'valign': 'vcenter', 
        'border': 1, 
        'text_wrap': True
    }
    workbook = writer.book
    worksheet = writer.sheets[sheet_name]
    sheet = FormattedWorksheet(worksheet, workbook, df, False)
    sheet.format_header(headerFormat=header_format, rowHeight=[120])
    sheet.format_cols(
        colWidthList=[ 20 for _ in range(len(df.columns)) ], 
        colFormatList=[ {
            'font_name': 'Roboto', 
            'font_size': 11, 
            'right': 1, 
            'text_wrap': 1, 
            'align': 'center', 
            'valign': 'vcenter'
        } for _ in range(len(df.columns))])
    sheet.format_row(df.shape[0] - 1, rowFormat={ 'bottom': 1 })
    sheet.apply_format_table()