import requests
from .settings import KIBANA_API_CREATE_INDEX, KIBANA_URL
from time import sleep

# TODO: make this a curl request in the kibana container

get_req = None

try:
	get_req = requests.get(f"{KIBANA_URL}/{KIBANA_API_CREATE_INDEX}/transcendence", headers={
		"kbn-xsrf": "true",
		"Content-Type": "application/json"
	})
except:
	get_req = None

status = 0

if get_req == None or get_req.status_code != 200:
	while status != 200:
		print("Trying to connect to kibana")

		req = requests.post(f"{KIBANA_URL}/{KIBANA_API_CREATE_INDEX}/transcendence", json={
			"attributes": {
				"title": "logstash-*",
			}
		}, headers={
			"kbn-xsrf": "true",
			"Content-Type": "application/json"
		})

		status = req.status_code

		if status != 200:
			sleep(5)
