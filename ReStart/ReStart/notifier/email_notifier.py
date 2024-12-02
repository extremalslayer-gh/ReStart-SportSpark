from .base import BaseNotifier
import smtplib


class EmailNotifier(BaseNotifier):
    def __init__(self, smtp_server, port, email, password, use_tls=True):
        self._server = smtplib.SMTP(smtp_server, port)
        if use_tls:
            self._server.starttls()
        self._email = email
        self._password = password
        self._server.login(self._email, self._password)
    
    def send_notification(self, receiver, message, **kwargs):
        self._server.sendmail(
            self._email, receiver, 
            bytes(message, encoding='utf-8')
        )