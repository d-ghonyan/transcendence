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
from django.urls import include, path, reverse, re_path
from django.conf import settings
from django.shortcuts import render, redirect
from django.views.generic.base import RedirectView

from src import views

from django.http.response import HttpResponseRedirect

favicon_view = RedirectView.as_view(url='/static/barev.png', permanent=True)

# def redirect_to_root(request, exception):
# 	return HttpResponseRedirect(reverse('login'))

urlpatterns = [
	re_path(r'^favicon\.ico$', favicon_view),
	path('login/', views.login),
	path('api/', include('api.urls')),
	path('game/', views.login),
	path('home/', views.login),
]

# handler404 = redirect_to_root

# + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
