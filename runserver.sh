#!/bin/bash
python3 ./src/manage.py runserver_plus --insecure --cert-file ./certs/cert.pem --key-file ./certs/key.pem 0.0.0.0:8000
