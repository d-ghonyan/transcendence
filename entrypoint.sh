#!/bin/sh

python ./src/manage.py makemigrations src
python ./src/manage.py makemigrations api
python ./src/manage.py migrate

python ./src/manage.py runserver --insecure "0.0.0.0:8000"
