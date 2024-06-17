import json
import bcrypt
from .models import User
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import logging

logger = logging.getLogger('django.server')

@require_POST
@csrf_exempt
def set_language(request):
	body = json.loads(request.body)
	if body['username'] and body['language']:
		try:
			logger.info(f'Setting language for user: {body["username"]} to {body["language"]}')
			user = User.objects.filter(username=body['username']).first()
			if (user):
				user.language = body['language']
				user.save()
				logger.info(f'Language updated successfully for user: {body["username"]}')
				return JsonResponse({ "status": 200, "message": "Language updated successfully" })
			logger.warning(f'User not found: {body["username"]}')
			return JsonResponse({ "status": 400, "message": "User not found" })
		except Exception as e:
			logger.warning(f"Error setting language: {e}", exc_info=True)
			return JsonResponse({ "status": 500, "message": e })

	logger.info("Bad request: Missing username or language")
	return JsonResponse({ "status": 400, "message": "Bad request" })

@require_POST
@csrf_exempt
def register(request):
	body = json.loads(request.body)
	if body['username'] and body['password'] and body['repeat_password']:
		body = json.loads(request.body)
		username = body["username"]
		logger.info(f"Registering user: {username}")
		try:
			if body['password'] != body['repeat_password']:
				logger.warning(f"Passwords do not match for user: {username}")
				return JsonResponse({ "status": 400, "message": "Passwords do not match" })

			if User.objects.filter(username=body['username']).exists():
				logger.warning(f"User already exists: {username}")
				return JsonResponse({ "status": 400, "message": "User already exists" })

			hashed = bcrypt.hashpw(body['password'].encode('utf-8'), bcrypt.gensalt())
			hashed = hashed.decode('utf-8')

			User.objects.create(username=body['username'], password=hashed, language='us')
			logger.info(f"User created successfully: {username}")
			return JsonResponse({ "status": 200, "message": "User created successfully" })
		except Exception as e:
			logger.warning(f"Error registering user: {e}", exc_info=True)
			return JsonResponse({ "status": 500, "message": f"Error: {e}" })
	logger.warning("Bad request: Missing username, password, or repeat_password in request body")
	return JsonResponse({ "status": 400, "message": "Bad request" })

@require_POST
@csrf_exempt
def login(request):
	logger.info("Received request to login user")
	body = json.loads(request.body)
	if body['username'] and body['password']:
		try:
			username = body.get('username')
			logger.info(f"Logging in user: {username}")
			user = User.objects.get(username=body['username'])
			hashed = user.password

			if bcrypt.checkpw(body['password'].encode('utf-8'), hashed.encode('utf-8')):
				logger.info(f"User logged in successfully: {username}")       
				return JsonResponse({
					"status": 200,
					"message": "User logged in successfully",
					"username": user.username,
					"language": user.language,
				})
			logger.warning(f"Invalid username or password for user: {username}")
			return JsonResponse({ "status": 400, "message": "Invalid username or password" })
		except Exception as e:
			logger.error(f"Error logging in user: {e}", exc_info=True)      
			return JsonResponse({ "status": 500, "message": f"Error: {e}" })
	logger.warning("Bad request: Missing username or password in request body")
	return JsonResponse({ "status": 400, "message": "Bad request" })
