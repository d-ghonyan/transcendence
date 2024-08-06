#!/bin/bash
python3 ./src/manage.py runserver_plus --insecure --cert-file ./certs/cert.pem --key-file ./certs/key.pem localhost:8000
# python3 ./src/manage.py runserver --insecure
