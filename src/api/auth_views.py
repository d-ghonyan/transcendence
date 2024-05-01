from api.models import User
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from src.settings import JWT_SECRET

from django.utils.translation import gettext as _

from datetime import datetime, timedelta
from dateutil import tz

from django.forms.models import model_to_dict

import jwt
import bcrypt

import json

@require_POST
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

			User.objects.create(username=body['username'], password=hashed)
			return JsonResponse({ "status": 200, "message": "User created successfully" })
		except Exception as e:
			return JsonResponse({ "status": 500, "message": f"Internal server error: {e}" })
	return JsonResponse({ "status": 400, "message": "Bad request" })

@require_POST
def login(request):
	body = json.loads(request.body)
	if body['username'] and body['password']:
		try:
			user = User.objects.get(username=body['username'])
			hashed = user.password

			if bcrypt.checkpw(body['password'].encode('utf-8'), hashed.encode('utf-8')):
				token = jwt.encode({ 'username': user.username,
						'exp': datetime.now(tz.UTC) + timedelta(hours=1) }, JWT_SECRET, algorithm='HS256')

				return JsonResponse({ "status": 200, "message": "User logged in successfully", "token": token, "username": user.username })
			return JsonResponse({ "status": 400, "message": "Invalid username or password" })
		except Exception as e:
			return JsonResponse({ "status": 500, "message": f"Internal server error: {e}" })
	return JsonResponse({ "status": 400, "message": "Bad request" })
