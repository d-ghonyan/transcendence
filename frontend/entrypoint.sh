#!/bin/sh

python ./manage.py makemigrations frontend
python ./manage.py migrate

python3 ./manage.py runserver_plus --insecure --cert-file /certs/cert.pem --key-file /certs/key.pem "0.0.0.0:$FRONTEND_PORT"
