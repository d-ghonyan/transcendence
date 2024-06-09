from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
	username = models.TextField(default="user", unique=True)
	password = models.TextField(default="user", )
	language = models.TextField(default="us", )
