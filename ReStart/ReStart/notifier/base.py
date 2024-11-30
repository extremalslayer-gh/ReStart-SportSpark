from abc import ABC, abstractmethod


class BaseNotifier(ABC):
    """
    Базовый интерфейс для отправки уведомлений.
    Предусмотрен на случай, если надо будет отправлять не только почтой либо вообще не почтой,
    чтобы не писать тонну нового кода - он будет реализовывать данный интерфейс
    """
    @abstractmethod
    def send_notification(self, receiver, message, **kwargs):
        ...