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

# load the contract from build/contracts/MyContract.json
with open('build/contracts/MyContract.json') as file:
	contract_json = json.load(file)
	abi = contract_json['abi']
	bytecode = contract_json['bytecode']


# pages = {}

# for i in os.listdir(BASE_DIR / 'src/pages'):

# 	filename = i.replace(".html", "")

# 	if os.path.isfile(BASE_DIR / 'src/pages' / i):
# 		with open(BASE_DIR / 'src/pages' / i, 'r') as f:
# 			pages[filename] = f.read()

		# with open(BASE_DIR / 'src/pages/page_scripts' / (filename + '.js'), 'r') as js:
		# 	pages[filename] += f"<script type='text/javascript'>{js.read()}</script>"

from web3 import Web3

sender_key = "0xb055b48db21434cda04a19f8a6e9b4acb1b3ac9ae6281f31ba7fc5273552a52e";

ganache_url = "HTTP://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

acct1 = web3.eth.account.from_key(sender_key)

some_address = "0xccf7E1892a17364ba1afC47235A51aFD14Cf80A5" 

transaction = {
      'from': acct1.address,
      'to': some_address, 
      'value': 1000000000,
      'nonce': web3.eth.get_transaction_count(acct1.address), 
      'gas': 250000,
      'gasPrice': web3.to_wei(8,'gwei'),
}

signed = web3.eth.account.sign_transaction(transaction, sender_key)

tx_hash = web3.eth.send_raw_transaction(signed.rawTransaction)
tx = web3.eth.get_transaction(tx_hash)
assert tx['from'] == acct1.address

# initialize the contract using the abi and bytecode
contract = web3.eth.contract(abi=abi, bytecode=bytecode)

print(contract, contract.all_functions()[1].call())

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
            