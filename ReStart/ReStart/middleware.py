from .settings import ENABLE_LOGGING, LOGGING_FILE
from datetime import datetime
from django.http import JsonResponse, HttpResponse

class ExceptionCatchMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request, *args, **kwargs):
        return self.get_response(request)

    def process_exception(self, request, e):
        if ENABLE_LOGGING:
            with open(LOGGING_FILE, 'a') as f:
                f.write(f'-------------[ {datetime.now()} | Exception log start ]-------------\n')
                f.write(f'Exception type: {type(e).__name__}\n')
                f.write(f'Exception origin: {e.__traceback__.tb_frame.f_code.co_filename}\n')
                f.write(f'Exception line: {e.__traceback__.tb_lineno}\n')
                f.write(f'Exception message: {str(e)}\n')
                f.write(f'-------------[ {datetime.now()} | Exception log end ]-------------\n')
        return JsonResponse({
            'message': 'Произошла ошибка! Возможно, браузер передал неверные данные.'
        }, status=503)