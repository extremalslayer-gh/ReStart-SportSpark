from django.contrib.auth.hashers import make_password, check_password
from sqlalchemy import Boolean
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from ReStart.db_config import engine, Session, PASSWORD
from ReStart.models import Base
from django.db.models.signals import post_migrate
from django.dispatch import receiver


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
    municipality_name: Mapped[str] = mapped_column(String(256))
    is_admin: Mapped[bool] = mapped_column(Boolean(), default=False)
    occupation: Mapped[str] = mapped_column(String(32))
    temp_password_changed: Mapped[str] = mapped_column(Boolean(), default=False)

    @property
    def password(self):
        raise AttributeError('Cannot read password. User User.verify_password instead!')

    @password.setter
    def password(self, value):
        self._password = make_password(value)
    
    def verify_password(self, password):
        return check_password(password, self._password)

Base.metadata.create_all(bind=engine)

@receiver(post_migrate)
def create_admin_user(sender, **kwargs):
    session = Session()
    same_user = session.query(User).filter(User.email=='admin@example.com').exists()
    if session.query(same_user).scalar():
        return

    user = User(
        first_name='System Admin',
        second_name='',
        last_name='',
        organization_id=-1,
        password=PASSWORD,
        email='admin@example.com', # todo: изменить домен когда будет, ни на что не влияет
        municipality_name='',
        is_admin=True,
        occupation='Администратор',
        temp_password_changed=True
    )
    print('Аккаунт администратора создан')

    session.add(user)
    session.commit()