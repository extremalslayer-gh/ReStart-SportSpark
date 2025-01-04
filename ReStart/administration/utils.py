import pandas as pd
from reports.models import Organization, Sports, Event
from user.models import User

# todo: поменять после фикса таблицы апналитиком
def export_to_excel_common(session, writer):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        report_first = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                  .order_by(Organization.creation_time.asc()).first()
        report_changed = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                    .order_by(Organization.creation_time.desc()).first()
        events =  session.query(Event).filter(Event.organization_id==report_changed.id)
        for event in events:
            name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'
            hours_total = sum([report_changed.hours_mon, report_changed.hours_tue, 
                            report_changed.hours_wed, report_changed.hours_thu, 
                            report_changed.hours_fri, report_changed.hours_sat, 
                            report_changed.hours_sun])

            result.append([
                user.municipality_name, report_changed.name, name, 
                report_first.creation_time, report_changed.creation_time, report_changed.hours_mon,
                report_changed.hours_tue, report_changed.hours_wed, report_changed.hours_thu, report_changed.hours_fri, report_changed.hours_sat, report_changed.hours_sun,
                hours_total, event.name, 
                event.student_count_all, event.date, 
                0, 0, 
                report_changed.students_total, report_changed.students_grade_1, report_changed.students_grade_2, report_changed.students_grade_3, report_changed.students_grade_4, 
                report_changed.students_grade_5, report_changed.students_grade_6, report_changed.students_grade_7, report_changed.students_grade_8, report_changed.students_grade_9, report_changed.students_grade_10, report_changed.students_grade_11, 
                '-', 0, '-', 0, 0, 
                '-', 
                0, None, '-', '-', 
                '-', '-', report_changed.achievements 
            ])

    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'ФИО руководителя',
        'Дата направления отчёта', 'Дата внесения правок', 'Понедельник',
        'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье',
        'Всего часов', 'Физкультурные мероприятия и спортивные мероприятия, проходящие в рамках деятельности школьного спортивного клуба',
        'Кол-во участников из числа обучающихся образовательной организации', 'Дата проведения мероприятия',
        'Кол-во участников, состоящих в школьном спортивном клубе', 'Численность обучающихся',
        'Из них участники школьного спортивного клуба', '1 класс','2 класс','3 класс','4 класс',
        '5 класс','6 класс','7 класс','8 класс', '9 класс', '10 класс', '11 класс',
        'Деятельность ШСК', 'Численность занимающихся', 'Место проведения', 'Инвентарь', 'Кол-во',
        'Участие школьного спортивного клуба в официальных всероссийских/региональных/муниципальных физкультурных мероприятиях и спортивных мероприятиях',
        'Кол-во участников', 'Дата проведения мероприятия', 'Уровень проводимого мероприятия', 'Место проведения',
        'Организатор', 'Положение', 'Достижения ШСК'
    ])
    df.to_excel(writer, sheet_name='Общий', index=False)

def export_to_excel_schedule(session, writer):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        report_changed = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                    .order_by(Organization.creation_time.desc()).first()
        result.append([
            user.municipality_name, report_changed.name, 
            report_changed.hours_mon, report_changed.hours_tue, 
            report_changed.hours_wed, report_changed.hours_thu, 
            report_changed.hours_fri, report_changed.hours_sat, 
            report_changed.hours_sun
        ])

    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'Понедельник',
        'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'
    ])
    df.to_excel(writer, sheet_name='Расписание занятий', index=False)

def export_to_excel_student_count(session, writer):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        report_changed = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                    .order_by(Organization.creation_time.desc()).first()
        result.append([
            user.municipality_name, report_changed.name, 
            report_changed.students_total, report_changed.students_grade_1, report_changed.students_grade_2, 
            report_changed.students_grade_3, report_changed.students_grade_4, report_changed.students_grade_5, 
            report_changed.students_grade_6, report_changed.students_grade_7, report_changed.students_grade_8, 
            report_changed.students_grade_9, report_changed.students_grade_10, report_changed.students_grade_11
        ])

    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'Всего', 
        '1 класс', '2 класс', '3 класс', '4 класс', '5 класс', '6 класс', '7 класс',
        '8 класс', '9 класс', '10 класс', '11 класс'
    ])
    df.to_excel(writer, sheet_name='Численность обучающихся', index=False)

def export_to_excel_sports(session, writer):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        report_changed = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                    .order_by(Organization.creation_time.desc()).first()
        sports_list = session.query(Sports).filter(Sports.organization_id==report_changed.id).all()
        for sports in sports_list:
            result.append([
                user.municipality_name, report_changed.name, 
                sports.name, sports.student_count, sports.location, 
                sports.inventory_name, sports.inventory_all, sports.inventory_used
            ])

    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'Вид спорта', 
        'Кол-во занимающихся', 'Место проведения', 'Инвентарь', 'Кол-во', 'Используемый инвентарь'
    ])
    df.to_excel(writer, sheet_name='Виды спорта ШСК', index=False)

def export_to_excel_events_official(session, writer):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        report_changed = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                    .order_by(Organization.creation_time.desc()).first()
        events =  session.query(Event).filter(Event.organization_id.like(report_changed.id), Event.is_official.is_(True))
        for event in events:
            result.append([
                user.municipality_name, report_changed.name, event.name, 
                event.student_count_all, event.date,
                event.official_type, event.official_location, event.official_organizer, 
                'Файл', report_changed.achievements #todo: link to file download API?
            ])

    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'Название', 
        'Кол-во участвующих', 'Дата проведения', 
        'Тип', 'Место проведения', 'Организатор', 
        'Положение', 'Достижения школьного спортивного клуба'
    ])
    df.to_excel(writer, sheet_name='Соревнования', index=False)

def export_to_excel_events(session, writer):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        report_changed = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
                                                    .order_by(Organization.creation_time.desc()).first()
        events =  session.query(Event).filter(Event.organization_id.like(report_changed.id), Event.is_official.is_(False))
        for event in events:
            result.append([
                user.municipality_name, report_changed.name, 
                event.name, event.student_count_all, event.date,
                event.student_count_organization
            ])

    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'Название', 
        'Кол-во участников образовательной организации', 'Дата проведения', 
        'Кол-во участников ШСК'
    ])
    df.to_excel(writer, sheet_name='Мероприятия в рамках ШСК', index=False)