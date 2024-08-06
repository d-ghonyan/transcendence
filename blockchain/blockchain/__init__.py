from blockchain.settings import GANACHE_URL, BASE_DIR, MNEMONIC
import logging
import os
import json
from web3 import Web3

logger = logging.getLogger('django.server')

chain_id = 1337
tournament_json = BASE_DIR / "contracts/Tournament.json"

with open(tournament_json, 'r') as f:
	compiled_sol = json.load(f)

abi = compiled_sol["Tournament"]["abi"]
bytecode = compiled_sol["Tournament"]["bin"]

web3 = Web3(Web3.HTTPProvider(GANACHE_URL))
web3.eth.account.enable_unaudited_hdwallet_features()

account = web3.eth.account.from_mnemonic(MNEMONIC, account_path="m/44'/60'/0'/0/0")

private_key = account.key.hex()
sender_address = account.address

Tournament = web3.eth.contract(abi=abi, bytecode=bytecode)

deployed_contract = None
address_file_path = BASE_DIR / ".deployed_contract"

print(web3.eth.get_balance(sender_address))

def deploy_contract():
	tx_hash = Tournament.constructor(123).transact({
		"chainId": chain_id,
		"gasPrice": web3.eth.gas_price,
		"from": sender_address,
		"nonce": web3.eth.get_transaction_count(sender_address),
	})

	deployed_address = web3.eth.get_transaction_receipt(tx_hash).contractAddress
	with open(address_file_path, 'w') as f:
		f.write(deployed_address)

	logger.info(f"Deployed the contract with address {deployed_address}.")
	return deployed_address

if os.path.exists(address_file_path):
	with open(address_file_path, 'r') as f:
		deployed_address = f.read()

	try:
		deployed_contract = web3.eth.contract(address=deployed_address, abi=abi)
	except Exception as e:
		print("exception: ", e)
		deployed_contract = web3.eth.contract(address=deploy_contract(), abi=abi)
else:
	deployed_contract = web3.eth.contract(address=deploy_contract(), abi=abi)

def call_contract(mathces, winner):
	try:
		call_function = deployed_contract.functions.addTournament(mathces, winner).build_transaction({
			"chainId": chain_id,
			"gasPrice": web3.eth.gas_price,
			"from": sender_address,
			"nonce": web3.eth.get_transaction_count(sender_address),
		})

		signed_tx = web3.eth.account.sign_transaction(call_function, private_key=private_key)

		tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
	except Exception as e:
		print("exception: ", e)
		return False

	return tx_hash

def get_all_tournaments():
	return deployed_contract.functions.getTournaments().call()