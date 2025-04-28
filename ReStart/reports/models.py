from datetime import datetime
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import LargeBinary
from ReStart.db_config import engine
from ReStart.models import Base


def convert_to_dict(obj):
    return { c.name: getattr(obj, c.name) for c in obj.__table__.columns if c.name != 'official_regulations' }

def get_nullable_data(json_data, key, default):
    return json_data[key] if key in json_data else default

class Organization(Base):
    __tablename__ = 'organizations'
    __table_args__ = { 'extend_existing': True }

    id: Mapped[int] = mapped_column(primary_key=True)
    organization_id: Mapped[int] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(256), nullable=True)
    students_grade_1: Mapped[int] = mapped_column(default=None, nullable=True)
    students_grade_2: Mapped[int] = mapped_column(default=None, nullable=True)
    students_grade_3: Mapped[int] = mapped_column(default=None, nullable=True)
    students_grade_4: Mapped[int] = mapped_column(default=None, nullable=True)
    students_grade_5: Mapped[int] = mapped_column(default=None, nullable=True)
    students_grade_6: Mapped[int] = mapped_column(default=None, nullable=True)
    students_grade_7: Mapped[int] = mapped_column(default=None, nullable=True)
    students_grade_8: Mapped[int] = mapped_column(default=None, nullable=True)
    students_grade_9: Mapped[int] = mapped_column(default=None, nullable=True)
    students_grade_10: Mapped[int] = mapped_column(default=None, nullable=True)
    students_grade_11: Mapped[int] = mapped_column(default=None, nullable=True)
    students_total: Mapped[int] = mapped_column(default=None, nullable=True)
    students_organization: Mapped[int] = mapped_column(default=None, nullable=True)
    creation_time: Mapped[datetime] = mapped_column(nullable=False)
    hours_mon: Mapped[int] = mapped_column(default=0, nullable=True)
    hours_tue: Mapped[int] = mapped_column(default=0, nullable=True)
    hours_wed: Mapped[int] = mapped_column(default=0, nullable=True)
    hours_thu: Mapped[int] = mapped_column(default=0, nullable=True)
    hours_fri: Mapped[int] = mapped_column(default=0, nullable=True)
    hours_sat: Mapped[int] = mapped_column(default=0, nullable=True)
    hours_sun: Mapped[int] = mapped_column(default=0, nullable=True)
    #class_location: Mapped[str] = mapped_column(String(32), nullable=True)
    #inventory_all: Mapped[str] = mapped_column(String(512), nullable=True)
    #inventory_used: Mapped[str] = mapped_column(String(256), nullable=True)
    # todo: change to LargeBinary?
    achievements: Mapped[str] = mapped_column(String(512), nullable=True) 

    def modify_from_dict(self, data):
        self.students_grade_1 = get_nullable_data(data, 'students_grade_1', self.students_grade_1)
        self.students_grade_2 = get_nullable_data(data, 'students_grade_2', self.students_grade_2)
        self.students_grade_3 = get_nullable_data(data, 'students_grade_3', self.students_grade_3)
        self.students_grade_4 = get_nullable_data(data, 'students_grade_4', self.students_grade_4)
        self.students_grade_5 = get_nullable_data(data, 'students_grade_5', self.students_grade_5)
        self.students_grade_6 = get_nullable_data(data, 'students_grade_6', self.students_grade_6)
        self.students_grade_7 = get_nullable_data(data, 'students_grade_7', self.students_grade_7)
        self.students_grade_8 = get_nullable_data(data, 'students_grade_8', self.students_grade_8)
        self.students_grade_9 = get_nullable_data(data, 'students_grade_9', self.students_grade_9)
        self.students_grade_10 = get_nullable_data(data, 'students_grade_10', self.students_grade_10)
        self.students_grade_11 = get_nullable_data(data, 'students_grade_11', self.students_grade_11)
        self.students_total = get_nullable_data(data, 'students_total', self.students_total)
        self.students_organization = get_nullable_data(data, 'students_organization', self.students_organization)
        self.hours_mon = get_nullable_data(data, 'hours_mon', self.hours_mon)
        self.hours_tue = get_nullable_data(data, 'hours_tue', self.hours_tue)
        self.hours_wed = get_nullable_data(data, 'hours_wed', self.hours_wed)
        self.hours_thu = get_nullable_data(data, 'hours_thu', self.hours_thu)
        self.hours_fri = get_nullable_data(data, 'hours_fri', self.hours_fri)
        self.hours_sat = get_nullable_data(data, 'hours_sat', self.hours_sat)
        self.hours_sun = get_nullable_data(data, 'hours_sun', self.hours_sun)
        #self.class_location = get_nullable_data(data, 'class_location', self.class_location)
        #self.inventory_all = get_nullable_data(data, 'inventory_all', self.inventory_all)
        #self.inventory_used = get_nullable_data(data, 'inventory_used', self.inventory_used)
        self.achievements = get_nullable_data(data, 'achievements', self.achievements)

class Sports(Base):
    __tablename__ = 'sports'
    __table_args__ = { 'extend_existing': True }

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(64), nullable=True)
    student_count: Mapped[int] = mapped_column(default=None, nullable=True)
    location: Mapped[str] = mapped_column(String(64), nullable=True)
    inventory: Mapped[str] = mapped_column(String(512), nullable=True)
    #inventory_name: Mapped[str] = mapped_column(String(64), nullable=True)
    #inventory_all: Mapped[int] = mapped_column(default=None, nullable=True)
    inventory_used: Mapped[int] = mapped_column(default=None, nullable=True)
    # Привязка к версии отчета, Именно к Organization.id, не Organization.organization_id!
    organization_id: Mapped[int] = mapped_column(default=None, nullable=True)

    def modify_from_dict(self, data):
        self.name = get_nullable_data(data, 'name', self.name)
        self.student_count = get_nullable_data(data, 'student_count', self.student_count)
        self.location = get_nullable_data(data, 'location', self.location)
        self.inventory = get_nullable_data(data, 'inventory', self.inventory)
        #self.inventory_name = get_nullable_data(data, 'inventory_name', self.inventory_name)
        #self.inventory_all = get_nullable_data(data, 'inventory_all', self.inventory_all)
        self.inventory_used = get_nullable_data(data, 'inventory_used', self.inventory_used)


class Event(Base):
    __tablename__ = 'events'
    __table_args__ = { 'extend_existing': True }

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(64), nullable=True)
    # Если is_official - то используется только это поле
    student_count_all: Mapped[int] = mapped_column(default=None, nullable=True)
    student_count_organization: Mapped[int] = mapped_column(default=None, nullable=True)
    # Привязка к версии отчета, Именно к Organization.id, не Organization.organization_id!
    organization_id: Mapped[int] = mapped_column(default=None, nullable=True)

    is_official: Mapped[bool] = mapped_column(default=False, nullable=True)
    official_type: Mapped[str] = mapped_column(String(64), nullable=True)
    official_location: Mapped[str] = mapped_column(String(64), nullable=True)
    official_organizer: Mapped[str] = mapped_column(String(64), nullable=True)
    official_regulations = mapped_column(LargeBinary, default=None, nullable=True)

    date: Mapped[datetime] = mapped_column(default=None, nullable=True)
    #document = mapped_column(LargeBinary, default=None, nullable=True)
    
    def modify_from_dict(self, data):
        self.name = get_nullable_data(data, 'name', self.name)
        self.student_count_all = get_nullable_data(data, 'student_count_all', self.student_count_all)
        self.student_count_organization = get_nullable_data(data, 'student_count_organization', self.student_count_organization)
        self.is_official = get_nullable_data(data, 'is_official', self.is_official)
        self.official_type = get_nullable_data(data, 'official_type', self.official_type)
        self.official_location = get_nullable_data(data, 'official_location', self.official_location)
        self.official_organizer = get_nullable_data(data, 'official_organizer', self.official_organizer)
        self.official_regulations = get_nullable_data(data, 'official_regulations', self.official_regulations)
        self.date = get_nullable_data(data, 'date', self.date)
        #self.document = get_nullable_data(data, 'document', self.document)


Base.metadata.create_all(bind=engine)