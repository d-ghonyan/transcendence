"""
URL configuration for src project.

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

from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, reverse
from django.conf import settings
from django.shortcuts import render, redirect

from api import views, auth_views

from django.http.response import HttpResponseRedirect

urlpatterns = [
	path('users/', views.users),
	path('login/', auth_views.login),
	path('register/', auth_views.register),
	path('user/update/', views.update_user),
]
