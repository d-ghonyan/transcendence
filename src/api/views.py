from api.models import User
from django.http import JsonResponse
from api.utils import get_random_string
from django.shortcuts import redirect
from django.views.decorators.http import require_GET
from src.settings import INTRA_API_URL, INTRA_TOKEN_URL,\
	 						INTRA_AUTH_URL, INTRA_UID, INTRA_SECRET,\
								REDIRECT, AUTHENTICATOR_SECRET_KEY, BASE_DIR

import os
import requests

import pyotp
import qrcode

import json

state = ""

@require_GET
def users(request):

	users = []
	allUsers = User.objects.all()

	if (allUsers):
		for user in allUsers:
			users.append({ 'username': user.username, 'password': user.password })

	return JsonResponse({'users': users})

@require_GET
def intra_redirect(request):

	global state # needed to motify the state variable

	state = get_random_string(30)

	response_type = "code"

	intra_full_url = \
		f"{INTRA_AUTH_URL}?client_id={INTRA_UID}&redirect_uri={REDIRECT}&response_type={response_type}&state={state}"

	return redirect(intra_full_url)

@require_GET
def intra_signin(request):

	grant_type = 'authorization_code'
	req_code = request.GET.get('code', '')
	req_state = request.GET.get('state', '')
	req_error = request.GET.get('error', '')

	if (state != req_state):
		return JsonResponse({ 'error': 'go_fuck_yourself', 'desc': 'self explanatory' })

	if (req_error):
		return JsonResponse({ 'error': req_error, 'desc': request.GET.get('error_description', 'none') })

	try:
		r = requests.request('POST', INTRA_TOKEN_URL, params={
			"grant_type": grant_type,
			"client_id": INTRA_UID,
			"client_secret": INTRA_SECRET,
			"code": req_code,
			"redirect_uri": REDIRECT,
			"state": req_state,
		})
	except Exception as e:
		return JsonResponse({ 'error': 'exception', 'desc': e })

	r = r.json()

	access_token = r['access_token']
	refresh_token = r['refresh_token']
	expires_in = r['expires_in']
	created_at = r['created_at']

	r = requests.request('GET', INTRA_API_URL + "me/", headers={
		'Authorization': 'Bearer ' + access_token,
	})

	return JsonResponse({
		"state": req_state,
		"code": req_code,
		"refresh_token": refresh_token,
		"expires_in": expires_in,
		"created_at": created_at
	})
