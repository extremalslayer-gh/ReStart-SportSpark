from .base import BaseNotifier
import smtplib


class EmailNotifier(BaseNotifier):
    def __init__(self, smtp_server, port, email, password, use_tls=True):
        self._smtp_server = smtp_server
        self._port = port
        self._use_tls = use_tls
        self._email = email
        self._password = password
    
    def send_notification(self, receiver, message, **kwargs):
        server = smtplib.SMTP(self._smtp_server, self._port)
        if self._use_tls:
            server.starttls()
        server.login(self._email, self._password)
        server.sendmail(
            self._email, receiver, 
            bytes(message, encoding='utf-8')
        )
        server.quit()