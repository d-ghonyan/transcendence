from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from api.blockchain_init import call_contract, get_contract, get_all_tournaments

from api.blockchain_init import deployed_contract

import json

@require_GET
def get_tournaments(request):
	return JsonResponse({ 'contract': get_all_tournaments() })

@require_POST
def add_tournament(request):
	# data = json.loads(request.body.decode('utf-8'))
	data = json.loads(request.body.decode('utf-8'))

	matches = data['matches']
	winner = data['winner']

	call_contract(matches, winner)

	# print(data)
	# deployed_contract = call_contract()
	return JsonResponse({ 'contract': "deployed_contract" })