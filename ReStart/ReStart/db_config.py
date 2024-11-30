from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


USER = ''
PASSWORD = ''
SCHEMA = ''
HOST = ''
PORT = 5432
DATABASE_URL = f'postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{SCHEMA}'

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)