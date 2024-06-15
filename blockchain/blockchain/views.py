from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from blockchain import call_contract, get_contract, get_all_tournaments

import json

@require_GET
def get_tournaments(request):
	return JsonResponse({ 'data': get_all_tournaments() })

@require_POST
def add_tournament(request):
	data = json.loads(request.body.decode('utf-8'))

	if ('matches' not in data) or ('winner' not in data):
		return JsonResponse({ 'error': 'Invalid data' })

	call_contract(data['matches'], data['winner'])

	return JsonResponse({ 'code': 'success' })

@require_POST
def get_tournaments_user(request):
	data = json.loads(request.body.decode('utf-8'))

	if ('username' not in data):
		return JsonResponse({ 'error': 'Invalid data' })

	return JsonResponse( { "data": get_contract(data['username']) } )
