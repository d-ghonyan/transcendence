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
	logger.info("Received request to set language")

	body = json.loads(request.body)
	if body['username'] and body['language']:
		try:
			username = body.get('username')
			language = body.get('language')
			if username and language:
				logger.info(f"Setting language for user: {username} to {language}")
			user = User.objects.filter(username=body['username']).first()
			if (user):
				user.language = body['language']
				user.save()
				logger.info(f"Language updated successfully for user: {username}")
				return JsonResponse({ "status": 200, "message": "Language updated successfully" })
			logger.warning(f"User not found: {username}")
			return JsonResponse({ "status": 400, "message": "User not found" })
		except Exception as e:
			logger.error(f"Error setting language: {e}", exc_info=True)
			return JsonResponse({ "status": 500, "message": e })
	return JsonResponse({ "status": 400, "message": "Bad request" })

@require_POST
@csrf_exempt
def register(request):
	logger.info("Received request to register user")
	body = json.loads(request.body)
	if body['username'] and body['password'] and body['repeat_password']:
		body = json.loads(request.body)
		username = body.get('username')
		password = body.get('password')
		repeat_password = body.get('repeat_password')
		if username and password and repeat_password:
			logger.info(f"Registering user: {username}")
		try:
			if body['password'] != body['repeat_password']:
				logger.warning(f"Passwords do not match for user: {username}")
				return JsonResponse({ "status": 400, "message": "Passwords do not match" })

			if User.objects.filter(username=body['username']).exists():
				logger.warning(f"Username already exists: {username}")
				return JsonResponse({ "status": 400, "message": "Username already exists" })

			hashed = bcrypt.hashpw(body['password'].encode('utf-8'), bcrypt.gensalt())
			hashed = hashed.decode('utf-8')

			User.objects.create(username=body['username'], password=hashed, language='us')
			logger.info(f"User created successfully: {username}")
			return JsonResponse({ "status": 200, "message": "User created successfully" })
		except Exception as e:
			logger.error(f"Error registering user: {e}", exc_info=True)
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
			password = body.get('password')
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
