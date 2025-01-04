from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


#USER = 'postgres'
# Также является паролем админа
PASSWORD = 'ReStart_temp_pass'
SCHEMA = 'postgres'
#HOST = ''
#PORT = 5432
#DATABASE_URL = f'postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{SCHEMA}'

# pythonanywhere запрещает подключения к сторонним сервисам, временное решение - использовать sqlite
DATABASE_URL = 'sqlite:///restart.db'

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)