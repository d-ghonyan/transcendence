#!/bin/sh

python ./manage.py makemigrations user_auth
python ./manage.py migrate

python ./manage.py runserver --insecure "0.0.0.0:$USER_AUTH_PORT"
