from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from blockchain import call_contract, get_all_tournaments, deployed_contract

import logging

logger = logging.getLogger('django.server')

import json
import logging
logger = logging.getLogger('django.server')

@require_GET
def get_tournaments(request):
	logger.info("Request received to get all tournaments")
	return JsonResponse({ 'data': get_all_tournaments() })

@require_POST
def add_tournament(request):
	logger.info("Request received to add a tournament")

	data = json.loads(request.body.decode('utf-8'))
	logger.info(f"Request data: {data}")
	if ('matches' not in data) or ('winner' not in data):
		logger.warning("Invalid data: 'matches' or 'winner' missing")
		return JsonResponse({ 'error': 'Invalid data' })

	call_contract(data['matches'], data['winner'])
	logger.info("Tournament added successfully")
	return JsonResponse({ 'code': 'success' })

@require_POST
def get_tournaments_user(request):
	logger.info("Request received to get tournaments for a user")

	data = json.loads(request.body.decode('utf-8'))
	logger.info(f"Request data: {data}")

	if ('username' not in data):
		logger.warning("Invalid data: 'username' missing")

		return JsonResponse({ 'error': 'Invalid data' })
	logger.info(f"Fetching tournaments for user: {data['username']}")

	tournaments = deployed_contract.functions.getTournaments().call()

	user_tournaments = []

	logger.info(tournaments)

	for tournament in tournaments:
		for match in tournament[0]:
			if (isinstance(match, list) or isinstance(match, tuple)) and data['username'] in match:
				user_tournaments.append(tournament)
				break

	return JsonResponse( { "data": user_tournaments } )
