from src.models import User
from django.http import JsonResponse
from src.utils import get_random_string
from django.shortcuts import render, redirect
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

def login_page(request):

	context = {
		"language_texts": json.dumps(json.load(open(BASE_DIR / 'src/lang.json'))),
		"pages": {}
	}

	for i in os.listdir(BASE_DIR / 'src/pages'):
		with open(BASE_DIR / 'src/pages' / i, 'r') as f:
			context["pages"][i.replace(".html", "")] = f.read()

	context['pages'] = json.dumps(context['pages'])

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

@require_GET
def login_intra(request):

	global state # needed to motify the state variable

	state = get_random_string(30)

	response_type = "code"

	intra_full_url = \
		f"{INTRA_AUTH_URL}?client_id={INTRA_UID}&redirect_uri={REDIRECT}&response_type={response_type}&state={state}"

	return redirect(intra_full_url)

@require_GET
def signin(request):

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

	return JsonResponse({ "state": req_state , "code": req_code, 'res': r.json() })

def get_users(request):

	print("helllllllllllllooooooooooo")

	users = []
	allUsers = User.objects.all()

	if (allUsers):
		for user in allUsers:
			users.append({ 'username': user.username, 'password': user.password })

	return JsonResponse({'users': users})

""" 
:method: GET
:path: /reg/view?id=5c499cb2cc07d625504b1334
:scheme: https 
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
"""

# cookie = '/reg/list={"grid":{"sort":{"column":false,"order":""},"filters":{"username":"davit.ghonyan1.y","date_created":"","total_absents_range":"","attending_duration":"","weekday":"","session":"","session_date":"","note_type":"","note_start_date":"","note_finish_date":"","push_notification":""},"visibleColumns":{"select":1,"first_name":1,"last_name":1,"middle_name":1,"username":1,"tumo_id":1,"status":1,"coach_id":1,"date_created":1},"per-page":100}}; _hjSessionUser_2962340=eyJpZCI6ImU4Zjg1ZjE2LWNhNTctNWFhYS05MmMyLTRjMjEwOGFjN2U1YyIsImNyZWF0ZWQiOjE2OTUyMTI4NDE4NzcsImV4aXN0aW5nIjp0cnVlfQ==; _hjSessionUser_3130500=eyJpZCI6IjZlOTI4YzdhLWZhMGItNWZkZi05NDgzLTk5YzkyOWRlZjkxZSIsImNyZWF0ZWQiOjE2OTcxMDM4ODYwNTYsImV4aXN0aW5nIjp0cnVlfQ==; _hjSessionUser_3266392=eyJpZCI6Ijg3NGVlMDkyLTdiYjItNTIwMC04MWE1LTg3OWQzZTM4N2I4MyIsImNyZWF0ZWQiOjE3MDMzNTYyMzE2ODIsImV4aXN0aW5nIjp0cnVlfQ==; _ga_5J250Q84JV=GS1.1.1707040388.13.1.1707048268.0.0.0; _ga_6JZYL3LMFZ=GS1.1.1707551275.11.0.1707551279.0.0.0; _ga_V5ERD9673D=GS1.1.1707551280.8.1.1707551881.0.0.0; PHPBACKSESSID=s6po1s54rjah1av1sasub1jcmc; _gid=GA1.2.413958180.1709962941; _gat_gtag_UA_136857647_12=1; jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2Mzg4OWVkZTIwYjZjZjBlNzkwZDgwODIiLCJ1c2VybmFtZSI6ImRhdml0Lmdob255YW4iLCJlbWFpbCI6ImRhdml0Lmdob255YW5AdHVtby5vcmciLCJsb2NhdGlvbl9wZXJtaXNzaW9ucyI6WyJ5ZXJldmFuIiwibm9yLW5vcmsiLCJ2YXlrIiwidi1zIl0sImlzcyI6Imh0dHBzOlwvXC9hbS50dW1vLndvcmxkXC8iLCJhdWQiOiJmaWxlLWFwaSJ9.h-zrWpDY_XtMsfQjSs5_D-p_N0K_UYJiD_khALYPtGE; _csrf=d70e2c32a0282bb24a053a096bda13c1746d34956b4b81f8ba6f85f18a1604e1a:2:{i:0;s:5:"_csrf";i:1;s:32:"eB-NQ5h1UGZgPuvKGH06jpiPASppOj8N";}; _ga_F2FYJJXEC5=GS1.1.1709962940.13.1.1709962954.0.0.0; _gat_gtag_UA_136857647_9=1; _ga_J45H77YH53=GS1.1.1709962954.14.1.1709962956.0.0.0; _ga=GA1.1.1107042229.1693474060'

# student_links = []
# def get_students(request):

# 	for i in student_links:
# 		r = requests.get(i, headers={
# 			'authority': '360.am.tumo.world',
# 			'method': 'GET',
# 			'path':  i[i.find("/reg"):], #'/reg/view?id=5c499cb2cc07d625504b1334',
# 			'scheme': 'https',
# 			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
# 			"Referer": "https://360.am.tumo.world/reg/list",
# 			'Cookie': cookie,
# 		})

# 		# r = r.json()

# 		text = r.text


# 		if ("<th>Gender</th><td>Female</td>" in text):
# 			index = text.find("<th>TUMO email</th>")
# 			mail_len = len("<th>TUMO email</th>")

# 			mail_substr = text[index + mail_len: index + mail_len + 100]

# 			student_mail = mail_substr[mail_substr.find("<span>") + len("<span>"): mail_substr.find("</span>")]

# 			with open('new_mails.txt', 'a') as f:
# 				f.write(student_mail + "\n")

# 			print("Found!")
# 		elif "<th>Gender</th><td>Male</td>" in text:
# 			print("Male")
# 		else:
# 			print(student_links.index(i) + 1, "Not found!")
# 	# print(text[index + len("<th>TUMO email</th>"): index + len("<th>TUMO email</th>") + 200])

# 	return JsonResponse({ "students": "a" })

