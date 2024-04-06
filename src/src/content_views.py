# from src.models import User
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST, require_GET
from src.settings import JWT_SECRET

from django.utils.translation import gettext as _

from datetime import datetime, timedelta
from dateutil import tz

import jwt
import bcrypt

import json

@require_GET
def get_page_content(request):



	return ""