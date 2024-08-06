#!/bin/sh

python ./manage.py makemigrations frontend
python ./manage.py migrate

python ./manage.py runserver --insecure "0.0.0.0:$FRONTEND_PORT"
