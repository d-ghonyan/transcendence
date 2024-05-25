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
    
def profile_picture(request, username):
    print('here in profile picture')
    
    user = User.objects.get(pk=username)
    if user is not None:
        return render(request, "users/user.html", {'user' : user})
    else:
        return JsonResponse({'error': "prof pic dd not exist"}, status=500)                                         