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

abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "myString",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "myFunction",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    }
]

bytecode = "0x60806040526040518060600160405280602d81526020016105cb602d91395f908161002a9190610276565b50348015610036575f80fd5b50610345565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806100b757607f821691505b6020821081036100ca576100c9610073565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f6008830261012c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826100f1565b61013686836100f1565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f61017a6101756101708461014e565b610157565b61014e565b9050919050565b5f819050919050565b61019383610160565b6101a761019f82610181565b8484546100fd565b825550505050565b5f90565b6101bb6101af565b6101c681848461018a565b505050565b5b818110156101e9576101de5f826101b3565b6001810190506101cc565b5050565b601f82111561022e576101ff816100d0565b610208846100e2565b81016020851015610217578190505b61022b610223856100e2565b8301826101cb565b50505b505050565b5f82821c905092915050565b5f61024e5f1984600802610233565b1980831691505092915050565b5f610266838361023f565b9150826002028217905092915050565b61027f8261003c565b67ffffffffffffffff81111561029857610297610046565b5b6102a282546100a0565b6102ad8282856101ed565b5f60209050601f8311600181146102de575f84156102cc578287015190505b6102d6858261025b565b86555061033d565b601f1984166102ec866100d0565b5f5b82811015610313578489015182556001820191506020850194506020810190506102ee565b86831015610330578489015161032c601f89168261023f565b8355505b6001600288020188555050505b505050505050565b610279806103525f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c8063492bfa1814610038578063c3780a3a14610056575b5f80fd5b610040610074565b60405161004d91906101c6565b60405180910390f35b61005e6100ff565b60405161006b91906101c6565b60405180910390f35b5f805461008090610213565b80601f01602080910402602001604051908101604052809291908181526020018280546100ac90610213565b80156100f75780601f106100ce576101008083540402835291602001916100f7565b820191905f5260205f20905b8154815290600101906020018083116100da57829003601f168201915b505050505081565b60606040518060400160405280601981526020017f48656c6c6f2c20576f726c643132333132333132333132332100000000000000815250905090565b5f81519050919050565b5f82825260208201905092915050565b5f5b83811015610173578082015181840152602081019050610158565b5f8484015250505050565b5f601f19601f8301169050919050565b5f6101988261013c565b6101a28185610146565b93506101b2818560208601610156565b6101bb8161017e565b840191505092915050565b5f6020820190508181035f8301526101de818461018e565b905092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061022a57607f821691505b60208210810361023d5761023c6101e6565b5b5091905056fea2646970667358221220d201e73183363f62d8a53b427cfc86083ffce0b96eba467ab927c823297d454664736f6c63430008150033447a6b6e6572203232323261736461736461736432333333333333313233313233313231323331323331323333",

# pages = {}

# for i in os.listdir(BASE_DIR / 'src/pages'):

# 	filename = i.replace(".html", "")

# 	if os.path.isfile(BASE_DIR / 'src/pages' / i):
# 		with open(BASE_DIR / 'src/pages' / i, 'r') as f:
# 			pages[filename] = f.read()

		# with open(BASE_DIR / 'src/pages/page_scripts' / (filename + '.js'), 'r') as js:
		# 	pages[filename] += f"<script type='text/javascript'>{js.read()}</script>"

from web3 import Web3

sender_key = "0xf9ee116ae1166f574bb36f34c7608ec356b5a3b90286899187212588ff05979c";

ganache_url = "HTTP://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

acct1 = web3.eth.account.from_key(sender_key)

some_address = "0x89439d86008e771D1dD534AE2520A71e21ddD7fF" 

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

print(tx)

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
            