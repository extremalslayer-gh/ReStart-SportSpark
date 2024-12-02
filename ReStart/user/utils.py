def is_logged_in(request):
    return 'user_id' in request.session