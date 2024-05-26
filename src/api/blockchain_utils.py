from src.settings import BASE_DIR
global web3, sender_address, chain_id, private_key, deployed_contract

def deploy_contract():
	tx_hash = deployed_address.constructor(123).transact({
		"chainId": chain_id,
		"gasPrice": web3.eth.gas_price,
		"from": sender_address,
		"nonce": web3.eth.get_transaction_count(sender_address),
	})

	deployed_address = web3.eth.get_transaction_receipt(tx_hash).contractAddress
	with open(BASE_DIR / '.deployed_contract', 'w') as f:
		f.write(deployed_address)

	return deployed_address

def call_contract(arg):
	try:
		call_function = deployed_contract.functions.setName(arg).build_transaction({
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



	return deployed_contract.functions.get