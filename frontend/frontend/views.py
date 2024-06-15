from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET
from .settings import BASE_DIR, USER_AUTH_PORT, BLOCKCHAIN_PORT

import os
import json

app_dir = 'frontend'

import logging
logger = logging.getLogger('django.server')

@require_GET
def login(request):

	logger.info("Login page accessed")

	texts_file = open(BASE_DIR / app_dir / 'lang.json', 'r')
	texts_json = json.dumps(json.load(texts_file))

	pages = {}

	for i in os.listdir(BASE_DIR / app_dir / 'pages'):
		filename = i.replace(".html", "")

		if os.path.isfile(BASE_DIR / app_dir / 'pages' / i):

			pages[filename] = {}
			with open(BASE_DIR / app_dir / 'pages' / i, 'r') as f:
				pages[filename]['html'] = f.read()

	pages = json.dumps(pages)
	context = {
		"language_texts": texts_json,
		"pages": pages,
		"auth_port": USER_AUTH_PORT,
		"blockchain_port": BLOCKCHAIN_PORT,
	}

	return render(request, 'index.html', context=context)
