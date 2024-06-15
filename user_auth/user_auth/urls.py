"""
URL configuration for auth project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from django.http import JsonResponse

from .views import register, login, set_language
from django.views.decorators.csrf import csrf_exempt
import logging

@csrf_exempt
def test(request):
	logger = logging.getLogger('django.server')
	logger.debug("anasun es?")
	return JsonResponse({ "status": 200, "message": f"User created successfully{logger.__dict__}" })

urlpatterns = [
	path('register/', register),
	path('login/', login),
	path('test/', test),
	path('set_language/', set_language),
]
