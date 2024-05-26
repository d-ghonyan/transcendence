from src.settings import GANACHE_URL, BASE_DIR
from api.utils import deploy_contract

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

if os.path.exists(BASE_DIR / '.deployed_contract'):
	with open(BASE_DIR / '.deployed_contract', 'r') as f:
		deployed_address = f.read()

	try:
		deployed_contract = web3.eth.contract(address=deployed_address, abi=abi)
	except Exception as e:
		print("exception: ", e)
		deployed_contract = web3.eth.contract(address=deploy_contract(Tournament, chain_id, sender_address), abi=abi)
else:
	deployed_contract = web3.eth.contract(address=deploy_contract(Tournament, chain_id, sender_address), abi=abi)
