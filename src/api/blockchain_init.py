from src.settings import GANACHE_URL, BASE_DIR

import os
from web3 import Web3
from solcx import install_solc, compile_files

chain_id = 1337

install_solc("0.8.9")
compiled_sol = compile_files(["./contracts/Tournament.sol"], output_values=["abi", "bin"], solc_version="0.8.9",)

web3 = Web3(Web3.HTTPProvider(GANACHE_URL))
web3.eth.account.enable_unaudited_hdwallet_features()

account = web3.eth.account.from_mnemonic(os.getenv("MNEMONIC"), account_path="m/44'/60'/0'/0/0")

private_key = account.key.hex()
sender_address = account.address
receiver_address = web3.eth.accounts[1]

abi = compiled_sol["contracts/Tournament.sol:Tournament"]["abi"]
bytecode = compiled_sol["contracts/Tournament.sol:Tournament"]["bin"]

Tournament = web3.eth.contract(abi=abi, bytecode=bytecode)

deployed_contract = None

def deploy_contract():
	tx_hash = Tournament.constructor(123).transact({
		"chainId": chain_id,
		"gasPrice": web3.eth.gas_price,
		"from": sender_address,
		"nonce": web3.eth.get_transaction_count(sender_address),
	})

	deployed_address = web3.eth.get_transaction_receipt(tx_hash).contractAddress
	with open('.deployed_contract', 'w') as f:
		f.write(deployed_address)

	return deployed_address

if os.path.exists('.deployed_contract'):
	with open('.deployed_contract', 'r') as f:
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

def get_contract(user_id):

	tournaments = deployed_contract.functions.getTournaments().call()

	for tournament in tournaments:
		for match in tournament.matches:
			if user_id in match:
				return tournament 

	return None

def get_all_tournaments():
	return deployed_contract.functions.getTournaments().call()