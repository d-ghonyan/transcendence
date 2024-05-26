# from src.models import User
from django.http import JsonResponse
from src.utils import get_random_string
from django.shortcuts import render, redirect
from django.views.decorators.http import require_GET
from src.settings import INTRA_API_URL, INTRA_TOKEN_URL,\
	 						INTRA_AUTH_URL, INTRA_UID, INTRA_SECRET,\
								REDIRECT, AUTHENTICATOR_SECRET_KEY, BASE_DIR, INTRA_GRANT_TYPE

from datetime import datetime

import os
import requests

import pyotp
import qrcode

import json

@require_GET
def login(request):
	intra_req = check_intra(request)

	if (intra_req.get('error', '')):
		return JsonResponse({ 'error': 'problem with intra', 'desc': intra_req['error'] })

	texts_file = open(BASE_DIR / 'src/lang.json', 'r')
	texts_json = json.dumps(json.load(texts_file))

	pages = {}

	for i in os.listdir(BASE_DIR / 'src/pages'):
		filename = i.replace(".html", "")

		if os.path.isfile(BASE_DIR / 'src/pages' / i):

			pages[filename] = {}
			with open(BASE_DIR / 'src/pages' / i, 'r') as f:
				pages[filename]['html'] = f.read()

	pages = json.dumps(pages)
	context = {
		"language_texts": texts_json,
		"pages": pages
	}

	if (intra_req.get('pass', '') == ''):
		context['token'] = intra_req['access_token']

		context['expires_at'] = intra_req['expires_in'] + intra_req['created_at']
		context['created_at'] = intra_req['created_at']

	return render(request, 'index.html', context=context)

@require_GET
def auth_qr(request):
	totp_auth = pyotp.totp.TOTP(AUTHENTICATOR_SECRET_KEY).provisioning_uri(
		name='Kov',
		issuer_name='barev.com')

	print(totp_auth)

	qrcode.make(totp_auth).save("qr_auth.png")
	# totp_qr = pyotp.TOTP(SECRET_KEY)

	# #  verifying the code 
	# while True:
	# 	print(totp_qr.verify(input(("Enter the Code : "))))

	return JsonResponse({ "qr": "qr_auth.png" })

def check_intra(request):
	req_code = request.GET.get('code', '')
	req_state = request.GET.get('state', '')
	req_error = request.GET.get('error', '')

	print(req_code, req_state, req_error)

	if req_error == '' and req_code == '':
		return { 'pass': 'pass' }

	# if (state != req_state):
	# 	return { 'error': 'hacker attack', 'desc': 'self explanatory' }

	if (req_error):
		return { 'error': req_error, 'desc': request.GET.get('error_description', 'none') }

	try:
		r = requests.request('POST', INTRA_TOKEN_URL, params={
			"grant_type": INTRA_GRANT_TYPE,
			"client_id": INTRA_UID,
			"client_secret": INTRA_SECRET,
			"code": req_code,
			"redirect_uri": REDIRECT,
			"state": req_state,
		})
	except Exception as e:
		print("exception: ", e)
		return { 'error': 'exception', 'desc': e }

	r = r.json()

	access_token = r['access_token']
	expires_in = r['expires_in']
	created_at = r['created_at']

	r = requests.request('GET', INTRA_API_URL + "me/", headers={
		'Authorization': 'Bearer ' + access_token,
	})

	r = r.json()

	for key, value in r.items():
		print(key, value)
	# print(access_token, expires_in, created_at)
	

	return {
		"access_token": access_token,
		"state": req_state,
		"code": req_code,
		"expires_in": expires_in,
		"created_at": created_at
	}
