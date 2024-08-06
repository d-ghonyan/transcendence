#!/bin/sh

python ./manage.py makemigrations user_auth
python ./manage.py migrate

python3 ./manage.py runserver_plus --insecure --cert-file /certs/cert.pem --key-file /certs/key.pem "0.0.0.0:$USER_AUTH_PORT"
