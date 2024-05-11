from api.models import User
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
from src.settings import JWT_SECRET
from api.utils import get_random_string

from django.shortcuts import redirect

from src.settings import INTRA_AUTH_URL, INTRA_UID, REDIRECT, INTRA_GRANT_TYPE, INTRA_TOKEN_URL

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
		return JsonResponse({ 'error': 'hacker attack', 'desc': 'self explanatory' })

	if (req_error):
		return JsonResponse({ 'error': req_error, 'desc': request.GET.get('error_description', 'none') })

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
