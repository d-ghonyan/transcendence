from django.http import JsonResponse
from src.models import User

import json

def get_users(request):

	try:
		users = []
		for i in User.objects.all():
			users.append({ 'username': i.username, 'password': i.password })

		return JsonResponse({ 'users': users })
	except Exception as e:
		print(e)
		return (JsonResponse({ 'message': 'Users not found' }))


def post_user(request):
	if (request.method == "POST"):
		body = json.loads(request.body)
		if body['username'] and body['password']:
			User.objects.create(username=body['username'], password=body['password'])
			return JsonResponse({ "barev": "barev" })
		else:
			return JsonResponse({ "himar": "himar" })
