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
	try:
		texts_file = open(BASE_DIR / app_dir / 'lang.json', 'r')
		texts_json = json.dumps(json.load(texts_file))
	except Exception as e:
		logger.warning(f"Error loading language texts: {e}")

	pages = {}

	try:
		for i in os.listdir(BASE_DIR / app_dir / 'pages'):
			filename = i.replace(".html", "")
	
			if os.path.isfile(BASE_DIR / app_dir / 'pages' / i):
				pages[filename] = {}
	
				with open(BASE_DIR / app_dir / 'pages' / i, 'r') as f:
					pages[filename]['html'] = f.read()

	except Exception as e:
		logger.warning(f"Error loading pages: {e}")

	pages = json.dumps(pages)
	context = {
		"language_texts": texts_json,
		"pages": pages,
		"auth_port": USER_AUTH_PORT,
		"blockchain_port": BLOCKCHAIN_PORT,
	}

	logger.info("Rendering login page.")
	return render(request, 'index.html', context=context)
