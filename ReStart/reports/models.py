from datetime import datetime
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
import importlib
from sqlalchemy.types import LargeBinary
engine = importlib.import_module("settings-project.db_config").engine
Base = importlib.import_module("settings-project.models").Base


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
    creation_time: Mapped[datetime] = mapped_column(nullable=False)
    hours_mon: Mapped[int] = mapped_column(default=0, nullable=True)
    hours_tue: Mapped[int] = mapped_column(default=0, nullable=True)
    hours_wed: Mapped[int] = mapped_column(default=0, nullable=True)
    hours_thu: Mapped[int] = mapped_column(default=0, nullable=True)
    hours_fri: Mapped[int] = mapped_column(default=0, nullable=True)
    hours_sat: Mapped[int] = mapped_column(default=0, nullable=True)
    hours_sun: Mapped[int] = mapped_column(default=0, nullable=True)
    class_location: Mapped[str] = mapped_column(String(32), nullable=True)
    inventory_all: Mapped[str] = mapped_column(String(512), nullable=True)
    inventory_used: Mapped[str] = mapped_column(String(256), nullable=True)
    achievements: Mapped[str] = mapped_column(String(512), nullable=True)

class Sports(Base):
    __tablename__ = 'sports'
    __table_args__ = { 'extend_existing': True }

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(64), nullable=False)
    student_count: Mapped[int] = mapped_column(default=None, nullable=True)
    organization_id: Mapped[int] = mapped_column(default=None, nullable=True)

class Event(Base):
    __tablename__ = 'events'
    __table_args__ = { 'extend_existing': True }

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(64), nullable=False)
    student_count: Mapped[int] = mapped_column(default=None, nullable=True)
    organization_id: Mapped[int] = mapped_column(default=None, nullable=True)
    date: Mapped[datetime] = mapped_column(default=None, nullable=True)
    document = mapped_column(LargeBinary, default=None, nullable=True)

Base.metadata.create_all(bind=engine)