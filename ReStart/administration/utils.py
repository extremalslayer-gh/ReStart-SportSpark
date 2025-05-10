import pandas as pd
from reports.models import Organization, Sports, Event
from user.models import User
import datetime
# Пакет не обновлен в pip, ставить с гитхаба
# pip install "XlsxPandasFormatter @ git+https://github.com/webermarcolivier/xlsxpandasformatter.git"
from xlsxpandasformatter import FormattedWorksheet


def filter_reports(query, json_data):    
    if 'filters' in json_data:
        filter_params_simple = ['students_total', 'students_organization', 'name']
        for i in range(1, 12):
            filter_params_simple.append(f'students_grade_{i}')

        for param in filter_params_simple:
            if param in json_data['filters']:
                query = query.filter(Organization.__table__.c[param].in_(json_data['filters'][param]))
        
        if 'creation_time' in json_data['filters']:
            creation_time_allowed = list(map(lambda x: datetime.datetime.strptime(x, '%d.%m.%Y'), json_data['filters']['creation_time']))
            query = query.filter(Organization.__table__.c['creation_time'].in_(creation_time_allowed))

    query = query.all()
    return query

def filter_user(user, json_data):
    name = f'{user.second_name} {user.first_name} {user.last_name}'
    if 'filters' in json_data:
        if 'municipality_name' in json_data['filters']:
            if user.municipality_name not in json_data['filters']['municipality_name']:
                return False
        if 'user_name' in json_data['filters']:
            if name not in json_data['filters']['user_name']:
                return False
    return True

def export_to_excel_common(session, writer, json_data):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        if not filter_user(user, json_data):
            continue
        #user_reports = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
        #                                            .order_by(Organization.creation_time.desc()).all()
        user_reports = (session.query(Organization).filter(Organization.organization_id==user.organization_id)
                                                  .order_by(Organization.creation_time.desc()))
        
        user_reports = filter_reports(user_reports, json_data)
        
        for report in user_reports:
            latest_unofficial_event =  session.query(Event).filter(Event.organization_id.like(report.id), Event.is_official.is_(False))\
                                                        .order_by(Event.date.desc()).first()
            latest_official_event =  session.query(Event).filter(Event.organization_id.like(report.id), Event.is_official.is_(True))\
                                                        .order_by(Event.date.desc()).first()
            sports_list = session.query(Sports).filter(Sports.organization_id==report.id)
            for sports in sports_list:
                name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'
                hours_total = sum([report.hours_mon, report.hours_tue, 
                                report.hours_wed, report.hours_thu, 
                                report.hours_fri, report.hours_sat, 
                                report.hours_sun])

                result.append([
                    user.municipality_name, report.name, name,
                    report.creation_time, report.creation_time, sports.name, sports.student_count,
                    report.hours_mon, report.hours_tue, report.hours_wed, report.hours_thu, report.hours_fri, report.hours_sat, report.hours_sun,
                    hours_total, report.students_total, report.students_organization,
                    report.students_grade_1, report.students_grade_2, report.students_grade_3, report.students_grade_4, report.students_grade_5, report.students_grade_6, report.students_grade_7, report.students_grade_8, report.students_grade_9, report.students_grade_10, report.students_grade_11,
                    latest_unofficial_event.name if latest_unofficial_event is not None else '-', latest_unofficial_event.student_count_all if latest_unofficial_event is not None else '-', latest_unofficial_event.date if latest_unofficial_event is not None else '-',
                    latest_unofficial_event.student_count_organization if latest_unofficial_event is not None else '-', latest_official_event.name if latest_official_event is not None else '-',
                    latest_official_event.student_count_all if latest_official_event is not None else '-', latest_official_event.date if latest_official_event is not None else '-', latest_official_event.official_type if latest_official_event is not None else '-',
                    latest_official_event.official_location if latest_official_event is not None else '-', latest_official_event.official_organizer if latest_official_event is not None else '-', 'Файл', 'Файл'
                ])
            
    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'ФИО Руководителя',
        'Дата направления отчёта', 'Дата внесения правок', 'Деятельность ШСК', 'Численность занимающихся', 
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

def export_to_excel_schedule(session, writer, json_data):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        if not filter_user(user, json_data):
            continue
        name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'
        #user_reports = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
        #                                            .order_by(Organization.creation_time.desc()).all()
        user_reports = (session.query(Organization).filter(Organization.organization_id==user.organization_id)
                                                  .order_by(Organization.creation_time.desc()))
        
        user_reports = filter_reports(user_reports, json_data)
        for report in user_reports:
            result.append([
                user.municipality_name, report.name, name, 
                report.hours_mon, report.hours_tue, 
                report.hours_wed, report.hours_thu, 
                report.hours_fri, report.hours_sat, 
                report.hours_sun
            ])

    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'ФИО Руководителя',
        'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'
    ])
    df.to_excel(writer, sheet_name='Расписание занятий', index=False)
    return df

def export_to_excel_student_count(session, writer, json_data):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        if not filter_user(user, json_data):
            continue
        name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'
        #user_reports = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
        #                                            .order_by(Organization.creation_time.desc()).all()
        user_reports = (session.query(Organization).filter(Organization.organization_id==user.organization_id)
                                                  .order_by(Organization.creation_time.desc()))
        
        user_reports = filter_reports(user_reports, json_data)

        for report in user_reports:
            result.append([
                user.municipality_name, report.name, name,
                report.students_total, report.students_organization,
                report.students_grade_1, report.students_grade_2, 
                report.students_grade_3, report.students_grade_4, report.students_grade_5, 
                report.students_grade_6, report.students_grade_7, report.students_grade_8, 
                report.students_grade_9, report.students_grade_10, report.students_grade_11
            ])

    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'ФИО руководителя',
        'Всего', 'На базе ШСК',
        '1 класс', '2 класс', '3 класс', '4 класс', '5 класс', '6 класс', '7 класс',
        '8 класс', '9 класс', '10 класс', '11 класс'
    ])
    df.to_excel(writer, sheet_name='Численность обучающихся', index=False)
    return df

def export_to_excel_sports(session, writer, json_data):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        if not filter_user(user, json_data):
            continue
        name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'
        #user_reports = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
        #                                            .order_by(Organization.creation_time.desc()).all()
        user_reports = (session.query(Organization).filter(Organization.organization_id==user.organization_id)
                                                  .order_by(Organization.creation_time.desc()))
        
        user_reports = filter_reports(user_reports, json_data)
        
        for report in user_reports:
            sports_list = session.query(Sports).filter(Sports.organization_id==report.id).all()
            for sports in sports_list:
                result.append([
                    user.municipality_name, report.name, name, sports.name, 
                    sports.student_count
                ])

    df = pd.DataFrame(result, columns=[
        'Муниципальное образование', 'Школьный спортивный клуб', 'ФИО руководителя', 'Вид спорта', 
        'Кол-во занимающихся'
    ])
    df.to_excel(writer, sheet_name='Виды спорта ШСК', index=False)
    return df

def export_to_excel_events_official(session, writer, json_data):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        if not filter_user(user, json_data):
            continue
        name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'
        #user_reports = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
        #                                            .order_by(Organization.creation_time.desc()).all()
        user_reports = (session.query(Organization).filter(Organization.organization_id==user.organization_id)
                                                  .order_by(Organization.creation_time.desc()))
        
        user_reports = filter_reports(user_reports, json_data)

        for report in user_reports:
            events =  session.query(Event).filter(Event.organization_id.like(report.id), Event.is_official.is_(True))
            for event in events:
                result.append([
                    user.municipality_name, report.name, name, event.name, 
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

def export_to_excel_events(session, writer, json_data):
    result = []
    users = session.query(User).filter(User.is_admin==False).all()
    for user in users:
        if not filter_user(user, json_data):
            continue
        name = f'{user.second_name} {user.first_name} {user.last_name}' if user is not None else 'Не определено'
        #user_reports = session.query(Organization).filter(Organization.organization_id==user.organization_id)\
        #                                            .order_by(Organization.creation_time.desc()).all()
        user_reports = (session.query(Organization).filter(Organization.organization_id==user.organization_id)
                                                  .order_by(Organization.creation_time.desc()))
        
        user_reports = filter_reports(user_reports, json_data)

        for report in user_reports:
            events =  session.query(Event).filter(Event.organization_id.like(report.id), Event.is_official.is_(False))
            for event in events:
                result.append([
                    user.municipality_name, report.name, name,
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
    if df.shape[0] > 0:
        sheet.format_row(df.shape[0] - 1, rowFormat={ 'bottom': 1 })
    sheet.format_index(indexFormat=header_format, colWidth=20)
    return sheet

def apply_conditional_style(df, sheet, cols_a, style_a, cols_b, style_b, style_other):
    sheet.format_cols(
        colWidthList=[ 20 for _ in range(len(df.columns)) ], 
        colFormatList=[ style_a if i in cols_a else (style_b if i in cols_b else style_other) for i in range(len(df.columns)) ]
    )

FORMAT_MAIN = {
    'font_name': 'Roboto', 
    'font_size': 11, 
    'right': 1, 
    'text_wrap': 1, 
    'align': 'center', 
    'valign': 'vcenter'
}

FORMAT_DATE = {
    'font_name': 'Roboto', 
    'font_size': 11, 
    'right': 1, 
    'text_wrap': 1, 
    'align': 'center', 
    'valign': 'vcenter',
    'num_format':'yyyy-mm-dd hh:mm:ss'
}

FORMAT_LEFT = {
    'font_name': 'Roboto', 
    'font_size': 11, 
    'right': 1, 
    'text_wrap': 1, 
    'align': 'left', 
    'valign': 'vcenter'
}

def apply_common_styles(df, sheet):
    left_align_cols = [ 0, 1, 2, 5, 28, 32, 35, 36, 37 ]
    date_cols = [ 3, 4, 30, 34]
    apply_conditional_style(df, sheet, left_align_cols, FORMAT_LEFT, date_cols, FORMAT_DATE, FORMAT_MAIN)
    sheet.apply_format_table()

def apply_schedule_styles(df, sheet):
    left_align_cols = [ 0, 1, 2 ]
    apply_conditional_style(df, sheet, left_align_cols, FORMAT_LEFT, [], FORMAT_DATE, FORMAT_MAIN)
    sheet.apply_format_table()

def apply_student_count_styles(df, sheet):
    left_align_cols = [ 0, 1, 2 ]
    apply_conditional_style(df, sheet, left_align_cols, FORMAT_LEFT, [], FORMAT_DATE, FORMAT_MAIN)
    sheet.apply_format_table()

def apply_sports_styles(df, sheet):
    left_align_cols = [ 0, 1, 2, 3 ]
    apply_conditional_style(df, sheet, left_align_cols, FORMAT_LEFT, [], FORMAT_DATE, FORMAT_MAIN)
    sheet.apply_format_table()

def apply_events_official_styles(df, sheet):
    left_align_cols = [ 0, 1, 2, 3, 6, 7, 8 ]
    date_cols = [ 5 ]
    apply_conditional_style(df, sheet, left_align_cols, FORMAT_LEFT, date_cols, FORMAT_DATE, FORMAT_MAIN)
    sheet.apply_format_table()

def apply_events_styles(df, sheet):
    left_align_cols = [ 0, 1, 2, 3 ]
    date_cols = [ 5 ]
    apply_conditional_style(df, sheet, left_align_cols, FORMAT_LEFT, date_cols, FORMAT_DATE, FORMAT_MAIN)
    sheet.apply_format_table()