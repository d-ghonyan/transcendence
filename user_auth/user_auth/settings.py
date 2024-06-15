<<<<<<< HEAD:src/api/settings.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
=======
"""
Django settings for user_auth project.

Generated by 'django-admin startproject' using Django 4.2.13.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-at-p8db8(4eiz(n$^%wky+j#xb$dely=$s^c&x@!dpra2ably#'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']
CORS_ALLOW_ALL_ORIGINS = True

POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
KIBANA_URL = os.getenv("KIBANA_URL")
LOGSTASH_PORT = os.getenv("LOGSTASH_PORT")
ELASTICSEARCH_HTTP_PORT = os.getenv("ELASTICSEARCH_HTTP_PORT")
ELASTICSEARCH_TRANSPORT_PORT = os.getenv("ELASTICSEARCH_TRANSPORT_PORT")
KIBANA_API_CREATE_INDEX = "api/saved_objects/index-pattern"

# Application definition

INSTALLED_APPS = [
	'user_auth',
	'corsheaders',
    'django.contrib.auth',
    'django.contrib.admin',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
	'django_elasticsearch_dsl',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
	"corsheaders.middleware.CorsMiddleware",
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'user_auth.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'user_auth.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.postgresql',
		'NAME': POSTGRES_DB,
		'PORT': POSTGRES_PORT,
		'USER': POSTGRES_USER,
		'PASSWORD': POSTGRES_PASSWORD,
		'HOST': POSTGRES_HOST,
	}
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

AUTH_USER_MODEL = 'user_auth.User'
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

ELASTICSEARCH_DSL={
    'default': {
        'hosts': f'localhost:{ELASTICSEARCH_HTTP_PORT}'
    },
}

LOGGING = {
  'version': 1,
  'disable_existing_loggers': True,
  'formatters': {
      'simple': {
            'format': '%(levelname)s %(message)s'
        },
  },
  'handlers': {
        # 'console': {
        #     'level': 'INFO',
        #     'class': 'logging.StreamHandler',
        #     'formatter': 'simple'
        # },
        'logstash': {
            'level': 'DEBUG',
            'class': 'logstash.TCPLogstashHandler',
            'host': 'logstash',
            'port': 5959, # Default value: 5959
            'version': 1, # Version of logstash event schema. Default value: 0 (for backward compatibility of the library)
            'message_type': 'django-server',  # 'type' field in logstash message. Default value: 'logstash'.
            'fqdn': False, # Fully qualified domain name. Default value: false.
            'tags': ['django.server'], # list of tags. Default: None.
        },
  },
  'loggers': {
        'django.server': {
            'handlers': ['logstash'],
            'level': 'DEBUG',
            'propagate': True,
        },
        # 'django': {
        #     'handlers': ['console'],
        #     'propagate': True,
        # },
    }
}
>>>>>>> 41d29b56fe2488f0720327adac2b23a034ebca9e:user_auth/user_auth/settings.py
