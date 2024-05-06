# from src.models import User
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

# pages = {}

# for i in os.listdir(BASE_DIR / 'src/pages'):

# 	filename = i.replace(".html", "")

# 	if os.path.isfile(BASE_DIR / 'src/pages' / i):
# 		with open(BASE_DIR / 'src/pages' / i, 'r') as f:
# 			pages[filename] = f.read()

		# with open(BASE_DIR / 'src/pages/page_scripts' / (filename + '.js'), 'r') as js:
		# 	pages[filename] += f"<script type='text/javascript'>{js.read()}</script>"

@require_GET
def login(request):

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

	# remove in prod
	# for i in os.listdir(BASE_DIR / 'src/pages/page_scripts'):
	# 	context["pages"][i.replace(".js", "")] = f"<script type='text/javascript'>{open(BASE_DIR / 'src/pages/page_scripts' / i, 'r').read()}</script>"

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
            