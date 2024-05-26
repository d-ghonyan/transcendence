from api.models import User
from django.http import JsonResponse
from django.shortcuts import redirect, render
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
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

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
    print("In update")
    try:
        data = json.loads(request.body)
        print("data is ", data)
        user = User.objects.get(username=data['username'])
        
        print("data is ", data)
        
        if	data['repeat_password_value'] != "" and data['repeat_password_value'] != data['password_value']:
            raise ValueError("Passwords do not match.")
        if 'username_value' in data and data['username_value'] != "":
            user.username = data['username_value']
        if 'password_value' in data and data['password_value'] != "":
            print(">>>>>>>>>>>>>")
            new_password = data['password_value']
            hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
            hashed = hashed.decode('utf-8')
            user.password = hashed
            print("2222222222")
        # if 'file_input' in data:
        #     file_input = data['file_input']
        #     user.prof_pic = file_input
        print("user is ", user.password)
        try:
            user.save()
            return JsonResponse({'ok': 'updated'}, status=200)
        except Exception as e:
            print("error occured we tryig to save", str(e))
            return JsonResponse({'message': 'User not updated successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def user_info(request):
    print("Here")
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username_ = data.get('username')
            user = User.objects.get(username=username_)
            response_data = {
                'username': user.username,
                'prof_pic': user.prof_pic.url 
            }
            return JsonResponse(response_data)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)