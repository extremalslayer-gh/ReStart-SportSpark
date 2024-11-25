from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from envparse import env

# Данные для подключения хранятся в переменных окружения
# Для Windows: set KEY=value
# Для *nix: export KEY=value
USER = env('RESTART_DB_USER')
PASSWORD = env('RESTART_DB_PASSWORD')
SCHEMA = env('RESTART_DB_SCHEMA')
HOST = env('RESTART_DB_HOST')
PORT = env('RESTART_DB_PORT')
DATABASE_URL = f'postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{SCHEMA}'

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)