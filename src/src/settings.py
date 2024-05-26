"""
Django settings for src project.

Generated by 'django-admin startproject' using Django 4.2.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from dotenv import load_dotenv
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Define the URL for static files
STATIC_URL = '/static/'
load_dotenv()

POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")

INTRA_API_URL = os.getenv("INTRA_API_URL")
INTRA_TOKEN_URL = os.getenv("INTRA_TOKEN_URL")
INTRA_AUTH_URL = os.getenv("INTRA_AUTH_URL")
INTRA_UID = os.getenv("INTRA_UID")
INTRA_SECRET = os.getenv("INTRA_SECRET")
INTRA_GRANT_TYPE = os.getenv("INTRA_GRANT_TYPE")

REDIRECT = os.getenv("REDIRECT")

AUTHENTICATOR_SECRET_KEY = os.getenv("SECRET_KEY")

JWT_SECRET = os.getenv("JWT_SECRET")

# added settings
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-pnt!)8ws0c!1t-z-#up^j9o-r47i+ksu22%ftmyblgy3&azwdy'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False # 

ALLOWED_HOSTS = ['*']  

# Application definition

INSTALLED_APPS = [
	'src',
	'api',
	'corsheaders',
	# 'django_extensions',
	# 'oauth2_provider',
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
]

MIDDLEWARE = [
	'django.middleware.security.SecurityMiddleware',
	"whitenoise.middleware.WhiteNoiseMiddleware", # Here
	'django.contrib.sessions.middleware.SessionMiddleware',
	"django.middleware.locale.LocaleMiddleware",
	'corsheaders.middleware.CorsMiddleware',
	'django.middleware.common.CommonMiddleware',
	# 'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
	'src.models.AuthMiddleware',
]

ROOT_URLCONF = 'src.urls'

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

CORS_ALLOW_ALL_ORIGINS = True

WSGI_APPLICATION = 'src.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.postgresql',
		'NAME': "db_transcendence",
		'PORT': 5432,
		'USER': "user_transcendence",
		'PASSWORD': "pass_transcendence",
		'HOST': 'db',
	}
	# "default": {
    #     "ENGINE": "django.db.backends.sqlite3",
    #     "NAME": "mydatabase",
    # }
}

AUTH_USER_MODEL = 'api.User'

LOGIN_URL = '/admin/login'

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

# not using lol

LANGUAGE_CODE = 'en'
LANGAUAGE_COOKIE_NAME = 'django_language' # this is the defailt

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

LANGUAGES = [
    ('en', 'English'),
    ('hy', 'Հայերեն'),
    ('ru', 'Русский'),
]

LOCALE_PATHS = [os.path.join(BASE_DIR, 'locale')]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# SECURE_SSL_REDIRECT = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True
