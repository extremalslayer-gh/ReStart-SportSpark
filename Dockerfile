FROM python:3.13-alpine

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

RUN mkdir -p restart/ReStart-SportSpark/ReStart/
WORKDIR /home/restart/ReStart-SportSpark/ReStart/
COPY ReStart/ /home/restart/ReStart-SportSpark/ReStart/
COPY __init__.py /home/restart/ReStart-SportSpark/__init__.py

RUN apk update \
    && apk add --no-cache git \
    && python3 -m venv venv \
    && venv/bin/python -m pip install --no-cache-dir -r requirements.txt \
    && venv/bin/python manage.py migrate

ENTRYPOINT ["venv/bin/python", "manage.py", "runserver", "0.0.0.0:8000"]