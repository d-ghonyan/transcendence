from api.models import User
from django.http import JsonResponse
from django.shortcuts import redirect
from django.views.decorators.http import require_GET, require_POST
from src.settings import INTRA_API_URL, INTRA_TOKEN_URL,\
	 						INTRA_AUTH_URL, INTRA_UID, INTRA_SECRET,\
								REDIRECT, AUTHENTICATOR_SECRET_KEY, BASE_DIR

import os
import requests

import pyotp
import qrcode

import json

import jwt
import bcrypt

state = ""

from src.settings import JWT_SECRET

@require_GET
def users(request):

	users = []
	allUsers = User.objects.all()

	if (allUsers):
		for user in allUsers:
			users.append({ 'username': user.username, 'password': user.password })

	return JsonResponse({'users': users})

@require_POST
def update_user(request):
    try:
        body = json.loads(request.body)
        user = User.objects.get(username=body['username_value'])
        data = json.loads(request.body)
        print('Received data:', data)

        if 'username_value' in data:
            user.username = data['username_value']
        if 'password_value' in data:
            new_password = data['password_value']
            hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
            hashed = hashed.decode('utf-8')
            user.password = hashed

        # if 'file_input' in data:s
        #     file_input = data['file_input']
        #     user.prof_pic = file_input

        user.save()

        return JsonResponse({'message': 'User updated successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
# def profile_picture(request, username):
#     user = User.objects.get(username)
#     if user.prof_pic:
#         image_data = open(user.prof_pic.path, "rb").read()
#         return HttpResponse(image_data, content_type="image/jpeg")
#     else:
#         return HttpResponse(status=404)                                         