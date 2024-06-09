import json
import bcrypt
from .models import User
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

@require_POST
@csrf_exempt
def set_language(request):
	body = json.loads(request.body)
	if body['username'] and body['language']:
		try:
			user = User.objects.filter(username=body['username']).first()
			if (user):
				user.language = body['language']
				user.save()
				return JsonResponse({ "status": 200, "message": "Language updated successfully" })
			return JsonResponse({ "status": 400, "message": "User not found" })
		except Exception as e:
			return JsonResponse({ "status": 500, "message": e })
	return JsonResponse({ "status": 400, "message": "Bad request" })

@require_POST
@csrf_exempt
def register(request):
	body = json.loads(request.body)
	if body['username'] and body['password'] and body['repeat_password']:
		try:
			if body['password'] != body['repeat_password']:
				return JsonResponse({ "status": 400, "message": "Passwords do not match" })

			if User.objects.filter(username=body['username']).exists():
				return JsonResponse({ "status": 400, "message": "Username already exists" })

			hashed = bcrypt.hashpw(body['password'].encode('utf-8'), bcrypt.gensalt())
			hashed = hashed.decode('utf-8')

			User.objects.create(username=body['username'], password=hashed, language='us')
			return JsonResponse({ "status": 200, "message": "User created successfully" })
		except Exception as e:
			return JsonResponse({ "status": 500, "message": f"Error: {e}" })
	return JsonResponse({ "status": 400, "message": "Bad request" })

@require_POST
@csrf_exempt
def login(request):
	body = json.loads(request.body)
	if body['username'] and body['password']:
		try:
			user = User.objects.get(username=body['username'])
			hashed = user.password

			if bcrypt.checkpw(body['password'].encode('utf-8'), hashed.encode('utf-8')):
				return JsonResponse({
					"status": 200,
					"message": "User logged in successfully",
					"username": user.username,
					"language": user.language,
				})
			return JsonResponse({ "status": 400, "message": "Invalid username or password" })
		except Exception as e:
			return JsonResponse({ "status": 500, "message": f"Error: {e}" })
	return JsonResponse({ "status": 400, "message": "Bad request" })
