from .base import BaseNotifier


class ConsoleNotifier(BaseNotifier):
    def __init__(self, smtp_server, port, email, password, use_tls=True):
        print(f'Set SMTP server: {smtp_server}:{port}')

    def send_notification(self, receiver, message, **kwargs):
        print(f'Sent message to {receiver}: {message}')