from src.models import User
from django.http import JsonResponse
import requests
import dotenv

# dotenv.load_dotenv()
from src.settings import INTRA_URL, INTRA_UID, INTRA_SECRET, INTRA_GRANT_TYPE

import json

def get_users(request):
	# r = requests.post(INTRA_URL, data={
	# 	"client_id": INTRA_UID,
	# 	"grant_type": INTRA_GRANT_TYPE,
	# 	"client_secret": INTRA_SECRET,
	# })

	users = []
	allUsers = User.objects.all();

	if (allUsers):
		for user in allUsers:
			users.append({ 'username': user.username, 'password': user.password })

	return JsonResponse({'users': users})

def post_user(request):
	if (request.method == "POST"):
		body = json.loads(request.body)
		if body['username'] and body['password']:
			User.objects.create(username=body['username'], password=body['password'])
			return JsonResponse({ "barev": "barev" })
		else:
			return JsonResponse({ "himar": "himar" })
