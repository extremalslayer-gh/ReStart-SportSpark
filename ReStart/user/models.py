from django.contrib.auth.hashers import make_password, check_password
from sqlalchemy import Boolean
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
import importlib
engine = importlib.import_module("settings-project.db_config").engine
Base = importlib.import_module("settings-project.models").Base


# Отслеживание изменений в отчетах:
# Foreign Key не работает с неуникальными полями, поэтому для извлечения последнего
# Изменения данных об организации, лучше написать кастомный @property, который будет учитывать дату.
# Либо можно использовать id(не organization_id) для foreign key и автоматически обновлять его везде, где это требуется,
# Однако я счел используемый способ предпочтительным, т.к. в данном случае отслеживание изменений становится проще
class User(Base):
    __tablename__ = 'users'
    __table_args__ = { 'extend_existing': True }

    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(32))
    second_name: Mapped[str] = mapped_column(String(32))
    last_name: Mapped[str] = mapped_column(String(32))
    email: Mapped[str] = mapped_column(String(32))
    _password: Mapped[str] = mapped_column('password', String(256))
    organization_id: Mapped[int] = mapped_column()
    #organization_id: Mapped[int] = mapped_column(ForeignKey('organizations.organization_id'))
    #organization: Mapped['Organization'] = relationship()
    municipality_name: Mapped[str] = mapped_column(String(256))
    is_admin: Mapped[bool] = mapped_column(Boolean(), default=False)
    occupation: Mapped[str] = mapped_column(String(32))

    @property
    def password(self):
        raise AttributeError('Cannot read password. User User.verify_password instead!')

    @password.setter
    def password(self, value):
        self._password = make_password(value)
    
    def verify_password(self, password):
        return check_password(password, self._password)

Base.metadata.create_all(bind=engine)