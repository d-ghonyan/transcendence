import logging
import requests
from .settings import KIBANA_API_CREATE_INDEX, KIBANA_URL

# TODO: make this a curl request in the kibana container
req = requests.post(f"{KIBANA_URL}/{KIBANA_API_CREATE_INDEX}", json={
	"index_pattern": {
		"title": "logstash-*",
	}
}, headers={
	"kbn-xsrf": "reporting"
})

logger = logging.getLogger('django')